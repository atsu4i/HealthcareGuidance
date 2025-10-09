// シナリオ2: 防衛的・否認傾向の対象者
import { HealthGuidanceScenario } from '@/types'

export const defensiveDenialScenario: HealthGuidanceScenario = {
  id: 'defensive-denial',
  name: '山田太郎（防衛的・否認傾向）',
  description: '健康問題を認めたくない、防衛的な態度を示す対象者',
  personalInfo: {
    fullName: '山田太郎',
    age: 52,
    gender: '男性',
    occupation: '建設会社管理職',
    familyStructure: '独身',
    address: '神奈川県横浜市'
  },
  healthCheckResults: {
    date: '2024年10月',
    height: 168,
    weight: 78.0,
    bmi: 27.6,
    waistCircumference: 95,
    bloodPressure: {
      systolic: 145,
      diastolic: 92
    },
    bloodTest: {
      fastingBloodSugar: 118,
      hba1c: 6.2,
      ldlCholesterol: 168,
      hdlCholesterol: 42,
      triglycerides: 220,
      ast: 38,
      alt: 52,
      gammaGtp: 95
    },
    urineTest: {
      protein: '±',
      sugar: '陰性'
    }
  },
  lifestyle: {
    diet: {
      pattern: '不規則、外食・中食中心',
      details: [
        '朝食：食べないことが多い',
        '昼食：現場近くの定食屋、ラーメン',
        '夕食：コンビニ弁当か外食',
        '間食：夜遅くにカップ麺やお菓子',
        '飲み物：缶コーヒー、エナジードリンク'
      ],
      problems: [
        '野菜をほとんど食べない',
        '揚げ物、ラーメンなど高カロリー食が多い',
        '夜遅い時間の食事',
        '早食い'
      ]
    },
    exercise: {
      frequency: 'ほぼなし',
      details: [
        '現場では歩くが管理業務が中心',
        '休日は自宅でゴロゴロ',
        '若い頃は野球をしていた'
      ],
      barriers: [
        '仕事が忙しい',
        '疲れている',
        '今さら運動しても意味がない',
        '膝が痛い'
      ]
    },
    alcohol: {
      frequency: 'ほぼ毎日',
      amount: 'ビール500ml×3本、焼酎も',
      details: [
        '仕事の付き合いで飲む',
        '家でも晩酌',
        'つまみは揚げ物、塩辛いもの',
        '飲まないと眠れない'
      ]
    },
    smoking: {
      status: '喫煙中',
      details: '1日20本、30年以上'
    },
    sleep: {
      duration: '5-6時間',
      quality: '悪い',
      problems: [
        '夜中に目が覚める',
        'いびきがひどいと言われる',
        '朝起きても疲れが取れない'
      ]
    },
    stress: {
      level: '高',
      sources: [
        '仕事の責任',
        '部下の管理',
        '会社の業績プレッシャー',
        '将来への不安'
      ],
      copingMethods: [
        '飲酒',
        '喫煙',
        '休日の寝だめ'
      ]
    }
  },
  medicalHistory: {
    currentDiseases: [],
    pastDiseases: ['痛風発作（48歳時）'],
    medications: [],
    familyHistory: [
      '父：心筋梗塞（55歳で死亡）',
      '母：脳梗塞（現在要介護）'
    ]
  },
  psychologicalProfile: {
    personality: '頑固で自己主張が強い。プライドが高く、弱みを見せたくない。',
    responseStyle: '防衛的',
    motivationLevel: '低',
    healthLiteracy: '低',
    concerns: [
      '本当は健康が心配だが認めたくない',
      '仕事を休めない',
      '父親と同じ道を辿るのではという恐怖',
      '母の介護で余裕がない'
    ],
    strengths: [
      '若い頃は運動していた経験',
      '責任感が強い',
      '実は家族思い（母の介護）',
      '仕事では実績がある'
    ]
  },
  backgroundStory: '建設会社の管理職として働く52歳の男性。仕事一筋で生きてきたが、独身で不規則な生活が続いている。父親が55歳で心筋梗塞で亡くなっており、内心では健康が心配だが、認めると仕事に影響すると思っている。健康診断の結果を軽視しており、「まだ大丈夫」「忙しくて無理」と言い訳をする。母親の介護もあり、自分のことは後回しにしている。プライドが高く、指導されることに抵抗感がある。',
  guidanceGoals: [
    '健康リスクの認識',
    '小さな行動変容から始める',
    '禁煙への動機づけ',
    '飲酒量の削減'
  ],
  expectedChallenges: [
    '問題の否認',
    '言い訳が多い',
    '指導への抵抗',
    '変化への恐れ',
    '継続の困難さ'
  ]
}

export default defensiveDenialScenario
