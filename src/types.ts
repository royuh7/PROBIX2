export type CategoryType = 
  | '정치 / 경제 / 비즈니스'
  | '자연과학'
  | '인문'
  | '환경'
  | '식품'
  | 'IT 및 콘텐츠'
  | '의학 및 헬스케어'
  | '교육'
  | '반려동물'
  | '생활 및 인테리어'
  | '뷰티 및 패션'
  | '안전'
  | '건설 및 제조'
  | '물류'
  | '문화'
  | '재난'
  | '학교폭력'
  | '드론'
  | '우주';

export interface Problem {
  id: string;
  category: CategoryType;
  title: string;
  description: string;
  source: '공개 데이터' | '사용자 입력';
  upvotes: number;
  isSaved?: boolean;
  frequency: string; // 발생 빈도 e.g. "매일", "프로젝트 시기마다", "여름철"
  severity: number; // 1~100점
  createdAt: string;
  authorName?: string;
  tags?: string[]; // 해시태그 e.g. ["#교육", "#발명", "#수행평가"]
}

export interface QuestionAnswers {
  q1_interest: string;        // ① 관심 문제 / 분야 불편점
  q2_target: string;          // ② 영향을 받는 사람 (누가)
  q3_context: string;         // ③ 언제/어디서 발생하는지
  q4_currentSolution: string; // ④ 현재 해결 방식
  q5_idealResult: string;     // ⑤ 이상적인 해결 모습
  q6_impact: string;          // ⑥ 해결 시 기대되는 변화 및 파급력
}

export interface MindmapNode {
  id: string;
  label: string;
  type: 'target' | 'context' | 'solution' | 'ideal' | 'keyword';
  description: string;
}

export interface MindmapData {
  centralProblem: string;
  category: CategoryType;
  nodes: MindmapNode[];
  extractedKeywords: string[];
}

export interface Idea {
  id: string;
  problemId: string;
  problemTitle: string;
  category: CategoryType;
  title: string;
  description: string;
  expectedEffect: string;
  difficulty: '쉬움' | '보통' | '어려움';
  keyFeatures: string[];
  createdAt: string;
}

export interface BenchmarkCitation {
  caseName: string;            // 예: "배달의민족", "타다"
  type: 'success' | 'failure';  // 성공 사례 vs 실패 사례
  keyQuestion: string;         // 핵심 질문 (예: "문제 빈도가 높은가?", "법적 규제를 검토했는가?")
  analysis: string;            // AI 평가 및 적용 시사점
}

export interface IdeaEvaluation {
  id: string;
  ideaId: string;
  ideaTitle: string;
  noveltyScore: number;       // 참신성 (1-100)
  feasibilityScore: number;   // 실현 가능성 (1-100)
  economicsScore: number;     // 경제성 (1-100)
  sustainabilityScore: number; // 지속가능성 (1-100)
  totalScore: number;         // 총점
  starRatingText?: string;    // 별점 텍스트 e.g. "⭐⭐⭐⭐⭐ (5 / 5)"
  starRatingValue?: string;   // e.g. "5 / 5"
  pros: string[];             // 장점
  cons: string[];             // 단점
  improvements: string[];     // 개선 방향
  benchmarks?: BenchmarkCitation[]; // 성공/실패 사례 인용 벤치마크
  evaluatedAt: string;
  rewardedPoints: number;     // 100
}

export interface CoFounder {
  id: string;
  name: string;
  role: string;
  avatar: string;
  badge: string;
  matchScore: number;
  pitch: string;
  bio: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'cofounder' | 'system';
  text: string;
  timestamp: string;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
}

export interface UserProfile {
  name: string;
  email: string;
  level: number;
  levelTitle: string;
  points: number;
  savedProblemIds: string[];
  createdIdeas: Idea[];
  evaluations: IdeaEvaluation[];
  badges: Badge[];
  frequentCategories: { category: CategoryType; count: number }[];
  pointHistory: { id: string; reason: string; amount: number; date: string }[];
  isProMember?: boolean;              // 유료 구독자 여부 (월 2,900원)
  dailyCofounderSearchCount?: number; // 무료 회원 일일 동업자 찾기 횟수 (최대 3회)
}

export interface PromotedCompany {
  id: string;
  companyName: string;         // 회사 / 스타트업 명
  tagline: string;             // 한 줄 홍보 슬로건
  description: string;         // 상세 소개 및 사업 내용
  category: CategoryType;      // 카테고리
  authorName: string;          // 창업자 / 대표명
  linkUrl?: string;            // 웹사이트 또는 연락처
  durationHours: 6 | 12 | 24;  // 6시간(500P), 12시간(1000P), 24시간(2000P)
  costPoints: 500 | 1000 | 2000;
  promotedAt: string;          // ISO Date string
  expiresAt: string;           // ISO Date string
  cheerCount: number;          // 응원 / 관심 클릭 수
  ideaTitle?: string;          // 연관된 사용자 아이디어
}
