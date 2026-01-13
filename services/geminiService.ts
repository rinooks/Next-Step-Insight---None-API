import { GoogleGenAI, Type } from "@google/genai";
import { SurveyData, AnalysisResult } from "../types";

export const analyzeExitSurvey = async (data: SurveyData, apiKey: string): Promise<AnalysisResult> => {
  // API Key 유효성 체크
  if (!apiKey) {
    return {
      summary: "API 키가 입력되지 않았습니다.",
      sentiment: "분석 불가",
      rootCause: "인증 오류",
      detailedDiagnosis: "서비스 이용을 위해 유효한 Gemini API 키를 입력해 주세요.",
      strategies: ["첫 화면으로 돌아가 API 키를 입력해 주세요."]
    };
  }

  try {
    // 동적으로 인스턴스 생성
    const ai = new GoogleGenAI({ apiKey });

    const prompt = `
      당신은 '레퍼런스HRD'의 수석 HR 컨설턴트이자 조직문화 전문가입니다. 
      다음 퇴사자 설문 데이터를 심층 분석하여 경영진과 HR 담당자가 실행할 수 있는 고품질의 인사이트 리포트를 작성해 주세요.

      [퇴사자 데이터]
      - 근속연수: ${data.tenure}
      - 소속 부서: ${data.department}
      - 주 퇴사 사유: ${data.primaryReason}
      - 항목별 만족도 (5점 만점): ${JSON.stringify(data.satisfaction)}
      - NPS (순 추천 지수): ${data.nps}점 (0~10점)
      - 좋았던 점 (VoC): ${data.openEnded.bestThing || "응답 없음"}
      - 아쉬웠던 점 (VoC): ${data.openEnded.worstThing || "응답 없음"}
      - 제안 사항: ${data.openEnded.suggestion || "응답 없음"}

      위 데이터를 바탕으로 다음 JSON 스키마에 맞춰 분석 결과를 반환해 주세요.
      특히 'detailedDiagnosis' 항목에서는 퇴사자의 표면적 사유 뒤에 숨겨진 심리적 동기, 조직 구조적 문제, 그리고 해당 부서의 잠재적 리스크를 논리적이고 구체적으로 서술해야 합니다. (약 3~4문단 분량)
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING, description: "경영진 보고용 1줄 핵심 요약 (임팩트 있게)" },
            sentiment: { type: Type.STRING, description: "응답자의 주된 감정 키워드 (예: 깊은 좌절감, 아쉬움이 남는, 냉소적인 등)" },
            rootCause: { type: Type.STRING, description: "퇴사를 결심하게 된 가장 결정적인 'Trigger Point' 분석" },
            detailedDiagnosis: { type: Type.STRING, description: "데이터 간 상관관계를 기반으로 한 심층 진단 리포트. 만족도 점수와 주관식 답변의 연관성을 분석하고, 조직이 놓치고 있는 'Blind Spot'을 지적할 것." },
            strategies: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "즉시 실행 가능한 구체적이고 전략적인 HR 액션 아이템 3가지 (추상적인 조언 지양)"
            }
          },
          required: ["summary", "sentiment", "rootCause", "detailedDiagnosis", "strategies"]
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as AnalysisResult;
    } else {
      throw new Error("Gemini API 응답이 비어있습니다.");
    }

  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    // 에러 발생 시 폴백 데이터 반환
    return {
      summary: "데이터 분석 중 오류가 발생했습니다.",
      sentiment: "분석 불가",
      rootCause: "API 호출 오류",
      detailedDiagnosis: "API 키가 올바르지 않거나, 할당량이 초과되었을 수 있습니다. 입력하신 키를 다시 확인해 주세요. (Error: " + (error instanceof Error ? error.message : "Unknown") + ")",
      strategies: ["API 키를 확인해 주세요.", "잠시 후 다시 시도해 주세요."]
    };
  }
};