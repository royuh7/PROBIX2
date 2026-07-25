import React from 'react';
import { CategoryType, Problem, PromotedCompany } from '../types';
import { CATEGORY_INFO } from '../data/sampleProblems';
import { CategoryBadge } from './CategoryBadge';
import { ProblemCard } from './ProblemCard';
import { SponsorBannerAd } from './SponsorBannerAd';
import { PromotedCompanyShowcase } from './PromotedCompanyShowcase';
import { Search, Sparkles, Plus, TrendingUp, Lightbulb, Compass, Award, Users, Bot, ArrowRight, Flame, Layers, Hash } from 'lucide-react';
import * as Icons from 'lucide-react';

interface Props {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategory: CategoryType | '전체';
  setSelectedCategory: (c: CategoryType | '전체') => void;
  problems: Problem[];
  onUpvote: (id: string) => void;
  onToggleSave: (id: string) => void;
  onStartAIMentor: (problem: Problem) => void;
  onOpenRegisterModal: () => void;
  onNavigateToProblems: () => void;
  onOpenSubscribeModal?: () => void;
  savedProblemIds: string[];
  isProMember?: boolean;
  promotions: PromotedCompany[];
  onOpenPromoteModal: () => void;
  onCheerCompany?: (companyId: string) => void;
}

