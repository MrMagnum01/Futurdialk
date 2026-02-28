/**
 * Exam Dashboard — Per-exam progress page with practice/diagnostic/simulation options.
 */
import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useTranslation, LanguageSwitcher } from '../i18n'
import { getExams, getExamProgress, isAuthenticated } from '../api'

export default function ExamDashboard() {
    const { examCode } = useParams()
    const { lang } = useTranslation()
    const isFr = lang === 'fr'
    const navigate = useNavigate()
    const [exam, setExam] = useState(null)
    const [progress, setProgress] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!isAuthenticated()) { navigate('/login'); return }
        Promise.all([
            getExams().then(d => d.exams.find(e => e.code === examCode)),
            getExamProgress(examCode).catch(() => null),
        ]).then(([e, p]) => { setExam(e); setProgress(p) }).finally(() => setLoading(false))
    }, [examCode])

    if (loading) return <div className="min-h-screen bg-bg-light flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div></div>
    if (!exam) return <div className="min-h-screen bg-bg-light flex flex-col items-center justify-center gap-4"><span className="material-symbols-outlined text-6xl text-gray-300">error</span><p className="text-secondary">{isFr ? 'Examen non trouvé' : 'Exam not found'}</p><Link to="/prep" className="text-primary font-bold">{isFr ? '← Retour' : '← Back'}</Link></div>

    return (
        <div className="min-h-screen bg-bg-light">
            <header className="sticky top-0 z-50 bg-white border-b border-gray-200 px-6 py-3 shadow-sm">
                <div className="max-w-[1000px] mx-auto flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2"><span className="material-symbols-outlined text-3xl text-primary">school</span><span className="text-xl font-bold text-text-main">FuturDialk</span></Link>
                    <div className="flex items-center gap-3"><LanguageSwitcher /><Link to="/prep" className="px-4 py-2 bg-gray-100 rounded-lg text-sm font-bold hover:bg-gray-200">{isFr ? '← Examens' : '← Exams'}</Link></div>
                </div>
            </header>

            <main className="max-w-[1000px] mx-auto px-4 py-8 md:px-6">
                {/* Hero */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 mb-8">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="px-3 py-1 text-xs font-bold bg-green-100 text-green-800 rounded-full">{exam.language}</span>
                        <span className="px-3 py-1 text-xs font-bold bg-blue-100 text-blue-800 rounded-full">{exam.cefr_range}</span>
                    </div>
                    <h1 className="text-3xl font-bold text-text-main mb-1">{exam.name}</h1>
                    <p className="text-secondary">{exam.scoring} • {exam.total_duration_minutes} min</p>
                </div>

                {/* Progress */}
                {progress && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        {[
                            { icon: 'trending_up', label: isFr ? 'Score estimé' : 'Estimated Score', value: progress.current_estimated_score || '—', color: 'text-primary' },
                            { icon: 'quiz', label: isFr ? 'Questions répondues' : 'Questions Answered', value: String(progress.total_questions_answered || 0), color: 'text-green-500' },
                            { icon: 'local_fire_department', label: 'Streak', value: String(progress.streak_current || 0) + '🔥', color: 'text-orange-500' },
                            { icon: 'target', label: isFr ? 'Objectif' : 'Target', value: progress.target_score || '—', color: 'text-purple-500' },
                        ].map(s => (
                            <div key={s.label} className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
                                <span className={`material-symbols-outlined text-2xl ${s.color}`}>{s.icon}</span>
                                <p className="text-xs text-secondary mt-2">{s.label}</p>
                                <p className="text-lg font-bold text-text-main">{s.value}</p>
                            </div>
                        ))}
                    </div>
                )}

                {/* Actions */}
                <h2 className="text-xl font-bold text-text-main mb-4">{isFr ? 'Commencer un entraînement' : 'Start Training'}</h2>
                <div className="grid md:grid-cols-3 gap-4 mb-8">
                    <ActionCard icon="speed" title={isFr ? 'Test Diagnostique' : 'Diagnostic Test'} desc={isFr ? '15 questions adaptatives pour évaluer votre niveau' : '15 adaptive questions to assess your level'} to={`/prep/${examCode}/diagnostic`} color="from-blue-500 to-indigo-600" />
                    <ActionCard icon="timer" title={isFr ? 'Simulation complète' : 'Full Simulation'} desc={isFr ? 'Conditions réelles d\'examen' : 'Real exam conditions'} to={`/prep/${examCode}/simulation`} color="from-green-500 to-emerald-600" />
                    <ActionCard icon="fitness_center" title={isFr ? 'Pratique par section' : 'Section Practice'} desc={isFr ? 'Entraînez-vous sur vos sections faibles' : 'Practice your weak sections'} to={`/prep/${examCode}/practice`} color="from-orange-500 to-red-500" />
                </div>

                {/* Sections */}
                <h2 className="text-xl font-bold text-text-main mb-4">{isFr ? 'Sections' : 'Sections'}</h2>
                <div className="space-y-3">
                    {(exam.sections || []).map(sec => (
                        <div key={sec.name} className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm flex items-center justify-between hover:border-primary/30 transition-colors">
                            <div>
                                <p className="font-bold text-text-main capitalize">{sec.name.replace(/_/g, ' ')}</p>
                                <p className="text-xs text-secondary mt-1">{sec.question_count} {isFr ? 'questions' : 'questions'} • {sec.time_minutes} min • {sec.question_types.join(', ')}</p>
                            </div>
                            <Link to={`/prep/${examCode}/practice`} className="px-4 py-2 text-xs font-bold bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors">
                                {isFr ? 'Pratiquer' : 'Practice'}
                            </Link>
                        </div>
                    ))}
                </div>

                {/* Strengths / Weaknesses */}
                {progress && (progress.strengths?.length > 0 || progress.weaknesses?.length > 0) && (
                    <div className="grid md:grid-cols-2 gap-4 mt-8">
                        {progress.strengths?.length > 0 && (
                            <div className="bg-green-50 rounded-xl p-5 border border-green-100">
                                <h3 className="font-bold text-green-800 mb-3 flex items-center gap-2"><span className="material-symbols-outlined">thumb_up</span>{isFr ? 'Points forts' : 'Strengths'}</h3>
                                <div className="flex flex-wrap gap-2">
                                    {progress.strengths.map(s => <span key={s} className="px-3 py-1 text-xs font-bold bg-green-100 text-green-800 rounded-full capitalize">{s.replace(/_/g, ' ')}</span>)}
                                </div>
                            </div>
                        )}
                        {progress.weaknesses?.length > 0 && (
                            <div className="bg-red-50 rounded-xl p-5 border border-red-100">
                                <h3 className="font-bold text-red-800 mb-3 flex items-center gap-2"><span className="material-symbols-outlined">thumb_down</span>{isFr ? 'À améliorer' : 'To Improve'}</h3>
                                <div className="flex flex-wrap gap-2">
                                    {progress.weaknesses.map(w => <span key={w} className="px-3 py-1 text-xs font-bold bg-red-100 text-red-800 rounded-full capitalize">{w.replace(/_/g, ' ')}</span>)}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    )
}

function ActionCard({ icon, title, desc, to, color }) {
    return (
        <Link to={to} className="group relative bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-lg transition-all overflow-hidden">
            <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-5 transition-opacity`} />
            <span className={`material-symbols-outlined text-3xl bg-gradient-to-br ${color} bg-clip-text text-transparent`}>{icon}</span>
            <h3 className="font-bold text-text-main mt-3 mb-1">{title}</h3>
            <p className="text-xs text-secondary">{desc}</p>
        </Link>
    )
}
