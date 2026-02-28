/**
 * Lesson — Individual language lesson with exercises from MongoDB.
 */
import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useTranslation } from '../i18n'
import { getLesson, completeLesson } from '../api'

export default function Lesson() {
    const { lang: targetLang, id } = useParams()
    const { lang } = useTranslation()
    const isFr = lang === 'fr'
    const navigate = useNavigate()
    const [lesson, setLesson] = useState(null)
    const [exercises, setExercises] = useState([])
    const [currentIdx, setCurrentIdx] = useState(0)
    const [answers, setAnswers] = useState({})
    const [showResult, setShowResult] = useState(false)
    const [completed, setCompleted] = useState(false)
    const [loading, setLoading] = useState(true)

    // Parse unit and lesson from id like "1-1" -> unit=1, lesson=1
    const parts = id?.split('-') || ['1', '1']
    const unit = parseInt(parts[0]) || 1
    const lessonNum = parseInt(parts[1]) || 1

    useEffect(() => {
        setLoading(true)
        getLesson(targetLang, unit, lessonNum)
            .then(data => {
                setLesson(data)
                setExercises(data.exercises || [])
            })
            .catch(() => {
                setExercises([
                    { type: 'info', instruction: isFr ? 'Cette leçon est en cours de préparation.' : 'This lesson is being prepared.' }
                ])
            })
            .finally(() => setLoading(false))
    }, [targetLang, unit, lessonNum])

    const current = exercises[currentIdx]
    const total = exercises.length
    const progress = total > 0 ? ((currentIdx + (showResult ? 1 : 0)) / total * 100) : 0

    function handleAnswer(ans) {
        setAnswers(prev => ({ ...prev, [currentIdx]: ans }))
        setShowResult(true)
    }

    function handleNext() {
        setShowResult(false)
        if (currentIdx < total - 1) {
            setCurrentIdx(currentIdx + 1)
        } else {
            handleComplete()
        }
    }

    async function handleComplete() {
        setCompleted(true)
        try { await completeLesson(targetLang, unit, lessonNum) } catch { }
    }

    function isCorrect(exerciseIdx) {
        const ex = exercises[exerciseIdx]
        const ans = answers[exerciseIdx]
        if (ex.type === 'choice') return ans === ex.answer
        if (ex.type === 'fill' || ex.type === 'translate') {
            return ans?.toLowerCase().trim() === ex.answer?.toLowerCase().trim()
        }
        return true
    }

    const correctCount = Object.keys(answers).filter(i => isCorrect(parseInt(i))).length

    if (loading) {
        return (
            <div className="min-h-screen bg-bg-light flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
            </div>
        )
    }

    if (completed) {
        return (
            <div className="min-h-screen bg-bg-light flex items-center justify-center">
                <div className="bg-white rounded-2xl border border-gray-100 p-10 shadow-lg text-center max-w-md">
                    <span className="text-6xl block mb-4">🎉</span>
                    <h2 className="text-2xl font-bold mb-2">{isFr ? 'Leçon terminée !' : 'Lesson Complete!'}</h2>
                    <p className="text-secondary mb-2">{isFr ? `${correctCount}/${total} réponses correctes` : `${correctCount}/${total} correct answers`}</p>
                    <div className="w-full bg-gray-100 rounded-full h-3 mb-6">
                        <div className="bg-green-500 h-3 rounded-full transition-all" style={{ width: `${(correctCount / total) * 100}%` }} />
                    </div>
                    <div className="flex gap-3 justify-center">
                        <Link to={`/learn/${targetLang}`} className="px-6 py-3 bg-primary text-white rounded-lg font-bold hover:bg-primary-hover transition-colors">
                            {isFr ? '← Continuer' : '← Continue'}
                        </Link>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-bg-light">
            <header className="sticky top-0 z-50 bg-white border-b border-gray-200 px-6 py-3 shadow-sm">
                <div className="max-w-[700px] mx-auto flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-3xl text-primary">school</span>
                        <span className="text-xl font-bold">FuturDialk</span>
                    </Link>
                    <div className="flex items-center gap-3">
                        <span className="text-xs text-secondary font-medium">{currentIdx + 1}/{total}</span>
                        <Link to={`/learn/${targetLang}`} className="px-4 py-2 bg-gray-100 rounded-lg text-sm font-bold hover:bg-gray-200 transition-colors">✕</Link>
                    </div>
                </div>
                {/* Progress bar */}
                <div className="max-w-[700px] mx-auto mt-2">
                    <div className="w-full bg-gray-100 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
                    </div>
                </div>
            </header>

            <main className="max-w-[700px] mx-auto px-4 py-8">
                {current && (
                    <div className="bg-white rounded-xl border border-gray-100 p-8 shadow-sm">
                        {/* Exercise instruction */}
                        <p className="text-lg font-bold text-text-main mb-6">{current.instruction}</p>

                        {/* Multiple choice */}
                        {current.type === 'choice' && (
                            <div className="space-y-3">
                                {current.options?.map((opt, i) => {
                                    const selected = answers[currentIdx] === i
                                    const correct = showResult && i === current.answer
                                    const wrong = showResult && selected && i !== current.answer
                                    return (
                                        <button key={i} onClick={() => !showResult && handleAnswer(i)}
                                            disabled={showResult}
                                            className={`w-full text-left p-4 rounded-xl border-2 transition-all text-sm font-medium ${correct ? 'border-green-500 bg-green-50 text-green-800' : wrong ? 'border-red-500 bg-red-50 text-red-800' : selected ? 'border-primary bg-blue-50' : 'border-gray-200 hover:border-primary/50'}`}
                                        >
                                            {opt}
                                        </button>
                                    )
                                })}
                            </div>
                        )}

                        {/* Fill in the blank */}
                        {current.type === 'fill' && (
                            <div>
                                {current.hint && <p className="text-xs text-secondary mb-2">💡 {current.hint}</p>}
                                <input
                                    type="text"
                                    disabled={showResult}
                                    className="w-full p-4 border-2 border-gray-200 rounded-xl outline-none focus:border-primary text-sm"
                                    placeholder={isFr ? 'Votre réponse...' : 'Your answer...'}
                                    onKeyDown={e => {
                                        if (e.key === 'Enter' && !showResult) handleAnswer(e.target.value)
                                    }}
                                    onChange={e => !showResult && setAnswers(prev => ({ ...prev, [currentIdx]: e.target.value }))}
                                />
                                {!showResult && (
                                    <button onClick={() => handleAnswer(answers[currentIdx] || '')}
                                        className="mt-3 px-6 py-2 bg-primary text-white rounded-lg font-bold text-sm hover:bg-primary-hover">
                                        {isFr ? 'Vérifier' : 'Check'}
                                    </button>
                                )}
                            </div>
                        )}

                        {/* Translate */}
                        {current.type === 'translate' && (
                            <div>
                                <input
                                    type="text"
                                    disabled={showResult}
                                    className="w-full p-4 border-2 border-gray-200 rounded-xl outline-none focus:border-primary text-sm"
                                    placeholder={isFr ? 'Traduction...' : 'Translation...'}
                                    onKeyDown={e => {
                                        if (e.key === 'Enter' && !showResult) handleAnswer(e.target.value)
                                    }}
                                    onChange={e => !showResult && setAnswers(prev => ({ ...prev, [currentIdx]: e.target.value }))}
                                />
                                {!showResult && (
                                    <button onClick={() => handleAnswer(answers[currentIdx] || '')}
                                        className="mt-3 px-6 py-2 bg-primary text-white rounded-lg font-bold text-sm hover:bg-primary-hover">
                                        {isFr ? 'Vérifier' : 'Check'}
                                    </button>
                                )}
                            </div>
                        )}

                        {/* Match (simplified display) */}
                        {current.type === 'match' && (
                            <div className="grid grid-cols-2 gap-3">
                                {current.pairs?.map(([left, right], i) => (
                                    <div key={i} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                                        <span className="font-bold text-primary text-sm">{left}</span>
                                        <span className="text-secondary text-sm">=</span>
                                        <span className="text-sm">{right}</span>
                                    </div>
                                ))}
                                {!showResult && (
                                    <button onClick={() => handleAnswer('matched')} className="col-span-2 mt-2 px-6 py-2 bg-primary text-white rounded-lg font-bold text-sm hover:bg-primary-hover">
                                        {isFr ? 'Continuer' : 'Continue'}
                                    </button>
                                )}
                            </div>
                        )}

                        {/* Info (no interaction) */}
                        {current.type === 'info' && (
                            <button onClick={() => handleAnswer('ok')} className="px-6 py-2 bg-primary text-white rounded-lg font-bold text-sm hover:bg-primary-hover">
                                {isFr ? 'Continuer' : 'Continue'}
                            </button>
                        )}

                        {/* Result feedback */}
                        {showResult && (
                            <div className={`mt-6 p-4 rounded-xl ${isCorrect(currentIdx) ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                                <p className={`font-bold text-sm ${isCorrect(currentIdx) ? 'text-green-700' : 'text-red-700'}`}>
                                    {isCorrect(currentIdx) ? '✅ ' + (isFr ? 'Correct !' : 'Correct!') : '❌ ' + (isFr ? 'Incorrect' : 'Incorrect')}
                                </p>
                                {!isCorrect(currentIdx) && current.answer !== undefined && (
                                    <p className="text-sm text-red-600 mt-1">
                                        {isFr ? 'Réponse :' : 'Answer:'} {current.type === 'choice' ? current.options?.[current.answer] : current.answer}
                                    </p>
                                )}
                                <button onClick={handleNext} className="mt-3 px-6 py-2 bg-primary text-white rounded-lg font-bold text-sm hover:bg-primary-hover">
                                    {currentIdx < total - 1 ? (isFr ? 'Suivant →' : 'Next →') : (isFr ? 'Terminer 🎉' : 'Finish 🎉')}
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    )
}
