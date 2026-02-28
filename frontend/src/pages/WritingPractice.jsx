/**
 * Writing Practice — Essay writing with live AI evaluation via OpenRouter.
 */
import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useTranslation } from '../i18n'
import { evaluateWriting } from '../api'

export default function WritingPractice() {
    const { examCode } = useParams()
    const { lang } = useTranslation()
    const isFr = lang === 'fr'
    const [essay, setEssay] = useState('')
    const [loading, setLoading] = useState(false)
    const [result, setResult] = useState(null)
    const [error, setError] = useState('')
    const wordCount = essay.trim().split(/\s+/).filter(Boolean).length

    const topic = isFr
        ? 'Discutez les avantages et inconvénients de l\'enseignement en ligne. Écrivez au moins 250 mots.'
        : 'Discuss the advantages and disadvantages of online education. Write at least 250 words.'

    async function handleEvaluate() {
        if (wordCount < 50) {
            setError(isFr ? 'Écrivez au moins 50 mots.' : 'Write at least 50 words.')
            return
        }
        setLoading(true)
        setError('')
        try {
            const data = await evaluateWriting(essay, examCode?.replace(/_/g, '-') || 'ielts', topic)
            setResult(data)
        } catch (err) {
            setError(err.message || (isFr ? 'Erreur d\'évaluation' : 'Evaluation error'))
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-bg-light">
            <header className="sticky top-0 z-50 bg-white border-b border-gray-200 px-6 py-3 shadow-sm">
                <div className="max-w-[900px] mx-auto flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-3xl text-primary">school</span>
                        <span className="text-xl font-bold">Tawjihi</span>
                    </Link>
                    <Link to={`/prep/${examCode}`} className="px-4 py-2 bg-gray-100 rounded-lg text-sm font-bold hover:bg-gray-200 transition-colors">
                        {isFr ? '← Retour' : '← Back'}
                    </Link>
                </div>
            </header>

            <main className="max-w-[900px] mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold mb-1">{isFr ? 'Pratique d\'écriture' : 'Writing Practice'}</h1>
                <p className="text-secondary mb-6">{examCode?.replace(/_/g, ' ').toUpperCase()} — {isFr ? 'Évaluation IA' : 'AI Evaluation'}</p>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Writing Area */}
                    <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                        <div className="bg-blue-50 rounded-lg p-4 mb-4">
                            <p className="text-sm font-bold text-blue-800 mb-1">{isFr ? 'Sujet' : 'Topic'}</p>
                            <p className="text-sm text-blue-700">{topic}</p>
                        </div>
                        <textarea
                            value={essay} onChange={e => setEssay(e.target.value)}
                            className="w-full h-80 p-4 border border-gray-200 rounded-xl resize-none outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm leading-relaxed"
                            placeholder={isFr ? 'Commencez à écrire votre essai ici...' : 'Start writing your essay here...'}
                        />
                        <div className="flex items-center justify-between mt-3">
                            <div className="flex items-center gap-3">
                                <p className={`text-xs font-medium ${wordCount >= 250 ? 'text-green-600' : wordCount >= 150 ? 'text-yellow-600' : 'text-secondary'}`}>
                                    {wordCount} {isFr ? 'mots' : 'words'}
                                </p>
                                {wordCount >= 250 && <span className="text-xs text-green-600">✓ {isFr ? 'Minimum atteint' : 'Minimum reached'}</span>}
                            </div>
                            <button
                                onClick={handleEvaluate}
                                disabled={loading || wordCount < 50}
                                className="px-6 py-2.5 bg-primary text-white rounded-lg font-bold text-sm hover:bg-primary-hover transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                            >
                                {loading ? (
                                    <span className="flex items-center gap-2">
                                        <span className="animate-spin">⏳</span>
                                        {isFr ? 'Évaluation...' : 'Evaluating...'}
                                    </span>
                                ) : (isFr ? '🤖 Évaluer avec IA' : '🤖 Evaluate with AI')}
                            </button>
                        </div>
                        {error && <p className="text-red-500 text-sm mt-2 bg-red-50 p-3 rounded-lg">{error}</p>}
                    </div>

                    {/* Results Area */}
                    <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                        {!result && !loading && (
                            <div className="flex flex-col items-center justify-center h-full text-center py-12">
                                <span className="material-symbols-outlined text-6xl text-gray-200 mb-4">rate_review</span>
                                <h3 className="font-bold text-lg text-gray-400 mb-2">{isFr ? 'Résultats IA' : 'AI Results'}</h3>
                                <p className="text-sm text-gray-400">{isFr ? 'Écrivez votre essai et cliquez Évaluer pour recevoir un feedback IA détaillé.' : 'Write your essay and click Evaluate to get detailed AI feedback.'}</p>
                            </div>
                        )}
                        {loading && (
                            <div className="flex flex-col items-center justify-center h-full text-center py-12">
                                <div className="w-16 h-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin mb-4" />
                                <p className="text-sm text-secondary">{isFr ? 'L\'IA analyse votre essai...' : 'AI is analyzing your essay...'}</p>
                            </div>
                        )}
                        {result && (
                            <div className="space-y-4">
                                <div className="text-center pb-4 border-b border-gray-100">
                                    <p className="text-4xl font-black text-primary mb-1">{result.overall_score || result.score || '?'}</p>
                                    <p className="text-sm text-secondary">{isFr ? 'Score global' : 'Overall Score'}</p>
                                </div>
                                {result.criteria && Object.entries(result.criteria).map(([key, val]) => (
                                    <div key={key} className="flex items-center justify-between py-2 border-b border-gray-50">
                                        <span className="text-sm font-medium capitalize">{key.replace(/_/g, ' ')}</span>
                                        <span className="text-sm font-bold text-primary">{val}/9</span>
                                    </div>
                                ))}
                                {result.feedback && (
                                    <div className="bg-green-50 rounded-lg p-4 mt-4">
                                        <p className="text-sm font-bold text-green-800 mb-1">{isFr ? 'Feedback' : 'Feedback'}</p>
                                        <p className="text-sm text-green-700 whitespace-pre-wrap">{result.feedback}</p>
                                    </div>
                                )}
                                {result.improvements && (
                                    <div className="bg-yellow-50 rounded-lg p-4">
                                        <p className="text-sm font-bold text-yellow-800 mb-1">{isFr ? 'Améliorations' : 'Improvements'}</p>
                                        <ul className="text-sm text-yellow-700 list-disc pl-4 space-y-1">
                                            {(Array.isArray(result.improvements) ? result.improvements : [result.improvements]).map((imp, i) => (
                                                <li key={i}>{imp}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    )
}
