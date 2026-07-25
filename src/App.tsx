import React, { useState, useEffect } from 'react';
import { CategoryType, Problem, Idea, IdeaEvaluation, UserProfile, Badge, PromotedCompany } from './types';
import { INITIAL_PROBLEMS, INITIAL_BADGES } from './data/sampleProblems';
import { INITIAL_PROMOTIONS } from './data/samplePromotions';
import { Header } from './components/Header';
import { MobileNav } from './components/MobileNav';
import { HomeView } from './components/HomeView';
import { ProblemListView } from './components/ProblemListView';
import { AIMentorFlow } from './components/AIMentorFlow';
import { CommunityView } from './components/CommunityView';
import { MyPageView } from './components/MyPageView';
import { ProblemRegisterModal } from './components/ProblemRegisterModal';
import { SubscriptionModal } from './components/SubscriptionModal';
import { PromoteCompanyModal } from './components/PromoteCompanyModal';

function deduplicateProblems(problemList: Problem[]): Problem[] {
  const seenIds = new Set<string>();
  const seenTitles = new Set<string>();
  const cleanList: Problem[] = [];

  for (const p of problemList) {
    if (!p || !p.id || !p.title) continue;
    const normTitle = p.title.replace(/[^가-힣a-zA-Z0-9]/g, '').toLowerCase();

    if (seenIds.has(p.id) || seenTitles.has(normTitle)) {
      continue;
    }

    seenIds.add(p.id);
    seenTitles.add(normTitle);
    cleanList.push(p);
  }

  return cleanList;
}

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'problems' | 'community' | 'mypage'>('home');
  const [activeMentorProblem, setActiveMentorProblem] = useState<Problem | null>(null);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState<boolean>(false);
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState<boolean>(false);
  const [isPromoteModalOpen, setIsPromoteModalOpen] = useState<boolean>(false);

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | '전체'>('전체');

  // Load promoted companies from localStorage or initial
  const [promotedCompanies, setPromotedCompanies] = useState<PromotedCompany[]>(() => {
    try {
      const saved = localStorage.getItem('probix_promoted_companies');
      if (saved) {
        const parsed: PromotedCompany[] = JSON.parse(saved);
        if (parsed.length > 0) return parsed;
      }
    } catch {}
    return INITIAL_PROMOTIONS;
  });

  // Load problems from localStorage or initial
  const [problems, setProblems] = useState<Problem[]>(() => {
    try {
      const saved = localStorage.getItem('probix_problems');
      const initialMap = new Map(INITIAL_PROBLEMS.map((p) => [p.id, p]));

      if (saved) {
        const parsed: Problem[] = JSON.parse(saved);
        const updatedParsed = parsed.map((p) => {
          const initialMatch = initialMap.get(p.id);
          if (initialMatch) {
            return {
              ...initialMatch,
              upvotes: p.upvotes ?? initialMatch.upvotes,
              isSaved: p.isSaved ?? initialMatch.isSaved,
              severity: initialMatch.severity,
            };
          }
          let sev = p.severity;
          if (sev <= 5) {
            sev = Math.min(100, Math.max(20, sev * 20));
          }
          return { ...p, severity: sev };
        });

        const existingIds = new Set(updatedParsed.map((p) => p.id));
        const missingInitial = INITIAL_PROBLEMS.filter((ip) => !existingIds.has(ip.id));
        const finalProblems = deduplicateProblems([...updatedParsed, ...missingInitial]);
        localStorage.setItem('probix_problems', JSON.stringify(finalProblems));
        return finalProblems;
      }
      return deduplicateProblems(INITIAL_PROBLEMS);
    } catch {
      return deduplicateProblems(INITIAL_PROBLEMS);
    }
  });

  // User Profile state
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem('probix_user_profile');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.name === '김발명') {
          parsed.name = '김트비';
        }
        return parsed;
      }
    } catch {}

    return {
      name: '김트비',
      email: 'student@school.ed.kr',
      level: 3,
      levelTitle: '프로블럼 솔버',
      points: 100,
      isProMember: false,
      savedProblemIds: ['p-edu-1', 'p-sci-3', 'p-it-1'],
      createdIdeas: [],
      evaluations: [],
      badges: INITIAL_BADGES,
      frequentCategories: [
        { category: '교육', count: 12 },
        { category: 'IT 및 콘텐츠', count: 8 },
        { category: '자연과학', count: 6 },
        { category: '환경', count: 5 },
      ],
      pointHistory: [
        { id: 'ph-1', reason: '회원가입 환영 가입 포인트', amount: 100, date: '2026-07-24' },
      ],
    };
  });

  const handleUpdateProfile = (updatedFields: Partial<UserProfile>) => {
    setUserProfile((prev) => ({
      ...prev,
      ...updatedFields,
    }));
  };

  useEffect(() => {
    try {
      localStorage.setItem('probix_problems', JSON.stringify(problems));
    } catch {}
  }, [problems]);

  useEffect(() => {
    try {
      localStorage.setItem('probix_user_profile', JSON.stringify(userProfile));
    } catch {}
  }, [userProfile]);

  useEffect(() => {
    try {
      localStorage.setItem('probix_promoted_companies', JSON.stringify(promotedCompanies));
    } catch {}
  }, [promotedCompanies]);

  // Handlers
  const handleUpvote = (id: string) => {
    setProblems((prev) =>
      prev.map((p) => (p.id === id ? { ...p, upvotes: p.upvotes + 1 } : p))
    );
  };

  const handleSpendPoints = (amount: number, reason: string): boolean => {
    if (userProfile.points < amount) return false;
    setUserProfile((prev) => ({
      ...prev,
      points: prev.points - amount,
      pointHistory: [
        {
          id: `ph-${Date.now()}`,
          reason,
          amount: -amount,
          date: new Date().toISOString().split('T')[0],
        },
        ...prev.pointHistory,
      ],
    }));
    return true;
  };

  const handlePromoteCompany = (newCompany: PromotedCompany) => {
    setPromotedCompanies((prev) => [newCompany, ...prev]);
  };

  const handleCheerCompany = (companyId: string) => {
    setPromotedCompanies((prev) =>
      prev.map((c) => (c.id === companyId ? { ...c, cheerCount: c.cheerCount + 1 } : c))
    );
  };

  const handleToggleSaveProblem = (id: string) => {
    setUserProfile((prev) => {
      const isAlreadySaved = prev.savedProblemIds.includes(id);
      const newSaved = isAlreadySaved
        ? prev.savedProblemIds.filter((pid) => pid !== id)
        : [...prev.savedProblemIds, id];
      return { ...prev, savedProblemIds: newSaved };
    });
  };

  const handleRegisterProblem = (newProblem: Problem) => {
    setProblems((prev) => deduplicateProblems([newProblem, ...prev]));
    // Also track frequent category
    setUserProfile((prev) => {
      const updatedFreq = prev.frequentCategories.map((fc) =>
        fc.category === newProblem.category ? { ...fc, count: fc.count + 1 } : fc
      );
      if (!updatedFreq.some((fc) => fc.category === newProblem.category)) {
        updatedFreq.push({ category: newProblem.category, count: 1 });
      }
      return { ...prev, frequentCategories: updatedFreq };
    });
  };

  const handleStartAIMentor = (problem: Problem) => {
    setActiveMentorProblem(problem);
    // Track category view count
    setUserProfile((prev) => {
      const updatedFreq = prev.frequentCategories.map((fc) =>
        fc.category === problem.category ? { ...fc, count: fc.count + 1 } : fc
      );
      return { ...prev, frequentCategories: updatedFreq };
    });
  };

  const handleRewardPoints = (amount: number, reason: string) => {
    setUserProfile((prev) => ({
      ...prev,
      points: prev.points + amount,
      pointHistory: [
        {
          id: `ph-${Date.now()}`,
          reason,
          amount,
          date: new Date().toISOString().split('T')[0],
        },
        ...prev.pointHistory,
      ],
    }));
  };

  const handleSaveIdea = (idea: Idea) => {
    setUserProfile((prev) => ({
      ...prev,
      createdIdeas: [idea, ...prev.createdIdeas],
    }));
  };

  const handleSaveEvaluation = (evalData: IdeaEvaluation) => {
    setUserProfile((prev) => ({
      ...prev,
      evaluations: [evalData, ...prev.evaluations],
    }));
  };

  const handleUnlockBadge = (badgeId: string) => {
    setUserProfile((prev) => ({
      ...prev,
      badges: prev.badges.map((b) =>
        b.id === badgeId && !b.unlocked
          ? { ...b, unlocked: true, unlockedAt: new Date().toISOString().split('T')[0] }
          : b
      ),
    }));
  };

  const handleSubscribePro = () => {
    setUserProfile((prev) => ({
      ...prev,
      isProMember: true,
    }));
    setIsSubscriptionModalOpen(false);
  };

  const [pendingTab, setPendingTab] = useState<'home' | 'problems' | 'community' | 'mypage' | null>(null);

  const handleTabChange = (targetTab: 'home' | 'problems' | 'community' | 'mypage') => {
    if (activeMentorProblem) {
      setPendingTab(targetTab);
    } else {
      setActiveTab(targetTab);
    }
  };

  const confirmTabExit = () => {
    if (pendingTab) {
      setActiveTab(pendingTab);
      setActiveMentorProblem(null);
      setPendingTab(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 font-sans pb-20 md:pb-12 antialiased selection:bg-blue-200">
      {/* Exit Confirmation Modal for Header / MobileNav Navigation */}
      {pendingTab && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-slate-200 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-3 text-amber-600">
              <div className="w-10 h-10 rounded-2xl bg-amber-100 flex items-center justify-center shrink-0">
                <span className="text-xl">⚠️</span>
              </div>
              <div>
                <h3 className="font-extrabold text-base text-slate-900">정말 나가시겠습니까?</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  진행 중인 AI 탐구 및 마인드맵 분석 내용이 저장되지 않고 초기화될 수 있습니다.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setPendingTab(null)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors"
              >
                취소 (이어서 진행)
              </button>
              <button
                onClick={confirmTabExit}
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
              >
                예 (페이지 나가기)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        points={userProfile.points}
        isProMember={userProfile.isProMember}
        onOpenRegisterModal={() => setIsRegisterModalOpen(true)}
        onOpenSubscribeModal={() => setIsSubscriptionModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="py-2">
        {activeMentorProblem ? (
          <AIMentorFlow
            problem={activeMentorProblem}
            onBack={() => setActiveMentorProblem(null)}
            onRewardPoints={handleRewardPoints}
            onSaveIdea={handleSaveIdea}
            onSaveEvaluation={handleSaveEvaluation}
            onUnlockBadge={handleUnlockBadge}
          />
        ) : activeTab === 'home' ? (
          <HomeView
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            problems={problems}
            onUpvote={handleUpvote}
            onToggleSave={handleToggleSaveProblem}
            onStartAIMentor={handleStartAIMentor}
            onOpenRegisterModal={() => setIsRegisterModalOpen(true)}
            onNavigateToProblems={() => setActiveTab('problems')}
            onOpenSubscribeModal={() => setIsSubscriptionModalOpen(true)}
            savedProblemIds={userProfile.savedProblemIds}
            isProMember={userProfile.isProMember}
            promotions={promotedCompanies}
            onOpenPromoteModal={() => setIsPromoteModalOpen(true)}
            onCheerCompany={handleCheerCompany}
          />
        ) : activeTab === 'problems' ? (
          <ProblemListView
            problems={problems}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            onUpvote={handleUpvote}
            onToggleSave={handleToggleSaveProblem}
            onStartAIMentor={handleStartAIMentor}
            onOpenRegisterModal={() => setIsRegisterModalOpen(true)}
            savedProblemIds={userProfile.savedProblemIds}
          />
        ) : activeTab === 'community' ? (
          <CommunityView
            problems={problems}
            createdIdeas={userProfile.createdIdeas}
            onUpvote={handleUpvote}
            onToggleSave={handleToggleSaveProblem}
            onStartAIMentor={handleStartAIMentor}
            savedProblemIds={userProfile.savedProblemIds}
            promotions={promotedCompanies}
            onOpenPromoteModal={() => setIsPromoteModalOpen(true)}
            onCheerCompany={handleCheerCompany}
          />
        ) : (
          <MyPageView
            userProfile={userProfile}
            problems={problems}
            onUpvote={handleUpvote}
            onToggleSave={handleToggleSaveProblem}
            onStartAIMentor={handleStartAIMentor}
            onOpenSubscribeModal={() => setIsSubscriptionModalOpen(true)}
            promotions={promotedCompanies}
            onOpenPromoteModal={() => setIsPromoteModalOpen(true)}
            onCheerCompany={handleCheerCompany}
            onUpdateProfile={handleUpdateProfile}
          />
        )}
      </main>

      {/* Problem Register Modal */}
      <ProblemRegisterModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        onRegister={handleRegisterProblem}
      />

      {/* Subscription Modal */}
      <SubscriptionModal
        isOpen={isSubscriptionModalOpen}
        onClose={() => setIsSubscriptionModalOpen(false)}
        onSubscribe={handleSubscribePro}
        isProMember={userProfile.isProMember}
      />

      {/* Startup Point Promotion Modal */}
      <PromoteCompanyModal
        isOpen={isPromoteModalOpen}
        onClose={() => setIsPromoteModalOpen(false)}
        userProfile={userProfile}
        onPromoteCompany={handlePromoteCompany}
        onDeductPoints={handleSpendPoints}
        onRewardPoints={handleRewardPoints}
      />

      {/* Bottom Sticky Mobile Navigation */}
      <MobileNav
        activeTab={activeTab}
        setActiveTab={handleTabChange}
      />
    </div>
  );
}
