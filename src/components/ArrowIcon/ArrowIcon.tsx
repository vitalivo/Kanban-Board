import React from 'react';

interface ArrowIconProps {
  isUp?: boolean;
  className?: string;
}

const ArrowIcon: React.FC<ArrowIconProps> = ({ isUp = false, className = '' }) => {
  return (
    <svg 
      width="12" 
      height="8" 
      viewBox="0 0 12 8" 
      fill="none" 
      className={className}
      style={{ transform: isUp ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s ease' }}
    >
      <path 
        d="M1.415 0.209991L6 4.79499L10.585 0.209991L12 1.62499L6 7.62499L0 1.62499L1.415 0.209991Z" 
        fill="white"
      />
    </svg>
  );
};

export default ArrowIcon;