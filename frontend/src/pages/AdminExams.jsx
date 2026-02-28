/**
 * Manage Exams — CRUD for exam question banks (MongoDB-backed).
 */
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation, LanguageSwitcher } from '../i18n'
import { getExams } from '../api'

export default function AdminExams() {
    const { lang } = useTranslation()
    const isFr = lang === 'fr'
    const [exams, setExams] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => { getExams().then(d => setExams(d.exams || [])).catch(() => { }).finally(() => setLoading(false)) }, [])

    return (
        <div className="min-h-screen bg-gray-50">
            <AdminHeader />
            <main className="max-w-[1200px] mx-auto px-4 py-8">
                <div className="flex items-center justify-between mb-6">
                    <div><h1 className="text-2xl font-bold">{isFr ? 'Gérer les examens' : 'Manage Exams'}</h1><p className="text-sm text-secondary">{exams.length} {isFr ? 'examens configurés' : 'exams configured'}</p></div>
                    <button className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold">+ {isFr ? 'Ajouter un examen' : 'Add Exam'}</button>
                </div>

                {loading ? <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div></div> : (
                    <div className="grid gap-4">
                        {exams.map(exam => (
                            <div key={exam.code} className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-all">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <h3 className="text-lg font-bold">{exam.name}</h3>
                                            <span className="px-2 py-0.5 text-xs font-bold bg-blue-100 text-blue-800 rounded-full">{exam.language}</span>
                                            <span className="px-2 py-0.5 text-xs bg-green-100 text-green-800 rounded-full">{exam.cefr_range}</span>
                                        </div>
                                        <p className="text-sm text-secondary mb-3">{exam.scoring} • {exam.total_duration_minutes} min</p>
                                        <div className="flex flex-wrap gap-2">
                                            {(exam.sections || []).map(sec => (
                                                <div key={sec.name} className="px-3 py-1.5 bg-gray-50 rounded-lg text-xs">
                                                    <span className="font-bold capitalize">{sec.name.replace(/_/g, ' ')}</span>
                                                    <span className="text-gray-400 ml-1">({sec.question_count}Q, {sec.time_minutes}min)</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="flex gap-2 shrink-0">
                                        <button className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-xs font-bold hover:bg-blue-100">{isFr ? 'Questions' : 'Questions'}</button>
                                        <button className="px-3 py-1.5 bg-yellow-50 text-yellow-700 rounded-lg text-xs font-bold hover:bg-yellow-100">{isFr ? 'Modifier' : 'Edit'}</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {exams.length === 0 && <p className="text-center text-secondary py-10">{isFr ? 'Aucun examen' : 'No exams'}</p>}
                    </div>
                )}
            </main>
        </div>
    )
}

function AdminHeader() {
    return (
        <header className="sticky top-0 z-50 bg-white border-b border-gray-200 px-6 py-3 shadow-sm">
            <div className="max-w-[1200px] mx-auto flex items-center justify-between">
                <div className="flex items-center gap-4"><Link to="/" className="flex items-center gap-2"><span className="material-symbols-outlined text-3xl text-primary">school</span><span className="text-xl font-bold">FuturDialk</span></Link><span className="text-gray-300">|</span><span className="text-sm font-bold text-red-600">ADMIN</span></div>
                <Link to="/admin" className="px-4 py-2 bg-gray-100 rounded-lg text-sm font-bold">← Dashboard</Link>
            </div>
        </header>
    )
}
