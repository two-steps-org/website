import React from 'react';
import clsx from 'clsx';

interface StatusBadgeProps {
  status: 'Active' | 'Inactive';
  onClick: () => void;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, onClick }) => {
  const badgeClass = clsx(
    'px-4 py-1 text-sm font-medium rounded-full transition-colors',
    status === 'Active'
      ? 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-950/30 dark:text-green-400 dark:hover:bg-green-950/50'
      : 'bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-950/30 dark:text-red-400 dark:hover:bg-red-950/50'
  );

  return (
    <button onClick={onClick} className={badgeClass}>
      {status}
    </button>
  );
};

export default React.memo(StatusBadge);
