/**
 * Diagnostic Test — Adaptive diagnostic for assessing level.
 */
import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useTranslation, LanguageSwitcher } from '../i18n'
import { startDiagnostic, submitAnswers, isAuthenticated } from '../api'

export default function DiagnosticTest() {
    const { examCode } = useParams()
    const { lang } = useTranslation()
    const isFr = lang === 'fr'
    const navigate = useNavigate()
    const [questions, setQuestions] = useState([])
    const [attemptId, setAttemptId] = useState(null)
    const [answers, setAnswers] = useState({})
    const [currentQ, setCurrentQ] = useState(0)
    const [phase, setPhase] = useState('intro')
    const [results, setResults] = useState(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => { if (!isAuthenticated()) navigate('/login') }, [])

    const begin = async () => {
        setLoading(true)
        try {
            const data = await startDiagnostic(examCode)
            setQuestions(data.questions || [])
            setAttemptId(data.id)
            setPhase('quiz')
        } catch { } finally { setLoading(false) }
    }

    const selectAnswer = (qId, ans) => setAnswers(prev => ({ ...prev, [qId]: ans }))

    const submit = async () => {
        setLoading(true)
        try {
            const answerList = Object.entries(answers).map(([qId, ans]) => ({ question_id: qId, answer: ans }))
            const res = await submitAnswers(attemptId, answerList)
            setResults(res)
            setPhase('results')
        } catch { } finally { setLoading(false) }
    }

    const q = questions[currentQ]

    return (
        <div className="min-h-screen bg-bg-light">
            <header className="sticky top-0 z-50 bg-white border-b border-gray-200 px-6 py-3 shadow-sm">
                <div className="max-w-[700px] mx-auto flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2"><span className="material-symbols-outlined text-3xl text-primary">school</span><span className="text-xl font-bold text-text-main">Tawjihi</span></Link>
                    <Link to={`/prep/${examCode}`} className="px-4 py-2 bg-gray-100 rounded-lg text-sm font-bold hover:bg-gray-200">{isFr ? '← Examen' : '← Exam'}</Link>
                </div>
            </header>

            <main className="max-w-[700px] mx-auto px-4 py-8 md:px-6">
                {phase === 'intro' && (
                    <div className="text-center py-12">
                        <span className="material-symbols-outlined text-6xl text-primary mb-4 block">speed</span>
                        <h1 className="text-3xl font-bold text-text-main mb-3">{isFr ? 'Test Diagnostique' : 'Diagnostic Test'}</h1>
                        <p className="text-secondary mb-2">{examCode?.replace(/_/g, ' ').toUpperCase()}</p>
                        <p className="text-secondary mb-8">{isFr ? '15 questions adaptatives pour évaluer votre niveau actuel' : '15 adaptive questions to assess your current level'}</p>
                        <button onClick={begin} disabled={loading} className="px-8 py-4 bg-primary text-white rounded-xl font-bold text-lg hover:bg-primary-hover transition-colors shadow-lg disabled:opacity-50">
                            {loading ? '...' : (isFr ? 'Commencer' : 'Start')}
                        </button>
                    </div>
                )}

                {phase === 'quiz' && q && (
                    <>
                        <div className="flex items-center justify-between mb-4"><p className="text-sm text-secondary">{isFr ? 'Diagnostique' : 'Diagnostic'}</p><p className="text-sm font-bold">{currentQ + 1}/{questions.length}</p></div>
                        <div className="h-2 bg-gray-200 rounded-full mb-6 overflow-hidden"><div className="h-full bg-primary rounded-full transition-all" style={{ width: `${((currentQ + 1) / questions.length) * 100}%` }} /></div>

                        <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm mb-6">
                            {q.content?.passage && <p className="text-sm text-secondary mb-4 p-4 bg-gray-50 rounded-xl italic">{q.content.passage}</p>}
                            <h2 className="text-lg font-bold text-text-main mb-6">{q.content?.question_text || 'Question'}</h2>
                            {q.content?.options ? (
                                <div className="space-y-3">{q.content.options.map(opt => (
                                    <button key={opt.id} onClick={() => selectAnswer(q.id, opt.id)} className={`w-full text-left p-4 rounded-xl border-2 transition-all ${answers[q.id] === opt.id ? 'border-primary bg-primary/5 font-bold' : 'border-gray-200 hover:border-primary/40'}`}>
                                        <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full mr-3 text-xs font-bold ${answers[q.id] === opt.id ? 'bg-primary text-white' : 'bg-gray-100'}`}>{opt.id}</span>{opt.text}
                                    </button>
                                ))}</div>
                            ) : (
                                <input type="text" value={answers[q.id] || ''} onChange={e => selectAnswer(q.id, e.target.value)} className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-primary outline-none" placeholder={isFr ? 'Votre réponse...' : 'Your answer...'} />
                            )}
                        </div>

                        <div className="flex justify-between">
                            <button onClick={() => setCurrentQ(Math.max(0, currentQ - 1))} disabled={currentQ === 0} className="px-6 py-3 bg-gray-100 rounded-xl font-bold text-sm disabled:opacity-50">{isFr ? '← Précédent' : '← Previous'}</button>
                            {currentQ < questions.length - 1 ? (
                                <button onClick={() => setCurrentQ(currentQ + 1)} className="px-6 py-3 bg-primary text-white rounded-xl font-bold text-sm">{isFr ? 'Suivant →' : 'Next →'}</button>
                            ) : (
                                <button onClick={submit} disabled={loading} className="px-6 py-3 bg-green-600 text-white rounded-xl font-bold text-sm disabled:opacity-50">{loading ? '...' : (isFr ? 'Soumettre ✓' : 'Submit ✓')}</button>
                            )}
                        </div>
                    </>
                )}

                {phase === 'results' && results && (
                    <div className="text-center py-8">
                        <div className="w-28 h-28 mx-auto rounded-full bg-gradient-to-br from-primary to-green-500 flex items-center justify-center text-white text-3xl font-bold mb-6 shadow-lg">{Math.round(results.score_percentage || 0)}%</div>
                        <h1 className="text-2xl font-bold text-text-main mb-2">{isFr ? 'Votre niveau' : 'Your Level'}</h1>
                        <p className="text-lg font-bold text-primary mb-6">{results.estimated_level}</p>
                        <div className="flex justify-center gap-4">
                            <Link to={`/prep/${examCode}/practice`} className="px-6 py-3 bg-primary text-white rounded-xl font-bold text-sm">{isFr ? 'Pratiquer' : 'Practice'}</Link>
                            <Link to={`/prep/${examCode}`} className="px-6 py-3 bg-gray-100 rounded-xl font-bold text-sm">{isFr ? 'Tableau de bord' : 'Dashboard'}</Link>
                        </div>
                    </div>
                )}
            </main>
        </div>
    )
}
