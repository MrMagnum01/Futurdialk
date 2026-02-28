/**
 * Mock Visa Interview — Country-specific visa interview practice.
 */
import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useTranslation, LanguageSwitcher } from '../i18n'
import { getVisaQuestions } from '../api'

export default function MockVisaInterview() {
    const { country } = useParams()
    const { lang } = useTranslation()
    const isFr = lang === 'fr'
    const [questions, setQuestions] = useState([])
    const [current, setCurrent] = useState(0)
    const [showAnswer, setShowAnswer] = useState(false)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        getVisaQuestions(country).then(d => setQuestions(d.questions || d || [])).catch(() => { }).finally(() => setLoading(false))
    }, [country])

    const q = questions[current]

    return (
        <div className="min-h-screen bg-bg-light">
            <header className="sticky top-0 z-50 bg-white border-b border-gray-200 px-6 py-3 shadow-sm">
                <div className="max-w-[700px] mx-auto flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2"><span className="material-symbols-outlined text-3xl text-primary">school</span><span className="text-xl font-bold">Tawjihi</span></Link>
                    <Link to="/visa-prep" className="px-4 py-2 bg-gray-100 rounded-lg text-sm font-bold">{isFr ? '← Visa' : '← Visa'}</Link>
                </div>
            </header>
            <main className="max-w-[700px] mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold mb-6">{isFr ? 'Entretien Visa' : 'Visa Interview'} — {country?.toUpperCase()}</h1>
                {loading ? <p className="text-center text-secondary">Loading...</p> : !q ? (
                    <p className="text-center text-secondary py-10">{isFr ? 'Aucune question' : 'No questions'}</p>
                ) : (
                    <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
                        <p className="text-xs text-secondary mb-2">{current + 1}/{questions.length}</p>
                        <h2 className="text-lg font-bold mb-6">{q.question || q.text}</h2>
                        {showAnswer && <div className="bg-green-50 rounded-xl p-4 mb-4 text-sm text-green-800">{q.tip || q.answer || (isFr ? 'Soyez honnête et confiant' : 'Be honest and confident')}</div>}
                        <div className="flex gap-3">
                            <button onClick={() => setShowAnswer(!showAnswer)} className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-bold">{showAnswer ? (isFr ? 'Masquer' : 'Hide') : (isFr ? 'Voir le conseil' : 'Show Tip')}</button>
                            <button onClick={() => { setCurrent(Math.min(questions.length - 1, current + 1)); setShowAnswer(false) }} className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold">{isFr ? 'Suivant →' : 'Next →'}</button>
                        </div>
                    </div>
                )}
            </main>
        </div>
    )
}
