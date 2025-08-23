// Campaign Control Types and Interfaces

export interface Project {
  id: string;
  title: string;
  description: string;
  status: 'planning' | 'in-progress' | 'review' | 'completed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignees: string[];
  dueDate: string;
  progress: number;
  tags: string[];
  lastActivity: string;
}

export interface Asset {
  id: string;
  name: string;
  type: 'image' | 'video' | 'document' | 'audio' | 'template';
  size: string;
  uploadDate: string;
  category: string;
  tags: string[];
  url?: string;
  thumbnail?: string;
}

export interface CampaignActivityItem {
  id: string;
  user: string;
  action: string;
  target: string;
  timestamp: string;
  type: 'project' | 'asset' | 'team' | 'system';
}

export type CampaignTab = 'projects' | 'assets' | 'activity' | 'ads';

export type ProjectStatus = 'planning' | 'in-progress' | 'review' | 'completed';
export type ProjectPriority = 'low' | 'medium' | 'high' | 'urgent';
export type AssetType = 'image' | 'video' | 'document' | 'audio' | 'template';
export type ActivityType = 'project' | 'asset' | 'team' | 'system';

export interface ProjectFilters {
  status: string;
  search: string;
}

export interface AssetFilters {
  category: string;
  search: string;
}
