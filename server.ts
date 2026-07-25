import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Helper to get Gemini Client safely
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey: apiKey,
  });
}

// 1. API: Mindmap Analysis & Keyword Extraction
app.post('/api/gemini/analyze-mindmap', async (req, res) => {
  try {
    const { problemTitle, problemDescription, category, answers } = req.body;
    const ai = getGeminiClient();

    if (ai) {
      const prompt = `
당신은 대한민국 대표 청소년/창업 발명 멘토 "PROBIX AI"입니다.
사용자가 발견한 문제와 6가지 핵심 질문 답변을 바탕으로 마인드맵 노드와 키워드를 추출해주세요.

[문제 정보]
카테고리: ${category}
문제 제목: ${problemTitle}
문제 설명: ${problemDescription}

[사용자 답변]
① 해결하고자 하는 핵심 문제: ${answers.q1_interest || '미입력'}
② 주요 영향 대상 (누가): ${answers.q2_target || '미입력'}
③ 발생 환경 및 시기: ${answers.q3_context || '미입력'}
④ 현재 대처 방법: ${answers.q4_currentSolution || '미입력'}
⑤ 이상적인 해결 모습: ${answers.q5_idealResult || '미입력'}

JSON 구조로 반환해주세요:
- extractedKeywords: 5개의 핵심 키워드 단어 배열 (예: ["시간 관리", "창의성", "협업", "맞춤형 가이드", "심리적 부담"])
- nodes: 마인드맵에 배치할 5개 분기 노드 배열
  - id: "node-1" ~ "node-5"
  - label: 노드 간략 제목 (예: "대상: 학생 및 취준생")
  - type: 'target' | 'context' | 'solution' | 'ideal' | 'keyword' 중 하나
  - description: 세부 설명 (1~2문장)
`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              extractedKeywords: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              nodes: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    label: { type: Type.STRING },
                    type: { type: Type.STRING },
                    description: { type: Type.STRING },
                  },
                  required: ['id', 'label', 'type', 'description'],
                },
              },
            },
            required: ['extractedKeywords', 'nodes'],
          },
        },
      });

      const parsed = JSON.parse(response.text || '{}');
      if (parsed.extractedKeywords && parsed.nodes) {
        return res.json(parsed);
      }
    }

    // Fallback if AI Key absent or parse failed
    return res.json(getFallbackMindmap(problemTitle, category, answers));
  } catch (err) {
    console.error('Mindmap API error:', err);
    return res.json(getFallbackMindmap(req.body.problemTitle, req.body.category, req.body.answers));
  }
});

// 2. API: Idea Generation (Generates 3 problem-driven ideas)
app.post('/api/gemini/generate-ideas', async (req, res) => {
  try {
    const { problemTitle, problemDescription, category, keywords, answers } = req.body;
    const ai = getGeminiClient();

    if (ai) {
      const prompt = `
당신은 대한민국 최고 기술 창업 멘토입니다.
반드시 사용자가 정의한 "문제 발견 내용"과 "마인드맵 키워드"를 해결하기 위한 창용적이고 현실적인 아이디어 3가지를 생성해주세요.
중요: 절대 유저 대신 단순히 막연한 아이디어를 던지지 말고, 사용자가 답변한 대상(${answers?.q2_target || '사용자'})과 이상적 요구(${answers?.q5_idealResult || '결과'})에 맞춘 구체적 비즈니스/제품/서비스 솔루션을 제안해야 합니다.

[문제 배경]
카테고리: ${category}
문제: ${problemTitle}
세부사항: ${problemDescription}
추출 키워드: ${keywords?.join(', ')}

3개의 아이디어를 JSON 배열로 반환하세요. 각 아이디어 속성:
- title: 명확하고 신선한 아이디어 이름
- description: 작동 방식과 해결 원리 설명 (2~3문장)
- expectedEffect: 기대 효과 (정량적/정성적 이점)
- difficulty: "쉬움" | "보통" | "어려움" 중 하나
- keyFeatures: 핵심 기능 3가지 문자열 배열
`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                expectedEffect: { type: Type.STRING },
                difficulty: { type: Type.STRING },
                keyFeatures: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
              },
              required: ['title', 'description', 'expectedEffect', 'difficulty', 'keyFeatures'],
            },
          },
        },
      });

      const ideas = JSON.parse(response.text || '[]');
      if (Array.isArray(ideas) && ideas.length > 0) {
        return res.json({ ideas });
      }
    }

    return res.json({ ideas: getFallbackIdeas(problemTitle, category, keywords) });
  } catch (err) {
    console.error('Idea Generation API error:', err);
    return res.json({ ideas: getFallbackIdeas(req.body.problemTitle, req.body.category, req.body.keywords) });
  }
});

