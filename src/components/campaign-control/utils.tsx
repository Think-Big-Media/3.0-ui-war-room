// Campaign Control Utility Functions

import React from 'react';
import {
  Image,
  Video,
  FileText,
  Play,
  Folder,
  Target,
  Users,
  Activity,
  Zap,
} from 'lucide-react';

import { type ProjectStatus, type ProjectPriority, type AssetType, type ActivityType } from '../../types/campaign';

// Status color utilities
export const getStatusColor = (status: ProjectStatus): string => {
  switch (status) {
    case 'planning':
      return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    case 'in-progress':
      return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    case 'review':
      return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
    case 'completed':
      return 'bg-green-500/20 text-green-400 border-green-500/30';
    default:
      return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  }
};

// Priority color utilities
export const getPriorityColor = (priority: ProjectPriority): string => {
  switch (priority) {
    case 'urgent':
      return 'border-red-500 bg-red-500/10';
    case 'high':
      return 'border-orange-500 bg-orange-500/10';
    case 'medium':
      return 'border-yellow-500 bg-yellow-500/10';
    case 'low':
      return 'border-gray-500 bg-gray-500/10';
    default:
      return 'border-gray-500 bg-gray-500/10';
  }
};

// Asset icon utilities
export const getAssetIcon = (type: AssetType) => {
  switch (type) {
    case 'image':
      return <Image className="w-5 h-5 text-blue-400" />;
    case 'video':
      return <Video className="w-5 h-5 text-purple-400" />;
    case 'document':
      return <FileText className="w-5 h-5 text-green-400" />;
    case 'audio':
      return <Play className="w-5 h-5 text-orange-400" />;
    case 'template':
      return <Folder className="w-5 h-5 text-yellow-400" />;
    default:
      return <FileText className="w-5 h-5 text-gray-400" />;
  }
};

// Activity icon utilities
export const getActivityIcon = (type: ActivityType) => {
  switch (type) {
    case 'project':
      return <Target className="w-4 h-4 text-blue-400" />;
    case 'asset':
      return <FileText className="w-4 h-4 text-green-400" />;
    case 'team':
      return <Users className="w-4 h-4 text-purple-400" />;
    case 'system':
      return <Zap className="w-4 h-4 text-orange-400" />;
    default:
      return <Activity className="w-4 h-4 text-gray-400" />;
  }
};

// Avatar generation utility
export const generateAvatar = (name: string): string => {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();
};