export const HomeView: React.FC<Props> = ({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  problems,
  onUpvote,
  onToggleSave,
  onStartAIMentor,
  onOpenRegisterModal,
  onNavigateToProblems,
  onOpenSubscribeModal,
  savedProblemIds,
  isProMember = false,
  promotions,
  onOpenPromoteModal,
  onCheerCompany,
}) => {
  const categories = Object.keys(CATEGORY_INFO) as CategoryType[];

  // Top Hashtags as requested
  const popularHashtags = [
    '#교육', '#환경', '#의료', '#재난', '#AI', '#발명', '#드론',
    '#학교폭력', '#교통', '#우주', '#수학', '#과학', '#물리', '#화학', '#생물', '#지구'
  ];

  // Top Hot Problems by Upvotes
  const hotProblems = [...problems].sort((a, b) => b.upvotes - a.upvotes);
  const featuredProblems = hotProblems.slice(0, 2);
  const topRankings = hotProblems.slice(0, 5);

  return (
    <div className="space-y-6 max-w-6xl mx-auto px-4 py-4">
      {/* Requirement 4: Sponsor Banner Ad for Free version (Hidden if Pro) */}
      <SponsorBannerAd onOpenSubscribeModal={onOpenSubscribeModal} isProMember={isProMember} />

      {/* Promoted Startup Showcase (Point Promotion Feature) */}
      <PromotedCompanyShowcase
        promotions={promotions}
        onOpenPromoteModal={onOpenPromoteModal}
        onCheerCompany={onCheerCompany}
      />

      {/* Search Header Bar in Bento Style */}
      <div className="bg-white rounded-3xl p-4 border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (e.target.value.trim()) onNavigateToProblems();
              }}
              placeholder="태그나 검색어를 입력해보세요 (예: 드론, 교육, 환경, AI, 학교폭력)..."
              className="w-full bg-slate-50 text-slate-900 placeholder:text-slate-400 text-xs sm:text-sm font-medium pl-12 pr-28 py-3.5 rounded-2xl border border-slate-200/80 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
            <button
              onClick={onNavigateToProblems}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-xs"
            >
              문제 탐색
            </button>
          </div>

          <button
            onClick={onOpenRegisterModal}
            className="w-full md:w-auto shrink-0 bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-bold px-5 py-3.5 rounded-2xl shadow-sm transition-all flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4 text-amber-400" />
            <span>새 문제 직접 제안</span>
          </button>
        </div>

        {/* Requirement 3: Interactive Tag Filter Chips (Strips # on click) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-1 pb-1 scrollbar-none text-xs">
          <span className="text-slate-400 font-bold text-[11px] shrink-0 flex items-center gap-1">
            <Hash className="w-3.5 h-3.5 text-blue-600" />
            추천 태그:
          </span>
          {popularHashtags.map((tag) => {
            const cleanTag = tag.replace(/^#/, '');
            return (
              <button
                key={tag}
                onClick={() => {
                  setSearchQuery(cleanTag);
                  onNavigateToProblems();
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all shrink-0 ${
                  searchQuery.toLowerCase().trim() === cleanTag.toLowerCase()
                    ? 'bg-blue-600 text-white font-bold shadow-xs'
                    : 'bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white border border-blue-200/80'
                }`}
              >
                {cleanTag}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Bento Grid Container */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
        {/* Bento Box 1: Featured Today's Problems (Col-Span 8) */}
        <div className="md:col-span-8 bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base sm:text-lg font-extrabold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-600 fill-blue-100" />
              <span>오늘의 추천 문제 발견</span>
            </h2>
            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
              신규 {problems.length}건 수집됨
            </span>
          </div>

          {/* 2 Side-by-side Bento Problem Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
            {featuredProblems.map((prob) => (
              <div
                key={prob.id}
                onClick={() => onStartAIMentor(prob)}
                className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200/80 flex flex-col justify-between cursor-pointer hover:border-blue-300 hover:bg-blue-50/40 transition-all hover:shadow-xs group"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] uppercase tracking-wider text-blue-600 font-extrabold bg-blue-100/80 px-2 py-0.5 rounded-md">
                      {prob.category}
                    </span>
                    <span className="text-[10px] text-amber-600 font-bold">
                      심각도 {prob.severity}/100점
                    </span>
                  </div>
                  <h3 className="font-bold text-xs sm:text-sm text-slate-900 leading-snug mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {prob.title}
                  </h3>
                  <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                    {prob.description}
                  </p>
                </div>

                <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-200/60">
                  <span className="text-[11px] font-bold text-slate-600 flex items-center gap-1">
                    ❤️ 공감 {prob.upvotes}명
                  </span>
                  <span className="text-xs font-extrabold text-blue-600 bg-white border border-blue-200 px-2.5 py-1 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    AI 멘토 탐구 →
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
            <p className="text-xs text-slate-500 font-medium">
              일상 속 작은 불편함이 세상을 바꾸는 첫 발명이 됩니다.
            </p>
            <button
              onClick={onNavigateToProblems}
              className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              <span>전체 목록 보기</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Bento Box 2: AI Mentor Interactive Card (Col-Span 4) */}
        <div className="md:col-span-4 bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-extrabold text-sm sm:text-base text-slate-900">PROBIX AI 멘토</h2>
                  <p className="text-[10px] text-slate-400 font-medium">실시간 문제 구조화 솔버</p>
                </div>
              </div>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" title="온라인 연결됨" />
            </div>

            <div className="bg-gradient-to-b from-blue-50/80 to-indigo-50/50 rounded-2xl p-4 border border-blue-100 text-center space-y-3">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-xs mx-auto text-blue-600 text-xl font-black">
                ⚡
              </div>
              <h3 className="font-bold text-xs sm:text-sm text-slate-900">
                문제를 먼저 발견해 볼까요?
              </h3>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                "아이디어를 내기 전, 불편함의 상황을 6가지 질문으로 정의하는 것이 발명의 핵심입니다."
              </p>
              <button
                onClick={() => {
                  if (problems.length > 0) onStartAIMentor(problems[0]);
                }}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2.5 rounded-xl shadow-md shadow-blue-500/20 transition-all"
              >
                AI 마인드맵 분석 시작
              </button>
            </div>
          </div>

          <div className="mt-4 space-y-1.5 pt-3 border-t border-slate-100">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              실시간 마인드맵 분석 상태
            </span>
            <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-xl border border-slate-100">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
              <p className="text-[11px] text-slate-700 font-semibold truncate">
                '수행평가 주제 설정' 마인드맵 생성 중...
              </p>
            </div>
          </div>
        </div>

        {/* Bento Box 3: Dark Category Explorer Grid (Col-Span 7) */}
        <div className="md:col-span-7 bg-slate-900 text-white rounded-3xl p-5 sm:p-6 shadow-lg flex flex-col justify-between relative overflow-hidden">
          <div className="absolute right-0 bottom-0 translate-x-8 translate-y-8 w-48 h-48 bg-blue-500/20 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 mb-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base sm:text-lg font-extrabold flex items-center gap-2">
                <Compass className="w-5 h-5 text-blue-400" />
                <span>카테고리별 문제 탐색</span>
              </h3>
              <span className="text-xs text-slate-400">14개 분야</span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              관심 분야를 클릭하여 실시간으로 등록된 문제들을 확인해보세요.
            </p>
          </div>

          {/* Interactive Categories Grid */}
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 relative z-10 my-2">
            {categories.slice(0, 7).map((cat) => {
              const info = CATEGORY_INFO[cat];
              const IconComp = (Icons as Record<string, any>)[info.icon] || Icons.Folder;
              const isSelected = selectedCategory === cat;

              return (
                <div
                  key={cat}
                  onClick={() => {
                    setSelectedCategory(cat);
                    onNavigateToProblems();
                  }}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer flex flex-col items-center text-center gap-1.5 ${
                    isSelected
                      ? 'bg-blue-600 border-blue-400 text-white shadow-md'
                      : 'bg-white/10 hover:bg-white/20 border-white/10 text-slate-200'
                  }`}
                >
                  <IconComp className="w-5 h-5 text-blue-300" />
                  <span className="text-[11px] font-bold truncate max-w-full">{cat}</span>
                </div>
              );
            })}

            <div
              onClick={() => {
                setSelectedCategory('전체');
                onNavigateToProblems();
              }}
              className="p-3 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white border border-blue-400/30 transition-all cursor-pointer flex flex-col items-center justify-center text-center gap-1 shadow-sm"
            >
              <Layers className="w-5 h-5 text-amber-300" />
              <span className="text-[11px] font-bold">전체 보기</span>
            </div>
          </div>

          <div className="relative z-10 pt-2 text-[11px] text-slate-400 flex items-center justify-between border-t border-white/10">
            <span>자연과학, IT, 교육, 소상공인 등 다양한 문제 상주</span>
            <span className="font-semibold text-blue-300 cursor-pointer hover:underline" onClick={onNavigateToProblems}>
              탐색하기 →
            </span>
          </div>
        </div>

        {/* Bento Box 4: Popular Problem Ranking (Col-Span 5) */}
        <div className="md:col-span-5 bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-extrabold text-slate-900 text-base sm:text-lg flex items-center gap-2">
                <Flame className="w-5 h-5 text-rose-500 fill-rose-500" />
                <span>인기 문제 랭킹</span>
              </h3>
              <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                실시간
              </span>
            </div>

            <div className="space-y-2.5">
              {topRankings.map((prob, idx) => (
                <div
                  key={prob.id}
                  onClick={() => onStartAIMentor(prob)}
                  className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all cursor-pointer group"
                >
                  <span
                    className={`font-black italic text-sm w-6 text-center ${
                      idx === 0
                        ? 'text-blue-600 text-base'
                        : idx === 1
                        ? 'text-indigo-500'
                        : idx === 2
                        ? 'text-amber-500'
                        : 'text-slate-300'
                    }`}
                  >
                    0{idx + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-800 group-hover:text-blue-600 truncate transition-colors">
                      {prob.title}
                    </p>
                    <span className="text-[10px] text-slate-400 font-medium">
                      {prob.category} • ❤️ {prob.upvotes}
                    </span>
                  </div>
                  <span className="text-[10px] font-extrabold text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                    탐구 →
                  </span>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={onNavigateToProblems}
            className="mt-3 text-center text-xs font-bold text-blue-600 hover:text-blue-800 pt-2 border-t border-slate-100 block w-full"
          >
            랭킹 전체보기 →
          </button>
        </div>

        {/* Bento Box 5: Idea Generation CTA Banner (Col-Span 12) */}
        <div className="md:col-span-12 bg-gradient-to-r from-blue-600 via-indigo-600 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />

          <div className="space-y-2 text-center md:text-left relative z-10">
            <div className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-xs text-amber-300 border border-white/20 px-3 py-1 rounded-full text-xs font-bold">
              <Lightbulb className="w-3.5 h-3.5 fill-amber-300" />
              <span>Idea Generation Platform</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black leading-tight">
              발견된 문제를 분석하고 <br className="hidden sm:block" />
              나만의 발명·창업 아이디어로 연결해보세요.
            </h3>
            <p className="text-xs sm:text-sm text-blue-100 max-w-xl font-normal">
              AI 발명 멘토가 마인드맵 분석부터 참신성, 실현 가능성, 경제성을 검증하는 종합 리포트를 발급해드립니다.
            </p>
          </div>

          <div className="shrink-0 flex flex-col sm:flex-row items-center gap-3 relative z-10 w-full md:w-auto">
            <button
              onClick={() => {
                if (problems.length > 0) onStartAIMentor(problems[0]);
              }}
              className="w-full sm:w-auto bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs sm:text-sm px-6 py-3.5 rounded-2xl shadow-lg transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
            >
              <span>AI 발명 멘토 연결하기</span>
              <Sparkles className="w-4 h-4 fill-slate-950" />
            </button>
            <button
              onClick={onOpenRegisterModal}
              className="w-full sm:w-auto bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs sm:text-sm px-5 py-3.5 rounded-2xl transition-all text-center"
            >
              새 문제 직접 제안
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

