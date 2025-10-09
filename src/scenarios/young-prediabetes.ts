// 🏥 Health Guidance Scenario - Young Adult with Prediabetes

import { HealthGuidanceScenario } from '@/types'

export const youngPrediabetesScenario: HealthGuidanceScenario = {
  id: 'young-prediabetes',
  name: '中村翔太',
  description: '28歳男性、IT企業勤務。若年層の生活習慣病予備軍。仕事優先で健康への関心が低い。',

  personalInfo: {
    fullName: '中村翔太',
    age: 28,
    gender: '男性',
    occupation: 'システムエンジニア（IT企業勤務）',
    familyStructure: '独身・一人暮らし',
    address: '東京都渋谷区'
  },

  healthCheckResults: {
    date: '2025年9月15日',
    height: 172,
    weight: 78,
    bmi: 26.4,
    waistCircumference: 88,
    bloodPressure: {
      systolic: 138,
      diastolic: 86
    },
    bloodTest: {
      fastingBloodSugar: 112,
      hba1c: 6.0,
      ldlCholesterol: 145,
      hdlCholesterol: 42,
      triglycerides: 185,
      gammaGtp: 68,
      alt: 42,
      ast: 38,
      creatinine: 0.9,
      uricAcid: 7.2
    }
  },

  lifestyle: {
    smoking: '非喫煙者（周囲に喫煙者多数）',
    alcohol: '週3-4回、ビール500ml缶2-3本、飲み会では深酒',
    exercise: '運動習慣なし。通勤は電車で座っている。休日はゲームや動画視聴',
    diet: '朝食抜き、昼はコンビニ弁当やラーメン、夜は外食やデリバリー。野菜はほとんど食べない。間食多い（お菓子、エナジードリンク）',
    sleep: '平均睡眠時間4-5時間、就寝時刻は午前2-3時、休日は昼まで寝ている',
    stress: '仕事の納期に常に追われている。残業月80時間程度。プライベートの時間が取れない'
  },

  medicalHistory: {
    currentDiseases: [],
    pastDiseases: ['特になし'],
    medications: [],
    familyHistory: '父親が40代で2型糖尿病、高血圧。母親は健康'
  },

  psychologicalProfile: {
    attitudeTowardGuidance: '面倒くさい。仕事が忙しいのに何でこんなことに時間を取られるのか。まだ若いし大丈夫だと思っている',
    motivationLevel: '非常に低い。健康診断も会社の義務だから受けているだけ',
    healthAwareness: '「病気になったら病院に行けばいい」という考え。予防の重要性を理解していない',
    changeReadiness: '変化への準備段階にすら達していない（無関心期）',
    communicationStyle: 'カジュアルで軽い口調。真剣に話を聞かない傾向。スマホをいじりながら話す',
    copingMechanism: '問題を先延ばしにする。ストレス発散は飲酒とゲーム'
  },

  backgroundStory: `
中村翔太さんは28歳のシステムエンジニアで、大手IT企業に勤務しています。大学卒業後、新卒でこの会社に入社し、6年目になります。

仕事は非常に忙しく、プロジェクトの納期に追われる日々を送っています。月の残業時間は80時間を超えることも珍しくなく、深夜まで働くことが常態化しています。

一人暮らしで、食事はほとんど外食かコンビニ、デリバリーで済ませています。料理をする時間も気力もなく、「食べられればいい」という考えです。朝は時間がないので朝食を抜き、昼はデスクでコンビニ弁当を食べながら仕事を続けることが多いです。

運動習慣は全くなく、通勤時も駅で座れる場所を探して座ります。休日は疲れているので、ゲームをしたり動画を見たりして過ごし、外出することはほとんどありません。

睡眠時間は平均4-5時間で、就寝は午前2-3時になることが多いです。「若いから大丈夫」「睡眠時間は週末に取り戻せる」と考えています。

ストレス発散は、同僚との飲み会です。週に3-4回は飲みに行き、ビールを2-3本は飲みます。飲み会では深酒することも多く、二日酔いで出勤することもあります。

健康診断の結果で「要注意」と指摘されても、「まだ若いし、そんなに悪くない」と軽く考えています。父親が40代で糖尿病になったことは知っていますが、「自分はまだ大丈夫」と楽観視しています。

今回の保健指導も、会社から「受けるように」と言われたので仕方なく来ましたが、正直面倒だと思っています。「説教されるんだろうな」という気持ちで、あまり真剣に話を聞く気はありません。
  `,

  guidanceGoals: [
    '若年層の生活習慣病リスクについて理解してもらう',
    '父親の糖尿病の家族歴と自分の状態との関連性に気づいてもらう',
    '今から予防することの重要性を認識してもらう',
    '小さな行動変容から始める（朝食を食べる、野菜を1品追加するなど）',
    '「若いから大丈夫」という誤った認識を修正する'
  ],

  expectedChallenges: [
    '健康への関心が非常に低く、話を真剣に聞かない',
    '「若いから大丈夫」という根強い信念',
    '仕事の忙しさを理由に行動変容を拒否する',
    '短期的な利益（仕事の成果、給料）を優先し、長期的な健康を軽視',
    '具体的な症状がないため、危機感を持てない',
    'カジュアルな態度で真剣さに欠ける'
  ],

  responseStyle: 'indifferent-busy',
  difficulty: 'medium'
}
