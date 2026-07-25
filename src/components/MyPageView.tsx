import React, { useState } from 'react';
import { UserProfile, Problem, Idea, IdeaEvaluation, Badge, PromotedCompany } from '../types';
import { CategoryBadge } from './CategoryBadge';
import { ProblemCard } from './ProblemCard';
import { PromotedCompanyShowcase } from './PromotedCompanyShowcase';
import {
  Award,
  Coins,
  Bookmark,
  Lightbulb,
  FileCheck,
  PieChart,
  User,
  Shield,
  Search,
  Sparkles,
  ChevronRight,
  TrendingUp,
  CheckCircle2,
  Crown,
  ShieldCheck,
  Zap,
  Check,
  ExternalLink,
  Megaphone,
  Clock,
  Flame,
  Settings,
  UserCheck,
  X,
  CheckCircle,
  Pencil
} from 'lucide-react';
import * as Icons from 'lucide-react';

interface Props {
  userProfile: UserProfile;
  problems: Problem[];
  onUpvote: (id: string) => void;
  onToggleSave: (id: string) => void;
  onStartAIMentor: (problem: Problem) => void;
  onOpenSubscribeModal?: () => void;
  promotions?: PromotedCompany[];
  onOpenPromoteModal?: () => void;
  onCheerCompany?: (companyId: string) => void;
  onUpdateProfile?: (updatedFields: Partial<UserProfile>) => void;
}

