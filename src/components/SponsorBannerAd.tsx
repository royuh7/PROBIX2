import React from 'react';
import { Award, ExternalLink, Sparkles } from 'lucide-react';

interface Props {
  onOpenSubscribeModal?: () => void;
  isProMember?: boolean;
}

export const SponsorBannerAd: React.FC<Props> = ({ onOpenSubscribeModal, isProMember = false }) => {
  if (isProMember) return null;

  return (
    <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-3.5 sm:p-4 border border-indigo-800/50 shadow-md flex flex-col sm:flex-row items-center justify-between gap-3 relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-xl pointer-events-none" />

      <div className="flex items-center gap-3 relative z-10">
        <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center shrink-0">
          <Award className="w-5 h-5 text-amber-300" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-amber-500/30 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-md border border-amber-400/30">
              공식 후원
            </span>
            <h4 className="text-xs sm:text-sm font-bold text-slate-100">
              KAIST IP 영재기업인교육원
            </h4>
          </div>
          <p className="text-[11px] text-slate-300 mt-0.5">
            청소년 및 예비 창업가의 차세대 기술 혁신 아이디어 발굴을 지원합니다.
          </p>
        </div>
      </div>

      {onOpenSubscribeModal && (
        <button
          onClick={onOpenSubscribeModal}
          className="self-stretch sm:self-auto bg-white/10 hover:bg-white/20 text-white text-xs font-semibold px-3 py-1.5 rounded-xl border border-white/20 transition-all flex items-center justify-center gap-1 shrink-0 whitespace-nowrap"
        >
          <span>광고 제거 (월 2,900원)</span>
          <ExternalLink className="w-3 h-3 text-slate-300" />
        </button>
      )}
    </div>
  );
};
