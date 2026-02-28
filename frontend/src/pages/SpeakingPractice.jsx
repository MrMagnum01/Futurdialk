/**
 * Speaking Practice — Audio recording with transcript-based AI evaluation.
 */
import { useState, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useTranslation } from '../i18n'
import { evaluateSpeaking } from '../api'

export default function SpeakingPractice() {
    const { examCode } = useParams()
    const { lang } = useTranslation()
    const isFr = lang === 'fr'
    const [recording, setRecording] = useState(false)
    const [transcript, setTranscript] = useState('')
    const [loading, setLoading] = useState(false)
    const [result, setResult] = useState(null)
    const [error, setError] = useState('')
    const [seconds, setSeconds] = useState(0)
    const timerRef = useRef(null)

    const question = isFr
        ? 'Décrivez un voyage mémorable que vous avez fait. Où êtes-vous allé ? Avec qui ? Qu\'est-ce qui l\'a rendu spécial ?'
        : 'Describe a memorable trip you took. Where did you go? Who were you with? What made it special?'

    function toggleRecording() {
        if (recording) {
            setRecording(false)
            clearInterval(timerRef.current)
        } else {
            setRecording(true)
            setSeconds(0)
            timerRef.current = setInterval(() => setSeconds(s => s + 1), 1000)
        }
    }

    function formatTime(s) {
        return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
    }

    async function handleEvaluate() {
        if (transcript.trim().length < 20) {
            setError(isFr ? 'Tapez au moins quelques phrases.' : 'Type at least a few sentences.')
            return
        }
        setLoading(true)
        setError('')
        try {
            const data = await evaluateSpeaking(transcript, examCode?.replace(/_/g, '-') || 'ielts')
            setResult(data)
        } catch (err) {
            setError(err.message || (isFr ? 'Erreur d\'évaluation' : 'Evaluation error'))
        } finally { setLoading(false) }
    }

    return (
        <div className="min-h-screen bg-bg-light">
            <header className="sticky top-0 z-50 bg-white border-b border-gray-200 px-6 py-3 shadow-sm">
                <div className="max-w-[800px] mx-auto flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-3xl text-primary">school</span>
                        <span className="text-xl font-bold">Tawjihi</span>
                    </Link>
                    <Link to={`/prep/${examCode}`} className="px-4 py-2 bg-gray-100 rounded-lg text-sm font-bold hover:bg-gray-200 transition-colors">
                        {isFr ? '← Retour' : '← Back'}
                    </Link>
                </div>
            </header>

            <main className="max-w-[800px] mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold mb-1">{isFr ? 'Pratique orale' : 'Speaking Practice'}</h1>
                <p className="text-secondary mb-6">{examCode?.replace(/_/g, ' ').toUpperCase()}</p>

                {/* Question Card */}
                <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm mb-6">
                    <div className="bg-blue-50 rounded-lg p-4 mb-6">
                        <p className="text-sm font-bold text-blue-800 mb-1">{isFr ? 'Question' : 'Question'}</p>
                        <p className="text-sm text-blue-700">{question}</p>
                    </div>

                    {/* Recording UI */}
                    <div className="text-center mb-6">
                        <button
                            onClick={toggleRecording}
                            className={`w-24 h-24 rounded-full mx-auto flex items-center justify-center text-white transition-all ${recording ? 'bg-red-500 animate-pulse shadow-lg shadow-red-200' : 'bg-primary hover:bg-primary-hover shadow-lg hover:shadow-xl hover:-translate-y-0.5'}`}
                        >
                            <span className="material-symbols-outlined text-4xl">{recording ? 'stop' : 'mic'}</span>
                        </button>
                        <p className="text-sm text-secondary mt-3 font-medium">
                            {recording ? `🔴 ${formatTime(seconds)} — ${isFr ? 'Enregistrement...' : 'Recording...'}` : (isFr ? 'Appuyez pour commencer' : 'Press to start')}
                        </p>
                    </div>

                    {/* Transcript Input */}
                    <div>
                        <p className="text-xs text-secondary mb-2">{isFr ? 'Transcription (tapez votre réponse si le micro n\'est pas disponible) :' : 'Transcript (type your answer if mic is not available):'}</p>
                        <textarea
                            value={transcript} onChange={e => setTranscript(e.target.value)}
                            className="w-full h-32 p-4 border border-gray-200 rounded-xl resize-none outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm"
                            placeholder={isFr ? 'Tapez votre réponse ici...' : 'Type your response here...'}
                        />
                        <div className="flex justify-end mt-3">
                            <button
                                onClick={handleEvaluate}
                                disabled={loading || transcript.trim().length < 20}
                                className="px-6 py-2.5 bg-primary text-white rounded-lg font-bold text-sm hover:bg-primary-hover transition-all disabled:opacity-50 shadow-md"
                            >
                                {loading ? (isFr ? '⏳ Évaluation...' : '⏳ Evaluating...') : (isFr ? '🤖 Évaluer' : '🤖 Evaluate')}
                            </button>
                        </div>
                    </div>
                    {error && <p className="text-red-500 text-sm mt-2 bg-red-50 p-3 rounded-lg">{error}</p>}
                </div>

                {/* Results */}
                {result && (
                    <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                        <h3 className="font-bold text-lg mb-4">{isFr ? 'Résultats' : 'Results'}</h3>
                        <div className="text-center pb-4 border-b border-gray-100 mb-4">
                            <p className="text-4xl font-black text-primary">{result.overall_score || result.score || '?'}</p>
                            <p className="text-sm text-secondary">{isFr ? 'Score estimé' : 'Estimated Score'}</p>
                        </div>
                        {result.feedback && (
                            <div className="bg-green-50 rounded-lg p-4">
                                <p className="text-sm text-green-700 whitespace-pre-wrap">{result.feedback}</p>
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    )
}
