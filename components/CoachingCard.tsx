
import React from 'react';
import { CoachingInsight } from '../types';
import { CheckCircleIcon, LightBulbIcon } from '@heroicons/react/24/solid';

interface CoachingCardProps {
  strengths: CoachingInsight[];
  missedOpportunities: CoachingInsight[];
}

const CoachingCard: React.FC<CoachingCardProps> = ({ strengths, missedOpportunities }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="bg-indigo-600 px-6 py-4">
        <h3 className="text-lg font-bold text-white">Coach Intelligence Report</h3>
        <p className="text-indigo-100 text-sm opacity-90">AI-generated actionable feedback</p>
      </div>
      
      <div className="p-6 space-y-8">
        {/* Strengths */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <CheckCircleIcon className="w-5 h-5 text-emerald-500" />
            <h4 className="font-bold text-gray-900 uppercase tracking-wider text-xs">Winning Behaviors</h4>
          </div>
          <div className="space-y-4">
            {strengths.map((s, idx) => (
              <div key={idx} className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-100">
                <p className="font-semibold text-emerald-900 text-sm mb-1">{s.title}</p>
                <p className="text-emerald-700 text-sm leading-relaxed">{s.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Opportunities */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <LightBulbIcon className="w-5 h-5 text-amber-500" />
            <h4 className="font-bold text-gray-900 uppercase tracking-wider text-xs">Growth Opportunities</h4>
          </div>
          <div className="space-y-4">
            {missedOpportunities.map((s, idx) => (
              <div key={idx} className="bg-amber-50/50 p-4 rounded-xl border border-amber-100">
                <p className="font-semibold text-amber-900 text-sm mb-1">{s.title}</p>
                <p className="text-amber-700 text-sm leading-relaxed">{s.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Icons manually defined since @heroicons/react might not be pre-installed in some environments
const CheckCircleIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
  </svg>
);

const LightBulbIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 1.5a.75.75 0 01.75.75V4.5a.75.75 0 01-1.5 0V2.25A.75.75 0 0112 1.5zM4.5 12a.75.75 0 01.75-.75H7.5a.75.75 0 010 1.5H5.25A.75.75 0 014.5 12zM16.5 12a.75.75 0 01.75-.75H19.5a.75.75 0 010 1.5H17.25A.75.75 0 0116.5 12zM12 18a.75.75 0 01.75.75V21.75a.75.75 0 01-1.5 0V18.75A.75.75 0 0112 18zM4.689 4.689a.75.75 0 011.06 0l2.25 2.25a.75.75 0 01-1.06 1.06l-2.25-2.25a.75.75 0 010-1.06zM16.001 16.001a.75.75 0 011.06 0l2.25 2.25a.75.75 0 01-1.06 1.06l-2.25-2.25a.75.75 0 010-1.06zM19.311 4.689a.75.75 0 010 1.06l-2.25 2.25a.75.75 0 01-1.06-1.06l2.25-2.25a.75.75 0 011.06 0zM7.939 16.001a.75.75 0 010 1.06l-2.25 2.25a.75.75 0 01-1.06-1.06l2.25-2.25a.75.75 0 011.06 0z" />
    <path fillRule="evenodd" d="M12 6a6 6 0 00-6 6c0 1.341.441 2.58 1.187 3.578A3.75 3.75 0 019 18.75v1.5a.75.75 0 00.75.75h4.5a.75.75 0 00.75-.75v-1.5a3.75 3.75 0 011.813-3.172A6 6 0 0012 6z" clipRule="evenodd" />
  </svg>
);

export default CoachingCard;
