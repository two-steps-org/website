import React, { memo } from 'react';
import { useBreakpoint } from '../../../utils/responsive/hooks';
import type { TableProps } from './types';
import TableHeader from './TableHeader';
import TableBody from './TableBody';
import clsx from 'clsx';

const Table: React.FC<TableProps> = ({
  columns,
  data,
  className = '',
  caption,
  id,
  'aria-label': ariaLabel,
}) => {
  const breakpoint = useBreakpoint();
  const isMobile = ['xs', 'sm'].includes(breakpoint);

  return (
    <div
      className="w-full overflow-x-auto custom-scrollbar"
      role="region"
      aria-label={ariaLabel || caption}
    >
      <table
        id={id}
        className={clsx(
          'w-full min-w-[640px] border-separate border-spacing-0',
          className
        )}
      >
        {caption && <caption className="sr-only">{caption}</caption>}
        <TableHeader columns={columns} isMobile={isMobile} />
        <TableBody columns={columns} data={data} isMobile={isMobile} />
      </table>
    </div>
  );
};

export default memo(Table);