// 3. API: Idea Evaluation
app.post('/api/gemini/evaluate-idea', async (req, res) => {
  try {
    const { problemTitle, category, ideaTitle, ideaDescription, expectedEffect, keyFeatures } = req.body;
    const ai = getGeminiClient();

    if (ai) {
      const prompt = `
당신은 기술 창업 심사위원 및 발명대회 심사위원장입니다.
아래 아이디어를 4가지 항목(참신성, 실현 가능성, 경제성, 지속가능성)으로 평가하고, 대한민국 대표 성공 사례 10개 및 실패 사례 10개 벤치마크에 기초하여 심층 인용 평가를 실시하세요.

[대한민국 성공 사례 10개 벤치마크]
1. 배달의민족 ("문제 빈도가 높은가?")
2. 당근마켓 (지역 기반 확장성)
3. 토스 (사용자 경험 개선 정도)
4. 직방 (정보 비대칭 해결 여부)
5. 오늘의집 (커뮤니티 확장 가능성)
6. 마켓컬리 (기존보다 얼마나 편리한가?)
7. 무신사 (사용자 충성도)
8. 야놀자 (디지털 전환 가능성)
9. 삼쩜삼 (사용자가 스스로 하기 어려운 문제인가?)
10. 뤼이드 (AI 활용 적절성)

[대한민국 실패 사례 10개 벤치마크]
1. 타다 ("법적 규제를 검토했는가?")
2. 옐로모바일 (성장 전략의 지속 가능성)
3. 메쉬코리아/부릉 (수익 모델 존재 여부)
4. 위자드웍스 (돈을 어떻게 벌 것인가?)
5. 원더스 (운영비 예측 가능성)
6. 플레이팅 (실제 수요 존재 여부)
7. 리화이트 (경쟁사 분석 여부)
8. 띵동 (대기업과 경쟁 가능한가?)
9. 퀵퀵 (기존 서비스와의 차이점)
10. 캐주얼스텝스/스내피 (장기 비전 존재 여부)

[평가 대상 아이디어]
아이디어명: ${ideaTitle}
카테고리: ${category}
원래 문제: ${problemTitle}
설명: ${ideaDescription}
기대효과: ${expectedEffect}
핵심기능: ${keyFeatures?.join(', ')}

JSON 구조로 반환하세요:
- noveltyScore: 참신성 점수 (1~100)
- feasibilityScore: 실현 가능성 점수 (1~100)
- economicsScore: 경제성 점수 (1~100)
- sustainabilityScore: 지속가능성 점수 (1~100)
- totalScore: 4개 평균 기반 종합점수 (1~100)
- pros: 장점 3가지 문장 배열
- cons: 아쉬운 점 또는 단점 2가지 문장 배열
- improvements: 앞으로의 발전/개선 방향 2가지 문장 배열
- benchmarks: 위 벤치마크 성공/실패 사례 중 해당 아이디어에 가장 유의미하게 적용되는 사례 4개를 선택한 분석 배열
  - caseName: 사례명 (예: "배달의민족", "토스", "타다", "위자드웍스")
  - type: "success" | "failure"
  - keyQuestion: 벤치마크 핵심 질문 (예: "문제 빈도가 높은가?", "법적 규제를 검토했는가?")
  - analysis: 이 아이디어가 해당 사례의 교훈에 비추어 볼 때 가지는 장점이나 유의할 점 (2문장)
`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              noveltyScore: { type: Type.NUMBER },
              feasibilityScore: { type: Type.NUMBER },
              economicsScore: { type: Type.NUMBER },
              sustainabilityScore: { type: Type.NUMBER },
              totalScore: { type: Type.NUMBER },
              pros: { type: Type.ARRAY, items: { type: Type.STRING } },
              cons: { type: Type.ARRAY, items: { type: Type.STRING } },
              improvements: { type: Type.ARRAY, items: { type: Type.STRING } },
              benchmarks: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    caseName: { type: Type.STRING },
                    type: { type: Type.STRING },
                    keyQuestion: { type: Type.STRING },
                    analysis: { type: Type.STRING },
                  },
                  required: ['caseName', 'type', 'keyQuestion', 'analysis'],
                },
              },
            },
            required: ['noveltyScore', 'feasibilityScore', 'economicsScore', 'sustainabilityScore', 'totalScore', 'pros', 'cons', 'improvements', 'benchmarks'],
          },
        },
      });

      const evalData = JSON.parse(response.text || '{}');
      if (evalData.totalScore) {
        return res.json(evalData);
      }
    }

    return res.json(getFallbackEvaluation(ideaTitle, category));
  } catch (err) {
    console.error('Idea Evaluation API error:', err);
    return res.json(getFallbackEvaluation(req.body.ideaTitle, req.body.category));
  }
});

