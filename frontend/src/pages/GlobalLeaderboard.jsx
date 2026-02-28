/**
 * Global Leaderboard — Top users by streak and XP.
 */
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation, LanguageSwitcher } from '../i18n'
import { getLeaderboard } from '../api'

export default function GlobalLeaderboard() {
    const { lang } = useTranslation()
    const isFr = lang === 'fr'
    const [entries, setEntries] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => { getLeaderboard().then(d => setEntries(d.leaderboard || [])).catch(() => { }).finally(() => setLoading(false)) }, [])

    const medals = ['🥇', '🥈', '🥉']

    return (
        <div className="min-h-screen bg-bg-light">
            <header className="sticky top-0 z-50 bg-white border-b border-gray-200 px-6 py-3 shadow-sm">
                <div className="max-w-[700px] mx-auto flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2"><span className="material-symbols-outlined text-3xl text-primary">school</span><span className="text-xl font-bold">FuturDialk</span></Link>
                    <Link to="/prep" className="px-4 py-2 bg-gray-100 rounded-lg text-sm font-bold">{isFr ? '← Examens' : '← Exams'}</Link>
                </div>
            </header>
            <main className="max-w-[700px] mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold mb-6 text-center">{isFr ? 'Classement Global' : 'Global Leaderboard'} 🏆</h1>
                {loading ? <p className="text-center text-secondary">Loading...</p> : entries.length === 0 ? (
                    <div className="text-center py-20"><span className="material-symbols-outlined text-5xl text-gray-300 mb-3 block">emoji_events</span><p className="text-secondary">{isFr ? 'Pas encore de participants' : 'No participants yet'}</p></div>
                ) : (
                    <div className="space-y-2">
                        {entries.map((e, i) => (
                            <div key={e.user_id || i} className={`flex items-center gap-4 p-4 rounded-xl border ${i < 3 ? 'bg-yellow-50 border-yellow-200' : 'bg-white border-gray-100'}`}>
                                <span className="text-xl w-8 text-center">{medals[i] || `${i + 1}.`}</span>
                                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">{(e.name || 'U').charAt(0)}</div>
                                <div className="flex-1"><p className="font-bold text-sm">{e.name || 'User'}</p><p className="text-xs text-secondary">{e.total_questions || 0} {isFr ? 'questions' : 'questions'}</p></div>
                                <span className="text-sm font-bold text-orange-500">{e.streak || 0}🔥</span>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    )
}
