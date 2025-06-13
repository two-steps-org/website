import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MessageSquare, Bell, Plus, X, Settings, Users, BarChart2, Layout, Database, Bot, Sun, Moon, Activity } from 'lucide-react';

const agents = [
  {
    id: 1,
    title: "ShopEase - E-commerce & Retail",
    description: "AI-powered shopping recommendations and support.",
    status: "Active",
    metrics: { users: "2.4k", requests: "15k/day", uptime: "99.9%" },
    users: [
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop",
      "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&h=100&fit=crop"
    ]
  },
  {
    id: 2,
    title: "FinanceGPT - Banking",
    description: "Smart financial advisor and portfolio management.",
    status: "Active",
    metrics: { users: "1.8k", requests: "12k/day", uptime: "99.8%" },
    users: [
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop"
    ]
  },
  {
    id: 3,
    title: "HealthBot - Medical",
    description: "24/7 healthcare support and scheduling.",
    status: "Active",
    metrics: { users: "3.2k", requests: "20k/day", uptime: "99.95%" },
    users: [
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop"
    ]
  },
  {
    id: 4,
    title: "LegalEase - Law",
    description: "Legal document analysis and compliance.",
    status: "Inactive",
    metrics: { users: "950", requests: "8k/day", uptime: "99.7%" },
    users: [
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop"
    ]
  },
  {
    id: 5,
    title: "TravelAI - Tourism",
    description: "Smart travel planning and bookings.",
    status: "Active",
    metrics: { users: "4.1k", requests: "25k/day", uptime: "99.9%" },
    users: [
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop",
      "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=100&h=100&fit=crop"
    ]
  },
  {
    id: 6,
    title: "EduBot - Learning",
    description: "Personalized education assistant.",
    status: "Active",
    metrics: { users: "5.5k", requests: "30k/day", uptime: "99.95%" },
    users: [
      "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100&h=100&fit=crop",
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop"
    ]
  }
];

const sidebarItems = [
  { icon: Layout, label: 'Dashboard' },
  { icon: Bot, label: 'AI Agents', active: true },
  { icon: Users, label: 'Users' },
  { icon: Database, label: 'Data' },
  { icon: BarChart2, label: 'Analytics' },
  { icon: Settings, label: 'Settings' }
];

