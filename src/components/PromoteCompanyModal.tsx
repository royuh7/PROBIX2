import React, { useState } from 'react';
import { UserProfile, PromotedCompany, CategoryType } from '../types';
import { CategoryBadge } from './CategoryBadge';
import {
  Megaphone,
  X,
  Coins,
  Clock,
  Sparkles,
  Building2,
  Globe,
  Lightbulb,
  CheckCircle2,
  AlertCircle,
  Zap,
  Flame,
  Crown
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  onPromoteCompany: (company: PromotedCompany) => void;
  onDeductPoints: (amount: number, reason: string) => boolean;
  onRewardPoints?: (amount: number, reason: string) => void;
}

const CATEGORIES: CategoryType[] = [
  '교육',
  'IT 및 콘텐츠',
  '환경',
  '안전',
  '의학 및 헬스케어',
  '생활 및 인테리어',
  '정치 / 경제 / 비즈니스',
  '자연과학',
  '인문',
  '식품',
  '반려동물',
  '뷰티 및 패션',
  '건설 및 제조',
  '물류',
  '문화',
  '재난',
  '학교폭력',
  '드론',
  '우주',
];

export const PromoteCompanyModal: React.FC<Props> = ({
  isOpen,
  onClose,
  userProfile,
  onPromoteCompany,
  onDeductPoints,
  onRewardPoints,
}) => {
  const [selectedIdeaId, setSelectedIdeaId] = useState<string>('');
  const [companyName, setCompanyName] = useState<string>('');
  const [tagline, setTagline] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [category, setCategory] = useState<CategoryType>('IT 및 콘텐츠');
  const [authorName, setAuthorName] = useState<string>(userProfile.name || '창업자');
  const [linkUrl, setLinkUrl] = useState<string>('');
  const [selectedTier, setSelectedTier] = useState<500 | 1000 | 2000>(1000);
  const [errorMessage, setErrorMessage] = useState<string>('');

  if (!isOpen) return null;

  // Handle auto-populating from selected idea
  const handleSelectIdea = (ideaId: string) => {
    setSelectedIdeaId(ideaId);
    if (!ideaId) return;

    const matched = userProfile.createdIdeas.find((i) => i.id === ideaId);
    if (matched) {
      setCompanyName(`${matched.title} Inc.`);
      setTagline(matched.expectedEffect || matched.title);
      setDescription(matched.description);
      setCategory(matched.category);
    }
  };

  const getDurationHours = (tier: 500 | 1000 | 2000): 6 | 12 | 24 => {
    if (tier === 500) return 6;
    if (tier === 1000) return 12;
    return 24;
  };

  const handleQuickAddPoints = () => {
    if (onRewardPoints) {
      onRewardPoints(500, '홍보 체험용 보너스 포인트 지급');
      setErrorMessage('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!companyName.trim()) {
      setErrorMessage('회사 또는 스타트업 이름을 입력해주세요.');
      return;
    }
    if (!tagline.trim()) {
      setErrorMessage('한 줄 홍보 슬로건을 입력해주세요.');
      return;
    }
    if (!description.trim()) {
      setErrorMessage('상세 사업 소개 내용을 입력해주세요.');
      return;
    }

    if (userProfile.points < selectedTier) {
      setErrorMessage(
        `포인트가 부족합니다. (필요: ${selectedTier} P / 현재: ${userProfile.points} P)`
      );
      return;
    }

    const durationHours = getDurationHours(selectedTier);
    const now = new Date();
    const expires = new Date(now.getTime() + durationHours * 3600 * 1000);

    const success = onDeductPoints(
      selectedTier,
      `[회사 홍보] ${companyName} (${durationHours}시간 홍보 등록)`
    );

    if (!success) {
      setErrorMessage('포인트 차감에 실패했습니다. 포인트를 확인해주세요.');
      return;
    }

    const selectedIdea = userProfile.createdIdeas.find((i) => i.id === selectedIdeaId);

    const newCompany: PromotedCompany = {
      id: `prom-${Date.now()}`,
      companyName: companyName.trim(),
      tagline: tagline.trim(),
      description: description.trim(),
      category,
      authorName: authorName.trim() || userProfile.name,
      linkUrl: linkUrl.trim() || undefined,
      durationHours,
      costPoints: selectedTier,
      promotedAt: now.toISOString(),
      expiresAt: expires.toISOString(),
      cheerCount: 1,
      ideaTitle: selectedIdea?.title,
    };

    onPromoteCompany(newCompany);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden my-auto animate-in fade-in zoom-in-95">
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-5 sm:p-6 relative overflow-hidden">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-400 to-orange-500 flex items-center justify-center shrink-0 shadow-md">
              <Megaphone className="w-5 h-5 text-slate-950 fill-slate-950" />
            </div>
            <div>
              <span className="bg-amber-400/20 text-amber-300 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border border-amber-400/30">
                아이디어 창업 기업 홍보 센터
              </span>
              <h2 className="text-lg sm:text-xl font-black text-white mt-0.5">
                내 창업 회사 홍보하기
              </h2>
            </div>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed max-w-lg">
            탐구 및 AI 멘토링으로 구상한 나만의 아이디어를 회사로 홍보하세요!
            포인트를 사용하면 전체 사용자 메인 화면과 홍보관에 실시간 노출됩니다.
          </p>

          {/* Current Points Badge */}
          <div className="mt-4 inline-flex items-center gap-2 bg-white/10 border border-white/20 px-3.5 py-1.5 rounded-xl">
            <Coins className="w-4 h-4 text-amber-300 fill-amber-300" />
            <span className="text-xs font-bold text-slate-200">현재 보유 포인트:</span>
            <span className="text-sm font-black text-amber-300">{userProfile.points} P</span>
            {userProfile.points < 500 && onRewardPoints && (
              <button
                type="button"
                onClick={handleQuickAddPoints}
                className="ml-2 text-[10px] font-extrabold bg-amber-400 text-slate-950 px-2 py-0.5 rounded-md hover:bg-amber-300 transition-colors"
              >
                +500P 충전받기 (테스트)
              </button>
            )}
          </div>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-5">
          {errorMessage && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl text-xs flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{errorMessage}</span>
              </div>
              {userProfile.points < selectedTier && onRewardPoints && (
                <button
                  type="button"
                  onClick={handleQuickAddPoints}
                  className="bg-rose-600 text-white font-bold text-[11px] px-2.5 py-1 rounded-lg shrink-0 hover:bg-rose-700"
                >
                  +500P 받기
                </button>
              )}
            </div>
          )}

          {/* 1. Point Pricing Plan Tier Selection */}
          <div className="space-y-2">
            <label className="text-xs font-extrabold text-slate-800 flex items-center gap-1.5">
              <Coins className="w-4 h-4 text-amber-500" />
              <span>홍보 기간 및 포인트 요금선택</span>
              <span className="text-rose-500">*</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Option 1: 500 P -> 6 Hours */}
              <div
                onClick={() => setSelectedTier(500)}
                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer relative flex flex-col justify-between ${
                  selectedTier === 500
                    ? 'border-blue-600 bg-blue-50/80 shadow-md'
                    : 'border-slate-200 bg-slate-50/50 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-md flex items-center gap-1">
                    <Zap className="w-3 h-3 text-blue-600" />
                    스피드 홍보
                  </span>
                  <Clock className="w-4 h-4 text-slate-400" />
                </div>
                <div>
                  <div className="text-base font-black text-slate-900">6시간 홍보</div>
                  <p className="text-[11px] text-slate-500 mt-0.5">단기 집중 노출</p>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-200/80 flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-medium">사용 포인트</span>
                  <span className="text-sm font-extrabold text-blue-600">500 P</span>
                </div>
              </div>

              {/* Option 2: 1000 P -> 12 Hours */}
              <div
                onClick={() => setSelectedTier(1000)}
                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer relative flex flex-col justify-between ${
                  selectedTier === 1000
                    ? 'border-indigo-600 bg-indigo-50/80 shadow-md'
                    : 'border-slate-200 bg-slate-50/50 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-extrabold bg-indigo-100 text-indigo-900 px-2 py-0.5 rounded-md flex items-center gap-1">
                    <Flame className="w-3 h-3 text-indigo-600" />
                    인기 추천
                  </span>
                  <Clock className="w-4 h-4 text-slate-400" />
                </div>
                <div>
                  <div className="text-base font-black text-slate-900">12시간 홍보</div>
                  <p className="text-[11px] text-slate-500 mt-0.5">반나절 메인 상단 노출</p>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-200/80 flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-medium">사용 포인트</span>
                  <span className="text-sm font-extrabold text-indigo-600">1000 P</span>
                </div>
              </div>

              {/* Option 3: 2000 P -> 24 Hours (하루) */}
              <div
                onClick={() => setSelectedTier(2000)}
                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer relative flex flex-col justify-between ${
                  selectedTier === 2000
                    ? 'border-amber-500 bg-amber-50/80 shadow-md'
                    : 'border-slate-200 bg-slate-50/50 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-black bg-amber-200 text-amber-950 px-2 py-0.5 rounded-md flex items-center gap-1">
                    <Crown className="w-3 h-3 text-amber-600 fill-amber-600" />
                    하루 프리미엄
                  </span>
                  <Clock className="w-4 h-4 text-slate-400" />
                </div>
                <div>
                  <div className="text-base font-black text-slate-900">하루 (24시간) 홍보</div>
                  <p className="text-[11px] text-slate-500 mt-0.5">24시간 연속 최대 노출</p>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-200/80 flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-medium">사용 포인트</span>
                  <span className="text-sm font-extrabold text-amber-700">2000 P</span>
                </div>
              </div>
            </div>
          </div>

          {/* Optional: Load from user's created ideas */}
          {userProfile.createdIdeas.length > 0 && (
            <div className="space-y-1.5 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                내 아이디어 불러오기 (선택)
              </label>
              <select
                value={selectedIdeaId}
                onChange={(e) => handleSelectIdea(e.target.value)}
                className="w-full text-xs font-semibold p-2.5 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">직접 정보 입력하기</option>
                {userProfile.createdIdeas.map((idea) => (
                  <option key={idea.id} value={idea.id}>
                    [{idea.category}] {idea.title}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* 2. Company Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-slate-500" />
                회사 / 스타트업 이름 <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="예: 에코패킹 (EcoPacking)"
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">
                카테고리 선택 <span className="text-rose-500">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as CategoryType)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">
              한 줄 홍보 슬로건 <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="예: 100% 친환경 바이오 생분해성 포장 박스 솔루션"
              className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">
              상세 사업 소개 및 홍보 내용 <span className="text-rose-500">*</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="창업 서비스나 제품의 핵심 가치, 해결하고자 하는 문제, 주요 특징 등을 사용들에게 자유롭게 소개해 주세요."
              className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 leading-relaxed"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">창업자 / 대표 이름</label>
              <input
                type="text"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="대표자명"
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                <Globe className="w-3.5 h-3.5 text-slate-500" />
                웹사이트 / 랜딩페이지 URL (선택)
              </label>
              <input
                type="text"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="https://mycompany.com"
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Deduction Summary & Action Button */}
          <div className="pt-3 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="text-xs text-slate-600">
              <span>차감 포인트: </span>
              <strong className="text-rose-600 font-black">{selectedTier} P</strong>
              <span className="text-slate-400 ml-1.5">
                (등록 후 즉시 메인 화면에 {getDurationHours(selectedTier)}시간 홍보 시작)
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors"
              >
                취소
              </button>
              <button
                type="submit"
                disabled={userProfile.points < selectedTier}
                className={`py-2.5 px-5 rounded-xl text-xs font-extrabold text-white flex items-center justify-center gap-1.5 shadow-md transition-all ${
                  userProfile.points >= selectedTier
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-blue-500/20 active:scale-[0.98]'
                    : 'bg-slate-300 cursor-not-allowed'
                }`}
              >
                <Megaphone className="w-4 h-4 fill-current" />
                <span>{selectedTier}P로 홍보 시작하기</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