export const MyPageView: React.FC<Props> = ({
  userProfile,
  problems,
  onUpvote,
  onToggleSave,
  onStartAIMentor,
  onOpenSubscribeModal,
  promotions = [],
  onOpenPromoteModal,
  onCheerCompany,
  onUpdateProfile,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'saved' | 'ideas' | 'evals' | 'badges' | 'points'>('saved');
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState<boolean>(false);
  const [inputName, setInputName] = useState<string>(userProfile.name);
  const [inputEmail, setInputEmail] = useState<string>(userProfile.email || '');
  const [showSuccessToast, setShowSuccessToast] = useState<boolean>(false);

  const savedProblems = problems.filter((p) => userProfile.savedProblemIds.includes(p.id));

  const handleOpenSettings = () => {
    setInputName(userProfile.name);
    setInputEmail(userProfile.email || '');
    setIsSettingsModalOpen(true);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputName.trim()) return;

    if (onUpdateProfile) {
      onUpdateProfile({
        name: inputName.trim(),
        email: inputEmail.trim() || userProfile.email,
      });
    }
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 2500);
    setIsSettingsModalOpen(false);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
      {/* Profile Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-blue-500 to-indigo-400 p-1 shrink-0 shadow-md">
              <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center font-black text-2xl sm:text-3xl text-blue-300">
                {userProfile.name ? userProfile.name.charAt(0) : '김'}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-extrabold">{userProfile.name}</h1>
                <button
                  onClick={handleOpenSettings}
                  className="bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white px-2.5 py-1 rounded-xl text-xs font-semibold flex items-center gap-1 transition-all border border-white/20 active:scale-95"
                  title="닉네임 변경 및 프로필 설정"
                >
                  <Settings className="w-3.5 h-3.5" />
                  <span>닉네임 설정</span>
                </button>
                <span className="bg-blue-500/30 border border-blue-400/40 text-blue-200 text-xs font-bold px-2.5 py-0.5 rounded-full">
                  {userProfile.levelTitle} (Lv.{userProfile.level})
                </span>
                {userProfile.isProMember && (
                  <span className="bg-amber-400 text-slate-950 font-black text-[10px] px-2 py-0.5 rounded-md flex items-center gap-1 shadow-xs">
                    <Crown className="w-3 h-3 fill-slate-950" />
                    PRO 2,900
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-300 font-medium">{userProfile.email}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs font-bold text-amber-300 bg-amber-400/20 px-2.5 py-1 rounded-lg border border-amber-400/30 flex items-center gap-1">
                  <Coins className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                  보유 포인트: {userProfile.points} P
                </span>
              </div>
            </div>
          </div>

          {/* User Quick Stats */}
          <div className="grid grid-cols-3 gap-2 bg-white/10 backdrop-blur-md p-3 sm:p-4 rounded-2xl border border-white/10 text-center shrink-0">
            <div>
              <span className="text-[10px] sm:text-xs text-slate-300 block font-semibold">저장 문제</span>
              <span className="text-base sm:text-lg font-extrabold text-white">{savedProblems.length}개</span>
            </div>
            <div>
              <span className="text-[10px] sm:text-xs text-slate-300 block font-semibold">생성 아이디어</span>
              <span className="text-base sm:text-lg font-extrabold text-amber-300">{userProfile.createdIdeas.length}개</span>
            </div>
            <div>
              <span className="text-[10px] sm:text-xs text-slate-300 block font-semibold">해금 배지</span>
              <span className="text-base sm:text-lg font-extrabold text-emerald-300">
                {userProfile.badges.filter((b) => b.unlocked).length}개
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Current Subscription Plan Status Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
              userProfile.isProMember
                ? 'bg-gradient-to-tr from-amber-500 to-orange-500 text-white shadow-md shadow-amber-500/20'
                : 'bg-slate-100 text-slate-600'
            }`}>
              <Crown className="w-5 h-5 fill-current" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-slate-900 text-base">나의 멤버십 플랜</h3>
                {userProfile.isProMember ? (
                  <span className="bg-emerald-100 text-emerald-800 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    PRO 멤버십 이용 중 (월 2,900원)
                  </span>
                ) : (
                  <span className="bg-slate-100 text-slate-600 text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-slate-200">
                    Free 기본 플랜
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {userProfile.isProMember
                  ? '월 2,900원 PRO 플랜으로 모든 스폰서 광고가 완벽 제거된 프리미엄 환경입니다.'
                  : '기본 무료 플랜 이용 중입니다. 월 2,900원 PRO 플랜으로 스폰서 광고를 완벽하게 제거해보세요!'}
              </p>
            </div>
          </div>

          {onOpenSubscribeModal && (
            <button
              onClick={onOpenSubscribeModal}
              className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all shadow-xs shrink-0 ${
                userProfile.isProMember
                  ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200'
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-blue-500/20 hover:scale-[1.02] active:scale-[0.98]'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-300 fill-amber-300" />
              <span>{userProfile.isProMember ? '플랜 혜택 상세보기' : '2,900원 플랜으로 광고 제거하기'}</span>
            </button>
          )}
        </div>

        {/* Plan Feature Status List */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          <div className={`p-3.5 rounded-2xl border text-xs space-y-1 ${
            userProfile.isProMember
              ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
              : 'bg-slate-50 border-slate-200 text-slate-700'
          }`}>
            <div className="flex items-center justify-between font-extrabold">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className={`w-4 h-4 ${userProfile.isProMember ? 'text-emerald-600' : 'text-slate-400'}`} />
                스폰서 광고 제거
              </span>
              <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold ${
                userProfile.isProMember ? 'bg-emerald-200 text-emerald-900' : 'bg-slate-200 text-slate-600'
              }`}>
                {userProfile.isProMember ? '완벽 제거됨' : '광고 표시 중'}
              </span>
            </div>
            <p className="text-[11px] opacity-80">
              {userProfile.isProMember
                ? '스폰서 배너 광고가 모두 차단되었습니다.'
                : '월 2,900원 플랜 구독 시 KAIST 등 스폰서 광고 완벽 차단'}
            </p>
          </div>

          <div className={`p-3.5 rounded-2xl border text-xs space-y-1 ${
            userProfile.isProMember
              ? 'bg-blue-50/70 border-blue-200 text-blue-950'
              : 'bg-slate-50 border-slate-200 text-slate-700'
          }`}>
            <div className="flex items-center justify-between font-extrabold">
              <span className="flex items-center gap-1.5">
                <Zap className={`w-4 h-4 ${userProfile.isProMember ? 'text-amber-500 fill-amber-500' : 'text-slate-400'}`} />
                동업자 찾기 매칭
              </span>
              <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold ${
                userProfile.isProMember ? 'bg-blue-200 text-blue-900' : 'bg-slate-200 text-slate-600'
              }`}>
                {userProfile.isProMember ? '무제한 매칭' : '1일 3회 제한'}
              </span>
            </div>
            <p className="text-[11px] opacity-80">
              {userProfile.isProMember
                ? '제한 없이 유능한 C-Level 공동창업자를 매칭합니다.'
                : '기본 플랜은 하루 3회 매칭 기회가 제공됩니다.'}
            </p>
          </div>

          <div className={`p-3.5 rounded-2xl border text-xs space-y-1 ${
            userProfile.isProMember
              ? 'bg-indigo-50/70 border-indigo-200 text-indigo-950'
              : 'bg-slate-50 border-slate-200 text-slate-700'
          }`}>
            <div className="flex items-center justify-between font-extrabold">
              <span className="flex items-center gap-1.5">
                <Sparkles className={`w-4 h-4 ${userProfile.isProMember ? 'text-indigo-600' : 'text-slate-400'}`} />
                AI 방사형 마인드맵
              </span>
              <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold ${
                userProfile.isProMember ? 'bg-indigo-200 text-indigo-900' : 'bg-slate-200 text-slate-600'
              }`}>
                {userProfile.isProMember ? '우선 AI 분석' : '기본 분석'}
              </span>
            </div>
            <p className="text-[11px] opacity-80">
              SCAMPER & TRIZ 6개 대화 질문 기반 초고속 발명 분석
            </p>
          </div>
        </div>
      </div>

      {/* Point Startup Promotion Card */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-5 sm:p-6 border border-indigo-800/50 shadow-xl space-y-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 to-orange-500 flex items-center justify-center text-slate-950 font-extrabold shrink-0 shadow-md">
              <Megaphone className="w-6 h-6 fill-current" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-amber-400/20 text-amber-300 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border border-amber-400/30">
                  포인트 홍보 서비스
                </span>
                <span className="text-xs font-bold text-amber-300">보유 포인트: {userProfile.points} P</span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-white mt-0.5">
                🚀 내 창업 아이디어 & 회사 홍보하기
              </h3>
              <p className="text-xs text-slate-300 mt-0.5 max-w-lg">
                획득한 포인트로 내 스타트업 및 서비스를 메인 화면 및 커뮤니티에 실시간으로 홍보해보세요!
              </p>
            </div>
          </div>

          {onOpenPromoteModal && (
            <button
              onClick={onOpenPromoteModal}
              className="bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-300 hover:to-orange-300 text-slate-950 text-xs font-black px-4 py-2.5 rounded-2xl shadow-md transition-all flex items-center justify-center gap-1.5 shrink-0 hover:scale-[1.02] active:scale-[0.98]"
            >
              <Megaphone className="w-4 h-4 fill-current" />
              <span>포인트로 회사 홍보하기</span>
            </button>
          )}
        </div>

        {/* 3 Price Tiers Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 relative z-10">
          <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/10 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-300 block font-bold">⚡ 스피드 홍보</span>
              <span className="text-sm font-black text-white">6시간 홍보</span>
            </div>
            <span className="text-xs font-black text-amber-300 bg-amber-400/20 px-2.5 py-1 rounded-lg border border-amber-400/30">
              500 P
            </span>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/10 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-indigo-300 block font-bold">🔥 인기 추천</span>
              <span className="text-sm font-black text-white">12시간 홍보</span>
            </div>
            <span className="text-xs font-black text-amber-300 bg-amber-400/20 px-2.5 py-1 rounded-lg border border-amber-400/30">
              1000 P
            </span>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/10 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-amber-300 block font-bold">👑 하루 프리미엄</span>
              <span className="text-sm font-black text-white">하루 (24시간) 홍보</span>
            </div>
            <span className="text-xs font-black text-amber-300 bg-amber-400/20 px-2.5 py-1 rounded-lg border border-amber-400/30">
              2000 P
            </span>
          </div>
        </div>
      </div>

      {/* Frequently Viewed Categories Analytics */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5">
        <h3 className="text-xs sm:text-sm font-bold text-slate-800 mb-2.5 flex items-center gap-1.5">
          <PieChart className="w-4 h-4 text-blue-600" />
          자주 탐구하는 관심 카테고리
        </h3>
        <div className="flex flex-wrap gap-2">
          {userProfile.frequentCategories.map((fc, i) => (
            <div
              key={i}
              className="bg-white border border-slate-200 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 flex items-center gap-2 shadow-2xs"
            >
              <span>{fc.category}</span>
              <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-1.5 py-0.5 rounded-md">
                {fc.count}회 방문
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Sub Tabs Bar */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => setActiveSubTab('saved')}
          className={`flex items-center gap-1.5 px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 transition-all shrink-0 ${
            activeSubTab === 'saved'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Bookmark className="w-4 h-4" />
          저장한 문제 ({savedProblems.length})
        </button>

        <button
          onClick={() => setActiveSubTab('ideas')}
          className={`flex items-center gap-1.5 px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 transition-all shrink-0 ${
            activeSubTab === 'ideas'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Lightbulb className="w-4 h-4" />
          생성한 아이디어 ({userProfile.createdIdeas.length})
        </button>

        <button
          onClick={() => setActiveSubTab('evals')}
          className={`flex items-center gap-1.5 px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 transition-all shrink-0 ${
            activeSubTab === 'evals'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileCheck className="w-4 h-4" />
          AI 평가 기록 ({userProfile.evaluations.length})
        </button>

        <button
          onClick={() => setActiveSubTab('badges')}
          className={`flex items-center gap-1.5 px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 transition-all shrink-0 ${
            activeSubTab === 'badges'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Award className="w-4 h-4" />
          획득한 배지 ({userProfile.badges.filter((b) => b.unlocked).length})
        </button>

        <button
          onClick={() => setActiveSubTab('points')}
          className={`flex items-center gap-1.5 px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 transition-all shrink-0 ${
            activeSubTab === 'points'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Coins className="w-4 h-4" />
          포인트 내역
        </button>
      </div>

      {/* Tab Content 1: Saved Problems */}
      {activeSubTab === 'saved' && (
        <div className="space-y-4">
          {savedProblems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {savedProblems.map((prob) => (
                <ProblemCard
                  key={prob.id}
                  problem={prob}
                  onUpvote={onUpvote}
                  onToggleSave={onToggleSave}
                  onStartAIMentor={onStartAIMentor}
                  isSaved={true}
                />
              ))}
            </div>
          ) : (
            <div className="bg-slate-50 border border-slate-200 rounded-3xl p-8 text-center space-y-2">
              <Bookmark className="w-8 h-8 text-slate-400 mx-auto" />
              <h3 className="font-bold text-slate-700 text-sm">저장된 문제가 없습니다.</h3>
              <p className="text-xs text-slate-500">
                관심 있는 문제 카드의 북마크 버튼을 눌러 나만의 문제 목록으로 저장해보세요.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Tab Content 2: Created Ideas */}
      {activeSubTab === 'ideas' && (
        <div className="space-y-4">
          {userProfile.createdIdeas.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {userProfile.createdIdeas.map((idea) => (
                <div key={idea.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between">
                    <CategoryBadge category={idea.category} size="sm" />
                    <span className="text-[11px] text-slate-400 font-medium">{idea.createdAt}</span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-base">{idea.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{idea.description}</p>

                  <div className="bg-blue-50/70 p-3 rounded-xl border border-blue-100 text-xs">
                    <strong className="text-blue-900 block mb-0.5">기대 효과:</strong>
                    <span className="text-blue-800">{idea.expectedEffect}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-slate-50 border border-slate-200 rounded-3xl p-8 text-center space-y-2">
              <Lightbulb className="w-8 h-8 text-slate-400 mx-auto" />
              <h3 className="font-bold text-slate-700 text-sm">생성한 아이디어가 없습니다.</h3>
              <p className="text-xs text-slate-500">
                문제 발견 화면에서 AI 마인드맵 분석을 마치면 나만의 해결 아이디어가 기록됩니다.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Tab Content 3: Evaluation History */}
      {activeSubTab === 'evals' && (
        <div className="space-y-4">
          {userProfile.evaluations.length > 0 ? (
            <div className="space-y-3">
              {userProfile.evaluations.map((ev) => {
                const starText = ev.starRatingText || (ev.totalScore >= 91 ? '⭐⭐⭐⭐⭐ (5 / 5)' : ev.totalScore >= 81 ? '⭐⭐⭐⭐☆ (4 / 5)' : ev.totalScore >= 71 ? '⭐⭐⭐☆☆ (3 / 5)' : ev.totalScore >= 51 ? '⭐⭐☆☆☆ (2 / 5)' : '⭐☆☆☆☆ (1 / 5)');
                return (
                  <div key={ev.id} className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
                          AI 검증 완료 ({ev.evaluatedAt})
                        </span>
                        <span className="text-xs font-extrabold text-amber-500">
                          {starText}
                        </span>
                      </div>
                      <h3 className="font-bold text-slate-900 text-base">{ev.ideaTitle}</h3>
                      <p className="text-xs text-slate-600 mt-1 line-clamp-1">
                        장점: {ev.pros[0]}
                      </p>
                    </div>

                    <div className="flex items-center gap-4 shrink-0 bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                      <div className="text-center">
                        <span className="text-[10px] text-slate-500 block font-medium">종합점수</span>
                        <span className="text-lg font-black text-blue-600">{ev.totalScore}점</span>
                      </div>
                      <div className="text-center border-l border-slate-200 pl-3">
                        <span className="text-[10px] text-slate-500 block font-medium">획득</span>
                        <span className="text-xs font-bold text-amber-600">+100 P</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-slate-50 border border-slate-200 rounded-3xl p-8 text-center space-y-2">
              <FileCheck className="w-8 h-8 text-slate-400 mx-auto" />
              <h3 className="font-bold text-slate-700 text-sm">평가 기록이 없습니다.</h3>
              <p className="text-xs text-slate-500">
                AI 발명 멘토에게 아이디어를 평가받아 종합 심사표와 100 포인트를 받으세요.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Tab Content 4: Earned Badges */}
      {activeSubTab === 'badges' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {userProfile.badges.map((badge) => {
            const IconComp = (Icons as Record<string, any>)[badge.icon] || Icons.Award;

            return (
              <div
                key={badge.id}
                className={`p-4 rounded-2xl border text-center flex flex-col items-center justify-between transition-all ${
                  badge.unlocked
                    ? 'bg-amber-50/70 border-amber-200 text-slate-900 shadow-2xs'
                    : 'bg-slate-100 border-slate-200 text-slate-400 opacity-60'
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-2 font-bold ${
                    badge.unlocked
                      ? 'bg-amber-400 text-amber-950 shadow-md shadow-amber-400/20'
                      : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  <IconComp className="w-6 h-6" />
                </div>

                <div>
                  <h4 className="font-bold text-xs sm:text-sm">{badge.title}</h4>
                  <p className="text-[10px] text-slate-500 mt-0.5 line-clamp-2">{badge.description}</p>
                </div>

                <div className="mt-2">
                  {badge.unlocked ? (
                    <span className="text-[10px] font-bold text-amber-800 bg-amber-200/80 px-2 py-0.5 rounded-full">
                      해금 완료 ({badge.unlockedAt || '최근'})
                    </span>
                  ) : (
                    <span className="text-[10px] font-semibold text-slate-400 bg-slate-200 px-2 py-0.5 rounded-full">
                      미해금 (달성 필요)
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tab Content 5: Points History */}
      {activeSubTab === 'points' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <span className="text-xs font-bold text-slate-700">포인트 획득 및 사용 이력</span>
            <span className="text-sm font-extrabold text-amber-600">현재 보유 {userProfile.points} P</span>
          </div>

          <div className="space-y-2">
            {userProfile.pointHistory.map((ph) => {
              const isPositive = ph.amount >= 0;
              return (
                <div
                  key={ph.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs"
                >
                  <div>
                    <strong className="text-slate-800 block font-semibold">{ph.reason}</strong>
                    <span className="text-slate-400 text-[10px]">{ph.date}</span>
                  </div>
                  <span
                    className={`font-extrabold px-2.5 py-1 rounded-lg border ${
                      isPositive
                        ? 'text-emerald-600 bg-emerald-50 border-emerald-200'
                        : 'text-rose-600 bg-rose-50 border-rose-200'
                    }`}
                  >
                    {isPositive ? `+${ph.amount}` : ph.amount} P
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Profile & Nickname Settings Modal */}
      {isSettingsModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900">프로필 & 닉네임 설정</h3>
                  <p className="text-xs text-slate-500">사용하실 닉네임과 내 정보를 정할 수 있습니다.</p>
                </div>
              </div>
              <button
                onClick={() => setIsSettingsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-xl hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  닉네임 (이름)
                </label>
                <input
                  type="text"
                  value={inputName}
                  onChange={(e) => setInputName(e.target.value)}
                  placeholder="사용하실 닉네임을 입력하세요"
                  maxLength={20}
                  required
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-600 text-sm font-semibold text-slate-900 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  추천 닉네임 예시
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {['김트비', '김발명', '창업마스터', '비즈니스솔버', 'AI아이디에이터'].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setInputName(preset)}
                      className={`text-xs px-2.5 py-1 rounded-xl font-bold transition-all border ${
                        inputName === preset
                          ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                      }`}
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  이메일 주소
                </label>
                <input
                  type="email"
                  value={inputEmail}
                  onChange={(e) => setInputEmail(e.target.value)}
                  placeholder="이메일을 입력하세요"
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-600 text-sm font-semibold text-slate-900 outline-none transition-all"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsSettingsModalOpen(false)}
                  className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl text-xs font-extrabold transition-colors"
                >
                  취소
                </button>
                <button
                  type="submit"
                  disabled={!inputName.trim()}
                  className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-2xl text-xs font-extrabold transition-all shadow-md shadow-blue-500/20 flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  <Check className="w-4 h-4" />
                  <span>설정 저장하기</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Success Toast */}
      {showSuccessToast && (
        <div className="fixed bottom-20 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-2 text-xs font-bold animate-bounce">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>닉네임 설정이 성공적으로 저장되었습니다!</span>
        </div>
      )}
    </div>
  );
};
