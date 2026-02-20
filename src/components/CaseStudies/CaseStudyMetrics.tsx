import { CaseStudy } from './types';

export const CaseStudyMetrics = ({ study }: { study: CaseStudy }) => {
  return (
    <div className="grid grid-cols-2 gap-2 mb-4 mt-auto">
      {Object.entries(study.metrics).map(([key, value]) => (
        <div
          key={key}
          className="bg-gray-800/40 rounded-xl p-3 border border-gray-700/30"
        >
          <p
            className={`text-lg font-bold bg-gradient-to-r ${study.gradient} bg-clip-text text-transparent`}
          >
            {value}
          </p>
          <p className="text-gray-500 text-xs mt-0.5 leading-tight">{key}</p>
        </div>
      ))}
    </div>
  );
};
