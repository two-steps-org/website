import React from 'react';
import Table from '../common/Table/Table';
import type { Column } from '../common/Table/types';

const columns: Column[] = [
  {
    key: 'deviceType',
    header: 'Device Type',
  },
  {
    key: 'resolution',
    header: 'Resolution Range',
  },
  {
    key: 'density',
    header: 'Pixel Density',
  },
];

const data = [
  {
    deviceType: 'Desktop',
    resolution: '1024×768 – 5120×2880',
    density: '100-300+ ppi',
  },
  {
    deviceType: 'Mobile',
    resolution: '320×480 – 1440×3200',
    density: '260-600+ ppi',
  },
  {
    deviceType: 'Tablet',
    resolution: '768×1024 – 2560×1600',
    density: '170-350 ppi',
  },
];

const DeviceTable: React.FC = () => {
  return (
    <Table
      columns={columns}
      data={data}
      caption="Device Screen Resolutions"
      aria-label="Device screen resolutions and pixel densities across different platforms"
    />
  );
};

export default React.memo(DeviceTable);
