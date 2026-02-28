/**
 * Writing Practice — Essay writing with AI evaluation placeholder.
 */
import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useTranslation, LanguageSwitcher } from '../i18n'

export default function WritingPractice() {
    const { examCode } = useParams()
    const { lang } = useTranslation()
    const isFr = lang === 'fr'
    const [essay, setEssay] = useState('')
    const wordCount = essay.trim().split(/\s+/).filter(Boolean).length

    return (
        <div className="min-h-screen bg-bg-light">
            <header className="sticky top-0 z-50 bg-white border-b border-gray-200 px-6 py-3 shadow-sm">
                <div className="max-w-[800px] mx-auto flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2"><span className="material-symbols-outlined text-3xl text-primary">school</span><span className="text-xl font-bold">Tawjihi</span></Link>
                    <Link to={`/prep/${examCode}`} className="px-4 py-2 bg-gray-100 rounded-lg text-sm font-bold">{isFr ? '← Examen' : '← Exam'}</Link>
                </div>
            </header>
            <main className="max-w-[800px] mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold mb-2">{isFr ? 'Pratique d\'écriture' : 'Writing Practice'}</h1>
                <p className="text-secondary mb-6">{examCode?.replace(/_/g, ' ').toUpperCase()}</p>
                <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm mb-4">
                    <div className="bg-blue-50 rounded-lg p-4 mb-4"><p className="text-sm font-bold text-blue-800 mb-1">{isFr ? 'Sujet' : 'Topic'}</p><p className="text-sm text-blue-700">{isFr ? 'Discutez les avantages et inconvénients de l\'enseignement en ligne.' : 'Discuss the advantages and disadvantages of online education.'}</p></div>
                    <textarea value={essay} onChange={e => setEssay(e.target.value)} className="w-full h-64 p-4 border border-gray-200 rounded-xl resize-none outline-none focus:border-primary text-sm" placeholder={isFr ? 'Commencez à écrire...' : 'Start writing...'} />
                    <div className="flex items-center justify-between mt-3">
                        <p className="text-xs text-secondary">{wordCount} {isFr ? 'mots' : 'words'}</p>
                        <button className="px-6 py-2 bg-primary text-white rounded-lg font-bold text-sm hover:bg-primary-hover">{isFr ? 'Évaluer (IA)' : 'Evaluate (AI)'}</button>
                    </div>
                </div>
            </main>
        </div>
    )
}
