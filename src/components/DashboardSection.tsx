import React, { useState, useCallback, useMemo, Suspense, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { LayoutDashboard, MessageSquareText, Mic } from 'lucide-react';
import { DashboardProvider } from './Dashboard/DashboardContext';
import Section from './common/Section';

// lazy load is preserved; we now also prepare prefetch hooks
const CRMDashboard = React.lazy(() => import('./Dashboard/CRMDashboard'));
const ChatDashboard = React.lazy(() => import('./Dashboard/ChatDashboard'));
const VoiceDashboard = React.lazy(() => import('./Dashboard/VoiceDashboard'));

type Feature = { id: string; icon: React.ComponentType<any>; text: string; gradient: string };

const FEATURES: Feature[] = [
  {
    id: 'crm',
    icon: LayoutDashboard,
    text: 'CRM Dashboard',
    gradient: 'from-blue-500 to-indigo-500',
  },
  {
    id: 'chat',
    icon: MessageSquareText,
    text: 'Chat Agents',
    gradient: 'from-purple-500 to-pink-500',
  },
  { id: 'voice', icon: Mic, text: 'Voice Agents', gradient: 'from-amber-500 to-orange-500' },
];

const Spinner: React.FC = () => (
  <div
    className="min-h-[300px] md:min-h-[480px] flex items-center justify-center"
    role="status"
    aria-live="polite"
  >
    <svg className="w-8 h-8 animate-spin" viewBox="0 0 24 24" aria-hidden>
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
        fill="none"
      />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
    </svg>
    <span className="sr-only">Loading dashboard…</span>
  </div>
);

const DashboardSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('crm');
  const reduceMotion = useReducedMotion();

  // memoize features so class names do not regenerate on every render
  const features = useMemo(() => FEATURES, []);

  // prefetch other dashboard chunks when user hovers or touches a tab (warm the bundle)
  const prefetchDashboard = useCallback((id: string) => {
    if (id === 'chat') import('./Dashboard/ChatDashboard');
    if (id === 'voice') import('./Dashboard/VoiceDashboard');
    if (id === 'crm') import('./Dashboard/CRMDashboard');
  }, []);

  // keyboard navigation for tabs
  const onKeyNav = useCallback(
    (e: React.KeyboardEvent, idx: number) => {
      const currentIndex = features.findIndex((f) => f.id === activeTab);
      if (['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(e.key)) {
        e.preventDefault();
        let nextIndex = currentIndex;
        if (e.key === 'ArrowRight') nextIndex = (currentIndex + 1) % features.length;
        if (e.key === 'ArrowLeft')
          nextIndex = (currentIndex - 1 + features.length) % features.length;
        if (e.key === 'Home') nextIndex = 0;
        if (e.key === 'End') nextIndex = features.length - 1;
        setActiveTab(features[nextIndex].id);
        // prefetch next
        prefetchDashboard(features[nextIndex].id);
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setActiveTab(features[idx].id);
      }
    },
    [activeTab, features, prefetchDashboard],
  );

  const renderDashboard = useMemo(() => {
    // memoize the mapping so re-evaluations are cheap
    const map: Record<string, React.ReactNode> = {
      crm: <CRMDashboard />,
      chat: <ChatDashboard />,
      voice: <VoiceDashboard />,
    };
    return map[activeTab] ?? <CRMDashboard />;
  }, [activeTab]);

  // On mount, prefetch the CRM chunk (fast first paint)
  useEffect(() => {
    // call without awaiting, allow browser to schedule
    import('./Dashboard/CRMDashboard');

    // gently prefetch chat/voice in background
    void import('./Dashboard/ChatDashboard');
    void import('./Dashboard/VoiceDashboard');
  }, []);

  return (
    <Section id="dashboard" className="bg-black hidden md:block">
      <div className="relative">
        {/* Background effects: disabled on low-power / mobile to save paint */}
        <div
          aria-hidden
          className="hidden md:block absolute top-0 left-1/4 w-72 h-72 md:w-96 md:h-96 bg-blue-500/8 rounded-full blur-3xl"
        />
        <div
          aria-hidden
          className="hidden md:block absolute bottom-0 right-1/4 w-72 h-72 md:w-96 md:h-96 bg-purple-500/8 rounded-full blur-3xl"
        />

        <div className="relative max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
          {/* Header */}
          <div className="text-center mb-6 md:mb-10">
            <motion.span
              initial={reduceMotion ? {} : { opacity: 0, y: 8 }}
              whileInView={reduceMotion ? {} : { opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-blue-400 text-xs md:text-sm font-semibold tracking-wider uppercase mb-3 block"
            >
              INTERACTIVE DEMOS
            </motion.span>

            <motion.h2
              initial={reduceMotion ? {} : { opacity: 0, y: 12 }}
              whileInView={reduceMotion ? {} : { opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-2xl md:text-4xl font-bold mb-2 md:mb-4 leading-tight"
            >
              <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                Experience Our Solutions
              </span>
            </motion.h2>
          </div>

          <DashboardProvider>
            {/* Tabs */}
            <div
              role="tablist"
              aria-label="Dashboard tabs"
              className="flex justify-center gap-3 mb-4 md:mb-8 px-2 snap-x h-fit"
            >
              {features.map((feature, index) => {
                const active = activeTab === feature.id;
                return (
                  <button
                    key={feature.id}
                    role="tab"
                    aria-selected={active}
                    aria-controls={`panel-${feature.id}`}
                    id={`tab-${feature.id}`}
                    tabIndex={active ? 0 : -1}
                    onClick={() => setActiveTab(feature.id)}
                    onMouseEnter={() => prefetchDashboard(feature.id)}
                    onTouchStart={() => prefetchDashboard(feature.id)}
                    onKeyDown={(e) => onKeyNav(e, index)}
                    className="group relative snap-start"
                  >
                    <div
                      className={`relative overflow-hidden rounded-full md:rounded-xl ${
                        active ? 'bg-gray-900/80' : 'bg-gray-900/55'
                      } backdrop-blur-sm border px-3 py-2 md:px-5 md:py-3 flex items-center gap-2 transition-all duration-250 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500`}
                    >
                      <div
                        className={`w-8 h-8 md:w-10 md:h-10 rounded-full md:rounded-lg bg-gradient-to-r ${feature.gradient} p-[1px]`}
                        aria-hidden
                      >
                        <div className="w-full h-full rounded-full md:rounded-lg bg-gray-900 flex items-center justify-center">
                          <feature.icon className="w-4 h-4 md:w-5 md:h-5 text-white" />
                        </div>
                      </div>
                      <span className="text-xs hidden md:block md:text-sm font-medium text-gray-300 whitespace-nowrap">
                        {feature.text}
                      </span>
                    </div>
                    {/* hover glow - keep minimal for performance */}
                    <span
                      aria-hidden
                      className={`absolute -inset-2 rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-300 -z-10 bg-gradient-to-r ${feature.gradient}`}
                    />
                  </button>
                );
              })}
            </div>

            {/* Dashboard Content */}
            <Suspense fallback={<Spinner />}>
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={activeTab}
                  id={`panel-${activeTab}`}
                  role="tabpanel"
                  aria-labelledby={`tab-${activeTab}`}
                  initial={reduceMotion ? {} : { opacity: 0, y: 8 }}
                  animate={reduceMotion ? {} : { opacity: 1, y: 0 }}
                  exit={reduceMotion ? {} : { opacity: 0, y: -6 }}
                  transition={{ duration: 0.32 }}
                  className="mx-auto"
                >
                  {renderDashboard}
                </motion.div>
              </AnimatePresence>
            </Suspense>
          </DashboardProvider>
        </div>
      </div>
    </Section>
  );
};

export default React.memo(DashboardSection);
