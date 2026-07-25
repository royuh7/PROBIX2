import React from 'react';
import { Problem } from '../types';
import { CategoryBadge } from './CategoryBadge';
import { Heart, Bookmark, Sparkles, AlertTriangle, Clock, User, Share2 } from 'lucide-react';

interface Props {
  problem: Problem;
  onUpvote: (id: string) => void;
  onToggleSave: (id: string) => void;
  onStartAIMentor: (problem: Problem) => void;
  isSaved?: boolean;
}

export const ProblemCard: React.FC<Props> = ({
  problem,
  onUpvote,
  onToggleSave,
  onStartAIMentor,
  isSaved = false,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group">
      <div>
        {/* Top Header: Category & Meta Info */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <CategoryBadge category={problem.category} size="sm" />

          <div className="flex items-center gap-2">
            <span
              className={`text-[11px] font-medium px-2 py-0.5 rounded-md border ${
                problem.source === '공개 데이터'
                  ? 'bg-slate-100 text-slate-600 border-slate-200'
                  : 'bg-emerald-50 text-emerald-700 border-emerald-200'
              }`}
            >
              {problem.source}
            </span>

            <button
              onClick={() => onToggleSave(problem.id)}
              className={`p-1.5 rounded-lg transition-colors ${
                isSaved
                  ? 'bg-amber-100 text-amber-600'
                  : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
              }`}
              title={isSaved ? '저장됨' : '문제 저장하기'}
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-amber-500' : ''}`} />
            </button>
          </div>
        </div>

        {/* Title & Description */}
        <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-2 leading-snug group-hover:text-blue-600 transition-colors">
          {problem.title}
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 mb-4 line-clamp-3 leading-relaxed">
          {problem.description}
        </p>

        {/* Problem Metrics: Severity & Frequency */}
        <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-100 mb-4 text-xs">
          <div className="flex items-center gap-1.5 text-slate-600">
            <Clock className="w-3.5 h-3.5 text-blue-500 shrink-0" />
            <span className="truncate">빈도: <strong className="text-slate-800">{problem.frequency}</strong></span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-600">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <div className="flex items-center gap-1">
              <span>심각도:</span>
              <strong className="text-amber-600 font-extrabold">{problem.severity}</strong>
              <span className="text-[10px] text-slate-400 font-normal">/100점</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer: Upvote & AI Action Button */}
      <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
        {/* Upvote Button */}
        <button
          onClick={() => onUpvote(problem.id)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-rose-50 hover:text-rose-600 transition-all active:scale-95"
        >
          <Heart className="w-4 h-4 text-rose-500 fill-rose-500/20" />
          <span>공감 {problem.upvotes}</span>
        </button>

        {/* Start AI Mentor Discovery Flow */}
        <button
          onClick={() => onStartAIMentor(problem)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-xs hover:shadow-blue-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <Sparkles className="w-4 h-4 text-amber-300 fill-amber-300" />
          <span>AI 마인드맵 탐구</span>
        </button>
      </div>
    </div>
  );
};
