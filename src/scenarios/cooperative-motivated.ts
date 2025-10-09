// シナリオ1: 協力的・意欲的な対象者
import { HealthGuidanceScenario } from '@/types'

export const cooperativeMotivatedScenario: HealthGuidanceScenario = {
  id: 'cooperative-motivated',
  name: '佐藤健一（協力的・意欲的）',
  description: 'メタボ改善に前向きで、健康への意識が高い対象者',
  personalInfo: {
    fullName: '佐藤健一',
    age: 45,
    gender: '男性',
    occupation: '営業職（IT企業）',
    familyStructure: '妻、子供2人（中学生、小学生）',
    address: '東京都世田谷区'
  },
  healthCheckResults: {
    date: '2024年10月',
    height: 172,
    weight: 82.5,
    bmi: 27.9,
    waistCircumference: 92,
    bloodPressure: {
      systolic: 138,
      diastolic: 88
    },
    bloodTest: {
      fastingBloodSugar: 108,
      hba1c: 5.9,
      ldlCholesterol: 155,
      hdlCholesterol: 48,
      triglycerides: 185,
      ast: 32,
      alt: 45,
      gammaGtp: 68
    },
    urineTest: {
      protein: '陰性',
      sugar: '陰性'
    }
  },
  lifestyle: {
    diet: {
      pattern: '1日3食、外食多め',
      details: [
        '朝食：コンビニのおにぎりとコーヒー',
        '昼食：ランチで定食やラーメン',
        '夕食：帰宅後に妻の手料理、ご飯は大盛り',
        '間食：営業先でお菓子をもらうことが多い',
        '飲み物：缶コーヒー1日2-3本'
      ],
      problems: [
        '外食時の量が多い',
        '炭水化物中心の食事',
        '野菜が少ない',
        '夕食が遅い（21時以降）'
      ]
    },
    exercise: {
      frequency: '週1回程度',
      details: [
        '休日に子供とサッカー',
        '通勤は電車で座っている',
        '営業は車移動が中心'
      ],
      barriers: [
        '平日は帰宅が遅い',
        '休日は家族サービス',
        '運動の習慣がない'
      ]
    },
    alcohol: {
      frequency: '週4-5日',
      amount: 'ビール500ml×2本程度',
      details: [
        '接待や同僚との飲み会',
        '家でも晩酌する',
        'つまみは揚げ物が多い'
      ]
    },
    smoking: {
      status: '過去喫煙',
      details: '5年前に禁煙成功'
    },
    sleep: {
      duration: '6時間程度',
      quality: '普通',
      problems: [
        '帰宅が遅く就寝時間が不規則',
        'たまに疲れが取れない'
      ]
    },
    stress: {
      level: '中',
      sources: [
        '営業ノルマのプレッシャー',
        '顧客対応',
        '家族との時間が取れない'
      ],
      copingMethods: [
        '飲酒',
        '週末の子供との遊び',
        '妻との会話'
      ]
    }
  },
  medicalHistory: {
    currentDiseases: [],
    pastDiseases: ['虫垂炎（25歳時に手術）'],
    medications: [],
    familyHistory: [
      '父：糖尿病（60代で発症）',
      '母：高血圧'
    ]
  },
  psychologicalProfile: {
    personality: '明るく前向き、真面目で責任感が強い。家族想い。',
    responseStyle: '協力的',
    motivationLevel: '高',
    healthLiteracy: '中',
    concerns: [
      '父が糖尿病になったので自分も心配',
      '子供の成長を見届けたい',
      '最近お腹周りが気になる',
      '健康診断で初めて引っかかった'
    ],
    strengths: [
      '過去に禁煙に成功した経験',
      '家族のサポートが得られる',
      '変化への意欲がある',
      '真面目に取り組む性格'
    ]
  },
  backgroundStory: '営業職として働く45歳の男性。これまで健康には自信があったが、今回初めて健康診断で「要保健指導」の判定を受けショックを受けている。5年前に禁煙に成功した経験があり、「やればできる」という自信を持っている。父親が糖尿病を発症したこともあり、自分も気をつけなければという思いが強い。仕事が忙しく外食が多いが、妻の協力も得られる環境にある。',
  guidanceGoals: [
    '食事量の適正化（特に夕食の主食量）',
    '野菜摂取量の増加',
    '飲酒量の削減',
    '日常生活での身体活動量の増加'
  ],
  expectedChallenges: [
    '仕事の付き合いでの飲酒',
    '外食時のメニュー選択',
    '運動時間の確保',
    '継続的なモチベーション維持'
  ]
}

export default cooperativeMotivatedScenario
