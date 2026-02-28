/**
 * Notification Center — User notifications from the backend.
 * Fetches from /api/notifications/history.
 */
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation, LanguageSwitcher } from '../i18n'
import { getNotificationHistory } from '../api'

const ICON_MAP = {
    deadline: { icon: 'event_upcoming', color: 'bg-red-100 text-red-600' },
    document: { icon: 'description', color: 'bg-blue-100 text-blue-600' },
    scholarship: { icon: 'school', color: 'bg-green-100 text-green-600' },
    system: { icon: 'settings', color: 'bg-gray-100 text-gray-600' },
    community: { icon: 'groups', color: 'bg-purple-100 text-purple-600' },
    exam: { icon: 'quiz', color: 'bg-orange-100 text-orange-600' },
}

export default function NotificationCenter() {
    const { lang } = useTranslation()
    const isFr = lang === 'fr'
    const [notifications, setNotifications] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        getNotificationHistory()
            .then(data => setNotifications(data.notifications || data.history || []))
            .catch(() => { })
            .finally(() => setLoading(false))
    }, [])

    return (
        <div className="min-h-screen bg-bg-light">
            <header className="sticky top-0 z-50 bg-white border-b border-gray-200 px-6 py-3 shadow-sm">
                <div className="max-w-[800px] mx-auto flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2"><span className="material-symbols-outlined text-3xl text-primary">school</span><span className="text-xl font-bold">FuturDialk</span></Link>
                    <div className="flex items-center gap-3"><LanguageSwitcher /><Link to="/dashboard" className="px-4 py-2 bg-gray-100 rounded-lg text-sm font-bold">{isFr ? '← Dashboard' : '← Dashboard'}</Link></div>
                </div>
            </header>
            <main className="max-w-[800px] mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">notifications</span>
                    {isFr ? 'Centre de Notifications' : 'Notification Center'}
                </h1>
                {loading ? (
                    <p className="text-center text-secondary py-10">{isFr ? 'Chargement...' : 'Loading...'}</p>
                ) : notifications.length === 0 ? (
                    <div className="text-center py-20">
                        <span className="material-symbols-outlined text-5xl text-gray-300 mb-3 block">notifications_none</span>
                        <p className="text-secondary mb-1">{isFr ? 'Aucune notification' : 'No notifications yet'}</p>
                        <p className="text-sm text-secondary">{isFr ? 'Vous recevrez des alertes pour vos échéances et candidatures.' : 'You\'ll receive alerts for deadlines and applications.'}</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {notifications.map((n, i) => {
                            const meta = ICON_MAP[n.type] || ICON_MAP.system
                            return (
                                <div key={n.id || i} className={`bg-white rounded-xl border p-4 flex items-start gap-3 ${n.read ? 'border-gray-100 opacity-70' : 'border-primary/20 shadow-sm'}`}>
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${meta.color}`}>
                                        <span className="material-symbols-outlined text-lg">{meta.icon}</span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-bold text-sm text-text-main">{n.title || n.message}</p>
                                        {n.body && <p className="text-sm text-secondary mt-0.5">{n.body}</p>}
                                        <p className="text-xs text-secondary mt-1">{n.time || n.created_at || ''}</p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </main>
        </div>
    )
}
