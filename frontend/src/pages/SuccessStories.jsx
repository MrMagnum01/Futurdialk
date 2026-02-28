/**
 * Success Stories — Anonymized student journey cards.
 */
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation, LanguageSwitcher } from '../i18n'
import { getCommunityStories } from '../api'

export default function SuccessStories() {
    const { lang } = useTranslation()
    const isFr = lang === 'fr'
    const [stories, setStories] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        getCommunityStories().then(d => setStories(d.stories || d || [])).catch(() => { }).finally(() => setLoading(false))
    }, [])

    return (
        <div className="min-h-screen bg-bg-light">
            <header className="sticky top-0 z-50 bg-white border-b border-gray-200 px-6 py-3 shadow-sm">
                <div className="max-w-[1100px] mx-auto flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2"><span className="material-symbols-outlined text-3xl text-primary">school</span><span className="text-xl font-bold">Tawjihi</span></Link>
                    <div className="flex items-center gap-3"><LanguageSwitcher /><Link to="/community" className="px-4 py-2 bg-gray-100 rounded-lg text-sm font-bold">{isFr ? '← Communauté' : '← Community'}</Link></div>
                </div>
            </header>
            <main className="max-w-[1100px] mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold mb-6">{isFr ? 'Histoires de Réussite' : 'Success Stories'}</h1>
                {loading ? <p className="text-secondary text-center py-10">Loading...</p> : stories.length === 0 ? (
                    <div className="text-center py-20"><span className="material-symbols-outlined text-5xl text-gray-300 mb-3 block">auto_stories</span><p className="text-secondary">{isFr ? 'Pas encore d\'histoires' : 'No stories yet'}</p></div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {stories.map((s, i) => (
                            <div key={s.id || i} className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">{(s.author || 'A').charAt(0)}</div>
                                    <div><p className="font-bold text-sm">{s.author || 'Anonymous'}</p><p className="text-xs text-secondary">{s.destination || ''}</p></div>
                                </div>
                                <p className="text-sm text-text-main line-clamp-4">{s.content || s.summary}</p>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    )
}
