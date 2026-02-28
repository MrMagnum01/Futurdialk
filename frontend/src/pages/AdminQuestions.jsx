/**
 * Admin Question Review Queue — Review and approve user-submitted questions.
 */
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation, LanguageSwitcher } from '../i18n'

const MOCK_QUEUE = [
    { id: '1', exam: 'IELTS', section: 'reading', question: 'Which paragraph mentions the impact of climate change?', status: 'pending', submitted_by: 'community', difficulty: 'B1' },
    { id: '2', exam: 'TCF', section: 'grammaire', question: 'Complétez: "Il __ parti hier soir."', status: 'pending', submitted_by: 'AI-generated', difficulty: 'A2' },
    { id: '3', exam: 'BAC', section: 'math', question: 'Résoudre l\'équation: 2x² - 5x + 3 = 0', status: 'approved', submitted_by: 'admin', difficulty: 'terminal' },
    { id: '4', exam: 'TOEFL', section: 'listening', question: 'What is the professor\'s main concern about the experiment?', status: 'rejected', submitted_by: 'AI-generated', difficulty: 'B2' },
    { id: '5', exam: 'TCF', section: 'compréhension_orale', question: 'De quoi parle la conversation?', status: 'pending', submitted_by: 'community', difficulty: 'A1' },
]

export default function AdminQuestions() {
    const { lang } = useTranslation()
    const isFr = lang === 'fr'
    const [questions, setQuestions] = useState(MOCK_QUEUE)
    const [filter, setFilter] = useState('all')

    const filtered = filter === 'all' ? questions : questions.filter(q => q.status === filter)

    const updateStatus = (id, status) => {
        setQuestions(prev => prev.map(q => q.id === id ? { ...q, status } : q))
    }

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
                <h1 className="text-2xl font-bold mb-2">{isFr ? 'File de révision des questions' : 'Question Review Queue'}</h1>
                <p className="text-secondary text-sm mb-6">{questions.filter(q => q.status === 'pending').length} {isFr ? 'en attente' : 'pending'}</p>

                <div className="flex gap-2 mb-6">
                    {['all', 'pending', 'approved', 'rejected'].map(f => (
                        <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 rounded-lg text-sm font-bold capitalize ${filter === f ? 'bg-primary text-white' : 'bg-white border border-gray-200 text-secondary hover:bg-gray-50'}`}>{f === 'all' ? (isFr ? 'Tous' : 'All') : f === 'pending' ? (isFr ? 'En attente' : 'Pending') : f === 'approved' ? (isFr ? 'Approuvé' : 'Approved') : (isFr ? 'Rejeté' : 'Rejected')}</button>
                    ))}
                </div>

                <div className="space-y-3">
                    {filtered.map(q => (
                        <div key={q.id} className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="px-2 py-0.5 text-xs font-bold bg-blue-100 text-blue-800 rounded-full">{q.exam}</span>
                                        <span className="px-2 py-0.5 text-xs bg-gray-100 rounded-full capitalize">{q.section.replace(/_/g, ' ')}</span>
                                        <span className="px-2 py-0.5 text-xs bg-purple-100 text-purple-800 rounded-full">{q.difficulty}</span>
                                        <span className="text-xs text-gray-400">{q.submitted_by}</span>
                                    </div>
                                    <p className="text-sm text-text-main">{q.question}</p>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                    {q.status === 'pending' ? (
                                        <>
                                            <button onClick={() => updateStatus(q.id, 'approved')} className="p-2 rounded-lg bg-green-50 text-green-700 hover:bg-green-100"><span className="material-symbols-outlined text-lg">check</span></button>
                                            <button onClick={() => updateStatus(q.id, 'rejected')} className="p-2 rounded-lg bg-red-50 text-red-700 hover:bg-red-100"><span className="material-symbols-outlined text-lg">close</span></button>
                                        </>
                                    ) : (
                                        <span className={`px-3 py-1 text-xs font-bold rounded-full ${q.status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{q.status}</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                    {filtered.length === 0 && <p className="text-center text-secondary py-10">{isFr ? 'Aucune question' : 'No questions'}</p>}
                </div>
            </main>
        </div>
    )
}
