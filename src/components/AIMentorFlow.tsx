import React, { useState } from 'react';
import { Problem, QuestionAnswers, MindmapData, Idea, IdeaEvaluation, CoFounder, ChatMessage, BenchmarkCitation } from '../types';
import { getRandomCofounder } from '../data/sampleCofounders';
import { CategoryBadge } from './CategoryBadge';
import { MindmapRadial } from './MindmapRadial';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Bot,
  Lightbulb,
  Users,
  Send,
  CheckCircle2,
  TrendingUp,
  RotateCcw,
  Zap,
  AlertTriangle,
  X,
  FileText,
  UserX,
  UserCheck,
  Star,
  Building2,
  MessageSquare
} from 'lucide-react';

// Star rating mapping helper function (Requirement 1):
// 91~100 : 5/5, 81~90 : 4/5, 71~80 : 3/5, 51~70 : 2/5, 0~50 : 1/5
export function getStarRating(score: number) {
  if (score >= 91) return { stars: '⭐⭐⭐⭐⭐', text: '5 / 5', count: 5 };
  if (score >= 81) return { stars: '⭐⭐⭐⭐☆', text: '4 / 5', count: 4 };
  if (score >= 71) return { stars: '⭐⭐⭐☆☆', text: '3 / 5', count: 3 };
  if (score >= 51) return { stars: '⭐⭐☆☆☆', text: '2 / 5', count: 2 };
  return { stars: '⭐☆☆☆☆', text: '1 / 5', count: 1 };
}

interface Props {
  problem: Problem;
  onBack: () => void;
  onRewardPoints: (amount: number, reason: string) => void;
  onSaveIdea: (idea: Idea) => void;
  onSaveEvaluation: (evalData: IdeaEvaluation) => void;
  onUnlockBadge: (badgeId: string) => void;
}

