import { CoFounder } from '../types';

export interface CoFounderCandidateTemplate {
  name: string;
  role: string;
  avatar: string;
  badge: string;
  bio: string;
  pitchTemplate: (category: string, ideaTitle: string) => string;
}

export const COFOUNDER_POOL: CoFounderCandidateTemplate[] = [
  {
    name: '김지훈',
    role: '소프트웨어 전공 / 백엔드 & AI 개발자',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    badge: 'AI 모델링 & 데이터 파이프라인 우수자',
    bio: '전국 대학생 소프트웨어 공모전 수상, 풀스택 및 딥러닝 실무 프로젝트 3회 경험',
    pitchTemplate: (cat, title) =>
      `안녕하세요! 저도 "${cat}" 분야에서 "${title}" 문제에 깊이 공감하고 있었습니다. 함께 AI 기반 시제품을 설계하고 개발해보면 시너지가 아주 클 것 같아요!`,
  },
  {
    name: '이수진',
    role: '산업디자인 전공 / UX·UI & 브랜드 디자이너',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    badge: '사용자 경험(UX) 전문 연구원',
    bio: '글로벌 디자인 어워드 입상, 피그마 기반 모바일 앱 UI 프로토타이핑 및 사용성 테스트 전문',
    pitchTemplate: (cat, title) =>
      `안녕하세요! "${title}" 아이디어의 디자인과 사용자 인터페이스(UI)를 직관적이고 세련되게 다듬어줄 파트너를 찾고 계신가요? 함께 멋진 디자인 프로토타입을 완성해요!`,
  },
  {
    name: '박민우',
    role: '경영·마케팅 전공 / 창업 기획자',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    badge: '비즈니스 모델(BM) 분석가',
    bio: '초기 스타트업 엑셀러레이팅 프로그램 수료, 시장 조사 및 자금 조달 피치덱 제작 전문',
    pitchTemplate: (cat, title) =>
      `반갑습니다! "${title}" 솔루션의 수익 모델과 비즈니스 확장성을 함께 다듬어 실제 시장에 출시해보고 싶습니다. 대화 나눠봐요!`,
  },
  {
    name: '최서연',
    role: '컴퓨터공학 & 데이터분석 전공',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    badge: '빅데이터 및 알고리즘 개발자',
    bio: '청소년 알고리즘 경진대회 메달리스트, 실시간 데이터 분석 알고리즘 구현 전문',
    pitchTemplate: (cat, title) =>
      `안녕하세요! "${cat}" 분야의 "${title}" 아이디어를 들으니 데이터 기반으로 충분히 승산이 있어 보이네요. 개발 및 데이터 분석 파트너로 합류하고 싶습니다!`,
  },
  {
    name: '정현우',
    role: '로봇·전자공학 전공 / 하드웨어 엔지니어',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    badge: '임베디드 & IoT 시제품 제작자',
    bio: '아두이노/라즈베리파이 센서 제어 및 3D 프린팅 하드웨어 제작 노하우 보유',
    pitchTemplate: (cat, title) =>
      `안녕하세요! "${title}" 문제 해결을 위한 하드웨어 장치나 IoT 센서 연동 프로토타입 제작을 맡을 수 있습니다. 함께 상상을 현실로 만들어봐요!`,
  },
  {
    name: '강다은',
    role: '서비스 기획 & 커뮤니티 리더',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    badge: '고객 경험 & 창업 커뮤니티 빌더',
    bio: '학생 창업 동아리 대표 역임, 초기 사용자 피드백 수집 및 유저 성장 전략 수립 경험',
    pitchTemplate: (cat, title) =>
      `안녕하세요! "${title}" 아이디어가 실제 타겟 유저들에게 매우 매력적으로 다가갈 것 같습니다. 초기 유저 확보와 커뮤니티 기획을 함께 만들어가요!`,
  },
  {
    name: '윤성민',
    role: '인공지능·모바일 앱 개발자',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    badge: 'React Native & Flutter 엔지니어',
    bio: '스마트폰 앱스토어 앱 2건 출시 경험, 크로스플랫폼 앱 개발 및 서버 연동 특화',
    pitchTemplate: (cat, title) =>
      `안녕하세요! "${cat}" 카테고리의 "${title}" 서비스를 빠르게 모바일 앱 프로토타입으로 구현해보고 싶습니다. 관심 있으시면 대화해요!`,
  },
  {
    name: '한지원',
    role: '환경·생명공학 연구원',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    badge: 'ESG & 친환경 사회혁신 연구자',
    bio: '청소년 과학발명품 경진대회 장려상, 친환경 소재 및 소셜 임팩트 프로젝트 주도',
    pitchTemplate: (cat, title) =>
      `반갑습니다! "${title}" 문제는 사회적·소셜 가치가 매우 높은 문제라고 생각합니다. 함께 진정성 있는 솔루션을 기획해보면 좋겠습니다!`,
  },
  {
    name: '송태양',
    role: '미디어·콘텐츠 크리에이티브 디렉터',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    badge: '영상 스토링텔링 & 바이럴 마케터',
    bio: '유튜브/숏폼 콘텐츠 제작 50만 뷰 달성, 소셜 미디어 바이럴 홍보 및 인플루언서 연계 전문',
    pitchTemplate: (cat, title) =>
      `안녕하세요! "${title}" 아이디어를 숏폼 및 소셜 미디어로 바이럴시키면 폭발적인 반응을 이끌어낼 수 있을 것 같아요. 홍보 마케팅 팀원으로 함께해요!`,
  },
  {
    name: '백소율',
    role: '핀테크 & 자산관리 기획자',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80',
    badge: '금융 및 데이터 보안 솔루션 연구자',
    bio: '금융 아이디어 공모전 대상, 결제 및 포인트 보상 시스템 구조 설계 경험 보유',
    pitchTemplate: (cat, title) =>
      `반갑습니다! "${title}" 서비스에 포인트 리워드나 경제적 선순환 구조를 접목하면 지속 가능한 모델이 될 것입니다. 함께 논의해보고 싶어요!`,
  },
];

let lastSelectedIndex = -1;

export function getRandomCofounder(category: string = '일반', ideaTitle: string = '아이디어'): CoFounder {
  // Pick a random index different from lastSelectedIndex to ensure variety
  let randomIndex = Math.floor(Math.random() * COFOUNDER_POOL.length);
  if (COFOUNDER_POOL.length > 1 && randomIndex === lastSelectedIndex) {
    randomIndex = (randomIndex + 1) % COFOUNDER_POOL.length;
  }
  lastSelectedIndex = randomIndex;

  const template = COFOUNDER_POOL[randomIndex];
  const matchScore = Math.floor(Math.random() * 8) + 92; // 92 ~ 99

  return {
    id: `cofounder-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
    name: template.name,
    role: template.role,
    avatar: template.avatar,
    badge: template.badge,
    matchScore,
    pitch: template.pitchTemplate(category, ideaTitle),
    bio: template.bio,
  };
}
