import React from 'react';
import { Tag } from '../../types';

interface TagBadgeProps {
  tag: Tag;
  onRemove?: () => void;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const TagBadge: React.FC<TagBadgeProps> = ({
  tag,
  onRemove,
  size = 'md',
  className = '',
}) => {
  // Size classes
  const sizeClasses = {
    sm: 'text-xs py-0.5 px-2',
    md: 'text-sm py-1 px-3',
    lg: 'text-base py-1.5 px-4',
  };

  // Generate contrasting text color based on background color
  const getContrastColor = (hexColor: string) => {
    // Remove # if present
    const color = hexColor.replace('#', '');
    
    // Convert to RGB
    const r = parseInt(color.substring(0, 2), 16);
    const g = parseInt(color.substring(2, 4), 16);
    const b = parseInt(color.substring(4, 6), 16);
    
    // Calculate luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    
    // Return white for dark colors, black for light colors
    return luminance > 0.5 ? '#000000' : '#FFFFFF';
  };

  const textColor = getContrastColor(tag.color);

  return (
    <span
      className={`
        inline-flex items-center rounded-full
        font-medium transition-all duration-200
        ${sizeClasses[size]}
        ${className}
      `}
      style={{
        backgroundColor: tag.color,
        color: textColor,
      }}
    >
      {tag.name}
      
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="ml-1.5 flex-shrink-0 inline-flex items-center justify-center rounded-full hover:bg-black hover:bg-opacity-10 focus:outline-none"
          style={{ width: size === 'sm' ? '16px' : size === 'md' ? '18px' : '20px', height: size === 'sm' ? '16px' : size === 'md' ? '18px' : '20px' }}
        >
          <span className="sr-only">Remove {tag.name}</span>
          <svg
            width="8"
            height="8"
            viewBox="0 0 8 8"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1 1L7 7M1 7L7 1"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      )}
    </span>
  );
};

export default TagBadge;