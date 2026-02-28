/**
 * Notification Center — View all notifications.
 */
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation, LanguageSwitcher } from '../i18n'

const MOCK_NOTIFICATIONS = [
    { type: 'deadline', icon: 'calendar_month', title: 'Campus France deadline in 7 days', titleFr: 'Délai Campus France dans 7 jours', time: '2h ago', read: false },
    { type: 'exam', icon: 'quiz', title: 'TCF March registration is now open', titleFr: 'Inscription TCF Mars ouverte', time: '5h ago', read: false },
    { type: 'step', icon: 'task_alt', title: 'Step 3 completed — upload casier judiciaire', titleFr: 'Étape 3 terminée — uploader le casier judiciaire', time: '1d ago', read: true },
    { type: 'acceptance', icon: 'celebration', title: 'Accepted at INSA Lyon! Next steps available', titleFr: 'Accepté à INSA Lyon! Prochaines étapes dispo', time: '2d ago', read: true },
    { type: 'study', icon: 'local_fire_department', title: "Don't break your 15-day streak! Quick quiz", titleFr: 'Ne brisez pas votre série de 15 jours!', time: '3d ago', read: true },
]

export default function NotificationCenter() {
    const { lang } = useTranslation()
    const isFr = lang === 'fr'
    const [notifs, setNotifs] = useState(MOCK_NOTIFICATIONS)

    const markAllRead = () => setNotifs(prev => prev.map(n => ({ ...n, read: true })))

    return (
        <div className="min-h-screen bg-bg-light">
            <header className="sticky top-0 z-50 bg-white border-b border-gray-200 px-6 py-3 shadow-sm">
                <div className="max-w-[700px] mx-auto flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2"><span className="material-symbols-outlined text-3xl text-primary">school</span><span className="text-xl font-bold">Tawjihi</span></Link>
                    <div className="flex items-center gap-3"><LanguageSwitcher /><Link to="/dashboard" className="px-4 py-2 bg-gray-100 rounded-lg text-sm font-bold">{isFr ? '← Dashboard' : '← Dashboard'}</Link></div>
                </div>
            </header>
            <main className="max-w-[700px] mx-auto px-4 py-8">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold">{isFr ? 'Notifications' : 'Notifications'}</h1>
                    <button onClick={markAllRead} className="text-sm text-primary font-bold hover:underline">{isFr ? 'Tout marquer lu' : 'Mark all read'}</button>
                </div>
                <div className="space-y-2">
                    {notifs.map((n, i) => (
                        <div key={i} className={`flex items-start gap-4 p-4 rounded-xl border transition-colors ${n.read ? 'bg-white border-gray-100' : 'bg-blue-50 border-blue-200'}`}>
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${n.read ? 'bg-gray-100 text-gray-500' : 'bg-primary/10 text-primary'}`}>
                                <span className="material-symbols-outlined">{n.icon}</span>
                            </div>
                            <div className="flex-1">
                                <p className={`text-sm ${n.read ? 'text-secondary' : 'text-text-main font-bold'}`}>{isFr ? n.titleFr : n.title}</p>
                                <p className="text-xs text-gray-400 mt-1">{n.time}</p>
                            </div>
                            {!n.read && <div className="w-2 h-2 rounded-full bg-primary shrink-0 mt-2" />}
                        </div>
                    ))}
                </div>
            </main>
        </div>
    )
}