// 4. API: Co-founder Simulated Chat
app.post('/api/gemini/cofounder-chat', async (req, res) => {
  try {
    const { cofounderName, role, ideaTitle, ideaDescription, category, userMessage, conversationHistory } = req.body;
    const ai = getGeminiClient();

    if (ai) {
      // Build proper alternating multi-turn chat contents
      const chatHistory = (conversationHistory || [])
        .filter((m: { sender: string; text: string }) => m.sender === 'user' || m.sender === 'cofounder')
        .map((m: { sender: string; text: string }) => ({
          role: (m.sender === 'user' ? 'user' : 'model') as 'user' | 'model',
          parts: [{ text: m.text }],
        }));

      const cleanedContents: { role: 'user' | 'model'; parts: { text: string }[] }[] = [];
      for (const item of chatHistory) {
        if (cleanedContents.length > 0 && cleanedContents[cleanedContents.length - 1].role === item.role) {
          cleanedContents[cleanedContents.length - 1].parts[0].text += `\n${item.parts[0].text}`;
        } else {
          cleanedContents.push({
            role: item.role,
            parts: [{ text: item.parts[0].text }],
          });
        }
      }

      if (cleanedContents.length > 0 && cleanedContents[cleanedContents.length - 1].role === 'user') {
        cleanedContents[cleanedContents.length - 1].parts[0].text += `\n${userMessage}`;
      } else {
        cleanedContents.push({
          role: 'user',
          parts: [{ text: userMessage }],
        });
      }

      const systemInstruction = `
당신은 PROBIX 스타트업 매칭 서비스에서 만난 실시간 AI 동업자 파트너 "${cofounderName || '김지훈'}" (${role || '백엔드/AI 개발자'})입니다.
사용자(창업자)와 함께 아이디어 "${ideaTitle}" (${category || '창업 아이디어'})를 실행하고 서비스로 구현해나가는 실제 스타트업 Co-Founder입니다.
아이디어 배경/설명: ${ideaDescription || ideaTitle}

[필수 대화 지침]
1. 정형화되거나 매번 똑같은 AI 인사말("좋은 생각이십니다", "기술 관점에서 중요합니다")을 절대 금지합니다.
2. 사용자의 최신 메시지("${userMessage}")에 담긴 의도와 세부 내용을 정확히 파악하여, 실제 팀원처럼 구체적이고 진솔한 의견을 나누세요.
3. 당신의 역할(${role}) 관점에서 실행 가능한 기술 스펙, UI/UX 구조, 타겟 고객 반응, 수익모델(BM), 런칭 일정 등을 자연스럽게 주고받으세요.
4. 어조: 친근하고 솔직하며 격의 없는 동료 간의 해요체.
5. 분량: 2~4문장으로 자연스럽게 대화하세요.
`;

      let responseText = '';
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-3.6-flash',
          contents: cleanedContents,
          config: {
            systemInstruction,
            temperature: 0.9,
          },
        });
        responseText = response.text?.trim() || '';
      } catch (e: any) {
        console.warn('Gemini 3.6 Flash attempt error, trying fallback model:', e?.message || e);
        try {
          const response = await ai.models.generateContent({
            model: 'gemini-2.0-flash',
            contents: cleanedContents,
            config: {
              systemInstruction,
              temperature: 0.9,
            },
          });
          responseText = response.text?.trim() || '';
        } catch (e2: any) {
          console.error('Gemini 2.0 Flash attempt also failed:', e2?.message || e2);
        }
      }

      if (responseText) {
        return res.json({ responseText });
      }
    }

    // Dynamic contextual fallback if API call returned empty or failed
    const fallbackReply = generateSmartCofounderFallback(
      userMessage,
      ideaTitle,
      role,
      conversationHistory
    );
    return res.json({ responseText: fallbackReply });
  } catch (err) {
    console.error('Cofounder Chat error:', err);
    const fallbackReply = generateSmartCofounderFallback(
      req.body.userMessage,
      req.body.ideaTitle,
      req.body.role,
      req.body.conversationHistory
    );
    return res.json({ responseText: fallbackReply });
  }
});

