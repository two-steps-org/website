interface AgentCardProps {
  id: number;
  name: string;
  description: string;
  status: 'Active' | 'Inactive';
  metrics: Record<string, string>;
  icon: LucideIcon;
  gradient: string;
  isActive: boolean;
  onClick: () => void;
  actionLabel?: string;
}

const AgentCard: React.FC<AgentCardProps> = ({
  name,
  description,
  status,
  metrics,
  icon: Icon,
  gradient,
  isActive,
  onClick,
  actionLabel = 'View Details'
}) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="relative group"
    >
      <div className={`relative overflow-hidden rounded-2xl border transition-all duration-300 
        bg-gray-900/50 backdrop-blur-xl border-gray-800/50
        ${isActive ? 'border-blue-500/50' : 'hover:border-blue-500/30'}`}
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${gradient} p-[1px] group-hover:scale-110 transition-transform duration-300`}>
                <div className="w-full h-full rounded-xl bg-gray-900 flex items-center justify-center">
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-white">{name}</h3>
                <p className="text-sm text-gray-400">{description}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5">
                <Activity className={`w-4 h-4 ${
                  status === 'Active' ? 'text-green-400' : 'text-red-400'
                }`} />
                <span className={`text-sm ${
                  status === 'Active' ? 'text-green-400' : 'text-red-400'
                }`}>
                  {status}
                </span>
              </span>
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            {Object.entries(metrics).map(([key, value]) => (
              <div key={key} className="bg-gray-900/50 rounded-xl p-3 backdrop-blur-sm">
                <p className="text-gray-400 text-sm mb-1">{key}</p>
                <p className={`font-semibold bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}>
                  {value}
                </p>
              </div>
            ))}
          </div>

          {/* Action Button */}
          <motion.button
            onClick={onClick}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`w-full py-2.5 rounded-xl font-medium transition-all duration-300 ${
              isActive
                ? 'bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white'
                : `bg-gradient-to-r ${gradient} text-white opacity-90 hover:opacity-100`
            }`}
          >
            {isActive ? `End ${actionLabel.split(' ')[1]}` : actionLabel}
          </motion.button>
        </div>
      </div>

      {/* Hover Glow Effect */}
      <div className={`absolute -inset-2 bg-gradient-to-r ${gradient} rounded-3xl opacity-0 group-hover:opacity-10 blur-xl transition-opacity duration-500 -z-10`} />
    </motion.div>
  );
};