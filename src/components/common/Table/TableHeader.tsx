import React from 'react';
import type { Column } from './types';
import clsx from 'clsx';

interface TableHeaderProps {
  columns: Column[];
  isMobile: boolean;
}

const TableHeader: React.FC<TableHeaderProps> = ({ columns, isMobile }) => {
  return (
    <thead>
      <tr>
        {columns.map((column, index) => (
          <th
            key={column.key}
            scope="col"
            className={clsx(
              index === 0 && 'rounded-tl-xl',
              index === columns.length - 1 && 'rounded-tr-xl',
              'bg-gray-900/50 backdrop-blur-xl',
              'px-4 py-3 first:pl-6 last:pr-6',
              'text-left text-sm font-semibold text-white',
              'border-b border-gray-800/50',
              isMobile && 'whitespace-nowrap'
            )}
          >
            {column.header}
          </th>
        ))}
      </tr>
    </thead>
  );
};

export default React.memo(TableHeader);
