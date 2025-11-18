import { CaseStudy } from './types';

export const CaseStudyMetrics = ({ study }: { study: CaseStudy }) => {
  return (
    <div className="grid grid-cols-2 gap-2 mb-4 mt-auto">
      {Object.entries(study.metrics).map(([key, value]) => (
        <div key={key} className="bg-gray-800/50 rounded-lg p-2">
          <p className="text-gray-400 text-xs mb-0.5">{key}</p>
          <p
            className={`text-sm font-bold bg-gradient-to-r ${study.gradient} bg-clip-text text-transparent`}
          >
            {value}
          </p>
        </div>
      ))}
    </div>
  );
};