function generateSmartCofounderFallback(
  userMsg: string,
  ideaTitle: string = '아이디어',
  role: string = '기술 파트너',
  history: any[] = []
): string {
  const msg = (userMsg || '').trim();
  const lowerMsg = msg.toLowerCase();
  const cleanInput = msg.replace(/[?!.,~]/g, '');

  // Extract non-stop words to echo context
  const words = cleanInput.split(/\s+/).filter((w) => w.length > 1);
  const keywordPrompt = words.slice(-3).join(', ');

  if (lowerMsg.includes('안녕') || lowerMsg.includes('반갑') || lowerMsg.includes('시작') || lowerMsg.includes('소개')) {
    return `안녕하세요! "${ideaTitle}" 팀으로 합류하게 된 ${role} 파트너입니다. 창업자님의 아이디어를 듣고 꼭 함께 만들어보고 싶었어요! 우선 가장 고민되는 부분이나 당장 검증하고 싶은 기능이 있으신가요?`;
  }

  if (lowerMsg.includes('개발') || lowerMsg.includes('기술') || lowerMsg.includes('백엔드') || lowerMsg.includes('프론트') || lowerMsg.includes('스택') || lowerMsg.includes('언어') || lowerMsg.includes('db') || lowerMsg.includes('서버')) {
    return `말씀해주신 "${keywordPrompt || '개발 스택'}" 관련해서, 속도감 있는 프로토타입 제작을 위해 백엔드는 Node.js/Express, 데이터베이스는 PostgreSQL/Firestore를 고려하고 있습니다. 핵심 API 인터페이스부터 설계해볼까요?`;
  }

  if (lowerMsg.includes('디자인') || lowerMsg.includes('ui') || lowerMsg.includes('ux') || lowerMsg.includes('화면') || lowerMsg.includes('로고') || lowerMsg.includes('레이아웃')) {
    return `사용자가 첫 접속 시 3초 만에 핵심 가치를 이해할 수 있도록 컴팩트하고 직관적인 UI 와이어프레임을 구상 중입니다. 언급하신 "${keywordPrompt}" 요소를 메인 홈 화면에 강조해보는 건 어떨까요?`;
  }

  if (lowerMsg.includes('마케팅') || lowerMsg.includes('유저') || lowerMsg.includes('고객') || lowerMsg.includes('홍보') || lowerMsg.includes('타겟') || lowerMsg.includes('인터뷰')) {
    return `초기 사용자 반응 확보가 제일 중요하죠! 관련 타겟 유저들이 모여있는 커뮤니티나 SNS에 사전 등록 랜딩페이지를 만들어서 직접 피드백을 수집해보는 테스트를 추천합니다.`;
  }

  if (lowerMsg.includes('수익') || lowerMsg.includes('bm') || lowerMsg.includes('돈') || lowerMsg.includes('가격') || lowerMsg.includes('유료') || lowerMsg.includes('비즈니스')) {
    return `수익 모델(BM)에 대한 아주 현실적인 지적이시네요! 초기엔 기본 핵심 기능을 무료로 풀어 유저 베이스를 만든 뒤, 맞춤 분석 리포트나 프리미엄 가이드를 월 구독 형태(Freemium)로 제공하는 방안이 유력할 것 같아요.`;
  }

  if (cleanInput.length > 0) {
    return `"${cleanInput}" 말씀이시군요! "${ideaTitle}" 프로젝트에 말씀해주신 의견을 반영하면 사용자의 만족도를 크게 높일 수 있을 것 같아요. 이 아이디어를 구체적인 실행 기능으로 풀어볼까요, 아니면 다른 핵심 요소도 검토해볼까요?`;
  }

  return `파트너로서 "${ideaTitle}"의 가치를 한 단계 올릴 수 있는 방향으로 적극 실행해보겠습니다! 추가로 신경쓰이는 세부 사항이 있다면 말씀해주세요.`;
}

