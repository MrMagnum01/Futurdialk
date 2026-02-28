/**
 * Exam Prep Home — Main exam prep dashboard.
 * Fetches real exam catalog from /api/prep/exams and leaderboard from /api/prep/leaderboard.
 */

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation, LanguageSwitcher } from '../i18n'
import { getExams, getLeaderboard, getGamificationStats } from '../api'

const EXAM_ICONS = {
    ielts_academic: '🇬🇧', tcf: '🇫🇷', toefl_ibt: '🇺🇸',
    bac_sciences: '🎓', delf_b2: '🇫🇷', testdaf: '🇩🇪',
}

export default function ExamPrepHome() {
    const { lang } = useTranslation()
    const isFr = lang === 'fr'
    const [exams, setExams] = useState([])
    const [leaderboard, setLeaderboard] = useState([])
    const [stats, setStats] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        Promise.all([
            getExams().catch(() => ({ exams: [] })),
            getLeaderboard().catch(() => ({ leaderboard: [] })),
            getGamificationStats().catch(() => null),
        ]).then(([examsData, lbData, gamData]) => {
            setExams(examsData.exams || examsData || [])
            setLeaderboard(lbData.leaderboard || [])
            setStats(gamData)
        }).finally(() => setLoading(false))
    }, [])

    return (
        <div className="min-h-screen bg-bg-light flex flex-col">
            <header className="sticky top-0 z-50 bg-white border-b border-gray-200 px-6 py-3 lg:px-20 shadow-sm">
                <div className="flex items-center justify-between max-w-[1280px] mx-auto">
                    <Link to="/" className="flex items-center gap-2"><span className="material-symbols-outlined text-3xl text-primary">school</span><span className="text-xl font-bold text-text-main">FuturDialk</span></Link>
                    <div className="flex items-center gap-3"><LanguageSwitcher /><Link to="/dashboard" className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold">Dashboard</Link></div>
                </div>
            </header>
            <main className="flex-1 px-6 lg:px-20 py-8 max-w-[1280px] mx-auto w-full">
                {/* Hero */}
                <div className="bg-gradient-to-r from-primary to-blue-700 rounded-2xl p-8 md:p-12 mb-10 text-white relative overflow-hidden">
                    <div className="absolute -right-20 -top-20 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
                    <div className="relative z-10 max-w-2xl">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="material-symbols-outlined">quiz</span>
                            <span className="text-sm font-bold uppercase tracking-wider">{isFr ? 'Centre de Préparation' : 'Exam Prep Center'}</span>
                        </div>
                        <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-3">
                            {isFr ? 'Préparez Vos Examens' : 'Prepare Your Exams'}
                        </h1>
                        <p className="text-blue-100 text-lg">
                            {isFr ? "IELTS, TOEFL, TCF, BAC, DELF, TestDaF — Entraînement adaptatif avec IA." : "IELTS, TOEFL, TCF, BAC, DELF, TestDaF — Adaptive AI-powered training."}
                        </p>
                    </div>
                </div>

                {/* Streak / Stats */}
                {stats && (
                    <div className="bg-gradient-to-r from-orange-500 to-amber-600 rounded-2xl p-6 text-white mb-8 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <span className="material-symbols-outlined text-4xl">local_fire_department</span>
                            <div>
                                <p className="font-bold text-lg">{stats.streak_days || 0} {isFr ? 'jours de série !' : 'Day Streak!'}</p>
                                <p className="text-amber-200 text-sm">{isFr ? 'Continuez votre entraînement quotidien.' : 'Keep up your daily training.'}</p>
                            </div>
                        </div>
                        <div className="text-center">
                            <span className="text-3xl font-black block">{stats.total_xp || 0}</span>
                            <span className="text-xs text-amber-200">XP</span>
                        </div>
                    </div>
                )}

                {loading ? (
                    <p className="text-center text-secondary py-10">{isFr ? 'Chargement...' : 'Loading...'}</p>
                ) : (
                    <>
                        {/* Available Exams */}
                        <h2 className="text-2xl font-bold text-text-main mb-6">{isFr ? 'Examens Disponibles' : 'Available Exams'}</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                            {exams.map((exam) => (
                                <Link key={exam.code} to={`/exam/${exam.code}`} className="group bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg hover:border-primary/30 transition-all flex flex-col">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <span className="text-3xl">{EXAM_ICONS[exam.code] || '📝'}</span>
                                            <div>
                                                <h3 className="text-lg font-bold text-text-main group-hover:text-primary">{exam.name}</h3>
                                                <p className="text-xs text-secondary">{exam.language} · {exam.cefr_range || ''}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-1 mb-4">
                                        {(exam.sections || []).slice(0, 4).map((s, i) => (
                                            <div key={i} className="flex justify-between text-xs text-secondary">
                                                <span className="capitalize">{s.name.replace(/_/g, ' ')}</span>
                                                <span>{s.question_count}q · {s.time_minutes}min</span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-auto pt-3 border-t border-gray-100 flex justify-between text-sm">
                                        <span className="text-secondary">{isFr ? 'Durée totale' : 'Total duration'}</span>
                                        <span className="font-bold text-primary">{exam.total_duration_minutes}min</span>
                                    </div>
                                </Link>
                            ))}
                        </div>

                        {/* Leaderboard */}
                        <h2 className="text-xl font-bold text-text-main mb-4 flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary">leaderboard</span>
                            {isFr ? 'Classement' : 'Leaderboard'}
                        </h2>
                        {leaderboard.length > 0 ? (
                            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-8">
                                {leaderboard.slice(0, 10).map((entry, idx) => (
                                    <div key={idx} className={`flex items-center gap-4 px-5 py-3 ${idx > 0 ? 'border-t border-gray-100' : ''}`}>
                                        <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-black ${idx === 0 ? 'bg-yellow-100 text-yellow-700' : idx === 1 ? 'bg-gray-200 text-gray-700' : idx === 2 ? 'bg-orange-100 text-orange-700' : 'bg-gray-50 text-gray-500'}`}>
                                            {idx + 1}
                                        </span>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-bold text-sm text-text-main truncate">{entry.name || 'Student'}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-sm text-primary">{entry.total_xp || 0} XP</p>
                                            <p className="text-xs text-secondary">{entry.streak_days || 0} {isFr ? 'jours' : 'days'}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-white rounded-xl border border-gray-200 p-8 text-center mb-8">
                                <p className="text-secondary text-sm">{isFr ? 'Commencez un examen pour apparaître dans le classement !' : 'Start an exam to appear on the leaderboard!'}</p>
                            </div>
                        )}

                        {/* Quick actions */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Link to="/career" className="bg-emerald-600 rounded-xl p-6 text-white hover:bg-emerald-700 transition-colors">
                                <span className="material-symbols-outlined text-3xl mb-2">work</span>
                                <h3 className="font-bold mb-1">{isFr ? 'Conseiller Carrière' : 'Career Advisor'}</h3>
                                <p className="text-emerald-100 text-sm">{isFr ? 'Découvrez votre voie' : 'Discover your path'}</p>
                            </Link>
                            <Link to="/languages" className="bg-cyan-600 rounded-xl p-6 text-white hover:bg-cyan-700 transition-colors">
                                <span className="material-symbols-outlined text-3xl mb-2">translate</span>
                                <h3 className="font-bold mb-1">{isFr ? 'Langues' : 'Languages'}</h3>
                                <p className="text-cyan-100 text-sm">{isFr ? 'Pratiquez au quotidien' : 'Practice daily'}</p>
                            </Link>
                            <Link to="/copilot" className="bg-purple-600 rounded-xl p-6 text-white hover:bg-purple-700 transition-colors">
                                <span className="material-symbols-outlined text-3xl mb-2">psychology</span>
                                <h3 className="font-bold mb-1">{isFr ? 'Copilote IA' : 'AI Copilot'}</h3>
                                <p className="text-purple-100 text-sm">{isFr ? 'Aide personnalisée' : 'Personalized help'}</p>
                            </Link>
                        </div>
                    </>
                )}
            </main>
        </div>
    )
}
