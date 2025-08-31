/**
 * Redis-backed Cache for Google Ads API
 * Implements compression, TTL management, and memory optimization
 * Pattern matching for cache invalidation
 */

import type Redis from 'ioredis';
import { EventEmitter } from 'events';
import { promisify } from 'util';
import * as zlib from 'zlib';
import { type CacheConfig, type CacheStats, type CacheEntry } from './types';

const gzip = promisify(zlib.gzip);
const gunzip = promisify(zlib.gunzip);

/**
 * High-performance Redis cache with compression and intelligent TTL
 */
export class GoogleAdsCache extends EventEmitter {
  private redis: Redis;
  private config: CacheConfig;
  private keyPrefix: string;
  private stats: CacheStats;
  private cleanupInterval: NodeJS.Timeout | null = null;

  // Lua script for atomic cache operations
  private setWithStatsScript = '';
  private getWithStatsScript = '';
  private invalidatePatternScript = '';

  constructor(config: CacheConfig, redis: Redis, keyPrefix = 'google_ads_cache') {
    super();

    this.config = {
      defaultTtl: 300, // 5 minutes
      maxMemoryMB: 50,
      compressionEnabled: true,
      compressionThreshold: 1024, // 1KB
      keyPattern: 'google_ads:*',
      ...config,
    };

    this.redis = redis;
    this.keyPrefix = keyPrefix;

    this.stats = {
      hits: 0,
      misses: 0,
      sets: 0,
      deletes: 0,
      evictions: 0,
      compressionRatio: 0,
      memoryUsage: 0,
      avgResponseTime: 0,
    };

    // Initialize Lua scripts
    this.initializeLuaScripts();

    // Start periodic cleanup
    this.startCleanup();

    this.emit('initialized', { config: this.config });
  }

  /**
   * Initialize Lua scripts for atomic operations
   */
  private initializeLuaScripts(): void {
    // Script for setting cache entry with stats update
    this.setWithStatsScript = `
      local key = KEYS[1]
      local stats_key = KEYS[2]
      local value = ARGV[1]
      local ttl = tonumber(ARGV[2])
      local compressed = ARGV[3]
      local original_size = tonumber(ARGV[4])
      local compressed_size = tonumber(ARGV[5])
      
      -- Set the cache entry
      redis.call('SET', key, value, 'EX', ttl)
      
      -- Update statistics
      redis.call('HINCRBY', stats_key, 'sets', 1)
      redis.call('HINCRBY', stats_key, 'total_original_size', original_size)
      redis.call('HINCRBY', stats_key, 'total_compressed_size', compressed_size)
      
      -- Set metadata
      local meta_key = key .. ':meta'
      redis.call('HMSET', meta_key, 
        'compressed', compressed,
        'original_size', original_size,
        'compressed_size', compressed_size,
        'created_at', redis.call('TIME')[1]
      )
      redis.call('EXPIRE', meta_key, ttl)
      
      return 1
    `;

    // Script for getting cache entry with stats update
    this.getWithStatsScript = `
      local key = KEYS[1]
      local stats_key = KEYS[2]
      local start_time = tonumber(ARGV[1])
      
      local value = redis.call('GET', key)
      local end_time = redis.call('TIME')[1]
      local response_time = (end_time - start_time) * 1000000 + redis.call('TIME')[2] - start_time
      
      if value then
        redis.call('HINCRBY', stats_key, 'hits', 1)
        redis.call('HINCRBY', stats_key, 'total_response_time', response_time)
        return {value, 'hit'}
      else
        redis.call('HINCRBY', stats_key, 'misses', 1)
        return {nil, 'miss'}
      end
    `;

    // Script for pattern-based cache invalidation
    this.invalidatePatternScript = `
      local pattern = ARGV[1]
      local stats_key = ARGV[2]
      local cursor = 0
      local deleted = 0
      
      repeat
        local result = redis.call('SCAN', cursor, 'MATCH', pattern, 'COUNT', 100)
        cursor = tonumber(result[1])
        local keys = result[2]
        
        if #keys > 0 then
          for i=1,#keys do
            redis.call('DEL', keys[i])
            redis.call('DEL', keys[i] .. ':meta')
            deleted = deleted + 1
          end
        end
      until cursor == 0
      
      if deleted > 0 then
        redis.call('HINCRBY', stats_key, 'deletes', deleted)
      end
      
      return deleted
    `;
  }

  /**
   * Set cache entry with automatic compression and TTL
   */
  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    const fullKey = this.buildKey(key);
    const statsKey = this.buildStatsKey();
    const effectiveTtl = ttl || this.config.defaultTtl || 3600; // Default to 1 hour

