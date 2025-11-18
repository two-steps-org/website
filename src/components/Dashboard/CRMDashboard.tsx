import React, { memo } from 'react';
import { LayoutDashboard, Users, DollarSign, TrendingUp, BarChart } from 'lucide-react';
import DashboardContainer from './shared/DashboardContainer';
import MetricsGrid from './shared/MetricsGrid';
import { GradientStyle, Metric } from './types';

const metrics: Metric[] = [
  {
    label: 'Active Deals',
    value: '320',
    change: '+12%',
    icon: DollarSign,
    gradient: 'from-blue-500 to-indigo-500',
  },
  {
    label: 'Total Clients',
    value: '12.4K',
    change: '+8%',
    icon: Users,
    gradient: 'from-blue-400 to-indigo-400',
  },
  {
    label: 'Revenue Growth',
    value: '$1.2M',
    change: '+15%',
    icon: TrendingUp,
    gradient: 'from-sky-500 to-blue-500' as GradientStyle,
  },
  {
    label: 'Conversion Rate',
    value: '28%',
    change: '+5%',
    icon: BarChart,
    gradient: 'from-blue-500 to-indigo-500',
  },
];

const CRMDashboard: React.FC = () => {
  return (
    <DashboardContainer
      title="CRM Dashboard"
      subtitle="Track your clients, deals, and revenue"
      icon={LayoutDashboard}
      gradient="from-blue-500 to-indigo-500"
      buttonLabel="New Deal"
    >
      {/* Metrics */}
      <MetricsGrid metrics={metrics} />

      {/* Example: Deals Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left text-gray-400">
          <thead className="text-xs uppercase bg-gray-800/50 text-gray-300">
            <tr>
              <th className="px-4 py-3">Client</th>
              <th className="px-4 py-3">Deal</th>
              <th className="px-4 py-3">Value</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            <tr>
              <td className="px-4 py-3">Acme Inc.</td>
              <td className="px-4 py-3">Enterprise Plan</td>
              <td className="px-4 py-3">$50,000</td>
              <td className="px-4 py-3 text-green-400">Closed</td>
            </tr>
            <tr>
              <td className="px-4 py-3">Globex Corp</td>
              <td className="px-4 py-3">Growth Package</td>
              <td className="px-4 py-3">$25,000</td>
              <td className="px-4 py-3 text-yellow-400">Pending</td>
            </tr>
          </tbody>
        </table>
      </div>
    </DashboardContainer>
  );
};

export default memo(CRMDashboard);
