/**
 * Section Practice — Interactive quiz for a specific exam section.
 */
import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useTranslation, LanguageSwitcher } from '../i18n'
import { getExams, startPractice, submitAnswers, isAuthenticated } from '../api'

export default function SectionPractice() {
    const { examCode } = useParams()
    const { lang } = useTranslation()
    const isFr = lang === 'fr'
    const navigate = useNavigate()
    const [exam, setExam] = useState(null)
    const [selectedSection, setSelectedSection] = useState(null)
    const [questions, setQuestions] = useState([])
    const [attemptId, setAttemptId] = useState(null)
    const [answers, setAnswers] = useState({})
    const [currentQ, setCurrentQ] = useState(0)
    const [results, setResults] = useState(null)
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [phase, setPhase] = useState('select') // select | quiz | results

    useEffect(() => {
        if (!isAuthenticated()) { navigate('/login'); return }
        getExams().then(d => { setExam(d.exams.find(e => e.code === examCode)) }).finally(() => setLoading(false))
    }, [examCode])

    const startSection = async (sectionName) => {
        setSelectedSection(sectionName)
        setLoading(true)
        try {
            const data = await startPractice(examCode, sectionName, 10)
            setQuestions(data.questions || [])
            setAttemptId(data.id)
            setPhase('quiz')
            setCurrentQ(0)
            setAnswers({})
        } catch { } finally { setLoading(false) }
    }

    const selectAnswer = (questionId, answer) => {
        setAnswers(prev => ({ ...prev, [questionId]: answer }))
    }

    const handleSubmit = async () => {
        setSubmitting(true)
        try {
            const answerList = Object.entries(answers).map(([qId, ans]) => ({ question_id: qId, answer: ans }))
            const res = await submitAnswers(attemptId, answerList)
            setResults(res)
            setPhase('results')
        } catch { } finally { setSubmitting(false) }
    }

    if (loading) return <div className="min-h-screen bg-bg-light flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div></div>

    const q = questions[currentQ]

    return (
        <div className="min-h-screen bg-bg-light">
            <header className="sticky top-0 z-50 bg-white border-b border-gray-200 px-6 py-3 shadow-sm">
                <div className="max-w-[800px] mx-auto flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2"><span className="material-symbols-outlined text-3xl text-primary">school</span><span className="text-xl font-bold text-text-main">Tawjihi</span></Link>
                    <div className="flex items-center gap-3"><LanguageSwitcher /><Link to={`/prep/${examCode}`} className="px-4 py-2 bg-gray-100 rounded-lg text-sm font-bold hover:bg-gray-200">{isFr ? '← Examen' : '← Exam'}</Link></div>
                </div>
            </header>

            <main className="max-w-[800px] mx-auto px-4 py-8 md:px-6">
                {/* Section Selector */}
                {phase === 'select' && exam && (
                    <>
                        <h1 className="text-2xl font-bold text-text-main mb-2">{exam.name} — {isFr ? 'Choisir une section' : 'Choose a Section'}</h1>
                        <p className="text-secondary mb-6">{isFr ? 'Sélectionnez une section pour vous entraîner' : 'Select a section to practice'}</p>
                        <div className="grid gap-3">
                            {(exam.sections || []).map(sec => (
                                <button key={sec.name} onClick={() => startSection(sec.name)} className="flex items-center justify-between bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:border-primary/30 hover:shadow-md transition-all text-left w-full">
                                    <div>
                                        <p className="font-bold text-text-main capitalize">{sec.name.replace(/_/g, ' ')}</p>
                                        <p className="text-xs text-secondary mt-1">{sec.question_count} Q • {sec.time_minutes} min</p>
                                    </div>
                                    <span className="material-symbols-outlined text-primary">play_circle</span>
                                </button>
                            ))}
                        </div>
                    </>
                )}

                {/* Quiz */}
                {phase === 'quiz' && q && (
                    <>
                        {/* Progress */}
                        <div className="flex items-center justify-between mb-6">
                            <p className="text-sm text-secondary font-medium capitalize">{selectedSection?.replace(/_/g, ' ')}</p>
                            <p className="text-sm font-bold text-text-main">{currentQ + 1}/{questions.length}</p>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full mb-8 overflow-hidden">
                            <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${((currentQ + 1) / questions.length) * 100}%` }} />
                        </div>

                        {/* Question */}
                        <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm mb-6">
                            {q.content?.passage && <p className="text-sm text-secondary mb-4 p-4 bg-gray-50 rounded-xl italic">{q.content.passage}</p>}
                            <h2 className="text-lg font-bold text-text-main mb-6">{q.content?.question_text || 'Question'}</h2>

                            {/* Options */}
                            {q.content?.options && (
                                <div className="space-y-3">
                                    {q.content.options.map(opt => (
                                        <button key={opt.id} onClick={() => selectAnswer(q.id, opt.id)}
                                            className={`w-full text-left p-4 rounded-xl border-2 transition-all ${answers[q.id] === opt.id ? 'border-primary bg-primary/5 text-primary font-bold' : 'border-gray-200 hover:border-primary/40 text-text-main'}`}>
                                            <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full mr-3 text-sm font-bold ${answers[q.id] === opt.id ? 'bg-primary text-white' : 'bg-gray-100 text-gray-500'}`}>{opt.id}</span>
                                            {opt.text}
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* Fill in the blank */}
                            {!q.content?.options && (
                                <input type="text" value={answers[q.id] || ''} onChange={e => selectAnswer(q.id, e.target.value)}
                                    className="w-full p-4 border-2 border-gray-200 rounded-xl text-text-main focus:border-primary focus:ring-0 outline-none"
                                    placeholder={isFr ? 'Votre réponse...' : 'Your answer...'} />
                            )}
                        </div>

                        {/* Navigation */}
                        <div className="flex justify-between">
                            <button onClick={() => setCurrentQ(Math.max(0, currentQ - 1))} disabled={currentQ === 0} className="px-6 py-3 bg-gray-100 rounded-xl font-bold text-sm disabled:opacity-50 hover:bg-gray-200 transition-colors">
                                {isFr ? '← Précédent' : '← Previous'}
                            </button>
                            {currentQ < questions.length - 1 ? (
                                <button onClick={() => setCurrentQ(currentQ + 1)} className="px-6 py-3 bg-primary text-white rounded-xl font-bold text-sm hover:bg-primary-hover transition-colors">
                                    {isFr ? 'Suivant →' : 'Next →'}
                                </button>
                            ) : (
                                <button onClick={handleSubmit} disabled={submitting} className="px-6 py-3 bg-green-600 text-white rounded-xl font-bold text-sm hover:bg-green-700 transition-colors disabled:opacity-50">
                                    {submitting ? '...' : (isFr ? 'Soumettre ✓' : 'Submit ✓')}
                                </button>
                            )}
                        </div>
                    </>
                )}

                {/* Results */}
                {phase === 'results' && results && (
                    <div className="text-center">
                        <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-primary to-green-500 flex items-center justify-center text-white text-3xl font-bold mb-6 shadow-lg">
                            {Math.round(results.score_percentage)}%
                        </div>
                        <h1 className="text-2xl font-bold text-text-main mb-2">{isFr ? 'Résultats' : 'Results'}</h1>
                        <p className="text-secondary mb-2">{results.correct}/{results.total} {isFr ? 'réponses correctes' : 'correct answers'}</p>
                        <p className="text-lg font-bold text-primary mb-8">{isFr ? 'Niveau estimé' : 'Estimated Level'}: {results.estimated_level}</p>

                        <div className="grid grid-cols-2 gap-4 max-w-md mx-auto mb-8">
                            {results.strengths?.length > 0 && (
                                <div className="bg-green-50 rounded-xl p-4 border border-green-100">
                                    <p className="text-xs font-bold text-green-800 mb-2">{isFr ? 'Points forts' : 'Strengths'}</p>
                                    {results.strengths.map(s => <span key={s} className="block text-xs text-green-700 capitalize">{s.replace(/_/g, ' ')}</span>)}
                                </div>
                            )}
                            {results.weaknesses?.length > 0 && (
                                <div className="bg-red-50 rounded-xl p-4 border border-red-100">
                                    <p className="text-xs font-bold text-red-800 mb-2">{isFr ? 'À améliorer' : 'To Improve'}</p>
                                    {results.weaknesses.map(w => <span key={w} className="block text-xs text-red-700 capitalize">{w.replace(/_/g, ' ')}</span>)}
                                </div>
                            )}
                        </div>

                        <div className="flex justify-center gap-4">
                            <button onClick={() => { setPhase('select'); setResults(null) }} className="px-6 py-3 bg-primary text-white rounded-xl font-bold text-sm hover:bg-primary-hover transition-colors">
                                {isFr ? 'Réessayer' : 'Try Again'}
                            </button>
                            <Link to={`/prep/${examCode}`} className="px-6 py-3 bg-gray-100 rounded-xl font-bold text-sm hover:bg-gray-200 transition-colors">
                                {isFr ? 'Tableau de bord' : 'Dashboard'}
                            </Link>
                        </div>
                    </div>
                )}
            </main>
        </div>
    )
}
