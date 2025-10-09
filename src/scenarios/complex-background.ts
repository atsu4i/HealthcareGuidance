// シナリオ5: 複雑な背景を持つ対象者
import { HealthGuidanceScenario } from '@/types'

export const complexBackgroundScenario: HealthGuidanceScenario = {
  id: 'complex-background',
  name: '伊藤誠（複雑な背景）',
  description: '仕事・家庭のストレスなど、複雑な背景を持つ対象者',
  personalInfo: {
    fullName: '伊藤誠',
    age: 55,
    gender: '男性',
    occupation: '中小企業経営者',
    familyStructure: '妻、息子（30歳・引きこもり）、母親（80歳・同居）',
    address: '埼玉県さいたま市'
  },
  healthCheckResults: {
    date: '2024年10月',
    height: 165,
    weight: 75.0,
    bmi: 27.5,
    waistCircumference: 94,
    bloodPressure: {
      systolic: 148,
      diastolic: 95
    },
    bloodTest: {
      fastingBloodSugar: 125,
      hba1c: 6.4,
      ldlCholesterol: 172,
      hdlCholesterol: 45,
      triglycerides: 245,
      ast: 42,
      alt: 58,
      gammaGtp: 105
    },
    urineTest: {
      protein: '±',
      sugar: '±'
    }
  },
  lifestyle: {
    diet: {
      pattern: '不規則、ストレス食い',
      details: [
        '朝食：食べないか簡単なもの',
        '昼食：取引先との外食、立ち食いそば',
        '夕食：帰宅後に妻の料理、深夜にラーメンやカップ麺',
        '間食：仕事中にお菓子、甘いもの',
        '飲み物：缶コーヒー、栄養ドリンク'
      ],
      problems: [
        'ストレスで過食',
        '深夜の食事',
        '不規則な食事時間',
        '野菜不足'
      ]
    },
    exercise: {
      frequency: 'なし',
      details: [
        '以前はゴルフをしていたが最近は行けていない',
        '車移動が中心',
        '休日も仕事か家の用事'
      ],
      barriers: [
        '会社経営で時間がない',
        '家庭の問題でストレス',
        '気力がない',
        '腰痛がある'
      ]
    },
    alcohol: {
      frequency: 'ほぼ毎日',
      amount: 'ビール500ml×2-3本、焼酎も',
      details: [
        '接待や付き合い',
        '家でのストレス解消',
        '寝酒代わり'
      ]
    },
    smoking: {
      status: '喫煙中',
      details: '1日15本、ストレスで本数が増えた'
    },
    sleep: {
      duration: '4-5時間',
      quality: '非常に悪い',
      problems: [
        '夜中に何度も目が覚める',
        '仕事や家庭のことを考えて眠れない',
        '早朝に目が覚める',
        '睡眠薬を時々使用'
      ]
    },
    stress: {
      level: '高',
      sources: [
        '会社経営の重圧（業績悪化）',
        '息子の引きこもり問題',
        '高齢の母親の介護',
        '妻との関係悪化',
        '金銭的な不安'
      ],
      copingMethods: [
        '飲酒',
        '喫煙',
        '過食',
        '一人で抱え込む'
      ]
    }
  },
  medicalHistory: {
    currentDiseases: ['高血圧（未治療）', '脂質異常症（未治療）'],
    pastDiseases: [
      '胃潰瘍（40代）',
      '腰椎椎間板ヘルニア（50歳時）'
    ],
    medications: ['ロキソニン（腰痛時）', '睡眠薬（時々）'],
    familyHistory: [
      '父：糖尿病、脳梗塞で死亡（58歳）',
      '母：認知症、高血圧',
      '兄：糖尿病'
    ]
  },
  psychologicalProfile: {
    personality: '責任感が強く、全て自分で背負い込む。弱音を吐けない。',
    responseStyle: '複雑な背景',
    motivationLevel: '中',
    healthLiteracy: '中',
    concerns: [
      '父親と同じ年齢で死ぬのではという恐怖',
      '自分が倒れたら家族や会社はどうなるか',
      '健康の大切さはわかっているが余裕がない',
      '誰にも相談できない孤独感'
    ],
    strengths: [
      '責任感が強い',
      '家族のために頑張れる',
      '問題解決能力がある',
      '本当は変わりたいと思っている'
    ]
  },
  backgroundStory: '中小企業を経営する55歳の男性。会社の業績悪化、30歳の息子の引きこもり、高齢の母親の介護と、多くの問題を抱えている。父親が58歳で脳梗塞で亡くなっており、自分も同じ年齢が近づいていることに恐怖を感じている。健康の大切さは理解しているが、目の前の問題に追われて自分のことは後回しになっている。ストレスから飲酒・喫煙・過食に走り、睡眠も十分に取れていない。誰にも弱音を吐けず、一人で抱え込んでいる。',
  guidanceGoals: [
    'ストレスマネジメント',
    '相談できる環境づくり',
    '医療機関への受診勧奨',
    '小さな行動変容から始める（完璧を求めない）'
  ],
  expectedChallenges: [
    '複数の問題を抱えている',
    '優先順位がつけられない',
    '時間的・精神的余裕がない',
    '支援リソースの不足',
    '孤立感',
    '変化への抵抗（現状維持で精一杯）'
  ]
}

export default complexBackgroundScenario
