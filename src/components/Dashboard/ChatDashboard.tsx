import React, { useState, useCallback, memo, useMemo } from 'react';
import { MessageSquareText, Users, Clock, CheckCircle2, Bot, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import DashboardContainer from './shared/DashboardContainer';
import MetricsGrid from './shared/MetricsGrid';
import AgentCard from './shared/AgentCard';
import { AgentMetrics, GradientStyle, Metric } from './types';
import ChatWidget from './ChatWidget';

// Gradient palette for consistency
const gradients: Record<string, GradientStyle> = {
  customer: 'from-purple-500 to-pink-500',
  sale: 'from-purple-400 to-pink-400',
  support: 'from-purple-500 to-pink-500',
};

// Metrics configuration
const useMetrics = (): Metric[] =>
  useMemo(
    () => [
      {
        label: 'Live Conversations',
        value: '1,234',
        change: '+15%',
        icon: MessageSquareText,
        gradient: gradients.customer,
      },
      {
        label: 'Total Users',
        value: '45.2K',
        change: '+8%',
        icon: Users,
        gradient: gradients.sale,
      },
      {
        label: 'Avg. Response Time',
        value: '1.2s',
        change: '+20%',
        icon: Clock,
        gradient: gradients.customer,
      },
      {
        label: 'Success Rate',
        value: '98.5%',
        change: '+2.1%',
        icon: CheckCircle2,
        gradient: gradients.sale,
      },
    ],
    [],
  );

// Agents configuration
const useAgents = () =>
  useMemo(
    () => [
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
        gradient: gradients.customer,
      },
      {
        id: 2,
        name: 'Sales Agent',
        description: 'Automated sales & lead generation',
        status: 'Active' as const,
        metrics: {
          'Conversion Rate': '32%',
          'Leads/Day': '145',
          Satisfaction: '4.7/5',
          'Response Time': '15s',
        } as AgentMetrics,
        icon: MessageSquareText,
        gradient: gradients.sale,
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
        gradient: gradients.support,
      },
    ],
    [],
  );

const ChatDashboard: React.FC = () => {
  const metrics = useMetrics();
  const agents = useAgents();
  const [activeChat, setActiveChat] = useState<number | null>(null);

  const handleAgentClick = useCallback((id: number) => {
    setActiveChat((prev) => (prev === id ? null : id));
  }, []);

  return (
    <>
      <DashboardContainer
        title="AI Chat Agents"
        subtitle="Manage your AI-powered chat agents"
        icon={MessageSquareText}
        gradient={gradients.customer}
        buttonLabel="New Chat Agent"
      >
        <MetricsGrid metrics={metrics} />

        {/* Agent grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-6">
          {agents.map((agent) => (
            <motion.div
              key={agent.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.25 }}
            >
              <AgentCard
                {...agent}
                gradient={agent.gradient}
                isActive={activeChat === agent.id}
                onClick={() => handleAgentClick(agent.id)}
                actionLabel="Start Chat"
              />
            </motion.div>
          ))}
        </div>
      </DashboardContainer>

      {/* Chat Widget */}
      <AnimatePresence>
        {activeChat !== null && (
          <ChatWidget isVisible={activeChat !== null} onClose={() => setActiveChat(null)} />
        )}
      </AnimatePresence>
    </>
  );
};

export default memo(ChatDashboard);
