import React, { useState, useCallback, memo } from 'react';
import { Mic } from 'lucide-react';
import DashboardContainer from './shared/DashboardContainer';
import MetricsGrid from './shared/MetricsGrid';
import AgentCard from './shared/AgentCard';
import WidgetContainer from './WidgetContainer';
import { AgentMetrics, GradientStyle, Metric } from './types';

const metrics: Metric[] = [
  {
    label: 'Live Calls',
    value: '324',
    change: '+12%',
    icon: Mic,
    gradient: 'from-amber-500 to-orange-500',
  },
  {
    label: 'Avg. Call Duration',
    value: '2m 35s',
    change: '-5%',
    icon: Mic,
    gradient: 'from-amber-400 to-orange-400',
  },
  {
    label: 'Call Success Rate',
    value: '96.3%',
    change: '+3%',
    icon: Mic,
    gradient: 'from-amber-500 to-orange-500',
  },
  {
    label: 'Total Minutes',
    value: '14.5K',
    change: '+18%',
    icon: Mic,
    gradient: 'from-amber-400 to-orange-400',
  },
];

const agents = [
  {
    id: 1,
    name: 'Voice Assistant',
    description: 'AI-driven voice support',
    status: 'Active' as const,
    metrics: {
      'Response Rate': '95%',
      'Avg. Response': '1.5s',
      CSAT: '4.7/5',
      'Calls/Day': '500+',
    } as AgentMetrics,
    icon: Mic,
    gradient: 'from-amber-500 to-orange-500',
  },
  {
    id: 2,
    name: 'Sales Caller',
    description: 'Cold calling & lead generation',
    status: 'Active' as const,
    metrics: {
      'Conversion Rate': '18%',
      'Leads/Day': '320',
      'Avg. Duration': '3m',
      Satisfaction: '4.5/5',
    },
    icon: Mic,
    gradient: 'from-amber-400 to-orange-400',
  },
];

const VoiceDashboard: React.FC = () => {
  const [activeVoice, setActiveVoice] = useState<number | null>(null);

  const handleAgentClick = useCallback((id: number) => {
    setActiveVoice((prev) => (prev === id ? null : id));
  }, []);

  return (
    <>
      <DashboardContainer
        title="AI Voice Agents"
        subtitle="Manage your AI-powered voice assistants"
        icon={Mic}
        gradient="from-amber-500 to-orange-500"
        buttonLabel="New Voice Agent"
      >
        <MetricsGrid metrics={metrics} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {agents.map((agent) => (
            <AgentCard
              key={agent.id}
              gradient={agent.gradient as GradientStyle}
              icon={agent.icon}
              name={agent.name}
              description={agent.description}
              status={agent.status}
              id={agent.id}
              metrics={agent.metrics}
              isActive={activeVoice === agent.id}
              onClick={() => handleAgentClick(agent.id)}
              actionLabel="Start Call"
            />
          ))}
        </div>
      </DashboardContainer>

      <WidgetContainer
        isOpen={activeVoice !== null}
        onClose={() => setActiveVoice(null)}
        mode="voice"
      />
    </>
  );
};

export default memo(VoiceDashboard);
