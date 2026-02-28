/**
 * Admin Question Review Queue — Review questions from MongoDB.
 * Fetches from /api/prep/exams and question data.
 * Admin actions are local-only for now (no backend submit endpoint yet).
 */
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation, LanguageSwitcher } from '../i18n'
import { getExams } from '../api'

export default function AdminQuestions() {
    const { lang } = useTranslation()
    const isFr = lang === 'fr'
    const [exams, setExams] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        getExams()
            .then(data => setExams(data.exams || []))
            .catch(() => { })
            .finally(() => setLoading(false))
    }, [])

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="sticky top-0 z-50 bg-white border-b border-gray-200 px-6 py-3 shadow-sm">
                <div className="max-w-[1200px] mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link to="/" className="flex items-center gap-2"><span className="material-symbols-outlined text-3xl text-primary">school</span><span className="text-xl font-bold">FuturDialk</span></Link>
                        <span className="text-gray-300">|</span><span className="text-sm font-bold text-red-600">ADMIN</span>
                    </div>
                    <Link to="/admin" className="px-4 py-2 bg-gray-100 rounded-lg text-sm font-bold">{isFr ? '← Dashboard' : '← Dashboard'}</Link>
                </div>
            </header>
            <main className="max-w-[1200px] mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold mb-2">{isFr ? 'Banque de Questions' : 'Question Bank'}</h1>
                <p className="text-secondary text-sm mb-6">{isFr ? 'Vue d\'ensemble des examens et sections disponibles' : 'Overview of available exams and sections'}</p>

                {loading ? (
                    <p className="text-center text-secondary py-10">{isFr ? 'Chargement...' : 'Loading...'}</p>
                ) : exams.length === 0 ? (
                    <div className="text-center py-20"><span className="material-symbols-outlined text-5xl text-gray-300 mb-3 block">quiz</span><p className="text-secondary">{isFr ? 'Aucun examen' : 'No exams'}</p></div>
                ) : (
                    <div className="space-y-4">
                        {exams.map(exam => (
                            <div key={exam.code} className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
                                <div className="flex items-center justify-between mb-3">
                                    <div>
                                        <h3 className="font-bold text-text-main text-lg">{exam.name}</h3>
                                        <p className="text-xs text-secondary">{exam.language} · {exam.scoring} · {exam.cefr_range}</p>
                                    </div>
                                    <span className="px-3 py-1 text-xs font-bold bg-blue-100 text-blue-800 rounded-full">{exam.total_duration_minutes}min</span>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                    {(exam.sections || []).map((s, i) => (
                                        <div key={i} className="bg-gray-50 rounded-lg p-3">
                                            <p className="text-sm font-medium text-text-main capitalize">{s.name.replace(/_/g, ' ')}</p>
                                            <p className="text-xs text-secondary">{s.question_count} {isFr ? 'questions' : 'questions'} · {s.time_minutes}min</p>
                                            <div className="flex flex-wrap gap-1 mt-1">
                                                {(s.question_types || []).map((qt, j) => (
                                                    <span key={j} className="text-xs bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded">{qt}</span>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    )
}
