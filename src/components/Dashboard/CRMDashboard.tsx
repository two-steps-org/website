import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Clock, Users, Building2, Contact2, BadgeDollarSign,
  Lightbulb, Target, BarChart3, Settings, HelpCircle, Bell, Moon,
  Search, Phone, Mail, MessageSquare, X, ArrowUpRight, ArrowDownRight,
  Trash2, Pencil, MoreHorizontal, ThumbsUp, MessageCircle, Share, Eye, MapPin
} from 'lucide-react';
import {
  BarChart as ReBarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  AreaChart, 
  Area,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis
} from 'recharts';

// -----------------
//   Sample Data
// -----------------
const customers = [
  {
    id: '1',
    name: 'John Smith',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
    title: 'CEO',
    company: 'TechCorp',
    leadScore: 85,
    status: 'Hot',
    lastContact: '2 days ago',
    email: 'john.smith@techcorp.com',
    phone: '+1 (555) 123-4567',
    nextAction: { type: 'Follow-up Call', date: '2024-03-20', time: '10:00 AM' }
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    title: 'Marketing Director',
    company: 'InnovateNow',
    leadScore: 72,
    status: 'Warm',
    lastContact: '5 days ago',
    email: 'sarah.j@innovatenow.com',
    phone: '+1 (555) 234-5678',
    nextAction: { type: 'Product Demo', date: '2024-03-22', time: '2:00 PM' }
  },
  {
    id: '3',
    name: 'Michael Chen',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    title: 'CTO',
    company: 'DataFlow Systems',
    leadScore: 95,
    status: 'Hot',
    lastContact: '1 day ago',
    email: 'm.chen@dataflow.com',
    phone: '+1 (555) 345-6789',
    nextAction: { type: 'Contract Review', date: '2024-03-21', time: '11:30 AM' }
  }
];

const opportunities = [
  {
    id: 'OPP-001',
    name: 'Enterprise Software Solution',
    value: 150000,
    stage: 'Proposal',
    probability: 75,
    closeDate: '2024-04-15'
  },
  {
    id: 'OPP-002',
    name: 'Cloud Migration Project',
    value: 85000,
    stage: 'Negotiation',
    probability: 90,
    closeDate: '2024-03-30'
  },
  {
    id: 'OPP-003',
    name: 'Security Infrastructure Upgrade',
    value: 120000,
    stage: 'Discovery',
    probability: 45,
    closeDate: '2024-05-01'
  }
];

const leadsBySalesData = [
  { name: 'Martin', leads: 85 },
  { name: 'Ausey', leads: 90 },
  { name: 'Moa', leads: 70 },
  { name: 'Mya', leads: 124 },
  { name: 'Friska', leads: 60 },
  { name: 'Julian', leads: 75 },
  { name: 'Aedith', leads: 80 },
  { name: 'Phuan', leads: 95 },
  { name: 'Chuki', leads: 100 },
];

const navItems = [
  { label: 'Business Overview', icon: LayoutDashboard },
  { label: 'Recent', icon: Clock },
  { label: 'Customers', icon: Users },
  { label: 'Accounts', icon: Building2 },
  { label: 'Contacts', icon: Contact2 },
  { label: 'Sales', icon: BadgeDollarSign },
  { label: 'Leads', icon: Lightbulb },
  { label: 'Opportunities', icon: Target },
  { label: 'Performance', icon: BarChart3 }
];

const settingsItems = [
  { label: 'Settings', icon: Settings },
  { label: 'Help Center', icon: HelpCircle }
];

// --------------------
//  Interfaces & Data
// --------------------
interface Customer {
  id: string;
  name: string;
  avatar: string;
  title: string;
  company: string;
  leadScore: number;
  status: 'New' | 'Warm' | 'Hot';
  lastContact: string;
  email: string;
  phone: string;
  nextAction: { type: string; date: string; time: string };
}

interface DashboardMetrics {
  totalCustomers: number;
  activeCustomers: number;
  profitTotal: string;
  expenseTotal: string;
  customerGrowth: string;
  activeGrowth: string;
  profitGrowth: string;
  expenseGrowth: string;
}

interface Opportunity {
  id: string;
  name: string;
  value: number;
  stage: string;
  probability: number;
  closeDate: string;
}

const metrics: DashboardMetrics = {
  totalCustomers: 21978,
  activeCustomers: 10369,
  profitTotal: '$64.981,97',
  expenseTotal: '$18.158,21',
  customerGrowth: '+15%',
  activeGrowth: '-9%',
  profitGrowth: '+7.2%',
  expenseGrowth: '-2%'
};

