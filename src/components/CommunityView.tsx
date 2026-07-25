import React from 'react';
import { Problem, Idea, PromotedCompany } from '../types';
import { ProblemCard } from './ProblemCard';
import { CategoryBadge } from './CategoryBadge';
import { PromotedCompanyShowcase } from './PromotedCompanyShowcase';
import { Users, Flame, Lightbulb, Clock, Award, ArrowRight, Heart } from 'lucide-react';

interface Props {
  problems: Problem[];
  createdIdeas: Idea[];
  onUpvote: (id: string) => void;
  onToggleSave: (id: string) => void;
  onStartAIMentor: (problem: Problem) => void;
  savedProblemIds: string[];
  promotions: PromotedCompany[];
  onOpenPromoteModal: () => void;
  onCheerCompany?: (companyId: string) => void;
}

export const CommunityView: React.FC<Props> = ({
  problems,
  createdIdeas,
  onUpvote,
  onToggleSave,
  onStartAIMentor,
  savedProblemIds,
  promotions,
  onOpenPromoteModal,
  onCheerCompany,
}) => {
  // Weekly Popular Problems
  const popularProblems = [...problems].sort((a, b) => b.upvotes - a.upvotes).slice(0, 3);

  // Recent Problems
  const recentProblems = [...problems].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 3);

  // Top Contributors Sample Data
  const topInventors = [
    { rank: 1, name: '이하은 (고2 발명반)', points: 1450, level: 'Level 5 마스터', solved: 14, avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80' },
    { rank: 2, name: '김민성 (대학 창업 동아리)', points: 1120, level: 'Level 4 솔버', solved: 11, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80' },
    { rank: 3, name: '박서연 (중3 탐구왕)', points: 980, level: 'Level 4 솔버', solved: 9, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80' },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-8">
      {/* Community Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-2 text-center sm:text-left">
          <span className="text-xs font-bold bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full border border-blue-400/30">
            PROBIX 커뮤니티
          </span>
          <h1 className="text-xl sm:text-3xl font-extrabold">
            함께 문제를 발견하고 세상을 바꿉니다.
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-lg">
            다른 학생들이 어떤 불편을 느끼고 있는지 둘러보고, 인기 있는 아이디어와 랭킹 리더보드를 확인해보세요!
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/20 text-center">
            <span className="text-xs text-slate-300 block font-semibold">등록된 문제</span>
            <span className="text-xl font-extrabold text-blue-300">{problems.length}개</span>
          </div>
          <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/20 text-center">
            <span className="text-xs text-slate-300 block font-semibold">생성된 아이디어</span>
            <span className="text-xl font-extrabold text-amber-300">{createdIdeas.length + 28}개</span>
          </div>
        </div>
      </div>

      {/* Promoted Companies Showcase */}
      <PromotedCompanyShowcase
        promotions={promotions}
        onOpenPromoteModal={onOpenPromoteModal}
        onCheerCompany={onCheerCompany}
      />

      {/* 1. 이번 주 인기 문제 */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <Flame className="w-5 h-5 text-rose-500 fill-rose-500" />
            이번 주 인기 문제 Top 3
          </h2>
          <span className="text-xs text-slate-500">실시간 공감수 기준</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {popularProblems.map((prob) => (
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
      </section>

      {/* 2. 가장 많이 생성된 아이디어 & 대표 발명 사례 */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-amber-500 fill-amber-500" />
            가장 많이 생성된 대표 솔루션
          </h2>
          <span className="text-xs text-slate-500">AI 검증 인기 모델</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 hover:border-blue-400 transition-all">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-blue-600 bg-blue-100 px-2.5 py-0.5 rounded-md">
                교육 카테고리
              </span>
              <span className="text-xs text-slate-500 font-semibold">124회 생성됨</span>
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-1">
              AI 기반 수행평가 탐구주제 3초 추천 및 로드맵 가이드
            </h3>
            <p className="text-xs text-slate-600 mb-3">
              학생 개개인의 과목별 흥미 키워드를 조합하여 독창적인 수행평가 및 탐구 보고서 목차와 실험 설계 가이드를 자동으로 제공합니다.
            </p>
            <div className="text-[11px] text-slate-500 font-semibold bg-white p-2.5 rounded-xl border border-slate-200">
              💡 기대 효과: 주제 탐색 시간 80% 감소 및 학습 불안감 해소
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 hover:border-blue-400 transition-all">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-cyan-600 bg-cyan-100 px-2.5 py-0.5 rounded-md">
                자연과학 카테고리
              </span>
              <span className="text-xs text-slate-500 font-semibold">98회 생성됨</span>
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-1">
              스마트 접이식 착륙 다리가 적용된 험지 전용 드론
            </h3>
            <p className="text-xs text-slate-600 mb-3">
              지형의 기울기를 초음파 센서로 즉시 측정하여 드론 착륙 다리의 수평을 실시간 자동 맞춤 조절하는 기계 가변 메커니즘입니다.
            </p>
            <div className="text-[11px] text-slate-500 font-semibold bg-white p-2.5 rounded-xl border border-slate-200">
              💡 기대 효과: 산악/경사지 착륙 전복사고율 0% 달성
            </div>
          </div>
        </div>
      </section>

      {/* 3. 최근 등록된 문제 & 4. 인기 사용자 랭킹 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 최근 등록된 문제 (2 columns) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600" />
              최근 등록된 신규 문제
            </h2>
          </div>

          <div className="space-y-3">
            {recentProblems.map((p) => (
              <div
                key={p.id}
                className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center justify-between gap-3 hover:shadow-xs transition-all"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <CategoryBadge category={p.category} size="sm" />
                    <span className="text-[11px] text-slate-400 font-medium">{p.createdAt}</span>
                  </div>
                  <h3 className="font-bold text-sm text-slate-900 line-clamp-1">{p.title}</h3>
                </div>

                <button
                  onClick={() => onStartAIMentor(p)}
                  className="shrink-0 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white px-3 py-1.5 rounded-xl text-xs font-bold transition-all"
                >
                  탐구하기 →
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* 인기 사용자 (Top Contributor Leaderboard) (1 column) */}
        <div className="space-y-4">
          <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500" />
            인기 문제 해결사 랭킹
          </h2>

          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
            {topInventors.map((inv) => (
              <div
                key={inv.rank}
                className="flex items-center justify-between bg-white p-3 rounded-xl border border-slate-200/80"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black shrink-0 ${
                      inv.rank === 1
                        ? 'bg-amber-400 text-amber-950'
                        : inv.rank === 2
                        ? 'bg-slate-300 text-slate-900'
                        : 'bg-amber-700 text-amber-50'
                    }`}
                  >
                    {inv.rank}
                  </span>
                  <img
                    src={inv.avatar}
                    alt={inv.name}
                    className="w-9 h-9 rounded-xl object-cover border border-slate-200 shrink-0"
                  />
                  <div>
                    <h4 className="font-bold text-xs text-slate-900">{inv.name}</h4>
                    <span className="text-[10px] text-blue-600 font-semibold">{inv.level}</span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-xs font-bold text-amber-600 block">🪙 {inv.points} P</span>
                  <span className="text-[10px] text-slate-400 font-medium">{inv.solved}개 해결</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
