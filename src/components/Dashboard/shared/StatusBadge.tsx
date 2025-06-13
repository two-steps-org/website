import React from 'react';

interface StatusBadgeProps {
  status: 'Active' | 'Inactive';
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  return (
    <span className={`text-sm ${
      status === 'Active' 
        ? 'text-green-500' 
        : 'text-red-500'
    }`}>
      {status}
    </span>
  );
};

export default StatusBadge;