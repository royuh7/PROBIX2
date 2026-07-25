import React, { useState, useEffect } from 'react';
import { PromotedCompany } from '../types';
import { CategoryBadge } from './CategoryBadge';
import {
  Megaphone,
  Clock,
  Heart,
  ExternalLink,
  Sparkles,
  Building2,
  ChevronRight,
  Plus,
  Coins,
  Flame,
  Crown,
  CheckCircle2,
  Share2
} from 'lucide-react';

interface Props {
  promotions: PromotedCompany[];
  onOpenPromoteModal: () => void;
  onCheerCompany?: (companyId: string) => void;
  isCompact?: boolean;
}

export const PromotedCompanyShowcase: React.FC<Props> = ({
  promotions,
  onOpenPromoteModal,
  onCheerCompany,
  isCompact = false,
}) => {
  const [cheeredIds, setCheeredIds] = useState<Set<string>>(new Set());

  // Function to calculate remaining time
  const formatTimeLeft = (expiresAtStr: string, durationHours: number) => {
    const expires = new Date(expiresAtStr).getTime();
    const now = Date.now();
    const diffMs = expires - now;

    if (diffMs <= 0) return '홍보 종료됨';

    const hours = Math.floor(diffMs / (1000 * 3600));
    const mins = Math.floor((diffMs % (1000 * 3600)) / (1000 * 60));

    if (hours > 0) {
      return `${hours}시간 ${mins}분 남음`;
    }
    return `${mins}분 남음`;
  };

  const handleCheer = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (cheeredIds.has(id)) return;

    setCheeredIds((prev) => new Set(prev).add(id));
    if (onCheerCompany) {
      onCheerCompany(id);
    }
  };

  if (promotions.length === 0) return null;

  return (
    <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-5 sm:p-6 border border-indigo-800/40 shadow-xl space-y-4 relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Showcase Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-400 to-orange-500 flex items-center justify-center shrink-0 shadow-md">
            <Megaphone className="w-5 h-5 text-slate-950 fill-slate-950 animate-bounce" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-amber-400/20 text-amber-300 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border border-amber-400/30 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-300" />
                포인트 벤처 기업 홍보
              </span>
              <span className="text-[10px] text-slate-400 font-medium">
                실시간 {promotions.length}개 회사 가동 중
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-black text-white mt-0.5">
              🚀 사용자 아이디어 창업 홍보관
            </h3>
          </div>
        </div>

        <button
          onClick={onOpenPromoteModal}
          className="self-start sm:self-auto bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-300 hover:to-orange-300 text-slate-950 text-xs font-black px-4 py-2 rounded-2xl shadow-md transition-all flex items-center gap-1.5 shrink-0 hover:scale-[1.02] active:scale-[0.98]"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>내 회사 홍보하기 (포인트 차감)</span>
        </button>
      </div>

      {/* Promoted Company Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 relative z-10">
        {promotions.map((company) => {
          const isCheered = cheeredIds.has(company.id);
          const currentCheer = company.cheerCount + (isCheered ? 1 : 0);
          const timeLeftText = formatTimeLeft(company.expiresAt, company.durationHours);

          return (
            <div
              key={company.id}
              className="bg-slate-800/80 hover:bg-slate-800 backdrop-blur-md rounded-2xl p-4 border border-indigo-500/20 hover:border-indigo-400/50 transition-all flex flex-col justify-between space-y-3 group shadow-md"
            >
              {/* Top Row: Category + Plan Duration Badge */}
              <div className="flex items-center justify-between gap-2">
                <CategoryBadge category={company.category} size="sm" />

                {/* Plan Tier Badge */}
                <div className="flex items-center gap-1 bg-amber-500/20 border border-amber-400/30 px-2 py-0.5 rounded-lg text-[10px] font-bold text-amber-300">
                  <Clock className="w-3 h-3 text-amber-300" />
                  <span>{company.costPoints}P ({company.durationHours}시간)</span>
                </div>
              </div>

              {/* Company Info */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-blue-400 shrink-0" />
                  <h4 className="font-extrabold text-sm text-white group-hover:text-blue-300 transition-colors">
                    {company.companyName}
                  </h4>
                  <span className="text-[10px] text-slate-400 font-medium">| {company.authorName}</span>
                </div>

                <p className="text-xs font-bold text-amber-200/90 line-clamp-1">
                  "{company.tagline}"
                </p>

                <p className="text-[11px] text-slate-300 leading-relaxed line-clamp-2">
                  {company.description}
                </p>

                {company.ideaTitle && (
                  <div className="text-[10px] text-slate-400 bg-slate-900/60 p-2 rounded-xl border border-slate-700/60 mt-2">
                    💡 <strong className="text-slate-300">기반 아이디어:</strong> {company.ideaTitle}
                  </div>
                )}
              </div>

              {/* Bottom Row: Remaining Time + Cheer Button */}
              <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg">
                  <Clock className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{timeLeftText}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={(e) => handleCheer(company.id, e)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-all ${
                      isCheered
                        ? 'bg-rose-500 text-white shadow-xs'
                        : 'bg-slate-700 hover:bg-slate-600 text-slate-200 border border-slate-600'
                    }`}
                  >
                    <Heart className={`w-3.5 h-3.5 ${isCheered ? 'fill-current text-white' : 'text-rose-400'}`} />
                    <span>응원 {currentCheer}</span>
                  </button>

                  {company.linkUrl && (
                    <a
                      href={company.linkUrl.startsWith('http') ? company.linkUrl : `https://${company.linkUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg bg-blue-600/30 hover:bg-blue-600 text-blue-200 border border-blue-400/30 transition-all"
                      title="웹사이트 방문"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
