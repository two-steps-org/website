import { useEffect, useState } from 'react';

type MetricMode = 'revenue' | 'users';
type ActiveField = 'label' | 'value' | null;

const METRICS: Record<MetricMode, { label: string; value: string; delta: string; streamLabel: string }> = {
  revenue: {
    label: 'Total Revenue',
    value: '$42,850',
    delta: '+12.4%',
    streamLabel: 'Revenue Stream',
  },
  users: {
    label: 'Active Users',
    value: '12,482',
    delta: '+8.1%',
    streamLabel: 'User Stream',
  },
};

export function useEncryptionMetricCycle() {
  const [mode, setMode] = useState<MetricMode>('revenue');
  const [label, setLabel] = useState(METRICS.revenue.label);
  const [value, setValue] = useState(METRICS.revenue.value);
  const [isSyncing, setIsSyncing] = useState(false);
  const [activeField, setActiveField] = useState<ActiveField>(null);

  useEffect(() => {
    let nextMode: MetricMode = 'users';

    const applyMetric = () => {
      setIsSyncing(true);
      setActiveField('label');

      window.setTimeout(() => {
        const metric = METRICS[nextMode];
        setMode(nextMode);
        setLabel(metric.label);
        setActiveField('value');

        window.setTimeout(() => {
          setValue(metric.value);
          setIsSyncing(false);
          setActiveField(null);
          nextMode = nextMode === 'revenue' ? 'users' : 'revenue';
        }, 150);
      }, 150);
    };

    const startTimer = window.setTimeout(applyMetric, 1500);
    const interval = window.setInterval(applyMetric, 4000);

    return () => {
      window.clearTimeout(startTimer);
      window.clearInterval(interval);
    };
  }, []);

  const metric = METRICS[mode];

  return {
    label,
    value,
    isSyncing,
    activeField,
    delta: metric.delta,
    streamLabel: metric.streamLabel,
  };
}
