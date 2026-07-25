import React from 'react';
import { CategoryType } from '../types';
import { CATEGORY_INFO } from '../data/sampleProblems';
import * as Icons from 'lucide-react';

interface Props {
  category: CategoryType;
  size?: 'sm' | 'md' | 'lg';
  active?: boolean;
  onClick?: () => void;
  showIcon?: boolean;
}

export const CategoryBadge: React.FC<Props> = ({
  category,
  size = 'md',
  active = false,
  onClick,
  showIcon = true,
}) => {
  const info = CATEGORY_INFO[category] || {
    icon: 'Folder',
    color: 'text-gray-600',
    bg: 'bg-gray-100',
    border: 'border-gray-200',
  };

  // Dynamic icon lookup
  const IconComponent = (Icons as Record<string, any>)[info.icon] || Icons.Folder;

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs font-medium rounded-md gap-1',
    md: 'px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-lg gap-1.5',
    lg: 'px-4 py-2.5 text-sm sm:text-base font-semibold rounded-xl gap-2',
  }[size];

  const activeClasses = active
    ? 'bg-blue-600 text-white shadow-sm border-blue-600 ring-2 ring-blue-300'
    : `${info.bg} ${info.color} ${info.border} border hover:bg-opacity-80 transition-all`;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!onClick}
      className={`inline-flex items-center cursor-pointer select-none whitespace-nowrap ${sizeClasses} ${activeClasses}`}
    >
      {showIcon && <IconComponent className={size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4'} />}
      <span>{category}</span>
    </button>
  );
};
