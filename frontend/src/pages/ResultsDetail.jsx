/**
 * Results Detail — Shows detailed results for a completed exam attempt.
 */
import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useTranslation, LanguageSwitcher } from '../i18n'
import { getExamResults, isAuthenticated } from '../api'

export default function ResultsDetail() {
    const { examCode, attemptId } = useParams()
    const { lang } = useTranslation()
    const isFr = lang === 'fr'
    const navigate = useNavigate()
    const [attempt, setAttempt] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!isAuthenticated()) { navigate('/login'); return }
        getExamResults(attemptId).then(setAttempt).catch(() => { }).finally(() => setLoading(false))
    }, [attemptId])

    if (loading) return <div className="min-h-screen bg-bg-light flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div></div>
    if (!attempt) return <div className="min-h-screen bg-bg-light flex flex-col items-center justify-center gap-4"><span className="material-symbols-outlined text-6xl text-gray-300">error</span><p className="text-secondary">{isFr ? 'Résultats non trouvés' : 'Results not found'}</p><Link to={`/prep/${examCode}`} className="text-primary font-bold">{isFr ? '← Retour' : '← Back'}</Link></div>

    return (
        <div className="min-h-screen bg-bg-light">
            <header className="sticky top-0 z-50 bg-white border-b border-gray-200 px-6 py-3 shadow-sm">
                <div className="max-w-[800px] mx-auto flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2"><span className="material-symbols-outlined text-3xl text-primary">school</span><span className="text-xl font-bold text-text-main">FuturDialk</span></Link>
                    <div className="flex items-center gap-3"><LanguageSwitcher /><Link to={`/prep/${examCode}`} className="px-4 py-2 bg-gray-100 rounded-lg text-sm font-bold hover:bg-gray-200">{isFr ? '← Examen' : '← Exam'}</Link></div>
                </div>
            </header>

            <main className="max-w-[800px] mx-auto px-4 py-8 md:px-6">
                {/* Score Hero */}
                <div className="bg-gradient-to-br from-primary/10 to-green-50 rounded-2xl p-8 mb-8 text-center">
                    <p className="text-sm text-secondary uppercase font-bold mb-4">{attempt.mode?.replace(/_/g, ' ')}</p>
                    <div className="w-28 h-28 mx-auto rounded-full bg-white shadow-lg flex items-center justify-center mb-4 border-4 border-primary/20">
                        <span className="text-3xl font-bold text-primary">{attempt.total_score != null ? `${Math.round(attempt.total_score)}%` : '—'}</span>
                    </div>
                    <h1 className="text-2xl font-bold text-text-main mb-1">{attempt.exam_code?.replace(/_/g, ' ').toUpperCase()}</h1>
                    {attempt.estimated_band_level && <p className="text-lg font-bold text-green-700">{attempt.estimated_band_level}</p>}
                    <div className="flex justify-center gap-4 mt-4 text-sm text-secondary">
                        {attempt.started_at && <span>{isFr ? 'Commencé' : 'Started'}: {new Date(attempt.started_at).toLocaleDateString()}</span>}
                        {attempt.completed_at && <span>{isFr ? 'Terminé' : 'Completed'}: {new Date(attempt.completed_at).toLocaleDateString()}</span>}
                    </div>
                </div>

                {/* Section Breakdown */}
                {attempt.sections_completed?.length > 0 && (
                    <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm mb-6">
                        <h2 className="text-lg font-bold text-text-main mb-4 flex items-center gap-2"><span className="material-symbols-outlined text-blue-500">analytics</span>{isFr ? 'Résultats par section' : 'Section Breakdown'}</h2>
                        <div className="space-y-4">
                            {attempt.sections_completed.map((sec, i) => {
                                const pct = sec.score || 0
                                return (
                                    <div key={i} className="p-4 rounded-xl bg-gray-50">
                                        <div className="flex items-center justify-between mb-2">
                                            <p className="font-bold text-text-main capitalize">{(sec.section || '').replace(/_/g, ' ')}</p>
                                            <span className={`text-sm font-bold ${pct >= 70 ? 'text-green-600' : pct >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>{sec.correct}/{sec.total} ({Math.round(pct)}%)</span>
                                        </div>
                                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                            <div className={`h-full rounded-full ${pct >= 70 ? 'bg-green-500' : pct >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${pct}%` }} />
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )}

                {/* Actions */}
                <div className="flex justify-center gap-4">
                    <Link to={`/prep/${examCode}/practice`} className="px-6 py-3 bg-primary text-white rounded-xl font-bold text-sm hover:bg-primary-hover transition-colors">{isFr ? 'Réessayer' : 'Try Again'}</Link>
                    <Link to={`/prep/${examCode}`} className="px-6 py-3 bg-gray-100 rounded-xl font-bold text-sm hover:bg-gray-200 text-text-main transition-colors">{isFr ? 'Tableau de bord' : 'Dashboard'}</Link>
                </div>
            </main>
        </div>
    )
}
