/**
 * Lesson — Individual language lesson.
 */
import { useParams, Link } from 'react-router-dom'
import { useTranslation, LanguageSwitcher } from '../i18n'

export default function Lesson() {
    const { lang: targetLang, id } = useParams()
    const { lang } = useTranslation()
    const isFr = lang === 'fr'

    return (
        <div className="min-h-screen bg-bg-light">
            <header className="sticky top-0 z-50 bg-white border-b border-gray-200 px-6 py-3 shadow-sm">
                <div className="max-w-[700px] mx-auto flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2"><span className="material-symbols-outlined text-3xl text-primary">school</span><span className="text-xl font-bold">Tawjihi</span></Link>
                    <Link to={`/learn/${targetLang}`} className="px-4 py-2 bg-gray-100 rounded-lg text-sm font-bold">← {targetLang}</Link>
                </div>
            </header>
            <main className="max-w-[700px] mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold mb-6">{isFr ? `Leçon ${id}` : `Lesson ${id}`}</h1>
                <div className="bg-white rounded-xl border border-gray-100 p-8 shadow-sm text-center">
                    <span className="material-symbols-outlined text-5xl text-gray-300 mb-4 block">menu_book</span>
                    <p className="text-secondary mb-4">{isFr ? 'Contenu de la leçon en cours de préparation.' : 'Lesson content is being prepared.'}</p>
                    <p className="text-sm text-gray-400">{isFr ? 'Bientôt disponible avec des exercices interactifs' : 'Coming soon with interactive exercises'}</p>
                </div>
            </main>
        </div>
    )
}
