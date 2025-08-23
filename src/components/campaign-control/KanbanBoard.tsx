// Kanban Board Component

import type React from 'react';
import { motion } from 'framer-motion';
import ProjectCard from './ProjectCard';
import { type Project, type ProjectStatus } from '../../types/campaign';

interface KanbanBoardProps {
  projects: Project[];
  onProjectSelect: (project: Project) => void;
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({ projects, onProjectSelect }) => {
  const statusColumns: ProjectStatus[] = ['planning', 'in-progress', 'review', 'completed'];

  const getStatusLabel = (status: ProjectStatus): string => {
    return status.replace('-', ' ');
  };

  const getProjectsByStatus = (status: ProjectStatus): Project[] => {
    return projects.filter((project) => project.status === status);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid grid-cols-1 lg:grid-cols-4 gap-6"
    >
      {statusColumns.map((status) => {
        const statusProjects = getProjectsByStatus(status);

        return (
          <div key={status} className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white/40 uppercase font-condensed tracking-wide">
                {getStatusLabel(status)}
              </h3>
              <span className="bg-white/20 text-white/80 px-2 py-1 rounded-full text-sm">
                {statusProjects.length}
              </span>
            </div>

            <div className="space-y-3">
              {statusProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onClick={onProjectSelect}
                />
              ))}
            </div>
          </div>
        );
      })}
    </motion.div>
  );
};

export default KanbanBoard;
