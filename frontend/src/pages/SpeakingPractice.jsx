/**
 * Speaking Practice — Audio recording placeholder for speaking evaluation.
 */
import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useTranslation, LanguageSwitcher } from '../i18n'

export default function SpeakingPractice() {
    const { examCode } = useParams()
    const { lang } = useTranslation()
    const isFr = lang === 'fr'
    const [recording, setRecording] = useState(false)

    return (
        <div className="min-h-screen bg-bg-light">
            <header className="sticky top-0 z-50 bg-white border-b border-gray-200 px-6 py-3 shadow-sm">
                <div className="max-w-[700px] mx-auto flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2"><span className="material-symbols-outlined text-3xl text-primary">school</span><span className="text-xl font-bold">Tawjihi</span></Link>
                    <Link to={`/prep/${examCode}`} className="px-4 py-2 bg-gray-100 rounded-lg text-sm font-bold">{isFr ? '← Examen' : '← Exam'}</Link>
                </div>
            </header>
            <main className="max-w-[700px] mx-auto px-4 py-8 text-center">
                <h1 className="text-2xl font-bold mb-2">{isFr ? 'Pratique orale' : 'Speaking Practice'}</h1>
                <p className="text-secondary mb-8">{examCode?.replace(/_/g, ' ').toUpperCase()}</p>
                <div className="bg-white rounded-2xl border border-gray-100 p-10 shadow-sm mb-6">
                    <div className="bg-blue-50 rounded-lg p-4 mb-8 text-left"><p className="text-sm font-bold text-blue-800 mb-1">{isFr ? 'Question' : 'Question'}</p><p className="text-sm text-blue-700">{isFr ? 'Décrivez un voyage mémorable que vous avez fait.' : 'Describe a memorable trip you took.'}</p></div>
                    <button onClick={() => setRecording(!recording)} className={`w-24 h-24 rounded-full mx-auto flex items-center justify-center text-white transition-all ${recording ? 'bg-red-500 animate-pulse shadow-lg shadow-red-200' : 'bg-primary hover:bg-primary-hover shadow-lg'}`}>
                        <span className="material-symbols-outlined text-4xl">{recording ? 'stop' : 'mic'}</span>
                    </button>
                    <p className="text-sm text-secondary mt-4">{recording ? (isFr ? 'Enregistrement en cours...' : 'Recording...') : (isFr ? 'Appuyez pour commencer' : 'Press to start')}</p>
                </div>
            </main>
        </div>
    )
}
