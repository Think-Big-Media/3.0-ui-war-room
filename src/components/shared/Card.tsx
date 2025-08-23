import type React from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { cn } from '../../lib/utils';
import { ANIMATION_CONFIGS } from '../../constants/animations';

export interface CardProps extends HTMLMotionProps<'div'> {
  variant?: 'glass' | 'solid' | 'elevated' | 'bordered';
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  children: React.ReactNode;
}

const Card: React.FC<CardProps> = ({
  variant = 'glass',
  hover = true,
  padding = 'md',
  className,
  children,
  ...props
}) => {
  const baseStyles = 'rounded-2xl transition-all duration-300';

  const variantStyles = {
    glass: 'bg-black/15 backdrop-blur-lg border border-white/20',
    solid: 'bg-white/10 backdrop-blur-md',
    elevated: 'bg-black/20 backdrop-blur-xl shadow-2xl',
    bordered: 'bg-transparent border-2 border-white/30',
  };

  const paddingStyles = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-10',
  };

  const hoverStyles = hover
    ? 'hover:bg-white/5 hover:border-white/30 hover:shadow-lg'
    : '';

  // Box shadow for glass effect
  const boxShadow = '0 4px 8px -2px rgb(0 0 0 / 0.08), 0 2px 4px -2px rgb(0 0 0 / 0.08)';

  return (
    <motion.div
      className={cn(
        baseStyles,
        variantStyles[variant],
        paddingStyles[padding],
        hoverStyles,
        className,
      )}
      style={{ boxShadow }}
      {...(hover ? ANIMATION_CONFIGS.card : {})}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export const CardHeader: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => (
  <div className={cn('mb-4', className)}>{children}</div>
);

export const CardTitle: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => (
  <h3 className={cn('text-xl font-semibold text-white/95', className)}>
    {children}
  </h3>
);

export const CardDescription: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => (
  <p className={cn('text-sm text-white/70 mt-1', className)}>{children}</p>
);

export const CardContent: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => (
  <div className={cn('', className)}>{children}</div>
);

export const CardFooter: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => (
  <div className={cn('mt-4 pt-4 border-t border-white/20', className)}>
    {children}
  </div>
);

export default Card;
