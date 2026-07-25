import React from 'react';
import { Lightbulb, PlusCircle, Coins, Search, Users, User, Home, Crown, Sparkles } from 'lucide-react';

interface Props {
  activeTab: 'home' | 'problems' | 'community' | 'mypage';
  setActiveTab: (tab: 'home' | 'problems' | 'community' | 'mypage') => void;
  points: number;
  isProMember?: boolean;
  onOpenRegisterModal: () => void;
  onOpenSubscribeModal?: () => void;
}

export const Header: React.FC<Props> = ({
  activeTab,
  setActiveTab,
  points,
  isProMember = false,
  onOpenRegisterModal,
  onOpenSubscribeModal,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-slate-50/90 backdrop-blur-md border-b border-slate-200/80">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Brand Logo & Name */}
        <div
          onClick={() => setActiveTab('home')}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-slate-900 text-white flex items-center justify-center shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
            <Lightbulb className="w-5 h-5 text-amber-300 fill-amber-300" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-black text-xl tracking-tight text-slate-900 font-sans">
                PROBIX
              </span>
              <span className="bg-blue-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow-2xs">
                BENTO AI
              </span>
            </div>
            <p className="text-[10px] text-slate-500 font-semibold hidden sm:block">
              문제 발견 중심 발명·창업 플랫폼
            </p>
          </div>
        </div>

        {/* Navigation for Desktop */}
        <nav className="hidden md:flex items-center gap-1 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-xs text-xs font-bold">
          <button
            onClick={() => setActiveTab('home')}
            className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
              activeTab === 'home'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Home className="w-3.5 h-3.5" />
            홈
          </button>
          <button
            onClick={() => setActiveTab('problems')}
            className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
              activeTab === 'problems'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            문제 발견
          </button>
          <button
            onClick={() => setActiveTab('community')}
            className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
              activeTab === 'community'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            커뮤니티
          </button>
          <button
            onClick={() => setActiveTab('mypage')}
            className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
              activeTab === 'mypage'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            마이페이지
          </button>
        </nav>

        {/* Right Actions: Points Pill, Plan Badge & Add Problem Button */}
        <div className="flex items-center gap-2">
          {/* Pro Member Badge or Ad-removal CTA */}
          {isProMember ? (
            <button
              onClick={onOpenSubscribeModal}
              className="flex items-center gap-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white border border-amber-400/80 px-2.5 py-1.5 rounded-xl text-xs font-black shadow-xs hover:brightness-105 transition-all"
              title="PRO 멤버십 이용 중 (월 2,900원) - 모든 광고 제거됨"
            >
              <Crown className="w-3.5 h-3.5 fill-white" />
              <span>PRO</span>
            </button>
          ) : (
            onOpenSubscribeModal && (
              <button
                onClick={onOpenSubscribeModal}
                className="hidden lg:flex items-center gap-1 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-800 border border-blue-200/90 px-2.5 py-1.5 rounded-xl text-xs font-bold hover:bg-blue-100/80 transition-all"
                title="월 2,900원 플랜으로 모든 스폰서 광고 제거"
              >
                <Sparkles className="w-3.5 h-3.5 text-blue-600 fill-blue-600" />
                <span>2,900원 광고제거</span>
              </button>
            )
          )}

          {/* User Points Badge */}
          <button
            onClick={() => setActiveTab('mypage')}
            className="flex items-center gap-1.5 bg-amber-50 text-amber-900 border border-amber-200/80 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-extrabold shadow-2xs hover:bg-amber-100 transition-colors"
            title="마이페이지에서 포인트 내역 및 플랜 확인"
          >
            <Coins className="w-4 h-4 text-amber-500 fill-amber-400" />
            <span>{points} P</span>
          </button>

          {/* Add Problem CTA */}
          <button
            onClick={onOpenRegisterModal}
            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold px-3.5 py-2 rounded-xl text-xs sm:text-sm shadow-xs transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <PlusCircle className="w-4 h-4" />
            <span className="hidden sm:inline">문제 직접 제안</span>
            <span className="sm:hidden">제안</span>
          </button>
        </div>
      </div>
    </header>
  );
};
