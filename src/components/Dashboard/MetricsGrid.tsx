import React from 'react';

interface MetricsProps {
  metrics: {
    users: string;
    requests: string;
    uptime: string;
  };
}

const MetricsGrid = ({ metrics }: MetricsProps) => {
  return (
    <div className="grid grid-cols-3 gap-3">
      {[
        { label: 'Users', value: metrics.users },
        { label: 'Requests', value: metrics.requests },
        { label: 'Uptime', value: metrics.uptime }
      ].map(({ label, value }) => (
        <div key={label} className="bg-gray-50 p-3 rounded-lg hover:bg-gray-100 transition-colors">
          <p className="text-xs text-gray-500 mb-1">{label}</p>
          <p className="text-sm font-semibold text-gray-900">{value}</p>
        </div>
      ))}
    </div>
  );
};

export default MetricsGrid;