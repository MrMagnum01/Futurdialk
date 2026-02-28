/**
 * Full Exam Simulation — Timed exam experience.
 */
import { useState, useEffect, useRef } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useTranslation, LanguageSwitcher } from '../i18n'
import { getExams, startSimulation, submitAnswers, isAuthenticated } from '../api'

export default function ExamSimulation() {
    const { examCode } = useParams()
    const { lang } = useTranslation()
    const isFr = lang === 'fr'
    const navigate = useNavigate()
    const [exam, setExam] = useState(null)
    const [questions, setQuestions] = useState([])
    const [attemptId, setAttemptId] = useState(null)
    const [answers, setAnswers] = useState({})
    const [currentQ, setCurrentQ] = useState(0)
    const [phase, setPhase] = useState('intro')
    const [results, setResults] = useState(null)
    const [loading, setLoading] = useState(false)
    const [timeLeft, setTimeLeft] = useState(0)
    const timerRef = useRef(null)

    useEffect(() => {
        if (!isAuthenticated()) { navigate('/login'); return }
        getExams().then(d => {
            const e = d.exams.find(x => x.code === examCode)
            setExam(e)
            if (e) setTimeLeft(e.total_duration_minutes * 60)
        }).catch(() => { })
    }, [examCode])

    useEffect(() => {
        if (phase === 'quiz' && timeLeft > 0) {
            timerRef.current = setInterval(() => setTimeLeft(t => t <= 1 ? (clearInterval(timerRef.current), 0) : t - 1), 1000)
        }
        return () => clearInterval(timerRef.current)
    }, [phase])

    const begin = async () => {
        setLoading(true)
        try {
            const data = await startSimulation(examCode)
            setQuestions(data.questions || [])
            setAttemptId(data.id)
            setPhase('quiz')
        } catch { } finally { setLoading(false) }
    }

    const submit = async () => {
        clearInterval(timerRef.current)
        setLoading(true)
        try {
            const res = await submitAnswers(attemptId, Object.entries(answers).map(([qId, ans]) => ({ question_id: qId, answer: ans })))
            setResults(res); setPhase('results')
        } catch { } finally { setLoading(false) }
    }

    const mins = Math.floor(timeLeft / 60)
    const secs = timeLeft % 60
    const q = questions[currentQ]

    return (
        <div className="min-h-screen bg-bg-light">
            <header className="sticky top-0 z-50 bg-white border-b border-gray-200 px-6 py-3 shadow-sm">
                <div className="max-w-[700px] mx-auto flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2"><span className="material-symbols-outlined text-3xl text-primary">school</span><span className="text-xl font-bold">Tawjihi</span></Link>
                    <div className="flex items-center gap-3">
                        {phase === 'quiz' && <span className={`font-mono font-bold text-sm ${timeLeft < 300 ? 'text-red-600' : 'text-text-main'}`}>{String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}</span>}
                        <Link to={`/prep/${examCode}`} className="px-4 py-2 bg-gray-100 rounded-lg text-sm font-bold">{isFr ? '←' : '←'}</Link>
                    </div>
                </div>
            </header>
            <main className="max-w-[700px] mx-auto px-4 py-8 md:px-6">
                {phase === 'intro' && (
                    <div className="text-center py-12">
                        <span className="material-symbols-outlined text-6xl text-green-500 mb-4 block">timer</span>
                        <h1 className="text-3xl font-bold mb-3">{isFr ? 'Simulation Complète' : 'Full Simulation'}</h1>
                        <p className="text-secondary mb-8">{exam?.name} — {exam?.total_duration_minutes} min</p>
                        <button onClick={begin} disabled={loading} className="px-8 py-4 bg-green-600 text-white rounded-xl font-bold text-lg hover:bg-green-700 shadow-lg disabled:opacity-50">{loading ? '...' : (isFr ? 'Commencer' : 'Start')}</button>
                    </div>
                )}
                {phase === 'quiz' && q && (
                    <>
                        <div className="flex items-center justify-between mb-4"><p className="text-sm text-secondary">{isFr ? 'Simulation' : 'Simulation'}</p><p className="text-sm font-bold">{currentQ + 1}/{questions.length}</p></div>
                        <div className="h-2 bg-gray-200 rounded-full mb-6 overflow-hidden"><div className="h-full bg-green-500 rounded-full transition-all" style={{ width: `${((currentQ + 1) / questions.length) * 100}%` }} /></div>
                        <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm mb-6">
                            {q.content?.passage && <p className="text-sm text-secondary mb-4 p-4 bg-gray-50 rounded-xl italic">{q.content.passage}</p>}
                            <h2 className="text-lg font-bold mb-6">{q.content?.question_text || 'Question'}</h2>
                            {q.content?.options ? (
                                <div className="space-y-3">{q.content.options.map(opt => (
                                    <button key={opt.id} onClick={() => setAnswers(p => ({ ...p, [q.id]: opt.id }))} className={`w-full text-left p-4 rounded-xl border-2 transition-all ${answers[q.id] === opt.id ? 'border-green-500 bg-green-50 font-bold' : 'border-gray-200 hover:border-green-300'}`}>
                                        <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full mr-3 text-xs font-bold ${answers[q.id] === opt.id ? 'bg-green-500 text-white' : 'bg-gray-100'}`}>{opt.id}</span>{opt.text}
                                    </button>
                                ))}</div>
                            ) : <input type="text" value={answers[q.id] || ''} onChange={e => setAnswers(p => ({ ...p, [q.id]: e.target.value }))} className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-green-500 outline-none" />}
                        </div>
                        <div className="flex justify-between">
                            <button onClick={() => setCurrentQ(Math.max(0, currentQ - 1))} disabled={currentQ === 0} className="px-6 py-3 bg-gray-100 rounded-xl font-bold text-sm disabled:opacity-50">←</button>
                            {currentQ < questions.length - 1 ? (
                                <button onClick={() => setCurrentQ(currentQ + 1)} className="px-6 py-3 bg-green-600 text-white rounded-xl font-bold text-sm">{isFr ? 'Suivant →' : 'Next →'}</button>
                            ) : (
                                <button onClick={submit} disabled={loading} className="px-6 py-3 bg-primary text-white rounded-xl font-bold text-sm disabled:opacity-50">{loading ? '...' : isFr ? 'Terminer' : 'Finish'}</button>
                            )}
                        </div>
                    </>
                )}
                {phase === 'results' && results && (
                    <div className="text-center py-8">
                        <div className="w-28 h-28 mx-auto rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white text-3xl font-bold mb-6 shadow-lg">{Math.round(results.score_percentage || 0)}%</div>
                        <h1 className="text-2xl font-bold mb-2">{isFr ? 'Terminé!' : 'Complete!'}</h1>
                        <p className="text-lg font-bold text-green-700 mb-6">{results.estimated_level}</p>
                        <div className="flex justify-center gap-4">
                            <Link to={`/prep/${examCode}`} className="px-6 py-3 bg-primary text-white rounded-xl font-bold text-sm">{isFr ? 'Dashboard' : 'Dashboard'}</Link>
                        </div>
                    </div>
                )}
            </main>
        </div>
    )
}
