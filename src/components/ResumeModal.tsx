// 📱 Health Guidance Simulation - Scenario Display Modal

'use client'

import { Resume, HealthGuidanceScenario } from '@/types'

interface ResumeModalProps {
  isOpen: boolean
  onClose: () => void
  resume: Resume | HealthGuidanceScenario | null
}

// Type guard to check if it's a HealthGuidanceScenario
function isHealthGuidanceScenario(resume: Resume | HealthGuidanceScenario | null): resume is HealthGuidanceScenario {
  return resume !== null && 'healthCheckResults' in resume
}

export default function ResumeModal({ isOpen, onClose, resume }: ResumeModalProps) {
  if (!isOpen) return null

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 99999,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px'
      }}
      onClick={handleBackdropClick}
    >
      <div
        style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          width: '100%',
          maxWidth: '672px',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          border: '1px solid #e5e7eb'
        }}
      >
        {/* Header */}
        <div className="
          flex items-center justify-between
          px-6 py-4
          bg-gradient-to-r from-blue-500 to-purple-600
          text-white
        ">
          <div>
            <h2 className="text-xl font-bold">{resume?.personalInfo.fullName || 'シナリオ'}</h2>
            <p className="text-blue-100 text-sm">
              {resume && isHealthGuidanceScenario(resume) ? 'シナリオ詳細' : '履歴書詳細'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="
              p-2 rounded-full
              hover:bg-white/20
              active:scale-95
              transition-all duration-150
            "
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content - Scrollable */}
        <div className="
          flex-1 overflow-y-auto
          p-6 space-y-8
        ">
          {!resume ? (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400">データがありません。</p>
            </div>
          ) : isHealthGuidanceScenario(resume) ? (
            /* Health Guidance Scenario Display */
            <>
              {/* Personal Info */}
              <section>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                  👤 基本情報
                </h3>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-2">
                  <div><span className="font-medium">氏名:</span> {resume.personalInfo.fullName}</div>
                  <div><span className="font-medium">年齢:</span> {resume.personalInfo.age}歳</div>
                  <div><span className="font-medium">性別:</span> {resume.personalInfo.gender}</div>
                  <div><span className="font-medium">職業:</span> {resume.personalInfo.occupation}</div>
                  <div><span className="font-medium">家族構成:</span> {resume.personalInfo.familyStructure}</div>
                </div>
              </section>

              {/* Health Check Results */}
              <section>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                  📊 健康診断結果
                </h3>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-2">
                  <div className="font-medium text-blue-600 mb-2">身体測定</div>
                  <div><span className="font-medium">身長:</span> {resume.healthCheckResults.height}cm</div>
                  <div><span className="font-medium">体重:</span> {resume.healthCheckResults.weight}kg</div>
                  <div><span className="font-medium">BMI:</span> {resume.healthCheckResults.bmi}</div>
                  <div><span className="font-medium">腹囲:</span> {resume.healthCheckResults.waistCircumference}cm</div>
                  <div><span className="font-medium">血圧:</span> {resume.healthCheckResults.bloodPressure.systolic}/{resume.healthCheckResults.bloodPressure.diastolic}mmHg</div>

                  <div className="font-medium text-blue-600 mt-4 mb-2">血液検査</div>
                  <div><span className="font-medium">空腹時血糖:</span> {resume.healthCheckResults.bloodTest.fastingBloodSugar}mg/dL</div>
                  <div><span className="font-medium">HbA1c:</span> {resume.healthCheckResults.bloodTest.hba1c}%</div>
                  <div><span className="font-medium">LDLコレステロール:</span> {resume.healthCheckResults.bloodTest.ldlCholesterol}mg/dL</div>
                  <div><span className="font-medium">HDLコレステロール:</span> {resume.healthCheckResults.bloodTest.hdlCholesterol}mg/dL</div>
                  <div><span className="font-medium">中性脂肪:</span> {resume.healthCheckResults.bloodTest.triglycerides}mg/dL</div>
                  <div><span className="font-medium">肝機能:</span> AST {resume.healthCheckResults.bloodTest.ast}, ALT {resume.healthCheckResults.bloodTest.alt}, γ-GTP {resume.healthCheckResults.bloodTest.gammaGtp}</div>
                </div>
              </section>

              {/* Lifestyle */}
              <section>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                  🍽️ 生活習慣
                </h3>
                {typeof resume.lifestyle.smoking === 'string' ? (
                  /* New scenario format - string values */
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-3">
                    <div>
                      <div className="font-medium text-gray-900 dark:text-gray-100 mb-1">喫煙</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {typeof resume.lifestyle.smoking === 'string' ? resume.lifestyle.smoking : String(resume.lifestyle.smoking)}
                      </div>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-gray-100 mb-1">飲酒</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {typeof resume.lifestyle.alcohol === 'string' ? resume.lifestyle.alcohol : String(resume.lifestyle.alcohol)}
                      </div>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-gray-100 mb-1">運動</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {typeof resume.lifestyle.exercise === 'string' ? resume.lifestyle.exercise : String(resume.lifestyle.exercise)}
                      </div>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-gray-100 mb-1">食事</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {typeof resume.lifestyle.diet === 'string' ? resume.lifestyle.diet : String(resume.lifestyle.diet)}
                      </div>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-gray-100 mb-1">睡眠</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {typeof resume.lifestyle.sleep === 'string' ? resume.lifestyle.sleep : String(resume.lifestyle.sleep)}
                      </div>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-gray-100 mb-1">ストレス</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {typeof resume.lifestyle.stress === 'string' ? resume.lifestyle.stress : String(resume.lifestyle.stress)}
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Old scenario format - object values */
                  <div className="space-y-3">
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                      <div className="font-medium text-gray-900 dark:text-gray-100 mb-2">食生活</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        パターン: {typeof resume.lifestyle.diet === 'object' ? resume.lifestyle.diet.pattern : ''}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        問題点: {typeof resume.lifestyle.diet === 'object' ? resume.lifestyle.diet.problems.join('、') : ''}
                      </div>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                      <div className="font-medium text-gray-900 dark:text-gray-100 mb-2">運動</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        頻度: {typeof resume.lifestyle.exercise === 'object' ? resume.lifestyle.exercise.frequency : ''}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        障壁: {typeof resume.lifestyle.exercise === 'object' ? resume.lifestyle.exercise.barriers.join('、') : ''}
                      </div>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                      <div className="font-medium text-gray-900 dark:text-gray-100 mb-2">飲酒・喫煙</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        飲酒: {typeof resume.lifestyle.alcohol === 'object' ? `${resume.lifestyle.alcohol.frequency} (${resume.lifestyle.alcohol.amount})` : ''}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        喫煙: {typeof resume.lifestyle.smoking === 'object' ? resume.lifestyle.smoking.status : ''}
                      </div>
                    </div>
                  </div>
                )}
              </section>

              {/* Psychological Profile */}
              <section>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                  🧠 心理プロフィール
                </h3>
                {'attitudeTowardGuidance' in resume.psychologicalProfile ? (
                  /* New scenario format */
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-3">
                    <div>
                      <div className="font-medium text-gray-900 dark:text-gray-100 mb-1">指導への態度</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">{resume.psychologicalProfile.attitudeTowardGuidance}</div>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-gray-100 mb-1">動機づけレベル</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">{resume.psychologicalProfile.motivationLevel}</div>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-gray-100 mb-1">健康意識</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">{resume.psychologicalProfile.healthAwareness}</div>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-gray-100 mb-1">変化への準備</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">{resume.psychologicalProfile.changeReadiness}</div>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-gray-100 mb-1">コミュニケーションスタイル</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">{resume.psychologicalProfile.communicationStyle}</div>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-gray-100 mb-1">対処メカニズム</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">{resume.psychologicalProfile.copingMechanism}</div>
                    </div>
                  </div>
                ) : (
                  /* Old scenario format */
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-2">
                    <div><span className="font-medium">性格:</span> {'personality' in resume.psychologicalProfile ? resume.psychologicalProfile.personality : ''}</div>
                    <div><span className="font-medium">応答スタイル:</span> {'responseStyle' in resume.psychologicalProfile ? resume.psychologicalProfile.responseStyle : ''}</div>
                    <div><span className="font-medium">動機づけレベル:</span> {resume.psychologicalProfile.motivationLevel}</div>
                    <div><span className="font-medium">ヘルスリテラシー:</span> {'healthLiteracy' in resume.psychologicalProfile ? resume.psychologicalProfile.healthLiteracy : ''}</div>
                  </div>
                )}
              </section>

              {/* Background Story */}
              <section>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                  📖 背景ストーリー
                </h3>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{resume.backgroundStory}</p>
                </div>
              </section>
            </>
          ) : (
            /* Resume Display */
            <>
              {/* Personal Info */}
              <section>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                  👤 基本情報
                </h3>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-2">
                  <div><span className="font-medium">氏名:</span> {resume.personalInfo.fullName}</div>
                  <div><span className="font-medium">Email:</span> {resume.personalInfo.email}</div>
                  {resume.personalInfo.phone && (
                    <div><span className="font-medium">電話:</span> {resume.personalInfo.phone}</div>
                  )}
                  {resume.personalInfo.address && (
                    <div><span className="font-medium">住所:</span> {resume.personalInfo.address}</div>
                  )}
                  {resume.personalInfo.dateOfBirth && (
                    <div><span className="font-medium">生年月日:</span> {resume.personalInfo.dateOfBirth}</div>
                  )}
                </div>
              </section>

              {/* Education */}
              <section>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                  🎓 学歴
                </h3>
                <div className="space-y-3">
                  {resume.education.map((edu, index) => (
                    <div key={index} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                      <div className="font-medium text-gray-900 dark:text-gray-100">
                        {edu.school} - {edu.degree}
                      </div>
                      <div className="text-gray-600 dark:text-gray-400">
                        {edu.major} ({edu.graduationYear}卒業)
                      </div>
                      {edu.gpa && (
                        <div className="text-sm text-blue-600 dark:text-blue-400">
                          GPA: {edu.gpa}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>

              {/* Experience */}
              <section>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                  💼 職歴・経験
                </h3>
                <div className="space-y-4">
                  {resume.experience.map((exp, index) => (
                    <div key={index} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                      <div className="font-medium text-gray-900 dark:text-gray-100 mb-1">
                        {exp.company} - {exp.position}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {exp.startDate} 〜 {exp.endDate}
                      </div>
                      <ul className="space-y-1">
                        {exp.description.map((desc, i) => (
                          <li key={i} className="text-sm text-gray-700 dark:text-gray-300 flex items-start gap-2">
                            <span className="text-blue-500 mt-1">•</span>
                            <span>{desc}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </section>

              {/* Skills */}
              <section>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                  🔧 スキル
                </h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">技術スキル</h4>
                    <div className="flex flex-wrap gap-2">
                      {resume.skills.technical.map((skill, index) => (
                        <span
                          key={index}
                          className="
                            px-3 py-1 text-sm
                            bg-blue-100 dark:bg-blue-900
                            text-blue-800 dark:text-blue-200
                            rounded-full
                          "
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">言語</h4>
                    <div className="flex flex-wrap gap-2">
                      {resume.skills.languages.map((lang, index) => (
                        <span
                          key={index}
                          className="
                            px-3 py-1 text-sm
                            bg-green-100 dark:bg-green-900
                            text-green-800 dark:text-green-200
                            rounded-full
                          "
                        >
                          {lang}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">資格</h4>
                    <div className="flex flex-wrap gap-2">
                      {resume.skills.certifications.map((cert, index) => (
                        <span
                          key={index}
                          className="
                            px-3 py-1 text-sm
                            bg-purple-100 dark:bg-purple-900
                            text-purple-800 dark:text-purple-200
                            rounded-full
                          "
                        >
                          {cert}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              {/* Projects */}
              <section>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                  🚀 プロジェクト経験
                </h3>
                <div className="space-y-4">
                  {resume.projects.map((project, index) => (
                    <div key={index} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                      <div className="font-medium text-gray-900 dark:text-gray-100 mb-1">
                        {project.name}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {project.duration}
                      </div>
                      <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                        {project.description}
                      </p>
                      <div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">使用技術:</div>
                        <div className="flex flex-wrap gap-1">
                          {project.technologies.map((tech, i) => (
                            <span
                              key={i}
                              className="
                                px-2 py-1 text-xs
                                bg-gray-200 dark:bg-gray-700
                                text-gray-700 dark:text-gray-300
                                rounded
                              "
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Interests */}
              <section>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                  🎯 趣味・関心
                </h3>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                  <div className="flex flex-wrap gap-2">
                    {resume.interests.map((interest, index) => (
                      <span
                        key={index}
                        className="
                          px-3 py-1 text-sm
                          bg-orange-100 dark:bg-orange-900
                          text-orange-800 dark:text-orange-200
                          rounded-full
                        "
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>
              </section>

              {/* Self Introduction */}
              <section>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                  💬 自己紹介
                </h3>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {resume.selfIntroduction}
                  </p>
                </div>
              </section>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="
          px-6 py-4
          bg-gray-50 dark:bg-gray-800
          border-t border-gray-200 dark:border-gray-700
        ">
          <button
            onClick={onClose}
            className="
              w-full px-4 py-3
              bg-blue-500 hover:bg-blue-600
              text-white
              rounded-lg
              font-medium
              transition-colors
            "
          >
            閉じる
          </button>
        </div>
      </div>
    </div>
  )
}
