import React, { useState, useCallback, memo } from 'react';
import { Mic, Users, Clock, Zap } from 'lucide-react';
import DashboardContainer from './shared/DashboardContainer';
import MetricsGrid from './shared/MetricsGrid';
import AgentCard from './shared/AgentCard';
import WidgetContainer from './WidgetContainer';

const metrics = [
  {
    label: 'Live Calls',
    value: '234',
    change: '+18%',
    icon: Mic,
    gradient: 'from-amber-500 to-orange-500'
  },
  {
    label: 'Total Callers',
    value: '12.4K',
    change: '+12%',
    icon: Users,
    gradient: 'from-amber-400 to-orange-400'
  },
  {
    label: 'Avg. Call Duration',
    value: '4m 12s',
    change: '+8%',
    icon: Clock,
    gradient: 'from-amber-500 to-orange-500'
  },
  {
    label: 'Call Success Rate',
    value: '96.8%',
    change: '+3.2%',
    icon: Zap,
    gradient: 'from-amber-400 to-orange-400'
  }
];

const agents = [
  {
    id: 1,
    name: 'Law Firm Secretary Agent',
    description: 'Seamless scheduling and task management.',
    status: 'Active' as const,
    metrics: {
      'Accuracy': '4.9/5',
      'Avg. Call Duration': '2m 30s',
      'Task Rate': '97%',
      'Daily Calls': '150'
    },
    icon: Mic,
    gradient: 'from-amber-500 to-orange-500'
  },
  {
    id: 2,
    name: 'Call Center Team of Agents',
    description: 'Automated call center operations',
    status: 'Active' as const,
    metrics: {
      'Resolution Rate': '94%',
      'Wait Time': '0s',
      'CSAT Score': '4.8/5',
      'Concurrent Calls': '∞'
    },
    icon: Mic,
    gradient: 'from-amber-400 to-orange-400'
  },
  {
    id: 3,
    name: 'Lead Generation Agent',
    description: 'lead generation expert for outbound calls',
    status: 'Active' as const,
    metrics: {
      'Conversion': '55%',
      'Call Time': '3m 15s',
      'Leads/Day': '500',
      'Satisfaction': '4.7/5'
    },
    icon: Mic,
    gradient: 'from-amber-500 to-orange-500'
  }
];

const VoiceDashboard: React.FC = () => {
  const [activeCall, setActiveCall] = useState<number | null>(null);

  const handleAgentClick = useCallback((id: number) => {
    setActiveCall(prev => (prev === id ? null : id));
  }, []);

  return (
    <>
      <DashboardContainer
        title="AI Voice Agents"
        subtitle="Manage your AI voice agents"
        icon={Mic}
        gradient="from-amber-500 to-orange-500"
        buttonLabel="New Voice Agent"
      >
        {/* Metrics Grid */}
        <MetricsGrid metrics={metrics} />

        {/* Agents Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {agents.map((agent) => (
            <AgentCard
              key={agent.id}
              {...agent}
              isActive={activeCall === agent.id}
              onClick={() => handleAgentClick(agent.id)}
              actionLabel="Start Call"
            />
          ))}
        </div>
      </DashboardContainer>

      {/* Voice Widget */}
      <WidgetContainer 
        isOpen={activeCall !== null}
        onClose={() => setActiveCall(null)}
        mode="voice"
      />
    </>
  );
};

export default memo(VoiceDashboard);