export const AIMentorFlow: React.FC<Props> = ({
  problem,
  onBack,
  onRewardPoints,
  onSaveIdea,
  onSaveEvaluation,
  onUnlockBadge,
}) => {
  // Step State: 1 = Interview Form (6 Questions), 2 = Radial Mindmap, 3 = Ideas, 4 = Evaluation, 5 = CoFounder
  const [step, setStep] = useState<number>(1);

  // Exit Confirmation Modal state (Requirement 6)
  const [showExitModal, setShowExitModal] = useState<boolean>(false);

  // Question Answers State (Requirement 1: 6 Questions)
  const [answers, setAnswers] = useState<QuestionAnswers>({
    q1_interest: problem.title,
    q2_target: '',
    q3_context: problem.frequency || '',
    q4_currentSolution: '',
    q5_idealResult: '',
    q6_impact: '',
  });

  // Flow State
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [mindmapData, setMindmapData] = useState<MindmapData | null>(null);
  const [generatedIdeas, setGeneratedIdeas] = useState<Idea[]>([]);
  const [selectedIdea, setSelectedIdea] = useState<Idea | null>(null);
  const [evaluation, setEvaluation] = useState<IdeaEvaluation | null>(null);
  const [pointsAwarded, setPointsAwarded] = useState<boolean>(false);

  // CoFounder State
  const [cofounderProposed, setCofounderProposed] = useState<CoFounder | null>(null);
  const [cofounderAccepted, setCofounderAccepted] = useState<boolean | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [userChatInput, setUserChatInput] = useState<string>('');
  const [isSendingChat, setIsSendingChat] = useState<boolean>(false);

  // Step 1 Chatbot Interview State (Requirement 1: SCAMPER & TRIZ 챗봇 대화)
  const [interviewMode, setInterviewMode] = useState<'chat' | 'form'>('chat');
  const [chatCurrentIndex, setChatCurrentIndex] = useState<number>(0);
  const [interviewChatInput, setInterviewChatInput] = useState<string>('');

  // 6 Questions Interview Definition Array with SCAMPER & TRIZ techniques
  const interviewQuestions = [
    {
      field: 'q1_interest',
      numStr: '① 관심 분야 및 해결하고 싶은 핵심 문제',
      title: `${problem.category} 분야에서 가장 해결하고 싶은 문제는 무엇인가요?`,
      subText: '평소 경험했거나 주변에서 들었던 구체적인 불편 상황을 적어주세요.',
      placeholder: '예: 수행평가나 팀 프로젝트 주제를 정하는 데 어려움을 겪고 있습니다.',
      sampleOptions: ['주제 고갈로 시간 낭비', '기존 사례의 단순 복제품', '실생활 연결 부족'],
      techniqueBadge: 'SCAMPER: C-결합(Combine) & A-적응(Adapt)',
      techniqueHint: '기존의 비효율적 요소를 다른 기술이나 성공 사례와 결합(Combine)하거나 현재 상황에 적응(Adapt)시켜 보세요.',
    },
    {
      field: 'q2_target',
      numStr: '② 가장 큰 불편을 겪는 대상 (누가)',
      title: '이 문제로 인해 가장 큰 어려움을 겪는 주요 대상은 누구인가요?',
      subText: '연령, 역할, 주 행동 특성을 구체적으로 작성하면 문제의 본질이 명확해집니다.',
      placeholder: '예: 탐구보고서를 준비하는 중·고등학생 및 신입 창업 참가자',
      sampleOptions: ['중·고등학생', '대학생/취업준비생', '소상공인', '발명대회 참가자'],
      techniqueBadge: 'TRIZ: 모순 분석 (Contradiction)',
      techniqueHint: '편리하고 싶지만 시간/비용 제약으로 상충되는 어려움을 겪는 주요 타겟(누가)을 정의해보세요.',
    },
    {
      field: 'q3_context',
      numStr: '③ 발생 환경 및 시기 (언제/어디서)',
      title: '이 문제는 주로 언제, 어디서, 어떤 특정 상황에서 도드라지게 발생하나요?',
      subText: '계절, 특정 시간대, 장소, 과제 제출 직전 등 문제 상황을 묘사하세요.',
      placeholder: '예: 학기 초 조별 과제 시작 시점 또는 밤늦게 홀로 주제를 정할 때',
      sampleOptions: ['학기 초/과제 시작 시', '실험 및 실습 진행 시', '이동 및 야외 활동 시'],
      techniqueBadge: 'SCAMPER: M-수정(Modify) & M-확대(Magnify)',
      techniqueHint: '문제가 발생하는 장소, 시간, 환경의 규모나 특성을 변형(Modify)하거나 확대(Magnify)하여 관찰해보세요.',
    },
    {
      field: 'q4_currentSolution',
      numStr: '④ 현재 대처 및 기존 해결 방식',
      title: '사람들은 현재 이 문제를 해결하기 위해 어떤 임시 대안을 쓰고 있나요?',
      subText: '기존의 한계점이나 임시방편의 불편함을 적어보세요.',
      placeholder: '예: 포털 사이트에 무작정 검색하거나 지인에게 묻지만 맞춤 정보가 부족함',
      sampleOptions: ['인터넷 검색 및 지인 질문', '수동 엑셀 정리', '그냥 불편함 감수'],
      techniqueBadge: 'TRIZ: 이상적 최종 결과 (Ideal Final Result)',
      techniqueHint: '기존 방식의 치명적 한계와 비효율 요소를 지적하고 왜 한계에 부딪히는지 살펴보세요.',
    },
    {
      field: 'q5_idealResult',
      numStr: '⑤ 이상적인 해결 모습 (만약 제약이 없다면)',
      title: '제약 조건이 없다면, 이 문제가 어떻게 완벽하게 해결되기를 바라시나요?',
      subText: '사용자가 경험할 최선의 상태를 자유롭게 상상해보세요.',
      placeholder: '예: 내 관심 분야에 맞는 문제 상황과 6단계 해결 로드맵이 3초 만에 생성되는 것',
      sampleOptions: ['3초 내 맞춤 가이드', '비용 및 시간 50% 절감', '실시간 협업 매칭'],
      techniqueBadge: 'SCAMPER: E-제거(Eliminate) & P-다른 용도(Put to another use)',
      techniqueHint: '불필요한 절차나 비용을 완전히 제거(Eliminate)하거나 새로운 용도로 전환(Put to another use)한 상태를 상상해보세요.',
    },
    {
      field: 'q6_impact',
      numStr: '⑥ 해결 시 기대되는 변화 및 파급력',
      title: '이 문제가 잘 해결되었을 때 사용자나 세상에 일어날 파급효과는 무엇인가요?',
      subText: '창의적 성과, 시간 절감, 자신감 향상 등 기대 효과를 기술해주세요.',
      placeholder: '예: 아이디어 고갈 없이 청소년들이 자신만의 차별화된 발명작품을 완성함',
      sampleOptions: ['아이디어 도출 시간 80% 단축', '창업 및 발명 성공률 향상', '실질적 사회 문제 해결'],
      techniqueBadge: 'SCAMPER: R-반전(Reverse) & TRIZ: 파급 효과',
      techniqueHint: '기존 순서나 방식을 완전히 뒤집었을 때(Reverse) 일어날 파급효과와 가치를 작성해보세요.',
    },
  ];

  const [interviewChatMessages, setInterviewChatMessages] = useState<Array<{
    id: string;
    sender: 'bot' | 'user';
    text: string;
    techniqueBadge?: string;
    techniqueHint?: string;
    field?: string;
    sampleOptions?: string[];
  }>>([
    {
      id: 'msg-init-1',
      sender: 'bot',
      text: `안녕하세요! 저는 SCAMPER & TRIZ 창의 발상 AI 멘토입니다. 🤖\n\n선택하신 문제 [${problem.title}]를 다각도로 분석하기 위해 6가지 발상 질문을 드리겠습니다.`,
    },
    {
      id: 'msg-init-2',
      sender: 'bot',
      text: `${interviewQuestions[0].numStr}\n${interviewQuestions[0].title}`,
      techniqueBadge: interviewQuestions[0].techniqueBadge,
      techniqueHint: interviewQuestions[0].techniqueHint,
      field: interviewQuestions[0].field,
      sampleOptions: interviewQuestions[0].sampleOptions,
    },
  ]);

  // Intercept exit attempt during active steps (Requirement 6)
  const handleAttemptBack = () => {
    if (step > 1) {
      setShowExitModal(true);
    } else {
      onBack();
    }
  };

  const confirmExit = () => {
    setShowExitModal(false);
    onBack();
  };

  // Answer change handler
  const handleAnswerChange = (field: string, text: string) => {
    setAnswers((prev) => ({
      ...prev,
      [field]: text,
    }));
  };

  // Step 1 Chatbot Message Send Handler (Requirement 1)
  const handleSendInterviewChatMessage = (overrideText?: string) => {
    const textToSend = (overrideText !== undefined ? overrideText : interviewChatInput).trim();
    if (!textToSend) return;

    const currentIdx = Math.min(chatCurrentIndex, interviewQuestions.length - 1);
    const currentQ = interviewQuestions[currentIdx];

    // 1. Save Answer
    handleAnswerChange(currentQ.field, textToSend);

    // 2. Add User Message
    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user' as const,
      text: textToSend,
    };

    const nextIdx = currentIdx + 1;
    setInterviewChatInput('');

    if (nextIdx < interviewQuestions.length) {
      const nextQ = interviewQuestions[nextIdx];
      const botFeedbackMsg = {
        id: `bot-fb-${Date.now()}`,
        sender: 'bot' as const,
        text: `👍 좋은 분석입니다! "${textToSend}" 내용이 입력되었습니다.\n\n다음 ${nextQ.numStr}\n${nextQ.title}`,
        techniqueBadge: nextQ.techniqueBadge,
        techniqueHint: nextQ.techniqueHint,
        field: nextQ.field,
        sampleOptions: nextQ.sampleOptions,
      };

      setInterviewChatMessages((prev) => [...prev, userMsg, botFeedbackMsg]);
      setChatCurrentIndex(nextIdx);
    } else {
      const botCompleteMsg = {
        id: `bot-comp-${Date.now()}`,
        sender: 'bot' as const,
        text: `🎉 축하합니다! 6가지 창의 인터뷰 질문 답변이 모두 수집되었습니다.\n\n수집된 답변을 바탕으로 AI 방사형 마인드맵을 생성해보세요!`,
      };

      setInterviewChatMessages((prev) => [...prev, userMsg, botCompleteMsg]);
      setChatCurrentIndex(6);
    }
  };

  // API Call 1: Generate Mindmap
  const handleGenerateMindmap = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/gemini/analyze-mindmap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          problemTitle: problem.title,
          problemDescription: problem.description,
          category: problem.category,
          answers,
        }),
      });
      const data = await res.json();
      setMindmapData({
        centralProblem: problem.title,
        category: problem.category,
        nodes: data.nodes || [],
        extractedKeywords: data.extractedKeywords || [problem.category, '수행평가', '시간 관리', '창의성', '협업'],
      });
      setStep(2);
      onUnlockBadge('b-2');
    } catch (e) {
      console.error(e);
      setStep(2);
    } finally {
      setIsLoading(false);
    }
  };

  // API Call 2: Generate 3 Ideas
  const handleGenerateIdeas = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/gemini/generate-ideas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          problemTitle: problem.title,
          problemDescription: problem.description,
          category: problem.category,
          keywords: mindmapData?.extractedKeywords,
          answers,
        }),
      });
      const data = await res.json();
      const rawIdeas = data.ideas || [];
      const formattedIdeas: Idea[] = rawIdeas.map((item: any, idx: number) => ({
        id: `idea-${Date.now()}-${idx}`,
        problemId: problem.id,
        problemTitle: problem.title,
        category: problem.category,
        title: item.title,
        description: item.description,
        expectedEffect: item.expectedEffect,
        difficulty: item.difficulty || '보통',
        keyFeatures: item.keyFeatures || [],
        createdAt: new Date().toISOString().split('T')[0],
      }));

      setGeneratedIdeas(formattedIdeas);
      setStep(3);
      onUnlockBadge('b-3');
    } catch (e) {
      console.error(e);
      setStep(3);
    } finally {
      setIsLoading(false);
    }
  };

  // API Call 3: Evaluate Selected Idea
  const handleEvaluateIdea = async (idea: Idea) => {
    setSelectedIdea(idea);
    setIsLoading(true);
    onSaveIdea(idea);

    try {
      const res = await fetch('/api/gemini/evaluate-idea', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          problemTitle: problem.title,
          category: problem.category,
          ideaTitle: idea.title,
          ideaDescription: idea.description,
          expectedEffect: idea.expectedEffect,
          keyFeatures: idea.keyFeatures,
        }),
      });
      const data = await res.json();
      const total = data.totalScore || 86;
      const star = getStarRating(total);

      const evalResult: IdeaEvaluation = {
        id: `eval-${Date.now()}`,
        ideaId: idea.id,
        ideaTitle: idea.title,
        noveltyScore: data.noveltyScore || 85,
        feasibilityScore: data.feasibilityScore || 82,
        economicsScore: data.economicsScore || 88,
        sustainabilityScore: data.sustainabilityScore || 90,
        totalScore: total,
        starRatingText: `${star.stars} (${star.text})`,
        starRatingValue: star.text,
        pros: data.pros || ['명확한 타겟 문제 해결', '모바일 접근성 우수'],
        cons: data.cons || ['초기 유저 확보 방안 필요'],
        improvements: data.improvements || ['100명 타겟 MVP 테스트 추천'],
        benchmarks: data.benchmarks || [
          {
            caseName: '배달의민족',
            type: 'success',
            keyQuestion: '문제 빈도가 높은가?',
            analysis: '일상에서 자주 경험하는 음식 주문 문제를 쉽고 빠른 UX로 해결하여 높은 재방문율을 확보합니다.',
          },
          {
            caseName: '토스',
            type: 'success',
            keyQuestion: '사용자 경험 개선 정도',
            analysis: '복잡했던 송금 절차를 수 초로 단축해 본질적인 사용성을 압도적으로 향상시킵니다.',
          },
          {
            caseName: '타다',
            type: 'failure',
            keyQuestion: '법적 규제를 검토했는가?',
            analysis: '서비스 출시 전 기존 산업의 관련 법률 및 규제 리스크를 사전에 철저히 검토해야 합니다.',
          },
          {
            caseName: '위자드웍스',
            type: 'failure',
            keyQuestion: '돈을 어떻게 벌 것인가?',
            analysis: '초기 유저 유입뿐만 아니라 지속 가능한 비즈니스 수익 모델(BM)을 조기에 구축해야 합니다.',
          },
        ],
        evaluatedAt: new Date().toISOString().split('T')[0],
        rewardedPoints: 100,
      };

      setEvaluation(evalResult);
      onSaveEvaluation(evalResult);
      setStep(4);

      if (!pointsAwarded) {
        onRewardPoints(100, `AI 아이디어 검증 완료 (${idea.title})`);
        setPointsAwarded(true);
        onUnlockBadge('b-4');
      }
    } catch (e) {
      console.error(e);
      setStep(4);
    } finally {
      setIsLoading(false);
    }
  };

  // Step 4 -> 5: Propose Co-founder
  const handleProposeCofounder = () => {
    const candidate = getRandomCofounder(
      problem.category,
      selectedIdea?.title || problem.title
    );

    setCofounderProposed(candidate);
    setCofounderAccepted(null);
    setChatMessages([
      {
        id: 'msg-1',
        sender: 'system',
        text: `PROBIX AI가 "${selectedIdea?.title || '아이디어'}" 아이디어와 ${candidate.matchScore}% 매칭되는 파트너 [${candidate.name}]님을 찾아냈습니다.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
      {
        id: 'msg-2',
        sender: 'cofounder',
        text: candidate.pitch,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    setStep(5);
  };

  // Send Chat Message to Gemini Co-founder
  const handleSendChat = async () => {
    if (!userChatInput.trim() || !cofounderProposed || isSendingChat) return;

    const userMsg: ChatMessage = {
      id: `msg-user-${Date.now()}`,
      sender: 'user',
      text: userChatInput.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updatedHistory = [...chatMessages, userMsg];
    setChatMessages(updatedHistory);
    setUserChatInput('');
    setIsSendingChat(true);

    try {
      const res = await fetch('/api/gemini/cofounder-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cofounderName: cofounderProposed.name,
          role: cofounderProposed.role,
          ideaTitle: selectedIdea?.title || problem.title,
          ideaDescription: selectedIdea?.description || problem.description,
          category: problem.category,
          userMessage: userMsg.text,
          conversationHistory: updatedHistory,
        }),
      });
      const data = await res.json();
      const replyMsg: ChatMessage = {
        id: `msg-reply-${Date.now()}`,
        sender: 'cofounder',
        text: data.responseText || '좋은 의견입니다! 우리 함께 첫 번째 테스트 버전을 구상해보시죠.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setChatMessages((prev) => [...prev, replyMsg]);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSendingChat(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      {/* Requirement 6: Exit Confirmation Modal */}
      {showExitModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-sm w-full p-6 shadow-2xl text-center space-y-4 animate-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-slate-900">정말 나가시겠습니까?</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                지금 나가시면 현재 작성 및 분석 중인 탐구 내용이 저장되지 않고 유실될 수 있습니다.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                onClick={() => setShowExitModal(false)}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 rounded-xl text-xs transition-colors"
              >
                취소
              </button>
              <button
                onClick={confirmExit}
                className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-2.5 rounded-xl text-xs shadow-sm transition-colors"
              >
                예 (나가기)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Top Bar Navigation */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <button
          onClick={handleAttemptBack}
          className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-xl transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>문제 목록으로 돌아가기</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100 flex items-center gap-1">
            <Bot className="w-3.5 h-3.5 text-blue-600" />
            AI 발명 멘토 연결됨
          </span>
        </div>
      </div>

      {/* Selected Problem Banner Header */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-3xl p-5 sm:p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-1/4 -translate-y-1/4 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-wrap items-center justify-between gap-2 mb-3 relative z-10">
          <CategoryBadge category={problem.category} size="sm" />
          <span className="text-xs font-medium text-blue-200 bg-white/10 backdrop-blur-xs px-2.5 py-1 rounded-lg">
            출처: {problem.source}
          </span>
        </div>

        <h1 className="text-lg sm:text-2xl font-extrabold mb-2 relative z-10 leading-snug">
          {problem.title}
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 relative z-10 leading-relaxed max-w-2xl">
          {problem.description}
        </p>

        {/* Stepper Progress Indicator */}
        <div className="mt-5 pt-4 border-t border-white/10 grid grid-cols-5 gap-1 sm:gap-2 text-center text-[10px] sm:text-xs font-semibold relative z-10">
          <div className={`p-1.5 rounded-lg ${step === 1 ? 'bg-blue-600 text-white font-bold' : step > 1 ? 'bg-white/20 text-blue-200' : 'text-slate-400'}`}>
            1. 인터뷰 탐구 (6질문)
          </div>
          <div className={`p-1.5 rounded-lg ${step === 2 ? 'bg-blue-600 text-white font-bold' : step > 2 ? 'bg-white/20 text-blue-200' : 'text-slate-400'}`}>
            2. 마인드맵
          </div>
          <div className={`p-1.5 rounded-lg ${step === 3 ? 'bg-blue-600 text-white font-bold' : step > 3 ? 'bg-white/20 text-blue-200' : 'text-slate-400'}`}>
            3. 아이디어 생성
          </div>
          <div className={`p-1.5 rounded-lg ${step === 4 ? 'bg-blue-600 text-white font-bold' : step > 4 ? 'bg-white/20 text-blue-200' : 'text-slate-400'}`}>
            4. AI 검증평가
          </div>
          <div className={`p-1.5 rounded-lg ${step === 5 ? 'bg-blue-600 text-white font-bold' : 'text-slate-400'}`}>
            5. 팀원 동업
          </div>
        </div>
      </div>

      {/* STEP 1: Requirement 1 - Interactive Chatbot Interview (6 Questions with SCAMPER & TRIZ) */}
      {step === 1 && (
        <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-7 shadow-xs space-y-6 animate-in fade-in duration-300">
          {/* Header Description & Mode Switcher */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-blue-50/80 p-4 sm:p-5 rounded-2xl border border-blue-100">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-md">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-extrabold text-slate-900 text-sm sm:text-base">SCAMPER & TRIZ 인터뷰 대화봇</span>
                  <span className="text-[10px] bg-blue-600 text-white font-bold px-2.5 py-0.5 rounded-full">
                    대화형 6질문
                  </span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  AI 인터뷰어와 챗봇으로 대화하며 6가지 창의 질문을 하나씩 풀어가세요. SCAMPER 및 TRIZ 발상 기법이 적용됩니다.
                </p>
              </div>
            </div>

            {/* Mode Switcher Tabs */}
            <div className="flex items-center bg-slate-200/80 p-1 rounded-xl shrink-0 self-start sm:self-center">
              <button
                onClick={() => setInterviewMode('chat')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  interviewMode === 'chat'
                    ? 'bg-white text-blue-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>챗봇 대화</span>
              </button>
              <button
                onClick={() => setInterviewMode('form')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  interviewMode === 'form'
                    ? 'bg-white text-blue-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>전체 양식</span>
              </button>
            </div>
          </div>

          {/* CHATBOT MODE (Requirement 1) */}
          {interviewMode === 'chat' && (
            <div className="space-y-4">
              {/* Progress Bar Header */}
              <div className="flex items-center justify-between text-xs font-bold text-slate-600 bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-200">
                <span className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  인터뷰 진행 현황: {chatCurrentIndex} / 6 질문 완료
                </span>
                <div className="w-32 bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(chatCurrentIndex / 6) * 100}%` }}
                  />
                </div>
              </div>

              {/* Chat Message Stream */}
              <div className="bg-slate-50/70 border border-slate-200 rounded-2xl p-4 sm:p-5 min-h-[360px] max-h-[500px] overflow-y-auto space-y-4 scrollbar-thin">
                {interviewChatMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${
                      msg.sender === 'user' ? 'items-end' : 'items-start'
                    } space-y-1.5 animate-in fade-in duration-200`}
                  >
                    <div className="flex items-center gap-2 text-[11px] font-bold text-slate-400">
                      {msg.sender === 'bot' ? (
                        <>
                          <span className="text-blue-600 flex items-center gap-1 font-extrabold">
                            <Bot className="w-3.5 h-3.5" /> AI 창의 발상 멘토
                          </span>
                          {msg.techniqueBadge && (
                            <span className="bg-indigo-100 text-indigo-700 font-extrabold px-2 py-0.5 rounded-md border border-indigo-200">
                              {msg.techniqueBadge}
                            </span>
                          )}
                        </>
                      ) : (
                        <span className="text-slate-600">나의 답변</span>
                      )}
                    </div>

                    <div
                      className={`max-w-[88%] sm:max-w-[80%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                        msg.sender === 'user'
                          ? 'bg-blue-600 text-white rounded-tr-none font-medium shadow-xs'
                          : 'bg-white border border-slate-200 text-slate-900 rounded-tl-none shadow-xs space-y-2'
                      }`}
                    >
                      <div className="whitespace-pre-line">{msg.text}</div>

                      {/* Technique Hint Box */}
                      {msg.techniqueHint && (
                        <div className="mt-2.5 pt-2 border-t border-slate-100 text-[11px] text-indigo-900 bg-indigo-50/90 p-2.5 rounded-xl border border-indigo-100 flex items-start gap-1.5 font-medium">
                          <Lightbulb className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-bold text-indigo-950 block mb-0.5">발상 가이드:</span>
                            {msg.techniqueHint}
                          </div>
                        </div>
                      )}

                      {/* Sample Option Chips for Bot Questions */}
                      {msg.sampleOptions && msg.sender === 'bot' && (
                        <div className="mt-3 pt-2.5 border-t border-slate-100 space-y-1">
                          <span className="text-[11px] font-bold text-slate-400 block">빠른 선택 예시 (클릭 시 자동 답변):</span>
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {msg.sampleOptions.map((opt, oidx) => (
                              <button
                                key={oidx}
                                type="button"
                                onClick={() => handleSendInterviewChatMessage(opt)}
                                className="text-[11px] bg-blue-50 hover:bg-blue-600 hover:text-white text-blue-700 font-semibold px-2.5 py-1 rounded-lg border border-blue-200 transition-all text-left"
                              >
                                + {opt}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Chat Input Area */}
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={interviewChatInput}
                  onChange={(e) => setInterviewChatInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleSendInterviewChatMessage();
                    }
                  }}
                  placeholder={
                    chatCurrentIndex < 6
                      ? `Q${chatCurrentIndex + 1}. 답변을 입력하세요 (또는 위의 빠른 선택 버튼 클릭)...`
                      : '모든 답변이 완료되었습니다. 마인드맵 생성을 진행해보세요!'
                  }
                  className="flex-1 bg-white border border-slate-200 focus:border-blue-500 rounded-2xl px-4 py-3 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all shadow-xs"
                />
                <button
                  onClick={() => handleSendInterviewChatMessage()}
                  disabled={!interviewChatInput.trim()}
                  className="px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-all shadow-xs shrink-0"
                >
                  <span>전송</span>
                  <Send className="w-4 h-4" />
                </button>
              </div>

              {/* Action Mindmap Button Banner */}
              <div className="pt-3 flex flex-col sm:flex-row items-center justify-between gap-4 bg-gradient-to-r from-blue-900 via-slate-900 to-indigo-950 p-5 rounded-2xl text-white shadow-md border border-blue-800/40">
                <div>
                  <span className="text-[10px] bg-amber-400 text-slate-950 font-black px-2.5 py-0.5 rounded-md uppercase tracking-wider mb-1 inline-block">
                    {chatCurrentIndex >= 6 ? '준비 완료' : '진행 가능'}
                  </span>
                  <h4 className="font-extrabold text-sm sm:text-base">
                    {chatCurrentIndex >= 6
                      ? '6가지 질문 수집 완료! AI 방사형 마인드맵 생성'
                      : '작성 중이어도 언제든 AI 마인드맵을 바로 생성할 수 있습니다'}
                  </h4>
                  <p className="text-xs text-slate-300 mt-0.5">
                    입력된 내용을 바탕으로 핵심 키워드가 사방으로 분기되는 원형 마인드맵을 시각화합니다.
                  </p>
                </div>

                <button
                  onClick={handleGenerateMindmap}
                  disabled={isLoading}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-extrabold text-xs sm:text-sm shadow-lg shadow-blue-500/30 transition-all shrink-0 hover:scale-[1.02] active:scale-[0.98]"
                >
                  {isLoading ? (
                    <span>AI 마인드맵 생성 중...</span>
                  ) : (
                    <>
                      <span>AI 마인드맵 생성하기</span>
                      <Sparkles className="w-4 h-4 text-amber-300 fill-amber-300" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* FORM MODE (Requirement 1: 6 Questions Form view) */}
          {interviewMode === 'form' && (
            <div className="space-y-6">
              <div className="space-y-6">
                {interviewQuestions.map((q) => (
                  <div
                    key={q.field}
                    className="bg-slate-50 border border-slate-200/90 rounded-2xl p-4 sm:p-5 space-y-3 hover:border-blue-300 transition-colors"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-blue-600 bg-blue-100/80 px-2.5 py-0.5 rounded-md">
                          {q.numStr}
                        </span>
                        <span className="text-[10px] bg-indigo-100 text-indigo-700 font-bold px-2 py-0.5 rounded-md border border-indigo-200">
                          {q.techniqueBadge}
                        </span>
                      </div>
                      <h3 className="text-sm sm:text-base font-bold text-slate-900 mt-1">
                        {q.title}
                      </h3>
                      <p className="text-xs text-slate-500">{q.subText}</p>
                    </div>

                    {/* Quick Option Chips */}
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-[11px] font-bold text-slate-400">빠른 선택 예시:</span>
                      {q.sampleOptions.map((opt, oidx) => (
                        <button
                          key={oidx}
                          type="button"
                          onClick={() => handleAnswerChange(q.field, opt)}
                          className="text-[11px] bg-white hover:bg-blue-50 text-slate-600 hover:text-blue-700 font-medium px-2.5 py-1 rounded-lg border border-slate-200 transition-colors"
                        >
                          + {opt}
                        </button>
                      ))}
                    </div>

                    {/* Textarea Input */}
                    <textarea
                      rows={3}
                      value={(answers as any)[q.field] || ''}
                      onChange={(e) => handleAnswerChange(q.field, e.target.value)}
                      placeholder={q.placeholder}
                      className="w-full bg-white border border-slate-200 focus:border-blue-500 rounded-xl p-3.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none transition-all"
                    />
                  </div>
                ))}
              </div>

              {/* Form Submit Action Button */}
              <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-xs text-slate-500">
                  💡 작성된 답변이 많을수록 AI 마인드맵의 연관성이 정교해집니다.
                </p>

                <button
                  onClick={handleGenerateMindmap}
                  disabled={isLoading}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold text-sm shadow-lg shadow-blue-500/25 transition-all hover:scale-[1.02] active:scale-[0.98] shrink-0"
                >
                  {isLoading ? (
                    <span>AI가 마인드맵을 분석 및 생성 중...</span>
                  ) : (
                    <>
                      <span>6가지 질문 작성 완료 & AI 마인드맵 생성 →</span>
                      <Sparkles className="w-4 h-4 text-amber-300 fill-amber-300" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* STEP 2: Requirement 2 - Visual Radial Mindmap */}
      {step === 2 && mindmapData && (
        <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-7 shadow-xs space-y-6 animate-in fade-in duration-300">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100">
                AI 방사형 마인드맵
              </span>
              <h2 className="text-xl font-extrabold text-slate-900 mt-1">사방 연결 마인드맵 구조</h2>
              <p className="text-xs text-slate-500">
                중앙의 핵심 문제에서 사방으로 뻗어나간 분기 노드를 확인하고 발상을 다각화하세요.
              </p>
            </div>
            <button
              onClick={() => setStep(1)}
              className="text-xs font-bold text-slate-500 hover:text-blue-600 flex items-center gap-1 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-xl transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              인터뷰 수정
            </button>
          </div>

          {/* Radial Visual Mindmap Canvas */}
          <MindmapRadial
            problemTitle={mindmapData.centralProblem}
            category={mindmapData.category}
            nodes={mindmapData.nodes}
            keywords={mindmapData.extractedKeywords}
          />

          {/* Action Button: Generate 3 Ideas */}
          <div className="pt-2 flex justify-end">
            <button
              onClick={handleGenerateIdeas}
              disabled={isLoading}
              className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-sm shadow-lg shadow-blue-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              {isLoading ? (
                <span>AI가 창의적 아이디어를 도출 중...</span>
              ) : (
                <>
                  <span>마인드맵 기반 창업 아이디어 3개 생성하기</span>
                  <Lightbulb className="w-5 h-5 text-amber-300 fill-amber-300" />
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Generated Ideas List */}
      {step === 3 && (
        <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-7 shadow-xs space-y-6 animate-in fade-in duration-300">
          <div>
            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100">
              문제 발견 기반 솔루션
            </span>
            <h2 className="text-xl font-extrabold text-slate-900 mt-1">AI 도출 창업 아이디어 3선</h2>
            <p className="text-xs text-slate-500">
              인터뷰와 마인드맵을 토대로 도출된 3가지 솔루션입니다. 하나를 선택해 평가받아 보세요!
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {generatedIdeas.map((idea, idx) => (
              <div
                key={idea.id}
                className="bg-slate-50 rounded-2xl border border-slate-200 p-5 hover:border-blue-400 hover:shadow-md transition-all flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-bold text-blue-700 bg-blue-100 px-2.5 py-0.5 rounded-lg">
                      아이디어 #{idx + 1}
                    </span>
                    <span
                      className={`text-xs font-bold px-2.5 py-0.5 rounded-md ${
                        idea.difficulty === '쉬움'
                          ? 'bg-emerald-100 text-emerald-700'
                          : idea.difficulty === '보통'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-700'
                      }`}
                    >
                      난이도: {idea.difficulty}
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-2">
                    {idea.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 mb-3 leading-relaxed">
                    {idea.description}
                  </p>

                  <div className="bg-white p-3 rounded-xl border border-slate-200/80 space-y-2 text-xs">
                    <div>
                      <strong className="text-slate-800 font-semibold block mb-0.5">💡 기대 효과:</strong>
                      <span className="text-slate-600">{idea.expectedEffect}</span>
                    </div>
                    {idea.keyFeatures.length > 0 && (
                      <div>
                        <strong className="text-slate-800 font-semibold block mb-1">⚙️ 주요 기능:</strong>
                        <div className="flex flex-wrap gap-1.5">
                          {idea.keyFeatures.map((feat, fidx) => (
                            <span key={fidx} className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md text-[11px]">
                              • {feat}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => handleEvaluateIdea(idea)}
                    disabled={isLoading}
                    className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-sm transition-all"
                  >
                    {isLoading && selectedIdea?.id === idea.id ? (
                      <span>AI 평가 검증 진행 중...</span>
                    ) : (
                      <>
                        <span>이 아이디어 선택 및 AI 평가받기 (+100P)</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* STEP 4: AI Evaluation Report & Reward */}
      {step === 4 && evaluation && selectedIdea && (
        <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-7 shadow-xs space-y-6 animate-in fade-in duration-300">
          {/* Confetti Banner for +100 Points */}
          <div className="bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-slate-900 rounded-2xl p-4 sm:p-5 shadow-lg flex items-center justify-between gap-3 animate-bounce">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white/30 backdrop-blur-md flex items-center justify-center shrink-0 text-amber-900 font-black text-xl">
                🪙
              </div>
              <div>
                <h3 className="font-extrabold text-base sm:text-lg">🎉축하합니다! 100 포인트를 획득하셨습니다!</h3>
                <p className="text-xs text-amber-950 font-medium">
                  문제 탐구부터 심사 평가까지 마친 멋진 발명/창업가 정신을 응원합니다.
                </p>
              </div>
            </div>
            <span className="bg-slate-900 text-amber-300 text-xs font-bold px-3 py-1.5 rounded-xl shrink-0">
              +100 P 적립 완료
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 gap-3">
            <div>
              <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100">
                AI 발명 심사 보고서
              </span>
              <h2 className="text-xl font-extrabold text-slate-900 mt-1">"{selectedIdea.title}" 평가 결과</h2>
            </div>
            <div className="flex items-center gap-3 self-start sm:self-auto">
              {/* Star Rating Badge */}
              <div className="bg-amber-50 border border-amber-200/90 px-3.5 py-2 rounded-2xl text-center">
                <span className="text-[10px] font-bold text-amber-700 block uppercase">5단계 등급</span>
                <span className="text-sm font-extrabold text-amber-600">
                  {evaluation.starRatingText || getStarRating(evaluation.totalScore).stars + ' (' + getStarRating(evaluation.totalScore).text + ')'}
                </span>
              </div>
              <div className="text-right pl-2 border-l border-slate-200">
                <span className="text-xs text-slate-500 font-bold block">종합 점수</span>
                <span className="text-2xl sm:text-3xl font-black text-blue-600">{evaluation.totalScore} <span className="text-sm text-slate-400 font-normal">/ 100</span></span>
              </div>
            </div>
          </div>

          {/* 4 Dimension Scores Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <div>
              <span className="text-xs font-semibold text-slate-600">참신성</span>
              <div className="text-lg font-bold text-slate-900">{evaluation.noveltyScore}점</div>
              <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden mt-1">
                <div className="bg-blue-600 h-full" style={{ width: `${evaluation.noveltyScore}%` }} />
              </div>
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-600">실현 가능성</span>
              <div className="text-lg font-bold text-slate-900">{evaluation.feasibilityScore}점</div>
              <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden mt-1">
                <div className="bg-emerald-500 h-full" style={{ width: `${evaluation.feasibilityScore}%` }} />
              </div>
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-600">경제성</span>
              <div className="text-lg font-bold text-slate-900">{evaluation.economicsScore}점</div>
              <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden mt-1">
                <div className="bg-indigo-600 h-full" style={{ width: `${evaluation.economicsScore}%` }} />
              </div>
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-600">지속가능성</span>
              <div className="text-lg font-bold text-slate-900">{evaluation.sustainabilityScore}점</div>
              <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden mt-1">
                <div className="bg-amber-500 h-full" style={{ width: `${evaluation.sustainabilityScore}%` }} />
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs sm:text-sm">
            <div className="bg-emerald-50/60 p-4 rounded-2xl border border-emerald-100 space-y-2">
              <h4 className="font-bold text-emerald-800 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                장점 (Pros)
              </h4>
              <ul className="space-y-1.5 text-slate-700">
                {evaluation.pros.map((p, i) => (
                  <li key={i} className="flex items-start gap-1">
                    <span className="text-emerald-500">•</span>
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-amber-50/60 p-4 rounded-2xl border border-amber-100 space-y-2">
              <h4 className="font-bold text-amber-800 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                보완점 / 단점 (Cons)
              </h4>
              <ul className="space-y-1.5 text-slate-700">
                {evaluation.cons.map((c, i) => (
                  <li key={i} className="flex items-start gap-1">
                    <span className="text-amber-500">•</span>
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-blue-50/60 p-4 rounded-2xl border border-blue-100 space-y-2">
              <h4 className="font-bold text-blue-800 flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-blue-600" />
                개선 방향
              </h4>
              <ul className="space-y-1.5 text-slate-700">
                {evaluation.improvements.map((imp, i) => (
                  <li key={i} className="flex items-start gap-1">
                    <span className="text-blue-500">•</span>
                    <span>{imp}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Requirement 1: Benchmarks Citation Section (2 Success & 2 Failure Cases) */}
          {evaluation.benchmarks && evaluation.benchmarks.length > 0 && (
            <div className="bg-slate-50/80 rounded-2xl p-4 sm:p-5 border border-slate-200/90 space-y-3.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-blue-600" />
                  <h4 className="font-extrabold text-slate-900 text-sm sm:text-base">벤치마킹 사례 분석 (성공 2 / 실패 2)</h4>
                </div>
                <span className="text-[10px] font-bold text-slate-500 bg-white px-2.5 py-1 rounded-md border border-slate-200">
                  타사 벤치마크 기반
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {evaluation.benchmarks.map((bm, bidx) => (
                  <div
                    key={bidx}
                    className={`p-3.5 rounded-xl border ${
                      bm.type === 'success'
                        ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                        : 'bg-rose-50/70 border-rose-200 text-rose-950'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-extrabold text-sm">{bm.caseName}</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                          bm.type === 'success'
                            ? 'bg-emerald-200 text-emerald-900'
                            : 'bg-rose-200 text-rose-900'
                        }`}
                      >
                        {bm.type === 'success' ? '🟢 성공 사례' : '🔴 실패/리스크 사례'}
                      </span>
                    </div>
                    <p className="font-bold text-[11px] opacity-80 mb-1">
                      ❓ 핵심 질문: {bm.keyQuestion}
                    </p>
                    <p className="text-[11px] leading-relaxed opacity-90">{bm.analysis}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action to Step 5: Co-Founder Matching */}
          <div className="pt-2 flex items-center justify-between border-t border-slate-100">
            <button
              onClick={() => setStep(3)}
              className="text-xs font-bold text-slate-500 hover:text-slate-800"
            >
              ← 다른 아이디어 선택
            </button>
            <button
              onClick={handleProposeCofounder}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md transition-all hover:scale-[1.02]"
            >
              <Users className="w-4 h-4" />
              <span>동업자 매칭 제안 확인 →</span>
            </button>
          </div>
        </div>
      )}

      {/* STEP 5: Requirement 5 - Co-Founder Proposal Accept / Decline Modal */}
      {step === 5 && cofounderProposed && (
        <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-7 shadow-xs space-y-6 animate-in fade-in duration-300">
          <div>
            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100">
              AI 팀원 동업자 매칭
            </span>
            <h2 className="text-xl font-extrabold text-slate-900 mt-1">동업 수락 / 거절 제안</h2>
            <p className="text-xs text-slate-500">
              AI가 추천한 매칭 파트너의 프로필을 확인하고 동업 수락 여부를 결정하세요.
            </p>
          </div>

          {/* Candidate Profile Card */}
          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-5">
            <div className="flex items-center gap-4">
              <img
                src={cofounderProposed.avatar}
                alt={cofounderProposed.name}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-blue-500 shadow-md shrink-0"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-lg text-slate-900">{cofounderProposed.name}</h3>
                  <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2 py-0.5 rounded-md">
                    {cofounderProposed.matchScore}% 매칭
                  </span>
                </div>
                <p className="text-xs font-bold text-blue-600">{cofounderProposed.role}</p>
                <p className="text-xs text-slate-600 mt-1">{cofounderProposed.bio}</p>
              </div>
            </div>

            {/* Requirement 5: Accept / Decline Action UI */}
            {cofounderAccepted === null && (
              <div className="flex items-center gap-2.5 w-full md:w-auto shrink-0">
                <button
                  onClick={() => setCofounderAccepted(false)}
                  className="flex-1 md:flex-initial px-4 py-2.5 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                >
                  <UserX className="w-4 h-4" />
                  <span>거절하기</span>
                </button>
                <button
                  onClick={() => {
                    setCofounderAccepted(true);
                    onUnlockBadge('b-6');
                  }}
                  className="flex-1 md:flex-initial px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all hover:scale-[1.02] flex items-center justify-center gap-1.5"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>수락하고 대화 시작하기</span>
                </button>
              </div>
            )}
          </div>

          {/* Declined State Notice */}
          {cofounderAccepted === false && (
            <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl text-center space-y-2">
              <p className="font-bold text-slate-800 text-sm">동업 제안을 거절했습니다.</p>
              <p className="text-xs text-slate-500">
                현재 작성하신 아이디어는 마이페이지 '나의 창업 아이디어' 목록에 안전하게 저장되었습니다.
              </p>
              <button
                onClick={onBack}
                className="bg-slate-900 text-white text-xs font-bold px-4 py-2 rounded-xl hover:bg-slate-800 transition-colors inline-block mt-2"
              >
                메인으로 이동하기
              </button>
            </div>
          )}

          {/* Active Chat Interface if Accepted */}
          {cofounderAccepted === true && (
            <div className="bg-slate-900 text-white rounded-3xl border border-slate-800 p-4 sm:p-5 space-y-4 shadow-inner">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-bold text-slate-200">
                    [{cofounderProposed.name}] 님과의 대화방
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded-md">
                  Gemini AI 실시간 대화
                </span>
              </div>

              {/* Chat Message Stream */}
              <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                {chatMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${
                      msg.sender === 'user'
                        ? 'items-end'
                        : msg.sender === 'system'
                        ? 'items-center'
                        : 'items-start'
                    }`}
                  >
                    {msg.sender === 'system' ? (
                      <span className="text-[10px] bg-slate-800 text-slate-400 px-3 py-1 rounded-full my-1">
                        {msg.text}
                      </span>
                    ) : (
                      <div
                        className={`max-w-[85%] p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                          msg.sender === 'user'
                            ? 'bg-blue-600 text-white rounded-br-none'
                            : 'bg-slate-800 text-slate-100 border border-slate-700 rounded-bl-none'
                        }`}
                      >
                        <p className="font-semibold text-[10px] opacity-75 mb-1">
                          {msg.sender === 'user' ? '나' : cofounderProposed.name}
                        </p>
                        <p>{msg.text}</p>
                      </div>
                    )}
                  </div>
                ))}
                {isSendingChat && (
                  <div className="flex flex-col items-start">
                    <div className="bg-slate-800 text-slate-300 border border-slate-700 p-3 rounded-2xl rounded-bl-none text-xs flex items-center gap-2">
                      <span className="font-semibold text-[10px] text-blue-400">{cofounderProposed.name}</span>
                      <span className="text-slate-400 text-[11px] animate-pulse">답변을 작성하는 중...</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Input Field */}
              <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
                <input
                  type="text"
                  value={userChatInput}
                  onChange={(e) => setUserChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
                  placeholder="동업자에게 구체적인 실행 방향이나 의견을 물어보세요..."
                  className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
                />
                <button
                  onClick={handleSendChat}
                  disabled={isSendingChat || !userChatInput.trim()}
                  className="bg-blue-600 hover:bg-blue-700 text-white p-2.5 rounded-xl disabled:bg-slate-700 transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
