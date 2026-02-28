/**
 * Language Dashboard — Progress for a specific language.
 */
import { useParams, Link } from 'react-router-dom'
import { useTranslation, LanguageSwitcher } from '../i18n'

const LANG_INFO = {
    french: { name: 'French', nameFr: 'Français', flag: '🇫🇷', levels: ['A1', 'A2', 'B1', 'B2', 'C1'] },
    english: { name: 'English', nameFr: 'Anglais', flag: '🇬🇧', levels: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'] },
    german: { name: 'German', nameFr: 'Allemand', flag: '🇩🇪', levels: ['A1', 'A2', 'B1', 'B2'] },
    spanish: { name: 'Spanish', nameFr: 'Espagnol', flag: '🇪🇸', levels: ['A1', 'A2', 'B1', 'B2'] },
}

export default function LanguageDashboard() {
    const { lang: targetLang } = useParams()
    const { lang } = useTranslation()
    const isFr = lang === 'fr'
    const info = LANG_INFO[targetLang] || { name: targetLang, nameFr: targetLang, flag: '🌍', levels: ['A1', 'A2', 'B1'] }

    return (
        <div className="min-h-screen bg-bg-light">
            <header className="sticky top-0 z-50 bg-white border-b border-gray-200 px-6 py-3 shadow-sm">
                <div className="max-w-[800px] mx-auto flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2"><span className="material-symbols-outlined text-3xl text-primary">school</span><span className="text-xl font-bold">Tawjihi</span></Link>
                    <div className="flex items-center gap-3"><LanguageSwitcher /><Link to="/learn" className="px-4 py-2 bg-gray-100 rounded-lg text-sm font-bold">{isFr ? '← Langues' : '← Languages'}</Link></div>
                </div>
            </header>
            <main className="max-w-[800px] mx-auto px-4 py-8">
                <div className="bg-gradient-to-br from-lime-50 to-green-50 rounded-2xl p-8 mb-8">
                    <span className="text-4xl mb-3 block">{info.flag}</span>
                    <h1 className="text-3xl font-bold mb-1">{isFr ? info.nameFr : info.name}</h1>
                    <p className="text-secondary">{isFr ? 'Votre progression' : 'Your Progress'}</p>
                </div>
                <h2 className="text-lg font-bold mb-4">{isFr ? 'Niveaux' : 'Levels'}</h2>
                <div className="space-y-3">
                    {info.levels.map((level, i) => (
                        <Link key={level} to={`/learn/${targetLang}/lesson/${i + 1}`} className="flex items-center justify-between bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:border-primary/30 transition-all group">
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg ${i === 0 ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-500'}`}>{level}</div>
                                <div><p className="font-bold group-hover:text-primary transition-colors">{level} — {isFr ? `Niveau ${level}` : `Level ${level}`}</p><p className="text-xs text-secondary">{i === 0 ? (isFr ? 'En cours' : 'In Progress') : (isFr ? 'Verrouillé' : 'Locked')}</p></div>
                            </div>
                            <span className="material-symbols-outlined text-gray-300">{i === 0 ? 'play_circle' : 'lock'}</span>
                        </Link>
                    ))}
                </div>
            </main>
        </div>
    )
}
