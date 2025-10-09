// 保健指導シナリオ管理ユーティリティ
import { HealthGuidanceScenario } from '@/types'

// すべてのシナリオを静的にインポート
import { cooperativeMotivatedScenario } from './cooperative-motivated'
import { defensiveDenialScenario } from './defensive-denial'
import { indifferentBusyScenario } from './indifferent-busy'
import { knowledgeNoActionScenario } from './knowledge-no-action'
import { complexBackgroundScenario } from './complex-background'
import { youngPrediabetesScenario } from './young-prediabetes'
import { elderlyMultipleConditionsScenario } from './elderly-multiple-conditions'
import { mentalHealthStressScenario } from './mental-health-stress'
import { familyUnsupportedScenario } from './family-unsupported'
import { medicalDistrustScenario } from './medical-distrust'
import { economicDifficultyScenario } from './economic-difficulty'
import { shiftWorkIrregularScenario } from './shift-work-irregular'
import { livingAloneTransferScenario } from './living-alone-transfer'

// 利用可能なシナリオのリスト
export const AVAILABLE_SCENARIOS = [
  {
    id: 'cooperative-motivated',
    name: '佐藤健一（協力的・意欲的）',
    description: 'メタボ改善に前向きで、健康への意識が高い対象者'
  },
  {
    id: 'defensive-denial',
    name: '山田太郎（防衛的・否認傾向）',
    description: '健康問題を認めたくない、防衛的な態度を示す対象者'
  },
  {
    id: 'indifferent-busy',
    name: '鈴木美咲（無関心・多忙）',
    description: '健康への関心が低く、忙しさを理由に行動変容を避ける対象者'
  },
  {
    id: 'knowledge-no-action',
    name: '田中裕子（知識あり実行なし）',
    description: '健康知識は豊富だが、行動に移せない対象者'
  },
  {
    id: 'complex-background',
    name: '伊藤誠（複雑な背景）',
    description: '仕事・家庭のストレスなど、複雑な背景を持つ対象者'
  },
  {
    id: 'young-prediabetes',
    name: '中村翔太（若年層・予備軍）',
    description: '28歳IT勤務。若年層の生活習慣病予備軍。健康への関心が低い'
  },
  {
    id: 'elderly-multiple-conditions',
    name: '高橋良子（高齢者・複数疾患）',
    description: '68歳専業主婦。高血圧・骨粗鬆症などの既往症あり。高齢者特有の課題'
  },
  {
    id: 'mental-health-stress',
    name: '小林美咲（メンタル・ストレス）',
    description: '35歳営業職。仕事と育児の両立でストレス過多。過食傾向あり'
  },
  {
    id: 'family-unsupported',
    name: '佐々木恵子（家族非協力）',
    description: '52歳パート。介護・家事・仕事の三重負担。家族の協力が得られない'
  },
  {
    id: 'medical-distrust',
    name: '木村健（医療不信）',
    description: '58歳自営業。医療や保健指導に懐疑的。民間療法を信じている'
  },
  {
    id: 'economic-difficulty',
    name: '松本由美（経済的困難）',
    description: '45歳シングルマザー。経済的理由で生活改善が難しい'
  },
  {
    id: 'shift-work-irregular',
    name: '鈴木大輔（夜勤・交代勤務）',
    description: '42歳工場勤務。夜勤・交代勤務で生活リズム不規則。睡眠障害あり'
  },
  {
    id: 'living-alone-transfer',
    name: '渡辺浩一（単身赴任）',
    description: '48歳会社員。単身赴任中。生活環境の制約で健康管理が困難'
  }
] as const

export type ScenarioId = typeof AVAILABLE_SCENARIOS[number]['id']

// シナリオマップ（静的インポート）
const SCENARIO_MAP: Record<ScenarioId, HealthGuidanceScenario> = {
  'cooperative-motivated': cooperativeMotivatedScenario,
  'defensive-denial': defensiveDenialScenario,
  'indifferent-busy': indifferentBusyScenario,
  'knowledge-no-action': knowledgeNoActionScenario,
  'complex-background': complexBackgroundScenario,
  'young-prediabetes': youngPrediabetesScenario,
  'elderly-multiple-conditions': elderlyMultipleConditionsScenario,
  'mental-health-stress': mentalHealthStressScenario,
  'family-unsupported': familyUnsupportedScenario,
  'medical-distrust': medicalDistrustScenario,
  'economic-difficulty': economicDifficultyScenario,
  'shift-work-irregular': shiftWorkIrregularScenario,
  'living-alone-transfer': livingAloneTransferScenario,
}

// シナリオをロードする関数（同期的に取得）
export function loadScenario(scenarioId: ScenarioId): HealthGuidanceScenario | null {
  const scenario = SCENARIO_MAP[scenarioId]
  if (!scenario) {
    console.warn(`Unknown scenario ID: ${scenarioId}`)
    return null
  }
  return scenario
}

// シナリオ情報を取得する関数
export function getScenarioInfo(scenarioId: ScenarioId) {
  return AVAILABLE_SCENARIOS.find(scenario => scenario.id === scenarioId) || null
}

// 全てのシナリオ情報を取得する関数
export function getAllScenarioInfo() {
  return AVAILABLE_SCENARIOS
}