const salesData = [
  { month: 'Jan', revenue: 10000, expenses: 5000 },
  { month: 'Feb', revenue: 15000, expenses: 7000 },
  { month: 'Mar', revenue: 12000, expenses: 6000 },
  { month: 'Apr', revenue: 18000, expenses: 9000 },
  { month: 'May', revenue: 20000, expenses: 10000 },
  { month: 'Jun', revenue: 22000, expenses: 11000 },
  { month: 'Jul', revenue: 25000, expenses: 12000 },
  { month: 'Aug', revenue: 19000, expenses: 9000 },
  { month: 'Sep', revenue: 23000, expenses: 11000 },
  { month: 'Oct', revenue: 27000, expenses: 13000 },
  { month: 'Nov', revenue: 30000, expenses: 14000 },
  { month: 'Dec', revenue: 28000, expenses: 13000 }
];

const customerGrowthData = [
  { month: 'Jan', customers: 1000 },
  { month: 'Feb', customers: 1200 },
  { month: 'Mar', customers: 1500 },
  { month: 'Apr', customers: 1800 },
  { month: 'May', customers: 2000 },
  { month: 'Jun', customers: 2200 },
  { month: 'Jul', customers: 2500 },
  { month: 'Aug', customers: 2300 },
  { month: 'Sep', customers: 2700 },
  { month: 'Oct', customers: 3000 },
  { month: 'Nov', customers: 3200 },
  { month: 'Dec', customers: 3500 }
];

// --------------------
//   Reusable Cards
// --------------------
const PremiumMetricCard = ({
  title,
  value,
  icon: Icon,
  growth,
  isDarkMode
}) => (
  <motion.div
    className="relative group overflow-hidden rounded-xl border border-gray-800/50 bg-gray-900/50 backdrop-blur-xl p-6 transition-all duration-300"
    whileHover={{ scale: 1.02 }}
  >
    {/* Icon */}
    <div className="flex items-center justify-between mb-4">
      <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 p-[1px] group-hover:scale-110 transition-transform duration-300">
        <div className="w-full h-full rounded-xl bg-gray-900 flex items-center justify-center">
          <Icon className="w-5 h-5 text-white" />
        </div>
      </div>
      <div className={`flex items-center gap-1 text-sm font-medium ${
        growth.includes('+') ? 'text-green-400' : 'text-red-400'
      }`}>
        {growth.includes('+') ? (
          <ArrowUpRight className="w-4 h-4" />
        ) : (
          <ArrowDownRight className="w-4 h-4" />
        )}
        <span>{growth}</span>
      </div>
    </div>

    {/* Value */}
    <div className="text-2xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
      {value}
    </div>
    <p className="mt-2 text-sm text-gray-400">{title}</p>
  </motion.div>
);

const SalesOverviewChart = ({ data, isDarkMode }) => (
  <ResponsiveContainer width="100%" height={220}>
    <LineChart data={data}>
      <CartesianGrid 
        strokeDasharray="3 3" 
        stroke={isDarkMode ? '#374151' : '#E5E7EB'} 
      />
      <XAxis 
        dataKey="month" 
        stroke={isDarkMode ? '#CBD5E1' : '#475569'} 
      />
      <YAxis stroke={isDarkMode ? '#CBD5E1' : '#475569'} />
      <Tooltip
        contentStyle={{
          backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF',
          border: 'none',
          borderRadius: '0.75rem',
          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
        }}
      />
      <Line type="monotone" dataKey="revenue" stroke="#8B5CF6" strokeWidth={2} />
      <Line type="monotone" dataKey="expenses" stroke="#6366F1" strokeWidth={2} />
    </LineChart>
  </ResponsiveContainer>
);

const CustomerGrowthChart = ({ data, isDarkMode }) => (
  <ResponsiveContainer width="100%" height={220}>
    <AreaChart data={data}>
      <defs>
        <linearGradient id="customerGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6366F1" stopOpacity={0.8}/>
          <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
        </linearGradient>
      </defs>
      <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#374151' : '#E5E7EB'} />
      <XAxis dataKey="month" stroke={isDarkMode ? '#CBD5E1' : '#475569'} />
      <YAxis stroke={isDarkMode ? '#CBD5E1' : '#475569'} />
      <Tooltip
        contentStyle={{
          backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF',
          border: 'none',
          borderRadius: '0.75rem',
          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
        }}
      />
      <Area
        type="monotone"
        dataKey="customers"
        stroke="#6366F1"
        fill="url(#customerGradient)"
      />
    </AreaChart>
  </ResponsiveContainer>
);

