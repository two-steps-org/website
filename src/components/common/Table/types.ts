/**
 * Represents a single column in a table.
 */
export interface Column {
  /**
   * Unique key for the column.
   */
  key: string;
  /**
   * The header text displayed for the column.
   */
  header: string;
  /**
   * Optional render function to customize cell content.
   * @param value - The cell's value.
   * @param row - The entire row data.
   * @returns A React node to be rendered in the cell.
   */
  render?: (value: any, row: Record<string, any>) => React.ReactNode;
}

/**
 * Props for the Table component.
 */
export interface TableProps {
  /**
   * An array of columns to be rendered in the table.
   */
  columns: Column[];
  /**
   * The data rows for the table. Each row is an object with key-value pairs.
   */
  data: Record<string, any>[];
  /**
   * Optional class name to style the table.
   */
  className?: string;
  /**
   * Optional caption for the table.
   */
  caption?: string;
  /**
   * Optional unique identifier for the table.
   */
  id?: string;
  /**
   * Optional aria-label for accessibility.
   */
  'aria-label'?: string;
}
