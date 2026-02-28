/**
 * Q&A Forum — Reddit-style Q&A threads.
 */
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation, LanguageSwitcher } from '../i18n'
import { getCommunityPosts } from '../api'

export default function QAForum() {
    const { lang } = useTranslation()
    const isFr = lang === 'fr'
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        getCommunityPosts().then(d => setPosts(d.posts || d || [])).catch(() => { }).finally(() => setLoading(false))
    }, [])

    return (
        <div className="min-h-screen bg-bg-light">
            <header className="sticky top-0 z-50 bg-white border-b border-gray-200 px-6 py-3 shadow-sm">
                <div className="max-w-[900px] mx-auto flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2"><span className="material-symbols-outlined text-3xl text-primary">school</span><span className="text-xl font-bold">Tawjihi</span></Link>
                    <div className="flex items-center gap-3"><LanguageSwitcher /><Link to="/community" className="px-4 py-2 bg-gray-100 rounded-lg text-sm font-bold">{isFr ? '← Communauté' : '← Community'}</Link></div>
                </div>
            </header>
            <main className="max-w-[900px] mx-auto px-4 py-8">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold">{isFr ? 'Forum Q&R' : 'Q&A Forum'}</h1>
                    <button className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold">{isFr ? '+ Poser une question' : '+ Ask Question'}</button>
                </div>
                <div className="space-y-3">
                    {loading ? <p className="text-secondary text-center py-10">Loading...</p> : posts.length === 0 ? (
                        <div className="text-center py-20"><span className="material-symbols-outlined text-5xl text-gray-300 mb-3 block">forum</span><p className="text-secondary">{isFr ? 'Aucune question pour le moment' : 'No questions yet'}</p></div>
                    ) : posts.map((p, i) => (
                        <div key={p.id || i} className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-all">
                            <h3 className="font-bold text-text-main mb-1">{p.title || p.content?.slice(0, 80)}</h3>
                            <p className="text-sm text-secondary line-clamp-2 mb-3">{p.content}</p>
                            <div className="flex items-center gap-4 text-xs text-secondary">
                                <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">thumb_up</span>{p.likes || 0}</span>
                                <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">chat_bubble</span>{p.replies || 0}</span>
                                <span>{p.author || 'Anonymous'}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    )
}