const Dashboard = () => {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [agentStates, setAgentStates] = useState(
    agents.reduce((acc, agent) => ({ ...acc, [agent.id]: agent.status }), {})
  );

  const toggleAgentStatus = (agentId: number) => {
    setAgentStates(prev => ({
      ...prev,
      [agentId]: prev[agentId] === 'Active' ? 'Inactive' : 'Active'
    }));
  };

  const filteredAgents = useMemo(() => {
    return agents
      .filter(agent => {
        const matchesSearch = agent.title.toLowerCase().includes(searchQuery.toLowerCase());
        const currentStatus = agentStates[agent.id];
        
        if (selectedFilter === 'all') return matchesSearch;
        return currentStatus.toLowerCase() === selectedFilter && matchesSearch;
      })
      .map(agent => ({ ...agent, status: agentStates[agent.id] }));
  }, [selectedFilter, searchQuery, agentStates]);

  const theme = isDarkMode ? {
    bg: 'bg-gradient-to-br from-gray-900 to-black',
    sidebar: 'bg-gray-900/50',
    header: 'bg-gray-900/30',
    card: 'bg-gray-900/50',
    border: 'border-gray-800/50',
    text: 'text-white',
    textMuted: 'text-gray-400',
    input: 'bg-gray-900/50',
    metric: 'bg-gray-800/50',
  } : {
    bg: 'bg-gradient-to-br from-white to-gray-100',
    sidebar: 'bg-white/50',
    header: 'bg-white/30',
    card: 'bg-white/50',
    border: 'border-gray-200/50',
    text: 'text-gray-900',
    textMuted: 'text-gray-600',
    input: 'bg-white/50',
    metric: 'bg-gray-100/50',
  };

  return (
    <div className={`relative min-h-[600px] ${theme.bg} rounded-[2.5rem] overflow-hidden border ${theme.border}`}>
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]"></div>
      <div className="absolute inset-0 backdrop-blur-3xl"></div>
      
      <div className="relative flex h-full">
        {/* Sidebar */}
        <div className={`w-20 ${theme.sidebar} backdrop-blur-xl border-r ${theme.border} rounded-l-[2.5rem] py-8`}>
          <div className="flex flex-col items-center space-y-8">
            <img src="/two-steps-logo.png" alt="Two Steps" className="h-8 w-8" />
            {sidebarItems.map((item, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className={`p-3 rounded-xl transition-all ${
                  index === 1 
                    ? 'bg-blue-500/20 text-blue-600' 
                    : `${theme.textMuted} hover:bg-gray-100/50`
                }`}
              >
                <item.icon className="w-5 h-5" />
              </motion.button>
            ))}
          </div>
        </div>

        <div className="flex-1">
          {/* Header */}
          <div className={`px-8 py-6 ${theme.header} backdrop-blur-xl border-b ${theme.border}`}>
            <div className="flex justify-between items-center">
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search agents..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full ${theme.input} rounded-xl pl-10 pr-4 py-2 text-sm ${theme.text} placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 border ${theme.border}`}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              
              <div className="flex items-center space-x-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsDarkMode(!isDarkMode)}
                  className={`p-2 ${theme.input} rounded-xl ${theme.textMuted}`}
                >
                  {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </motion.button>
                
                <div className="flex items-center space-x-3">
                  <button className={`p-2 hover:bg-gray-100/50 rounded-xl relative ${theme.textMuted}`}>
                    <MessageSquare className="h-5 w-5" />
                    <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-blue-500 rounded-full ring-2 ring-white dark:ring-gray-900"></span>
                  </button>
                  <button className={`p-2 hover:bg-gray-100/50 rounded-xl relative ${theme.textMuted}`}>
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-blue-500 rounded-full ring-2 ring-white dark:ring-gray-900"></span>
                  </button>
                  <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                    <span className="text-white text-sm font-medium">JD</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="p-8">
            <div className="flex justify-between items-center mb-8">
              <div className="flex space-x-2">
                <motion.button 
                  onClick={() => setSelectedFilter('all')}
                  className={`px-4 py-2 rounded-xl transition-all ${
                    selectedFilter === 'all' 
                      ? 'bg-blue-500 text-white' 
                      : `${theme.card} ${theme.textMuted} hover:bg-gray-100/50`
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  All Agents
                </motion.button>
                <motion.button 
                  onClick={() => setSelectedFilter('active')}
                  className={`px-4 py-2 rounded-xl transition-all ${
                    selectedFilter === 'active' 
                      ? 'bg-green-500 text-white' 
                      : `${theme.card} ${theme.textMuted} hover:bg-gray-100/50`
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Active
                </motion.button>
                <motion.button 
                  onClick={() => setSelectedFilter('inactive')}
                  className={`px-4 py-2 rounded-xl transition-all ${
                    selectedFilter === 'inactive' 
                      ? 'bg-red-500 text-white' 
                      : `${theme.card} ${theme.textMuted} hover:bg-gray-100/50`
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Inactive
                </motion.button>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-blue-500 text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-blue-600 transition-colors"
              >
                <Plus className="w-4 h-4" />
                New Agent
              </motion.button>
            </div>

            <AnimatePresence mode="wait">
              <motion.div 
                key={selectedFilter}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-2 xl:grid-cols-3 gap-6"
              >
                {filteredAgents.map((agent) => (
                  <motion.div
                    key={agent.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className={`${theme.card} backdrop-blur-xl rounded-2xl p-5 border ${theme.border} hover:border-blue-500/30 transition-all duration-300`}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <h3 className={`font-semibold ${theme.text}`}>{agent.title}</h3>
                      <motion.button
                        onClick={() => toggleAgentStatus(agent.id)}
                        className={`px-3 py-1 rounded-xl text-xs font-medium ${
                          agent.status === 'Active'
                            ? 'bg-green-500/20 text-green-600'
                            : 'bg-red-500/20 text-red-600'
                        }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <span className="flex items-center gap-1">
                          <Activity className="w-3 h-3" />
                          {agent.status}
                        </span>
                      </motion.button>
                    </div>
                    <p className={`${theme.textMuted} text-sm mb-4`}>{agent.description}</p>
                    
                    <div className="grid grid-cols-3 gap-3 mb-4">
                      <div className={`${theme.metric} p-2 rounded-xl`}>
                        <p className="text-xs text-gray-500 mb-1">Users</p>
                        <p className={`text-sm font-semibold ${theme.text}`}>{agent.metrics.users}</p>
                      </div>
                      <div className={`${theme.metric} p-2 rounded-xl`}>
                        <p className="text-xs text-gray-500 mb-1">Requests</p>
                        <p className={`text-sm font-semibold ${theme.text}`}>{agent.metrics.requests}</p>
                      </div>
                      <div className={`${theme.metric} p-2 rounded-xl`}>
                        <p className="text-xs text-gray-500 mb-1">Uptime</p>
                        <p className={`text-sm font-semibold ${theme.text}`}>{agent.metrics.uptime}</p>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex -space-x-2">
                        {agent.users.map((url, i) => (
                          <motion.img 
                            key={i}
                            src={url}
                            alt={`User ${i + 1}`}
                            className="w-7 h-7 rounded-xl border-2 border-white dark:border-gray-900"
                            whileHover={{ scale: 1.15, zIndex: 1 }}
                          />
                        ))}
                      </div>
                      <button className="text-blue-600 dark:text-blue-400 text-sm hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors group flex items-center gap-1">
                        Manage
                        <span className="opacity-0 group-hover:opacity-100 transform group-hover:translate-x-1 transition-all">→</span>
                      </button>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;