// Fallback Generators
function getFallbackMindmap(title: string, category: string, answers: any) {
  const target = answers?.q2_target || '해당 문제로 영향받는 유저 및 학생';
  const context = answers?.q3_context || '문제 발생 환경 및 상시 상황';
  const solution = answers?.q4_currentSolution || '기존의 임시 대처 방식';
  const ideal = answers?.q5_idealResult || '원활한 해결 및 편의성 증대';

  return {
    extractedKeywords: [category, '사용자 경험', '효율성 향상', '자동화', '심리적 편의'],
    nodes: [
      { id: 'node-1', label: `핵심 타겟: ${target.slice(0, 15)}`, type: 'target', description: `영향을 받는 주요 대상은 "${target}" 입니다.` },
      { id: 'node-2', label: `발생 환경: ${context.slice(0, 15)}`, type: 'context', description: `주로 "${context}" 조건에서 문제가 발생합니다.` },
      { id: 'node-3', label: `현재 대응: ${solution.slice(0, 15)}`, type: 'solution', description: `현재는 "${solution}" 방식으로 임시 대응 중입니다.` },
      { id: 'node-4', label: `이상적 목표: ${ideal.slice(0, 15)}`, type: 'ideal', description: `최종 목표는 "${ideal}" 상태를 만드는 것입니다.` },
      { id: 'node-5', label: `핵심 동인: ${category} 혁신`, type: 'keyword', description: '문제의 근본적인 원인을 기술과 프로세스로 혁신해야 합니다.' },
    ],
  };
}

