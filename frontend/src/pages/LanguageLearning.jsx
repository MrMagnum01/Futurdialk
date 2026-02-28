/**
 * Language Learning — Real language data from /api/learn.
 * Shows language courses from MongoDB and user progress from PostgreSQL.
 */

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation, LanguageSwitcher } from '../i18n'
import { getLanguages, getLearningPath } from '../api'

export default function LanguageLearning() {
    const { lang } = useTranslation()
    const isFr = lang === 'fr'
    const [languages, setLanguages] = useState([])
    const [coursePaths, setCoursePaths] = useState({})
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        getLanguages()
            .then(async (data) => {
                const langs = data.languages || []
                setLanguages(langs)
                // Fetch course structure for each language
                const pathPromises = langs.map(l =>
                    getLearningPath(l.code).then(p => [l.code, p]).catch(() => [l.code, null])
                )
                const paths = await Promise.all(pathPromises)
                const pathMap = {}
                paths.forEach(([code, path]) => { if (path) pathMap[code] = path })
                setCoursePaths(pathMap)
            })
            .catch(() => { })
            .finally(() => setLoading(false))
    }, [])

    const examResources = [
        { icon: '📝', titleFr: 'Pack TCF Complet', titleEn: 'Complete TCF Pack', descFr: '80 exercices + 4 simulations', descEn: '80 exercises + 4 simulations', tag: 'TCF' },
        { icon: '🎧', titleFr: 'IELTS Listening Master', titleEn: 'IELTS Listening Master', descFr: '50 exercices audio', descEn: '50 audio exercises', tag: 'IELTS' },
        { icon: '✍️', titleFr: 'DELF B2 Writing Lab', titleEn: 'DELF B2 Writing Lab', descFr: 'Modèles + corrigés', descEn: 'Templates + model answers', tag: 'DELF' },
        { icon: '🗣️', titleFr: 'Speaking Practice IA', titleEn: 'AI Speaking Practice', descFr: 'Feedback IA en temps réel', descEn: 'Real-time AI feedback', tag: 'TOEFL' },
    ]

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
                <div className="bg-gradient-to-r from-cyan-600 to-sky-700 rounded-2xl p-8 md:p-12 mb-10 text-white relative overflow-hidden">
                    <div className="absolute -right-20 -top-20 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
                    <div className="relative z-10 max-w-2xl">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="material-symbols-outlined">translate</span>
                            <span className="text-sm font-bold uppercase tracking-wider">{isFr ? 'Apprentissage des Langues' : 'Language Learning'}</span>
                        </div>
                        <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-3">
                            {isFr ? 'Maîtrisez Vos Langues' : 'Master Your Languages'}
                        </h1>
                        <p className="text-cyan-100 text-lg">
                            {isFr ? "Préparez-vous aux examens de langue requis pour étudier à l'étranger." : "Prepare for language exams required for studying abroad."}
                        </p>
                    </div>
                </div>

                {loading ? (
                    <p className="text-center text-secondary py-10">{isFr ? 'Chargement...' : 'Loading...'}</p>
                ) : (
                    <>
                        {/* Language cards */}
                        <h2 className="text-2xl font-bold text-text-main mb-6">{isFr ? 'Langues Disponibles' : 'Available Languages'}</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                            {languages.map(l => {
                                const course = coursePaths[l.code]
                                const totalLessons = course?.units?.reduce((sum, u) => sum + (u.lessons?.length || 0), 0) || 0
                                const totalUnits = course?.units?.length || 0
                                return (
                                    <Link key={l.code} to={`/learn/${l.code}`} className="group bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-lg hover:border-primary/30 transition-all flex flex-col">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-3">
                                                <span className="text-3xl">{l.flag}</span>
                                                <div>
                                                    <h3 className="text-xl font-bold text-text-main group-hover:text-primary">{l.name_native || l.name}</h3>
                                                    <p className="text-sm text-secondary">{l.name}</p>
                                                </div>
                                            </div>
                                        </div>
                                        {course && (
                                            <div className="space-y-2 mb-3">
                                                {course.units.slice(0, 3).map((unit, i) => (
                                                    <div key={i} className="flex justify-between text-xs text-secondary">
                                                        <span>{unit.title}</span>
                                                        <span>{unit.lessons.length} {isFr ? 'leçons' : 'lessons'}</span>
                                                    </div>
                                                ))}
                                                {totalUnits > 3 && <p className="text-xs text-primary">+{totalUnits - 3} {isFr ? 'unités de plus' : 'more units'}</p>}
                                            </div>
                                        )}
                                        <div className="flex justify-between text-sm text-secondary mt-auto pt-3 border-t border-gray-100">
                                            <span>{totalUnits} {isFr ? 'unités' : 'units'}</span>
                                            <span>{totalLessons} {isFr ? 'leçons' : 'lessons'}</span>
                                        </div>
                                    </Link>
                                )
                            })}
                        </div>

                        {/* Exam Resources */}
                        <h2 className="text-2xl font-bold text-text-main mb-6 flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary">library_books</span>
                            {isFr ? 'Ressources Examens' : 'Exam Resources'}
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {examResources.map((r, i) => (
                                <div key={i} className="bg-white rounded-xl p-5 border border-gray-200 hover:shadow-md transition-shadow">
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-2xl">{r.icon}</span>
                                        <span className="text-xs font-bold bg-gray-100 px-2 py-0.5 rounded text-secondary">{r.tag}</span>
                                    </div>
                                    <h4 className="font-bold text-text-main mb-1">{isFr ? r.titleFr : r.titleEn}</h4>
                                    <p className="text-sm text-secondary">{isFr ? r.descFr : r.descEn}</p>
                                    <Link to="/exam-prep" className="mt-4 w-full text-sm font-bold text-primary py-2 border border-primary/20 rounded-lg hover:bg-blue-50 transition-colors block text-center">
                                        {isFr ? 'Commencer' : 'Start'}
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </main>
        </div>
    )
}