    try {
      const serialized = JSON.stringify(value);
      const originalSize = Buffer.byteLength(serialized, 'utf8');

      let finalValue = serialized;
      let compressed = 'false';
      let compressedSize = originalSize;

      // Compress if enabled and above threshold
      if (this.config.compressionEnabled && originalSize > this.config.compressionThreshold!) {
        const compressedBuffer = await gzip(serialized);
        if (compressedBuffer.length < originalSize * 0.9) { // Only use if >10% savings
          finalValue = compressedBuffer.toString('base64');
          compressed = 'true';
          compressedSize = compressedBuffer.length;

          this.emit('compressed', {
            key: fullKey,
            originalSize,
            compressedSize,
            compressionRatio: (1 - compressedSize / originalSize) * 100,
          });
        }
      }

      await this.redis.eval(
        this.setWithStatsScript,
        2,
        fullKey,
        statsKey,
        finalValue,
        effectiveTtl.toString(),
        compressed,
        originalSize.toString(),
        compressedSize.toString(),
      );

      this.emit('set', { key: fullKey, size: compressedSize, ttl: effectiveTtl });

    } catch (error) {
      this.emit('error', { operation: 'set', key: fullKey, error });
      throw error;
    }
  }

  /**
   * Get cache entry with automatic decompression
   */
  async get<T>(key: string): Promise<T | null> {
    const fullKey = this.buildKey(key);
    const statsKey = this.buildStatsKey();
    const startTime = Date.now();

    try {
      const result = await this.redis.eval(
        this.getWithStatsScript,
        2,
        fullKey,
        statsKey,
        startTime.toString(),
      ) as [string | null, string];

      const [value, hitType] = result;

      if (!value) {
        this.emit('miss', { key: fullKey });
        return null;
      }

      // Get metadata to check if compressed
      const metaKey = `${fullKey}:meta`;
      const metadata = await this.redis.hmget(metaKey, 'compressed', 'original_size');
      const isCompressed = metadata[0] === 'true';

      let finalValue = value;

      // Decompress if needed
      if (isCompressed) {
        const compressedBuffer = Buffer.from(value, 'base64');
        const decompressedBuffer = await gunzip(compressedBuffer);
        finalValue = decompressedBuffer.toString('utf8');

        this.emit('decompressed', {
          key: fullKey,
          compressedSize: compressedBuffer.length,
          originalSize: parseInt(metadata[1] || '0') || 0,
        });
      }

      const parsed = JSON.parse(finalValue) as T;
      this.emit('hit', { key: fullKey, value: parsed });

      return parsed;

    } catch (error) {
      this.emit('error', { operation: 'get', key: fullKey, error });
      // Return null instead of throwing to prevent cache failures from breaking the app
      return null;
    }
  }

  /**
   * Delete specific cache entry
   */
  async delete(key: string): Promise<boolean> {
    const fullKey = this.buildKey(key);
    const metaKey = `${fullKey}:meta`;
    const statsKey = this.buildStatsKey();

    try {
      const pipeline = this.redis.pipeline();
      pipeline.del(fullKey);
      pipeline.del(metaKey);
      pipeline.hincrby(statsKey, 'deletes', 1);

      const results = await pipeline.exec();
      const deleted = results?.[0]?.[1] as number;

      if (deleted > 0) {
        this.emit('delete', { key: fullKey });
        return true;
      }

      return false;

    } catch (error) {
      this.emit('error', { operation: 'delete', key: fullKey, error });
      throw error;
    }
  }

  /**
   * Check if key exists in cache
   */
  async exists(key: string): Promise<boolean> {
    const fullKey = this.buildKey(key);

    try {
      const result = await this.redis.exists(fullKey);
      return result === 1;
    } catch (error) {
      this.emit('error', { operation: 'exists', key: fullKey, error });
      return false;
    }
  }

  /**
   * Get remaining TTL for cache entry
   */
  async getTtl(key: string): Promise<number> {
    const fullKey = this.buildKey(key);

    try {
      return await this.redis.ttl(fullKey);
    } catch (error) {
      this.emit('error', { operation: 'getTtl', key: fullKey, error });
      return -1;
    }
  }

  /**
   * Extend TTL for existing cache entry
   */
  async extend(key: string, additionalTtl: number): Promise<boolean> {
    const fullKey = this.buildKey(key);
    const metaKey = `${fullKey}:meta`;

    try {
      const currentTtl = await this.redis.ttl(fullKey);
      if (currentTtl <= 0) {
        return false; // Key doesn't exist or has no expiry
      }

      const newTtl = currentTtl + additionalTtl;

      const pipeline = this.redis.pipeline();
      pipeline.expire(fullKey, newTtl);
      pipeline.expire(metaKey, newTtl);

      await pipeline.exec();

      this.emit('extended', { key: fullKey, newTtl });
      return true;

    } catch (error) {
      this.emit('error', { operation: 'extend', key: fullKey, error });
      return false;
    }
  }

  /**
   * Invalidate cache entries by pattern
   */
  async invalidatePattern(pattern: string): Promise<number> {
    const fullPattern = this.buildKey(pattern);
    const statsKey = this.buildStatsKey();

    try {
      const deleted = await this.redis.eval(
        this.invalidatePatternScript,
        0,
        fullPattern,
        statsKey,
      ) as number;

      this.emit('patternInvalidated', { pattern: fullPattern, deleted });
      return deleted;

    } catch (error) {
      this.emit('error', { operation: 'invalidatePattern', pattern: fullPattern, error });
      throw error;
    }
  }

  /**
   * Clear all cache entries
   */
  async clear(): Promise<number> {
    return this.invalidatePattern('*');
  }

  /**
   * Get cache statistics
   */
  async getStats(): Promise<CacheStats> {
    const statsKey = this.buildStatsKey();

    try {
      const rawStats = await this.redis.hmget(
        statsKey,
        'hits', 'misses', 'sets', 'deletes', 'evictions',
        'total_original_size', 'total_compressed_size', 'total_response_time',
      );

      const hits = parseInt(rawStats[0] || '0') || 0;
      const misses = parseInt(rawStats[1] || '0') || 0;
      const sets = parseInt(rawStats[2] || '0') || 0;
      const deletes = parseInt(rawStats[3] || '0') || 0;
      const evictions = parseInt(rawStats[4] || '0') || 0;
      const totalOriginalSize = parseInt(rawStats[5] || '0') || 0;
      const totalCompressedSize = parseInt(rawStats[6] || '0') || 0;
      const totalResponseTime = parseInt(rawStats[7] || '0') || 0;

      const totalRequests = hits + misses;
      const hitRate = totalRequests > 0 ? (hits / totalRequests) * 100 : 0;
      const compressionRatio = totalOriginalSize > 0 ?
        ((totalOriginalSize - totalCompressedSize) / totalOriginalSize) * 100 : 0;
      const avgResponseTime = hits > 0 ? totalResponseTime / hits / 1000 : 0; // Convert to ms

      // Get memory usage
      const memoryInfo = await this.redis.memory('USAGE', `${this.keyPrefix  }*`);
      const memoryUsage = Array.isArray(memoryInfo) ?
        memoryInfo.reduce((sum: any, usage: any) => sum + (usage as number), 0) : 0;

      return {
        hits,
        misses,
        sets,
        deletes,
        evictions,
        hitRate,
        compressionRatio,
        memoryUsage: memoryUsage / (1024 * 1024), // Convert to MB
        avgResponseTime,
      };

    } catch (error) {
      this.emit('error', { operation: 'getStats', error });
      return this.stats; // Return default stats on error
    }
  }

  /**
   * Reset cache statistics
   */
  async resetStats(): Promise<void> {
    const statsKey = this.buildStatsKey();

    try {
      await this.redis.del(statsKey);
      this.emit('statsReset');
    } catch (error) {
      this.emit('error', { operation: 'resetStats', error });
      throw error;
    }
  }

  /**
   * Get cache entries by pattern with metadata and access control
   */
  async getEntriesByPattern(
    pattern: string,
    limit = 100,
    requesterRole?: 'admin' | 'user' | 'readonly',
  ): Promise<CacheEntry[]> {
    // Security: Implement access control for cache pattern access
    if (!this.canAccessPattern(pattern, requesterRole)) {
      throw new Error('Insufficient permissions for cache pattern access');
    }

    const fullPattern = this.buildKey(pattern);

    try {
      const keys = await this.redis.keys(fullPattern);
      const entries: CacheEntry[] = [];

      for (const key of keys.slice(0, limit)) {
        if (key.endsWith(':meta')) {continue;}

        const [value, ttl, metadata] = await Promise.all([
          this.redis.get(key),
          this.redis.ttl(key),
          this.redis.hmget(`${key}:meta`, 'compressed', 'original_size', 'compressed_size', 'created_at'),
        ]);

        if (value) {
          entries.push({
            key: key.replace(`${this.keyPrefix  }:`, ''),
            size: parseInt(metadata[2] || '0') || Buffer.byteLength(value, 'utf8'),
            ttl,
            compressed: metadata[0] === 'true',
            createdAt: new Date(parseInt(metadata[3] || '0') * 1000),
          });
        }
      }

      return entries.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    } catch (error) {
      this.emit('error', { operation: 'getEntriesByPattern', pattern: fullPattern, error });
      return [];
    }
  }

  /**
   * Optimize cache by removing expired and large entries
   */
  async optimize(): Promise<{ removed: number; spaceSaved: number }> {
    const pattern = this.buildKey('*');
    let removed = 0;
    let spaceSaved = 0;

    try {
      const keys = await this.redis.keys(pattern);
      const maxSize = ((this.config.maxMemoryMB || 100) * 1024 * 1024) * 0.8; // 80% of max memory

      const entries: Array<{ key: string; size: number; lastAccess: number }> = [];

      // Collect entry information
      for (const key of keys) {
        if (key.endsWith(':meta')) {continue;}

        const [ttl, metadata] = await Promise.all([
          this.redis.ttl(key),
          this.redis.hmget(`${key}:meta`, 'compressed_size', 'original_size', 'created_at'),
        ]);

        // Remove expired entries
        if (ttl === -2) { // Key doesn't exist
          continue;
        }

        const size = parseInt(metadata[0] || '0') || parseInt(metadata[1] || '0') || 0;
        const createdAt = parseInt(metadata[2] || '0') || 0;

        entries.push({
          key,
          size,
          lastAccess: createdAt,
        });
      }

      // Sort by size (largest first) and age (oldest first)
      entries.sort((a, b) => {
        const sizeDiff = b.size - a.size;
        if (sizeDiff !== 0) {return sizeDiff;}
        return a.lastAccess - b.lastAccess;
      });

      // Remove largest/oldest entries if over memory limit
      let currentMemory = entries.reduce((sum, entry) => sum + entry.size, 0);

      for (const entry of entries) {
        if (currentMemory <= maxSize) {break;}

        await this.delete(entry.key.replace(`${this.keyPrefix  }:`, ''));
        removed++;
        spaceSaved += entry.size;
        currentMemory -= entry.size;
      }

      this.emit('optimized', { removed, spaceSaved });

      return { removed, spaceSaved };

    } catch (error) {
      this.emit('error', { operation: 'optimize', error });
      return { removed: 0, spaceSaved: 0 };
    }
  }

  /**
   * Health check for cache system
   */
  async healthCheck(): Promise<{
    status: string;
    redis: boolean;
    memoryUsage: number;
    hitRate: number;
    responseTime: number;
  }> {
    try {
      const start = Date.now();
      await this.redis.ping();
      const responseTime = Date.now() - start;

      const stats = await this.getStats();

      return {
        status: 'healthy',
        redis: true,
        memoryUsage: stats.memoryUsage,
        hitRate: stats.hitRate || 0,
        responseTime,
      };

    } catch (error) {
      return {
        status: 'unhealthy',
        redis: false,
        memoryUsage: 0,
        hitRate: 0,
        responseTime: -1,
      };
    }
  }

  /**
   * Start periodic cleanup of expired entries
   */
  private startCleanup(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }

    this.cleanupInterval = setInterval(async () => {
      try {
        await this.optimize();
      } catch (error) {
        this.emit('error', { operation: 'cleanup', error });
      }
    }, 5 * 60 * 1000); // Every 5 minutes
  }

  /**
   * Build full cache key
   */
  private buildKey(key: string): string {
    return `${this.keyPrefix}:${key}`;
  }

  /**
   * Security: Check if requester can access cache pattern
   */
  private canAccessPattern(pattern: string, role?: string): boolean {
    // Restrict access to sensitive patterns
    const sensitivePatterns = [
      '*customer*',
      '*auth*',
      '*token*',
      '*key*',
      '*secret*',
    ];

    const isSensitive = sensitivePatterns.some(sensitive =>
      pattern.toLowerCase().includes(sensitive.replace(/\*/g, '')),
    );

    if (isSensitive && role !== 'admin') {
      return false;
    }

    return true;
  }

  /**
   * Build statistics key
   */
  private buildStatsKey(): string {
    return `${this.keyPrefix}:stats`;
  }

  /**
   * Cleanup resources
   */
  async close(): Promise<void> {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }

    this.removeAllListeners();
  }
}

export default GoogleAdsCache;
