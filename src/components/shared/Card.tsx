import type React from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { ANIMATION_CONFIGS } from '../../constants/animations';
import { getSectionTheme } from '../../utils/sectionTheming';

export interface CardProps extends HTMLMotionProps<'div'> {
  variant?: 'glass' | 'solid' | 'elevated' | 'bordered';
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  noShadow?: boolean;
  themeOverride?: string; // Allow override of automatic theme detection
  children: React.ReactNode;
}

const Card: React.FC<CardProps> = ({
  variant = 'glass',
  hover = true,
  padding = 'md',
  noShadow = false,
  themeOverride,
  className,
  children,
  ...props
}) => {
  const location = useLocation();
  const sectionTheme = getSectionTheme(themeOverride || location.pathname);
  const baseStyles = 'rounded-2xl transition-colors duration-200';

  const variantStyles = {
    glass: 'bg-black/15 border border-white/20',
    solid: 'bg-white/10',
    elevated: 'bg-black/20 shadow-lg',
    bordered: 'bg-transparent border-2 border-white/30',
  };

  const paddingStyles = {
    none: '',
    sm: 'p-4',
    md: 'p-4',
    lg: 'p-5',
    xl: 'p-10',
  };

  const hoverStyles = hover ? `hover:bg-black/25 hoverable` : '';

  // Box shadow for glass effect (unless disabled)
  const boxShadow = noShadow
    ? undefined
    : '0 4px 8px -2px rgb(0 0 0 / 0.08), 0 2px 4px -2px rgb(0 0 0 / 0.08)';

  return (
    <motion.div
      className={cn(
        baseStyles,
        variantStyles[variant],
        paddingStyles[padding],
        hoverStyles,
        className
      )}
      style={boxShadow ? { boxShadow } : {}}
      {...(hover ? { transition: { duration: 0.15 } } : {})}
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
  <h3 className={cn('section-header', className)}>{children}</h3>
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
