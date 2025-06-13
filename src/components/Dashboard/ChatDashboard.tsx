import React, { useState, useCallback, memo } from 'react';
import { MessageSquareText, Users, Clock, Zap } from 'lucide-react';
import DashboardContainer from './shared/DashboardContainer';
import MetricsGrid from './shared/MetricsGrid';
import AgentCard from './shared/AgentCard';
import WidgetContainer from './WidgetContainer';

const metrics = [
  {
    label: 'Live Conversations',
    value: '1,234',
    change: '+15%',
    icon: MessageSquareText,
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    label: 'Total Users',
    value: '45.2K',
    change: '+8%',
    icon: Users,
    gradient: 'from-purple-400 to-pink-400',
  },
  {
    label: 'Avg. Response Time',
    value: '1.2s',
    change: '+20%',
    icon: Clock,
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    label: 'Response Success Rate',
    value: '98.5%',
    change: '+2.1%',
    icon: Zap,
    gradient: 'from-purple-400 to-pink-400',
  },
];

const agents = [
  {
    id: 1,
    name: 'Customer Success Agent',
    description: '24/7 customer support assistant',
    status: 'Active' as const,
    metrics: {
      'Response Rate': '98%',
      'Avg. Response': '30s',
      'Customer Satisfaction': '4.8/5',
      'Active Chats': '24/7',
    },
    icon: MessageSquareText,
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    id: 2,
    name: 'Sales Agent',
    description: 'Automated sales & lead generation',
    status: 'Active' as const,
    metrics: {
      'Conversion Rate': '32%',
      'Leads/Day': '145',
      'Satisfaction': '4.7/5',
      'Avg. Response Time': '15s',
    },
    icon: MessageSquareText,
    gradient: 'from-purple-400 to-pink-400',
  },
  {
    id: 3,
    name: 'Support Agent',
    description: 'Technical support & troubleshooting',
    status: 'Active' as const,
    metrics: {
      'Resolution Rate': '92%',
      'Tickets/Day': '250',
      'CSAT Score': '4.9/5',
      'Avg. Handling Time': '4m',
    },
    icon: MessageSquareText,
    gradient: 'from-purple-500 to-pink-500',
  },
];

const ChatDashboard: React.FC = () => {
  const [activeChat, setActiveChat] = useState<number | null>(null);

  const handleAgentClick = useCallback((id: number) => {
    setActiveChat(prev => (prev === id ? null : id));
  }, []);

  return (
    <>
      <DashboardContainer
        title="AI Chat Agents"
        subtitle="Manage your AI chat agents"
        icon={MessageSquareText}
        gradient="from-purple-500 to-pink-500"
        buttonLabel="New Chat Agent"
      >
        {/* Metrics Grid */}
        <MetricsGrid metrics={metrics} />

        {/* Agents Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {agents.map(agent => (
            <AgentCard
              key={agent.id}
              {...agent}
              isActive={activeChat === agent.id}
              onClick={() => handleAgentClick(agent.id)}
              actionLabel="Start Chat"
            />
          ))}
        </div>
      </DashboardContainer>

      {/* Chat Widget */}
      <WidgetContainer 
        isOpen={activeChat !== null}
        onClose={() => setActiveChat(null)}
        mode="chat"
      />
    </>
  );
};

export default memo(ChatDashboard);
