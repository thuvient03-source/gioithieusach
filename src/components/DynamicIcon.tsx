import React from 'react';
import * as Icons from 'lucide-react';

interface DynamicIconProps {
  name: string;
  className?: string;
  size?: number;
  style?: React.CSSProperties;
}

export const DynamicIcon: React.FC<DynamicIconProps> = ({ name, className = 'w-5 h-5', size, style }) => {
  // Try to find icon component in Lucide
  const IconComponent = (Icons as any)[name] || Icons.BookOpen;
  return <IconComponent className={className} size={size} style={style} />;
};