function getFallbackIdeas(title: string, category: string, keywords: string[]) {
  const kw1 = keywords?.[0] || category;
  const kw2 = keywords?.[1] || '맞춤 솔루션';

  return [
    {
      title: `스마트 ${kw1} 자동화 서비스`,
      description: `"${title}" 문제를 해결하기 위해 AI 데이터 모니터링과 사용자 가이드를 결합한 직관적 스마트 솔루션입니다.`,
      expectedEffect: '문제 해결 시간 50% 단축 및 실수율 최소화',
      difficulty: '보통',
      keyFeatures: ['실시간 상황 알림 및 대시보드', '맞춤 가이드라인 자동 생성', '유저 간 노하우 공유 커뮤니티'],
    },
    {
      title: `초간편 ${kw2} 플랫폼`,
      description: '복잡한 절차 없이 모바일 앱으로 3초 만에 문제를 진단하고 최적 대안을 연결해주는 모바일 기반 서비스입니다.',
      expectedEffect: '접근성 대폭 향상 및 비용 30% 절감',
      difficulty: '쉬움',
      keyFeatures: ['원터치 문제 등록 및 즉시 진단', '카테고리별 전문가/동료 연결', '단계별 해결 체크리스트'],
    },
    {
      title: `하이브리드 ${category} 스마트 인프라`,
      description: '온·오프라인 모듈을 결합하여 기존 시스템에 부드럽게 연동되는 혁신적인 센서/SaaS 통합 솔루션입니다.',
      expectedEffect: '장기적 재발 방지 및 지속가능한 인프라 확보',
      difficulty: '어려움',
      keyFeatures: ['AI 예측 기반 선제적 경보', '모듈형 장치 연동', '종합 리포트 자동 발급'],
    },
  ];
}

function getFallbackEvaluation(ideaTitle: string, category: string) {
  return {
    noveltyScore: 88,
    feasibilityScore: 82,
    economicsScore: 85,
    sustainabilityScore: 90,
    totalScore: 86,
    pros: [
      `기존 ${category} 분야의 고질적 불편점을 명확한 타겟에 맞추어 해결하려고 시도했습니다.`,
      '모바일 접근성을 활용해 사용자가 부담 없이 참여할 수 있는 동선이 뛰어납니다.',
      '초기 개발 비용 대비 사용자 파급력이 높아 빠르게 확장 가능한 모델입니다.',
    ],
    cons: [
      '초기 유저 확보를 위한 지속적인 커뮤니티 활성화 방안이 보완될 필요가 있습니다.',
      '유사 경쟁 서비스 진입 시 독자적인 데이터 차별화 요소 확보가 중요합니다.',
    ],
    improvements: [
      '첫 100명의 타겟 유저를 대상으로 소규모 시제품(MVP) 사용 테스트를 실시해보세요.',
      '사용자 피드백을 실시간 수집할 수 있는 유저 반응 지표 채널을 연동하세요.',
    ],
    benchmarks: [
      {
        caseName: '배달의민족',
        type: 'success',
        keyQuestion: '문제 빈도가 높은가?',
        analysis: '일상에서 지속적으로 반복되는 문제를 간편한 UI/UX로 풀어내어 높은 사용 빈도와 재방문율 확보가 예상됩니다.',
      },
      {
        caseName: '토스',
        type: 'success',
        keyQuestion: '사용자 경험 개선 정도',
        analysis: '복잡했던 기존 절차를 몇 단계 단축시키는 획기적인 편의성을 제공하여 유저 유입 장벽을 대폭 낮췄습니다.',
      },
      {
        caseName: '타다',
        type: 'failure',
        keyQuestion: '법적 규제를 검토했는가?',
        analysis: '서비스 확장 시 관련 법령 및 규제 기관과의 마찰 가능성을 미리 검토하고 합법적 인프라 가이드라인을 준비해야 합니다.',
      },
      {
        caseName: '위자드웍스',
        type: 'failure',
        keyQuestion: '돈을 어떻게 벌 것인가?',
        analysis: '명확한 비즈니스 모델(BM) 없이 유저 모객에만 의존하지 않도록 초기 B2B/B2C 수익 창출 구조를 명확히 설계하세요.',
      },
    ],
  };
}

// Start Server (Vite in Dev mode, Static in Prod)
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[PROBIX Server] running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