const LeadsBySalesChart = ({ data, isDarkMode }) => (
  <ResponsiveContainer width="100%" height={220}>
    <ReBarChart data={data}>
      <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#374151' : '#E5E7EB'} />
      <XAxis dataKey="name" stroke={isDarkMode ? '#CBD5E1' : '#475569'} />
      <YAxis stroke={isDarkMode ? '#CBD5E1' : '#475569'} />
      <Tooltip
        contentStyle={{
          backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF',
          border: 'none',
          borderRadius: '0.75rem',
          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
        }}
      />
      <Bar dataKey="leads" fill="#6366F1" />
    </ReBarChart>
  </ResponsiveContainer>
);

// --------------------
//   Page Components
// --------------------
const BusinessOverviewPage = ({
  isDarkMode,
  metrics,
  salesData,
  customerGrowthData,
  customers
}) => (
  <div className="space-y-8">
    {/* Metrics Grid */}
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <PremiumMetricCard
        title="Total Customers"
        value={metrics.totalCustomers.toLocaleString()}
        icon={Users}
        growth={metrics.customerGrowth}
        isDarkMode={isDarkMode}
      />
      <PremiumMetricCard
        title="Active Customers"
        value={metrics.activeCustomers.toLocaleString()}
        icon={Users}
        growth={metrics.activeGrowth}
        isDarkMode={isDarkMode}
      />
      <PremiumMetricCard
        title="Profit Total"
        value={metrics.profitTotal}
        icon={BadgeDollarSign}
        growth={metrics.profitGrowth}
        isDarkMode={isDarkMode}
      />
      <PremiumMetricCard
        title="Expense Total"
        value={metrics.expenseTotal}
        icon={BadgeDollarSign}
        growth={metrics.expenseGrowth}
        isDarkMode={isDarkMode}
      />
    </div>

    {/* Charts */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <motion.div
        className={`relative group overflow-hidden rounded-xl p-6 transition-all duration-300 
          hover:shadow-lg cursor-pointer border 
          ${ isDarkMode 
            ? 'bg-gray-800/50 border-gray-700 backdrop-blur-sm' 
            : 'bg-white/60 border-gray-200 backdrop-blur-sm'
          }`}
      >
        <h3 className={`text-xl font-bold mb-4 tracking-tight ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
          Sales Overview
        </h3>
        <SalesOverviewChart data={salesData} isDarkMode={isDarkMode} />
      </motion.div>

      <motion.div
        className={`relative group overflow-hidden rounded-xl p-6 transition-all duration-300 
          hover:shadow-lg cursor-pointer border 
          ${ isDarkMode 
            ? 'bg-gray-800/50 border-gray-700 backdrop-blur-sm' 
            : 'bg-white/60 border-gray-200 backdrop-blur-sm'
          }`}
      >
        <h3 className={`text-xl font-bold mb-4 tracking-tight ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
          Customer Growth
        </h3>
        <CustomerGrowthChart data={customerGrowthData} isDarkMode={isDarkMode} />
      </motion.div>

      <motion.div
        className={`relative group overflow-hidden rounded-xl p-6 transition-all duration-300 
          hover:shadow-lg cursor-pointer border 
          ${ isDarkMode 
            ? 'bg-gray-800/50 border-gray-700 backdrop-blur-sm' 
            : 'bg-white/60 border-gray-200 backdrop-blur-sm'
          }`}
      >
        <h3 className={`text-xl font-bold mb-4 tracking-tight ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
          Leads by Sales
        </h3>
        <LeadsBySalesChart data={leadsBySalesData} isDarkMode={isDarkMode} />
      </motion.div>
    </div>

    {/* List Members Table */}
    <div>
      <h3 className={`text-xl font-bold mb-4 tracking-tight ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
        Team / Lead List
      </h3>
      <div 
        className={`relative overflow-x-auto shadow-md sm:rounded-lg 
          ${isDarkMode ? 'bg-gray-800/60' : 'bg-white/70'} 
          border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} 
          backdrop-blur-sm`}
      >
        <table className="w-full text-sm text-left">
          <thead className={isDarkMode ? 'bg-gray-700/90 text-gray-300' : 'bg-gray-100 text-gray-700'}>
            <tr>
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Task Progress</th>
              <th className="px-6 py-3">Email</th>
              <th className="px-6 py-3">Title</th>
              <th className="px-6 py-3">Last Active</th>
              <th className="px-6 py-3">Team</th>
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr 
                key={customer.id} 
                className={`${
                  isDarkMode ? 'border-b border-gray-700/40' : 'border-b border-gray-200'
                } hover:bg-gray-700/10 transition-colors`}
              >
                <td className="px-6 py-4 flex items-center">
                  <img 
                    src={customer.avatar} 
                    alt={customer.name} 
                    className="w-8 h-8 rounded-xl mr-3 object-cover" 
                  />
                  <span className={isDarkMode ? 'text-white' : 'text-gray-900'}>
                    {customer.name}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="w-24 bg-gray-300 h-2 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-indigo-500 rounded-full"
                      style={{ width: `${customer.leadScore}%` }}
                    />
                  </div>
                </td>
                <td className="px-6 py-4">{customer.email}</td>
                <td className="px-6 py-4">{customer.title}</td>
                <td className="px-6 py-4">{customer.lastContact}</td>
                <td className="px-6 py-4">{customer.company}</td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <motion.button 
                      className="p-1 hover:bg-gray-200/20 rounded" 
                      whileHover={{ scale: 1.1 }}
                    >
                      <Trash2 className="w-4 h-4 text-red-400 hover:text-red-300" />
                    </motion.button>
                    <motion.button 
                      className="p-1 hover:bg-gray-200/20 rounded" 
                      whileHover={{ scale: 1.1 }}
                    >
                      <Pencil className="w-4 h-4 text-yellow-400 hover:text-yellow-300" />
                    </motion.button>
                    <motion.button 
                      className="p-1 hover:bg-gray-200/20 rounded" 
                      whileHover={{ scale: 1.1 }}
                    >
                      <MoreHorizontal className="w-4 h-4 text-gray-300 hover:text-gray-200" />
                    </motion.button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

const CustomerCard = ({ customer, isDarkMode, onClick }) => (
  <motion.div
    className={`relative group overflow-hidden rounded-xl p-4 transition-all duration-300 
      hover:shadow-lg cursor-pointer border
      ${
        isDarkMode
          ? 'bg-gray-800/60 border-gray-700 backdrop-blur-sm'
          : 'bg-white/60 border-gray-200 backdrop-blur-sm'
      }`}
    onClick={onClick}
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
  >
    <div className="flex items-center gap-4">
      <img 
        src={customer.avatar} 
        alt={customer.name} 
        className="w-12 h-12 rounded-xl object-cover" 
      />
      <div className="flex-1">
        <h4 className={`font-semibold tracking-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          {customer.name}
        </h4>
        <p className={`text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mt-1`}>
          {customer.title} at {customer.company}
        </p>
        <div className="flex items-center gap-2 mt-3">
          <span
            className={`px-2 py-1 rounded-full text-xs text-white 
              ${
                customer.status === 'Hot'
                  ? 'bg-red-500'
                  : customer.status === 'Warm'
                  ? 'bg-yellow-500'
                  : 'bg-indigo-500'
              }
            `}
          >
            {customer.status}
          </span>
          <div className="flex-1 bg-gray-400/50 h-1 rounded-full overflow-hidden">
            <div 
              className="h-full bg-green-500 rounded-full"
              style={{ width: `${customer.leadScore}%` }}
            />
          </div>
          <span className={`text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            {customer.leadScore}%
          </span>
        </div>
      </div>
    </div>
  </motion.div>
);

const RecentPage = ({ isDarkMode, customers, handleCustomerClick }) => (
  <div>
    <h3 className={`text-2xl font-bold mb-6 tracking-tight ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
      Recent Activities
    </h3>
    <div className="grid grid-cols-1 gap-4">
      {customers.map((customer) => (
        <CustomerCard
          key={customer.id}
          customer={customer}
          isDarkMode={isDarkMode}
          onClick={() => handleCustomerClick(customer)}
        />
      ))}
    </div>
  </div>
);

const CustomersPage = ({ isDarkMode, customers, handleCustomerClick }) => (
  <div>
    <h3 className={`text-2xl font-bold mb-6 tracking-tight ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
      All Customers
    </h3>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {customers.map((customer) => (
        <CustomerCard
          key={customer.id}
          customer={customer}
          isDarkMode={isDarkMode}
          onClick={() => handleCustomerClick(customer)}
        />
      ))}
    </div>
  </div>
);

const SalesPage = ({ isDarkMode, salesData }) => {
  const totalRevenue = salesData.reduce((sum, data) => sum + data.revenue, 0);
  const totalExpenses = salesData.reduce((sum, data) => sum + data.expenses, 0);
  const totalProfit = totalRevenue - totalExpenses;

  return (
    <div>
      <h3 className={`text-2xl font-bold mb-6 tracking-tight ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
        Sales Overview
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <PremiumMetricCard
          title="Total Revenue"
          value={totalRevenue.toLocaleString()}
          icon={BadgeDollarSign}
          growth="+12.3%"
          isDarkMode={isDarkMode}
        />
        <PremiumMetricCard
          title="Total Expenses"
          value={totalExpenses.toLocaleString()}
          icon={BadgeDollarSign}
          growth="-5.2%"
          isDarkMode={isDarkMode}
        />
        <PremiumMetricCard
          title="Total Profit"
          value={totalProfit.toLocaleString()}
          icon={BadgeDollarSign}
          growth="+8.4%"
          isDarkMode={isDarkMode}
        />
      </div>
      <motion.div
        className={`relative group overflow-hidden rounded-xl p-6 transition-all duration-300 
          hover:shadow-lg cursor-pointer border 
          ${ isDarkMode
            ? 'bg-gray-800/60 border-gray-700 backdrop-blur-sm'
            : 'bg-white/60 border-gray-200 backdrop-blur-sm'
          }`}
      >
        <h3 className={`text-xl font-bold mb-4 tracking-tight ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
          Monthly Sales
        </h3>
        <SalesOverviewChart data={salesData} isDarkMode={isDarkMode} />
      </motion.div>
    </div>
  );
};

const LeadsPage = ({ isDarkMode, customers, handleCustomerClick }) => {
  const sortedCustomers = [...customers].sort((a, b) => b.leadScore - a.leadScore);
  return (
    <div>
      <h3 className={`text-2xl font-bold mb-6 tracking-tight ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
        Leads
      </h3>
      <div className="grid grid-cols-1 gap-4">
        {sortedCustomers.map((customer) => (
          <CustomerCard
            key={customer.id}
            customer={customer}
            isDarkMode={isDarkMode}
            onClick={() => handleCustomerClick(customer)}
          />
        ))}
      </div>
    </div>
  );
};

const OpportunitiesPage = ({ isDarkMode, opportunities }) => (
  <div>
    <h3 className={`text-2xl font-bold mb-6 tracking-tight ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
      Opportunities
    </h3>
    <div className="grid grid-cols-1 gap-4">
      {opportunities.map((opp) => (
        <motion.div
          key={opp.id}
          className={`relative group overflow-hidden rounded-xl p-4 transition-all duration-300 
            hover:shadow-lg cursor-pointer border 
            ${
              isDarkMode
                ? 'bg-gray-800/60 border-gray-700 backdrop-blur-sm'
                : 'bg-white/60 border-gray-200 backdrop-blur-sm'
            }`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex justify-between items-start">
            <div>
              <h4 className={`font-semibold tracking-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {opp.name}
              </h4>
              <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Value: ${opp.value.toLocaleString()}
              </p>
              <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Stage: {opp.stage}
              </p>
            </div>
            <div
              className={`px-3 py-1 rounded-full text-sm text-white 
                ${
                  opp.probability >= 70 
                    ? 'bg-green-500' 
                    : opp.probability >= 40 
                    ? 'bg-yellow-500' 
                    : 'bg-red-500'
                }`}
            >
              {opp.probability}%
            </div>
          </div>
          <div className="mt-3">
            <div className="w-full bg-gray-300 h-1 rounded-full overflow-hidden">
              <div 
                className="h-full bg-indigo-500 rounded-full"
                style={{ width: `${opp.probability}%` }}
              />
            </div>
            <p className={`text-sm mt-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Close Date: {opp.closeDate}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  </div>
);

// --------------------
//   Performance Page
// --------------------
const PerformancePage = ({ isDarkMode }) => {
  // Example data for the new "Performance" layout
  const mockInfluencers = [
    { id: '1', name: 'Malik Wiwoho', projects: 23, followers: 1620201, avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=48&h=48&fit=crop' },
    { id: '2', name: 'Nancy Aulia', projects: 34, followers: 1224820, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=48&h=48&fit=crop' },
    { id: '3', name: 'Natasha Viresta', projects: 12, followers: 1100491, avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=48&h=48&fit=crop' },
    { id: '4', name: 'Wilona Hamda', projects: 8, followers: 927421, avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=48&h=48&fit=crop' },
    { id: '5', name: 'Rava Nanda', projects: 10, followers: 827810, avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=48&h=48&fit=crop' }
  ];

  const audienceData = [
    { ageRange: '15-24', male: 40, female: 60 },
    { ageRange: '25-34', male: 35, female: 65 },
    { ageRange: '35-44', male: 50, female: 50 },
    { ageRange: '45-54', male: 45, female: 55 },
    { ageRange: '55-64', male: 30, female: 70 },
    { ageRange: '+64',   male: 20, female: 80 }
  ];

  const interestData = [
    { subject: 'Fashion',     Tiktok: 80, Twitter: 60, Facebook: 50 },
    { subject: 'Cosmetics',   Tiktok: 65, Twitter: 70, Facebook: 40 },
    { subject: 'Watches',     Tiktok: 55, Twitter: 50, Facebook: 55 },
    { subject: 'Cars',        Tiktok: 75, Twitter: 40, Facebook: 70 },
    { subject: 'Memes',       Tiktok: 85, Twitter: 95, Facebook: 80 },
    { subject: 'Others',      Tiktok: 50, Twitter: 60, Facebook: 65 }
  ];

  return (
    <div className="space-y-6 text-gray-100">
      {/* Top Row: 4 Metric Cards + Campaign Info/Map */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: 4 small metric cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <CardStat icon={ThumbsUp} title="Total Likes" value="350,809" />
          <CardStat icon={MessageCircle} title="Total Comments" value="186,072" />
          <CardStat icon={Share} title="Total Shares" value="120,043" />
          <CardStat icon={Eye} title="Engagement" value="48,07%" />
        </div>

        {/* Right: Campaign Info + Mini Map */}
        <div className="rounded-xl border border-gray-700 bg-gray-800/60 p-6 backdrop-blur-sm flex flex-col">
          <h2 className="text-lg font-bold mb-2">Campaign Reach</h2>
          <div className="flex items-center gap-6 text-sm text-gray-300 mb-4">
            <div>
              <p className="font-semibold">12 <span className="text-xs">country</span></p>
              <p>180,807,839 <span className="text-xs">user reached</span></p>
              <p>Period: 9 month</p>
            </div>
            <div>
              <p className="text-xs text-blue-400 cursor-pointer hover:text-blue-300 transition-colors">
                Updated 2s ago<br />
                <span className="underline">Click to refresh</span>
              </p>
            </div>
          </div>
          <div className="flex-1 bg-gray-700 rounded-lg relative flex items-center justify-center">
            <MapPin className="text-gray-500 w-16 h-16" />
            <span className="absolute text-xs text-gray-400 top-3 right-3">
              Canada <strong>87,142</strong>
            </span>
            <span className="absolute text-xs text-gray-400 top-8 left-6">
              Germany <strong>90,069</strong>
            </span>
            <span className="absolute text-xs text-gray-400 bottom-4 right-8">
              Indonesia <strong>120,904</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Row: Influencer Table + 2 Charts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Influencer Table */}
        <div className="md:col-span-1 rounded-xl border border-gray-700 bg-gray-800/60 p-4 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-sm">Influencer</h3>
            <button className="text-blue-400 text-xs hover:text-blue-300 transition-colors">
              + Add Influencer
            </button>
          </div>
          <div className="space-y-2">
            {mockInfluencers.map((inf) => (
              <div 
                key={inf.id}
                className="flex items-center justify-between text-sm p-2 hover:bg-gray-700/30 rounded-lg transition-colors"
              >
                <div className="flex items-center gap-2">
                  <img
                    src={inf.avatar}
                    alt={inf.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <span>{inf.name}</span>
                </div>
                <div className="flex-1 text-right text-gray-400">
                  <span className="mr-4">{inf.projects} projects</span>
                  <span>{inf.followers.toLocaleString()} F</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Audience Age & Gender */}
        <div className="rounded-xl border border-gray-700 bg-gray-800/60 p-4 backdrop-blur-sm">
          <h3 className="font-bold text-sm mb-4">Audience Age &amp; Gender</h3>
          <div className="flex items-center justify-between text-xs text-gray-400 mb-2 px-2">
            <span className="text-blue-400 font-semibold">Male</span>
            <span className="text-green-400 font-semibold">Female</span>
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <ReBarChart data={audienceData} layout="vertical">
              <XAxis type="number" hide />
              <YAxis dataKey="ageRange" type="category" width={30} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: 'none',
                  borderRadius: '0.75rem',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                }}
              />
              <Bar dataKey="male" fill="#3B82F6" barSize={8} />
              <Bar dataKey="female" fill="#10B981" barSize={8} />
            </ReBarChart>
          </ResponsiveContainer>
        </div>

        {/* Follower Interest Radar */}
        <div className="rounded-xl border border-gray-700 bg-gray-800/60 p-4 backdrop-blur-sm">
          <h3 className="font-bold text-sm mb-4">Follower Interest</h3>
          <div className="text-xs text-gray-400 mb-2 flex gap-2">
            <span className="text-yellow-300">Tiktok</span>
            <span className="text-blue-400">Twitter</span>
            <span className="text-indigo-400">Facebook</span>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <RadarChart data={interestData}>
              <PolarGrid stroke="#374151" />
              <PolarAngleAxis dataKey="subject" stroke="#CBD5E1" />
              <PolarRadiusAxis stroke="#4B5563" />
              <Radar name="Tiktok"   dataKey="Tiktok"   stroke="#FBBF24" fill="#FBBF24" fillOpacity={0.3} />
              <Radar name="Twitter"  dataKey="Twitter"  stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3} />
              <Radar name="Facebook" dataKey="Facebook" stroke="#6366F1" fill="#6366F1" fillOpacity={0.3} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

// A small card for stats in Performance
const CardStat = ({ icon: Icon, title, value }) => (
  <motion.div
    className="rounded-xl border border-gray-700 bg-gray-800/60 backdrop-blur-sm p-4 hover:shadow-lg cursor-pointer flex flex-col gap-2"
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
  >
    <div className="flex items-center justify-between">
      <div className="text-sm font-semibold text-gray-300">{title}</div>
      <div className="p-1 rounded-lg bg-gray-700">
        <Icon className="w-5 h-5 text-gray-200" />
      </div>
    </div>
    <div className="text-2xl font-bold text-white">{value}</div>
  </motion.div>
);

// --------------------
//   Main Dashboard
// --------------------
const CRMDashboard = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [currentPage, setCurrentPage] = useState('Business Overview');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handlePageChange = (page: string) => {
    setCurrentPage(page);
    setSelectedCustomer(null);
  };

  const handleCustomerClick = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsModalOpen(true);
  };

  const pageComponents = {
    'Business Overview': (
      <BusinessOverviewPage
        isDarkMode={isDarkMode}
        metrics={metrics}
        salesData={salesData}
        customerGrowthData={customerGrowthData}
        customers={customers}
      />
    ),
    'Recent': (
      <RecentPage 
        isDarkMode={isDarkMode} 
        customers={customers} 
        handleCustomerClick={handleCustomerClick} 
      />
    ),
    'Customers': (
      <CustomersPage 
        isDarkMode={isDarkMode} 
        customers={customers} 
        handleCustomerClick={handleCustomerClick} 
      />
    ),
    'Sales': (
      <SalesPage 
        isDarkMode={isDarkMode} 
        salesData={salesData} 
      />
    ),
    'Leads': (
      <LeadsPage 
        isDarkMode={isDarkMode} 
        customers={customers} 
        handleCustomerClick={handleCustomerClick} 
      />
    ),
    'Opportunities': (
      <OpportunitiesPage 
        isDarkMode={isDarkMode} 
        opportunities={opportunities} 
      />
    ),
    'Performance': (
      <PerformancePage 
        isDarkMode={isDarkMode}
      />
    )
  };

  return (
    <div className={`relative min-h-[600px] rounded-[2.5rem] overflow-hidden border border-gray-800/50 bg-gradient-to-b from-gray-900/95 to-black/95`}>
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]"></div>
      <div className="absolute inset-0 backdrop-blur-3xl"></div>
      
      <div className="relative flex h-full">
        {/* Sidebar */}
        <aside className="w-72 border-r border-gray-800/50 bg-gray-900/50 backdrop-blur-xl p-6 flex flex-col">
          {/* Logo */}
          <div className="flex items-center gap-2 mb-8">
            <img src="/logo4.png" alt="Two Steps" className="h-8" />
          </div>

          {/* Navigation */}
          <nav className="space-y-1 flex-1">
            {navItems.map((item) => (
              <motion.button
                key={item.label}
                onClick={() => handlePageChange(item.label)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors 
                  ${
                    currentPage === item.label
                      ? 'bg-blue-500 text-white'
                      : 'text-gray-400 hover:bg-gray-800/50'
                  }
                `}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.95 }}
              >
                <item.icon className="w-5 h-5" />
                <span className="text-sm font-medium">
                  {item.label}
                </span>
              </motion.button>
            ))}
          </nav>

          {/* Settings */}
          <div className="mt-8">
            {settingsItems.map((item) => (
              <motion.button
                key={item.label}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-gray-400 hover:bg-gray-800/50 transition-colors"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.95 }}
              >
                <item.icon className="w-5 h-5" />
                <span className="text-sm font-medium">
                  {item.label}
                </span>
              </motion.button>
            ))}
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-h-screen flex flex-col">
          {/* Header */}
          <header className="h-20 border-b border-gray-800/50 bg-gray-900/50 backdrop-blur-xl px-8 flex items-center justify-between">
            <h1 className="text-xl font-medium text-white">
              Hello, Anthony!
            </h1>
            <div className="flex items-center gap-4">
              <motion.button 
                onClick={() => setIsDarkMode(!isDarkMode)} 
                className="p-2 rounded-xl bg-gray-800/50 hover:bg-gray-700/50 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Moon className="w-5 h-5 text-gray-400" />
              </motion.button>
              <motion.button 
                className="p-2 rounded-xl bg-gray-800/50 hover:bg-gray-700/50 transition-colors relative"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Bell className="w-5 h-5 text-gray-400" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full" />
              </motion.button>
              <div className="flex items-center gap-3">
                <img 
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop" 
                  alt="User Avatar" 
                  className="w-8 h-8 rounded-xl object-cover"
                />
                <div className="text-right">
                  <div className="font-semibold text-white">Anthony Alverizo</div>
                  <div className="text-xs text-gray-400">
                    anthony.alve@gmail.com
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Page Content */}
          <div className="p-8 flex-1 overflow-y-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPage}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4 }}
              >
                {pageComponents[currentPage]}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>

      {/* Customer Modal */}
      <AnimatePresence>
        {isModalOpen && selectedCustomer && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => e.target === e.currentTarget && setIsModalOpen(false)}
          >
            <motion.div
              className="relative w-[95%] max-w-2xl rounded-xl p-6 bg-gray-900/95 border border-gray-800/50 backdrop-blur-xl"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <img
                    src={selectedCustomer.avatar}
                    alt={selectedCustomer.name}
                    className="w-12 h-12 rounded-xl object-cover"
                  />
                  <div>
                    <h3 className="text-xl font-semibold text-white">
                      {selectedCustomer.name}
                    </h3>
                    <p className="text-gray-400">
                      {selectedCustomer.title}
                    </p>
                  </div>
                </div>
                <motion.button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="w-5 h-5 text-gray-400" />
                </motion.button>
              </div>

              {/* Content */}
              <div className="space-y-6">
                {/* Contact Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-800/50 rounded-xl p-4">
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-400">Phone</p>
                        <p className="text-sm font-medium text-white">
                          {selectedCustomer.phone}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-800/50 rounded-xl p-4">
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-400">Email</p>
                        <p className="text-sm font-medium text-white">
                          {selectedCustomer.email}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Next Action */}
                <div className="bg-gray-800/50 rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <MessageSquare className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-400">Next Action</p>
                      <p className="text-sm font-medium text-white">
                        {selectedCustomer.nextAction.type}
                      </p>
                      <p className="text-xs text-gray-400">
                        {selectedCustomer.nextAction.date} at {selectedCustomer.nextAction.time}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Lead Score */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-sm text-gray-400">Lead Score</p>
                    <span className="text-sm font-medium text-white">
                      {selectedCustomer.leadScore}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 h-2 rounded-full overflow-hidden">
                    <div
                      className={`
                        h-full rounded-full
                        ${
                          selectedCustomer.leadScore >= 80 
                            ? 'bg-green-500'
                            : selectedCustomer.leadScore >= 50 
                            ? 'bg-yellow-500'
                            : 'bg-red-500'
                        }
                      `}
                      style={{ width: `${selectedCustomer.leadScore}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Footer Buttons */}
              <div className="flex justify-end gap-3 mt-6">
                <motion.button
                  className="px-4 py-2 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 text-white transition-colors"
                  onClick={() => setIsModalOpen(false)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Close
                </motion.button>
                <motion.button
                  className="px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition-colors font-medium"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Contact Customer
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CRMDashboard;