/**
 * Notification Settings — Toggle notification preferences.
 */
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation, LanguageSwitcher } from '../i18n'

export default function NotificationSettings() {
    const { lang } = useTranslation()
    const isFr = lang === 'fr'
    const [prefs, setPrefs] = useState({
        deadlines: { email: true, whatsapp: true, push: true },
        exams: { email: true, whatsapp: true, push: false },
        weekly: { email: true, whatsapp: false, push: false },
        study: { email: false, whatsapp: true, push: true },
    })

    const toggle = (type, channel) => {
        setPrefs(p => ({ ...p, [type]: { ...p[type], [channel]: !p[type][channel] } }))
    }

    const types = [
        { key: 'deadlines', label: isFr ? 'Rappels de délais' : 'Deadline Reminders', icon: 'calendar_month' },
        { key: 'exams', label: isFr ? 'Inscriptions examens' : 'Exam Registration', icon: 'quiz' },
        { key: 'weekly', label: isFr ? 'Résumé hebdomadaire' : 'Weekly Digest', icon: 'summarize' },
        { key: 'study', label: isFr ? 'Rappels d\'étude' : 'Study Reminders', icon: 'school' },
    ]

    return (
        <div className="min-h-screen bg-bg-light">
            <header className="sticky top-0 z-50 bg-white border-b border-gray-200 px-6 py-3 shadow-sm">
                <div className="max-w-[700px] mx-auto flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2"><span className="material-symbols-outlined text-3xl text-primary">school</span><span className="text-xl font-bold">Tawjihi</span></Link>
                    <div className="flex items-center gap-3"><LanguageSwitcher /><Link to="/settings" className="px-4 py-2 bg-gray-100 rounded-lg text-sm font-bold">{isFr ? '← Paramètres' : '← Settings'}</Link></div>
                </div>
            </header>
            <main className="max-w-[700px] mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold mb-6">{isFr ? 'Préférences de notifications' : 'Notification Preferences'}</h1>
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="grid grid-cols-4 p-4 border-b bg-gray-50 text-xs font-bold text-secondary">
                        <span>{isFr ? 'Type' : 'Type'}</span><span className="text-center">Email</span><span className="text-center">WhatsApp</span><span className="text-center">Push</span>
                    </div>
                    {types.map(t => (
                        <div key={t.key} className="grid grid-cols-4 items-center p-4 border-b border-gray-50 hover:bg-gray-50/50">
                            <div className="flex items-center gap-2"><span className="material-symbols-outlined text-gray-400 text-lg">{t.icon}</span><span className="text-sm font-medium">{t.label}</span></div>
                            {['email', 'whatsapp', 'push'].map(ch => (
                                <div key={ch} className="text-center">
                                    <button onClick={() => toggle(t.key, ch)} className={`w-10 h-6 rounded-full transition-colors ${prefs[t.key][ch] ? 'bg-primary' : 'bg-gray-200'}`}>
                                        <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform mx-1 ${prefs[t.key][ch] ? 'translate-x-4' : ''}`} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </main>
        </div>
    )
}
