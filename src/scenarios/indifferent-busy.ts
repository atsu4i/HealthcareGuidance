// シナリオ3: 無関心・多忙を理由にする対象者
import { HealthGuidanceScenario } from '@/types'

export const indifferentBusyScenario: HealthGuidanceScenario = {
  id: 'indifferent-busy',
  name: '鈴木美咲（無関心・多忙）',
  description: '健康への関心が低く、忙しさを理由に行動変容を避ける対象者',
  personalInfo: {
    fullName: '鈴木美咲',
    age: 38,
    gender: '女性',
    occupation: 'システムエンジニア',
    familyStructure: '夫、子供1人（5歳）',
    address: '東京都江東区'
  },
  healthCheckResults: {
    date: '2024年10月',
    height: 158,
    weight: 68.0,
    bmi: 27.2,
    waistCircumference: 88,
    bloodPressure: {
      systolic: 132,
      diastolic: 85
    },
    bloodTest: {
      fastingBloodSugar: 105,
      hba1c: 5.8,
      ldlCholesterol: 148,
      hdlCholesterol: 52,
      triglycerides: 165,
      ast: 28,
      alt: 38,
      gammaGtp: 42
    },
    urineTest: {
      protein: '陰性',
      sugar: '陰性'
    }
  },
  lifestyle: {
    diet: {
      pattern: '不規則、手軽なもの中心',
      details: [
        '朝食：菓子パンとコーヒー',
        '昼食：デスクでコンビニ弁当',
        '夕食：惣菜や冷凍食品、インスタント食品',
        '間食：チョコレート、スナック菓子',
        '飲み物：ペットボトルのカフェラテ、ジュース'
      ],
      problems: [
        '加工食品が多い',
        '野菜が少ない',
        '糖質過多',
        '食事時間が不規則'
      ]
    },
    exercise: {
      frequency: 'なし',
      details: [
        '通勤は電車、駅から会社まで徒歩5分',
        'デスクワークで座りっぱなし',
        '休日は家事と育児で精一杯'
      ],
      barriers: [
        '仕事が忙しい',
        '育児で時間がない',
        '疲れている',
        '運動は苦手'
      ]
    },
    alcohol: {
      frequency: '週1-2回',
      amount: 'ワイングラス2-3杯',
      details: [
        '週末のストレス解消',
        '夫と一緒に飲む'
      ]
    },
    smoking: {
      status: '非喫煙'
    },
    sleep: {
      duration: '5-6時間',
      quality: '悪い',
      problems: [
        '夜遅くまで家事',
        '子供が夜泣きすることも',
        '朝早く起きなければならない',
        '慢性的な睡眠不足'
      ]
    },
    stress: {
      level: '高',
      sources: [
        '仕事のプレッシャー',
        '育児との両立',
        '時間がない',
        '夫の協力が少ない'
      ],
      copingMethods: [
        '甘いものを食べる',
        'スマホを見る',
        '週末の飲酒'
      ]
    }
  },
  medicalHistory: {
    currentDiseases: [],
    pastDiseases: ['産後うつ（3年前）'],
    medications: [],
    familyHistory: [
      '母：肥満、糖尿病予備軍',
      '祖母：糖尿病'
    ]
  },
  psychologicalProfile: {
    personality: '真面目で完璧主義。自分のことは後回しにしがち。',
    responseStyle: '無関心',
    motivationLevel: '低',
    healthLiteracy: '中',
    concerns: [
      '時間がない',
      '優先順位が低い',
      '今すぐ困っていない',
      '自分のことより家族や仕事'
    ],
    strengths: [
      '真面目で責任感がある',
      '一度やると決めたら頑張る',
      '家族のためなら頑張れる',
      '情報収集能力がある'
    ]
  },
  backgroundStory: 'システムエンジニアとして働く38歳の女性。仕事と育児の両立で毎日忙しく、自分の健康は後回しになっている。健康診断の結果は「まあこんなもの」と気にしていない。母親も糖尿病予備軍だが、「まだ若いから大丈夫」と考えている。夫の協力が少なく、家事育児の負担が大きい。時間がないことを理由に、何か新しいことを始めることに消極的。',
  guidanceGoals: [
    '健康の優先順位を上げる',
    '時間がなくてもできる小さな変化を見つける',
    '家族を巻き込んだ健康づくり',
    '食事の質の改善（特に野菜）'
  ],
  expectedChallenges: [
    '時間がないという言い訳',
    '優先順位の低さ',
    '疲労感',
    '完璧主義（できないならやらない）',
    '夫の協力を得る'
  ]
}

export default indifferentBusyScenario
