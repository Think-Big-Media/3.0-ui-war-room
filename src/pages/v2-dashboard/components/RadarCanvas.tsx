import React, { useRef, useEffect, useCallback } from 'react';
import { SWOTDataPoint } from './SWOTRadarDashboard';
interface RadarCanvasProps {
  dataPoints: SWOTDataPoint[];
  sweepAngle: number;
  onSweepHit: (point: SWOTDataPoint, x: number, y: number) => void;
}

// @component: RadarCanvas
export const RadarCanvas = ({
  dataPoints,
  sweepAngle,
  onSweepHit
}: RadarCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const lastSweepAngle = useRef<number>(0);
  const backgroundCache = useRef<ImageData | null>(null);
  const lastFrameTime = useRef<number>(0);
  const FPS_LIMIT = 60; // Limit to 60 FPS
  const FRAME_INTERVAL = 1000 / FPS_LIMIT;
  const drawRadarBackground = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const centerX = width / 2;
    const centerY = height / 2;
    const radarSize = Math.min(width, height) - 80; // Square radar area
    const halfSize = radarSize / 2;

    // Clear canvas with dark green background
    ctx.fillStyle = '#0d1f0d';
    ctx.fillRect(0, 0, width, height);

    // Create darker green gradient background for radar area
    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, halfSize);
    gradient.addColorStop(0, '#1a3d2e');
    gradient.addColorStop(0.7, '#0f2419');
    gradient.addColorStop(1, '#0d1f0d');
    ctx.fillStyle = gradient;
    ctx.fillRect(centerX - halfSize, centerY - halfSize, radarSize, radarSize);

    // Draw square border with softer green
    ctx.strokeStyle = 'rgba(34, 197, 94, 0.6)'; // More translucent
    ctx.lineWidth = 2;
    ctx.strokeRect(centerX - halfSize, centerY - halfSize, radarSize, radarSize);

    // Draw fine grid pattern with reduced opacity (60%)
    ctx.strokeStyle = 'rgba(34, 197, 94, 0.24)'; // 60% of 0.4 = 0.24
    ctx.lineWidth = 0.8; // Thinner lines

    // Vertical grid lines - 20 divisions for finer grid
    for (let i = 1; i < 20; i++) {
      const x = centerX - halfSize + radarSize / 20 * i;
      ctx.beginPath();
      ctx.moveTo(x, centerY - halfSize);
      ctx.lineTo(x, centerY + halfSize);
      ctx.stroke();
    }

    // Horizontal grid lines - 20 divisions for finer grid
    for (let i = 1; i < 20; i++) {
      const y = centerY - halfSize + radarSize / 20 * i;
      ctx.beginPath();
      ctx.moveTo(centerX - halfSize, y);
      ctx.lineTo(centerX + halfSize, y);
      ctx.stroke();
    }

    // Draw center crosshairs with reduced opacity (60%)
    ctx.strokeStyle = 'rgba(34, 197, 94, 0.42)'; // 60% of 0.7 = 0.42
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY - halfSize);
    ctx.lineTo(centerX, centerY + halfSize);
    ctx.moveTo(centerX - halfSize, centerY);
    ctx.lineTo(centerX + halfSize, centerY);
    ctx.stroke();

    // Draw SWOT labels at corners with reduced opacity (60%)
    ctx.fillStyle = 'rgba(34, 197, 94, 0.36)'; // 60% of 0.6 = 0.36
    ctx.font = 'bold 16px monospace';
    ctx.shadowColor = 'rgba(34, 197, 94, 0.3)'; // 60% of 0.5 = 0.3
    ctx.shadowBlur = 8;

    // STRENGTHS - top-left
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText('STRENGTHS', centerX - halfSize + 10, centerY - halfSize + 10);

    // WEAKNESSES - top-right
    ctx.textAlign = 'right';
    ctx.textBaseline = 'top';
    ctx.fillText('WEAKNESSES', centerX + halfSize - 10, centerY - halfSize + 10);

    // OPPORTUNITIES - bottom-left
    ctx.textAlign = 'left';
    ctx.textBaseline = 'bottom';
    ctx.fillText('OPPORTUNITIES', centerX - halfSize + 10, centerY + halfSize - 10);

    // THREATS - bottom-right
    ctx.textAlign = 'right';
    ctx.textBaseline = 'bottom';
    ctx.fillText('THREATS', centerX + halfSize - 10, centerY + halfSize - 10);

    // Reset shadow
    ctx.shadowBlur = 0;
  }, []);
  const drawSweepLine = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number, angle: number) => {
    const centerX = width / 2;
    const centerY = height / 2;
    const radarSize = Math.min(width, height) - 80;
    const halfSize = radarSize / 2;

    // Convert angle to radians
    const radians = (angle - 90) * (Math.PI / 180);
    const endX = centerX + Math.cos(radians) * halfSize;
    const endY = centerY + Math.sin(radians) * halfSize;

    // OPTIMIZED: Reduced trail length from 90° to 45° (half quadrant)
    const trailLength = 45; // degrees of trail - 50% reduction
    const trailSegments = 30; // number of segments - 50% reduction for performance

    // Draw trail as filled arc segments with decreasing opacity
    for (let i = 0; i < trailSegments; i++) {
      const segmentAngle = trailLength / trailSegments; // degrees per segment
      const startAngle = angle - i * segmentAngle;
      const endAngle = angle - (i + 1) * segmentAngle;

      // Convert to radians for canvas arc
      const startRadians = (startAngle - 90) * (Math.PI / 180);
      const endRadians = (endAngle - 90) * (Math.PI / 180);

      // Calculate opacity - brightest at needle, fading smoothly
      const opacity = Math.max(0, (1 - i / trailSegments) * 0.4);
      ctx.fillStyle = `rgba(34, 197, 94, ${opacity})`;
      ctx.beginPath();
      ctx.moveTo(centerX, centerY); // Start at center
      ctx.arc(centerX, centerY, halfSize, startRadians, endRadians, true); // Draw arc segment
      ctx.closePath();
      ctx.fill();
    }

    // Draw main sweep needle - bright and thin like real 1940s radar
    ctx.strokeStyle = 'rgba(34, 197, 94, 1)';
    ctx.lineWidth = 2;
    ctx.shadowColor = 'rgba(34, 197, 94, 0.8)';
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(endX, endY);
    ctx.stroke();

    // Reset shadow
    ctx.shadowBlur = 0;
  }, []);
  const drawDataPoints = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number, points: SWOTDataPoint[], currentAngle: number) => {
    const centerX = width / 2;
    const centerY = height / 2;

    // PERFORMANCE: Pre-calculate time-based values once per frame
    const currentTime = Date.now();
    points.forEach(point => {
      // Calculate if sweep line is near this point
      const pointAngle = Math.atan2(point.y - centerY, point.x - centerX) * (180 / Math.PI) + 90;
      const normalizedPointAngle = (pointAngle % 360 + 360) % 360;
      const normalizedSweepAngle = (currentAngle % 360 + 360) % 360;
      let angleDiff = Math.abs(normalizedSweepAngle - normalizedPointAngle);
      if (angleDiff > 180) angleDiff = 360 - angleDiff;
      const isNearSweep = angleDiff < 5;

      // Check if sweep just passed over this point
      const lastNormalizedAngle = (lastSweepAngle.current % 360 + 360) % 360;
      let lastAngleDiff = Math.abs(lastNormalizedAngle - normalizedPointAngle);
      if (lastAngleDiff > 180) lastAngleDiff = 360 - lastAngleDiff;
      const wasNearSweep = lastAngleDiff < 5;
      if (isNearSweep && !wasNearSweep) {
        onSweepHit(point, point.x, point.y);
      }

      // PERFORMANCE: Optimized pulsing calculation
      const pulseIntensity = Math.sin(currentTime * 0.003 + point.x * 0.01) * 0.4 + 0.8;
      const blobRadius = 6 + point.intensity * 8 * pulseIntensity;

      // PERFORMANCE: Pre-define colors to avoid switch statement overhead
      const colorMap = {
        strength: {
          color: '#22c55e',
          glow: '#22c55e'
        },
        weakness: {
          color: '#ef4444',
          glow: '#ff6b6b'
        },
        opportunity: {
          color: '#3b82f6',
          glow: '#60a5fa'
        },
        threat: {
          color: '#f59e0b',
          glow: '#fbbf24'
        }
      };
      const {
        color,
        glow: glowColor
      } = colorMap[point.type] || colorMap.strength;

      // PERFORMANCE: Simplified gradient creation
      const gradient = ctx.createRadialGradient(point.x, point.y, 0, point.x, point.y, blobRadius * 2);
      gradient.addColorStop(0, color);
      gradient.addColorStop(0.5, `${glowColor}60`);
      gradient.addColorStop(1, 'transparent');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(point.x, point.y, blobRadius * 2, 0, Math.PI * 2);
      ctx.fill();

      // Draw solid center with phosphor glow
      ctx.fillStyle = color;
      ctx.shadowColor = glowColor;
      ctx.shadowBlur = 10; // Reduced from 15 for performance
      ctx.beginPath();
      ctx.arc(point.x, point.y, blobRadius * 0.6, 0, Math.PI * 2);
      ctx.fill();

      // Add inner bright core
      ctx.fillStyle = '#ffffff';
      ctx.shadowBlur = 3; // Reduced from 5 for performance
      ctx.beginPath();
      ctx.arc(point.x, point.y, blobRadius * 0.2, 0, Math.PI * 2);
      ctx.fill();

      // Reset shadow
      ctx.shadowBlur = 0;
    });
  }, [onSweepHit]);
  const animate = useCallback((currentTime: number = 0) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // PERFORMANCE: Frame rate limiting
    if (currentTime - lastFrameTime.current < FRAME_INTERVAL) {
      animationRef.current = requestAnimationFrame(animate);
      return;
    }
    lastFrameTime.current = currentTime;

    // PERFORMANCE: Only redraw if sweep angle changed
    if (Math.abs(sweepAngle - lastSweepAngle.current) < 0.1) {
      animationRef.current = requestAnimationFrame(animate);
      return;
    }
    const {
      width,
      height
    } = canvas;

    // PERFORMANCE: Use cached background if available
    if (!backgroundCache.current) {
      drawRadarBackground(ctx, width, height);
      backgroundCache.current = ctx.getImageData(0, 0, width, height);
    } else {
      ctx.putImageData(backgroundCache.current, 0, 0);
    }

    // Draw data points
    drawDataPoints(ctx, width, height, dataPoints, sweepAngle);

    // Draw sweep line
    drawSweepLine(ctx, width, height, sweepAngle);
    lastSweepAngle.current = sweepAngle;
    animationRef.current = requestAnimationFrame(animate);
  }, [dataPoints, sweepAngle, drawRadarBackground, drawDataPoints, drawSweepLine]);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set canvas size
    canvas.width = 600;
    canvas.height = 600;

    // PERFORMANCE: Clear background cache when canvas size changes
    backgroundCache.current = null;
    animate();
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [animate]);

  // PERFORMANCE: Clear background cache when data points change
  useEffect(() => {
    backgroundCache.current = null;
  }, [dataPoints]);

  // @return
  return <div className="flex justify-center items-center bg-gradient-to-br from-slate-900 via-slate-800 to-black rounded-xl p-6 shadow-inner">
      <canvas ref={canvasRef} className="border border-slate-700/50 rounded-xl shadow-2xl" style={{
      filter: 'contrast(1.05) brightness(1.05)',
      background: 'radial-gradient(circle, #0f1419 0%, #000000 100%)'
    }} />
    </div>;
};