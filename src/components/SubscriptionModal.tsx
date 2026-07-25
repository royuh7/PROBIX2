import React from 'react';
import { Sparkles, Check, ShieldCheck, Zap, X, Crown, Award } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubscribe: () => void;
  isProMember?: boolean;
}

export const SubscriptionModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSubscribe,
  isProMember = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl border border-slate-200 max-w-lg w-full p-6 sm:p-8 shadow-2xl relative space-y-6 my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
            <Crown className="w-4 h-4 fill-white" />
            <span>PROBIX PRO 멤버십</span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900">
            {isProMember ? '현재 PRO 멤버십 이용 중' : '더 빠른 창업 문제 해결을 위해'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            제약 없는 탐구와 무제한 동업자 매칭으로 나만의 아이디어를 완성해보세요.
          </p>
        </div>

        {/* Pricing Comparison Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Free Plan Box */}
          <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50 space-y-3">
            <div>
              <span className="text-xs font-bold text-slate-500">기본 플랜</span>
              <h3 className="text-lg font-bold text-slate-800">Free</h3>
              <p className="text-xs text-slate-500 mt-1">기본 문제 탐구 및 동업자 연결</p>
            </div>
            <ul className="text-xs space-y-2 text-slate-600 pt-2 border-t border-slate-200">
              <li className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-slate-500 shrink-0" />
                <span>하루 동업자 찾기 <strong>3회 제한</strong></span>
              </li>
              <li className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-slate-500 shrink-0" />
                <span>스폰서 광고 표시 (KAIST 등)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-slate-500 shrink-0" />
                <span>기본 AI 마인드맵 생성</span>
              </li>
            </ul>
          </div>

          {/* Pro Plan Box */}
          <div className="border-2 border-blue-600 rounded-2xl p-4 bg-blue-50/50 space-y-3 relative overflow-hidden shadow-sm">
            <span className="absolute top-2 right-2 bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
              추천
            </span>
            <div>
              <span className="text-xs font-bold text-blue-600">프리미엄 플랜</span>
              <div className="flex items-baseline gap-1">
                <h3 className="text-xl font-extrabold text-slate-900">2,900원</h3>
                <span className="text-xs text-slate-500 font-medium">/ 월</span>
              </div>
              <p className="text-xs text-blue-700 mt-0.5 font-medium">무제한 탐구 & 동업 매칭</p>
            </div>
            <ul className="text-xs space-y-2 text-slate-700 pt-2 border-t border-blue-200 font-medium">
              <li className="flex items-center gap-1.5 text-blue-900">
                <Zap className="w-4 h-4 text-amber-500 shrink-0 fill-amber-500" />
                <span><strong>무제한 동업자 찾기</strong></span>
              </li>
              <li className="flex items-center gap-1.5 text-blue-900">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span><strong>광고 완벽 제거</strong></span>
              </li>
              <li className="flex items-center gap-1.5 text-blue-900">
                <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
                <span>우선 AI 마인드맵 & 평가</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Sponsor Notice for Free Tier */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 text-xs text-amber-800 flex items-center gap-2.5">
          <Award className="w-5 h-5 text-amber-600 shrink-0" />
          <div>
            <p className="font-bold">무료 이용 후원 기관</p>
            <p className="text-[11px] text-amber-700">KAIST IP 영재기업인교육원에서 차세대 청소년 창의혁신을 지원합니다.</p>
          </div>
        </div>

        {/* Submit Payment Action Button */}
        {isProMember ? (
          <button
            disabled
            className="w-full bg-emerald-600 text-white font-bold py-3.5 rounded-2xl shadow-sm text-sm cursor-default flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-5 h-5" />
            <span>현재 PRO 멤버십 이용 중입니다</span>
          </button>
        ) : (
          <button
            onClick={() => {
              onSubscribe();
              onClose();
            }}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold py-3.5 rounded-2xl shadow-lg shadow-blue-500/20 text-sm transition-all active:scale-98 flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-amber-300 fill-amber-300" />
            <span>결제하기 (월 2,900원)</span>
          </button>
        )}
      </div>
    </div>
  );
};
