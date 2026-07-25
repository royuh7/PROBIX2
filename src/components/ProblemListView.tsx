import React, { useState } from 'react';
import { CategoryType, Problem } from '../types';
import { CATEGORY_INFO } from '../data/sampleProblems';
import { CategoryBadge } from './CategoryBadge';
import { ProblemCard } from './ProblemCard';
import { Search, Filter, Plus, Flame, Sparkles, AlertCircle, Hash } from 'lucide-react';

interface Props {
  problems: Problem[];
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategory: CategoryType | '전체';
  setSelectedCategory: (c: CategoryType | '전체') => void;
  onUpvote: (id: string) => void;
  onToggleSave: (id: string) => void;
  onStartAIMentor: (problem: Problem) => void;
  onOpenRegisterModal: () => void;
  savedProblemIds: string[];
}

export const ProblemListView: React.FC<Props> = ({
  problems,
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  onUpvote,
  onToggleSave,
  onStartAIMentor,
  onOpenRegisterModal,
  savedProblemIds,
}) => {
  const categories = Object.keys(CATEGORY_INFO) as CategoryType[];
  const [sortBy, setSortBy] = useState<'popular' | 'recent' | 'severity'>('popular');

  const popularHashtags = [
    '#교육', '#환경', '#의료', '#재난', '#AI', '#발명', '#드론',
    '#학교폭력', '#교통', '#우주', '#수학', '#과학', '#물리', '#화학', '#생물', '#지구'
  ];

  // Enhanced search filter matching tags, title, description, category
  const filteredProblems = problems.filter((p) => {
    const matchesCategory = selectedCategory === '전체' || p.category === selectedCategory;
    const q = searchQuery.toLowerCase().trim();
    if (!q) return matchesCategory;

    const matchesTitle = p.title.toLowerCase().includes(q);
    const matchesDesc = p.description.toLowerCase().includes(q);
    const matchesCategoryName = p.category.toLowerCase().includes(q);
    const matchesTags = p.tags?.some((t) => t.toLowerCase().includes(q)) ?? false;

    return matchesCategory && (matchesTitle || matchesDesc || matchesCategoryName || matchesTags);
  });

  // Sorted logic
  const sortedProblems = [...filteredProblems].sort((a, b) => {
    if (sortBy === 'popular') return b.upvotes - a.upvotes;
    if (sortBy === 'severity') return b.severity - a.severity;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
      {/* Header Title & Subtitle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-blue-600" />
            문제 발견 모음 ({filteredProblems.length}개)
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            발명대회, 창업, 프로젝트의 아이디어가 되는 실생활 불편 목록입니다.
          </p>
        </div>

        <button
          onClick={onOpenRegisterModal}
          className="self-start sm:self-auto bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold px-4 py-2.5 rounded-xl shadow-sm transition-all flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>문제 직접 등록</span>
        </button>
      </div>

      {/* Search & Sort Bar */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="검색어나 #해시태그를 입력하세요 (예: #드론, #교육, #환경, #AI)..."
              className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          {/* Sort Select Buttons */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold w-full sm:w-auto shrink-0">
            <button
              onClick={() => setSortBy('popular')}
              className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-lg transition-all ${
                sortBy === 'popular'
                  ? 'bg-white text-blue-600 font-bold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🔥 공감순
            </button>
            <button
              onClick={() => setSortBy('recent')}
              className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-lg transition-all ${
                sortBy === 'recent'
                  ? 'bg-white text-blue-600 font-bold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              ✨ 최근순
            </button>
            <button
              onClick={() => setSortBy('severity')}
              className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-lg transition-all ${
                sortBy === 'severity'
                  ? 'bg-white text-blue-600 font-bold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              ⚠️ 심각도순
            </button>
          </div>
        </div>

        {/* Tag Filter Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
          <span className="text-slate-400 font-bold text-[11px] shrink-0 flex items-center gap-1">
            <Hash className="w-3.5 h-3.5 text-blue-600" />
            태그 필터:
          </span>
          {popularHashtags.map((tag) => {
            const cleanTag = tag.replace(/^#/, '');
            const isActive = searchQuery.toLowerCase().trim() === cleanTag.toLowerCase();
            return (
              <button
                key={tag}
                onClick={() => setSearchQuery(isActive ? '' : cleanTag)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all shrink-0 ${
                  isActive
                    ? 'bg-blue-600 text-white font-bold shadow-xs'
                    : 'bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200/60'
                }`}
              >
                {cleanTag}
              </button>
            );
          })}
        </div>
      </div>

      {/* Category Pills Filter Horizontal Scroll */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setSelectedCategory('전체')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 ${
            selectedCategory === '전체'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          전체 보기
        </button>
        {categories.map((cat) => (
          <CategoryBadge
            key={cat}
            category={cat}
            size="sm"
            active={selectedCategory === cat}
            onClick={() => setSelectedCategory(cat)}
          />
        ))}
      </div>

      {/* Problem Cards Grid */}
      {sortedProblems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedProblems.map((prob) => (
            <ProblemCard
              key={prob.id}
              problem={prob}
              onUpvote={onUpvote}
              onToggleSave={onToggleSave}
              onStartAIMentor={onStartAIMentor}
              isSaved={savedProblemIds.includes(prob.id)}
            />
          ))}
        </div>
      ) : (
        <div className="bg-slate-50 border border-slate-200 rounded-3xl p-10 text-center max-w-md mx-auto space-y-3">
          <AlertCircle className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="font-bold text-slate-800 text-base">검색된 문제가 없습니다.</h3>
          <p className="text-xs text-slate-500">
            검색어를 변경하시거나, 새로운 문제 상황을 직접 등록하여 AI와 탐구해보세요!
          </p>
          <button
            onClick={onOpenRegisterModal}
            className="bg-blue-600 text-white text-xs font-bold px-4 py-2 rounded-xl hover:bg-blue-700 transition-colors inline-block mt-2"
          >
            새 문제 직접 등록하기
          </button>
        </div>
      )}
    </div>
  );
};
