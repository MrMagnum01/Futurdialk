/**
 * Dashboard — main authenticated view with live user data and i18n.
 */

import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation, LanguageSwitcher } from '../i18n'
import { getProfile, getMyRoadmaps, isAuthenticated } from '../api'

export default function Dashboard() {
    const { t, lang } = useTranslation()
    const isFr = lang === 'fr'
    const navigate = useNavigate()
    const [userName, setUserName] = useState('')
    const [userInitial, setUserInitial] = useState('T')
    const [stats, setStats] = useState({ roadmaps: 0, stepsCompleted: 0 })

    useEffect(() => {
        if (!isAuthenticated()) { navigate('/login'); return }
        getProfile()
            .then(data => {
                const name = data.user?.full_name || ''
                setUserName(name)
                setUserInitial(name.charAt(0).toUpperCase() || 'T')
            })
            .catch(() => { })
        getMyRoadmaps()
            .then(data => {
                const rms = data.roadmaps || []
                const totalCompleted = rms.reduce((sum, rm) => {
                    const steps = rm.steps_status || []
                    return sum + steps.filter(s => s.status === 'completed').length
                }, 0)
                setStats({ roadmaps: rms.length, stepsCompleted: totalCompleted })
            })
            .catch(() => { })
    }, [])

    const modules = [
        { icon: 'explore', title: t('dashboard.explore'), desc: t('dashboard.exploreDesc'), to: '/explore', color: 'bg-blue-500' },
        { icon: 'quiz', title: t('dashboard.examPrep'), desc: t('dashboard.examPrepDesc'), to: '/prep', color: 'bg-green-500' },
        { icon: 'psychology', title: t('dashboard.careerAI'), desc: t('dashboard.careerAIDesc'), to: '/career', color: 'bg-purple-500' },
        { icon: 'route', title: t('dashboard.roadmap'), desc: t('dashboard.roadmapDesc'), to: '/roadmap', color: 'bg-orange-500' },
        { icon: 'description', title: t('dashboard.documents'), desc: t('dashboard.documentsDesc'), to: '/documents', color: 'bg-red-500' },
        { icon: 'groups', title: t('dashboard.community'), desc: t('dashboard.communityDesc'), to: '/community', color: 'bg-teal-500' },
        { icon: 'savings', title: t('dashboard.budget'), desc: t('dashboard.budgetDesc'), to: '/budget', color: 'bg-yellow-500' },
        { icon: 'school', title: t('dashboard.scholarships'), desc: t('dashboard.scholarshipsDesc'), to: '/scholarships', color: 'bg-indigo-500' },
        { icon: 'apartment', title: t('dashboard.housing'), desc: t('dashboard.housingDesc'), to: '/housing', color: 'bg-pink-500' },
        { icon: 'storefront', title: t('dashboard.marketplace'), desc: t('dashboard.marketplaceDesc'), to: '/marketplace', color: 'bg-amber-500' },
        { icon: 'record_voice_over', title: t('dashboard.visaPrep'), desc: t('dashboard.visaPrepDesc'), to: '/visa-prep', color: 'bg-cyan-500' },
        { icon: 'translate', title: t('dashboard.languages'), desc: t('dashboard.languagesDesc'), to: '/learn', color: 'bg-lime-600' },
    ]

    return (
        <div className="min-h-screen bg-bg-light">
            {/* Header */}
            <header className="sticky top-0 z-50 flex items-center justify-between border-b border-gray-200 bg-white px-6 py-3 lg:px-20 shadow-sm">
                <Link to="/" className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-3xl text-primary">school</span>
                    <span className="text-xl font-bold text-text-main">FuturDialk</span>
                </Link>
                <div className="flex items-center gap-4">
                    <LanguageSwitcher />
                    <Link to="/notifications" className="relative p-2 text-secondary hover:text-primary">
                        <span className="material-symbols-outlined">notifications</span>
                    </Link>
                    <Link to="/profile" className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-blue-600 text-white flex items-center justify-center text-sm font-bold">
                        {userInitial}
                    </Link>
                </div>
            </header>

            <main className="max-w-[1200px] mx-auto p-6 lg:p-10">
                {/* Welcome */}
                <div className="mb-10">
                    <h1 className="text-3xl font-bold text-text-main mb-2">
                        {isFr ? `Bienvenue, ${userName || 'Étudiant'} 👋` : `Welcome, ${userName || 'Student'} 👋`}
                    </h1>
                    <p className="text-secondary text-lg">{t('dashboard.subtitle')}</p>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                    {[
                        { icon: 'emoji_events', label: t('dashboard.level'), value: t('dashboard.beginner'), color: 'text-yellow-500' },
                        { icon: 'route', label: isFr ? 'Roadmaps' : 'Roadmaps', value: String(stats.roadmaps), color: 'text-blue-500' },
                        { icon: 'bolt', label: t('dashboard.xp'), value: String(stats.stepsCompleted * 50), color: 'text-purple-500' },
                        { icon: 'task_alt', label: t('dashboard.tasksDone'), value: String(stats.stepsCompleted), color: 'text-green-500' },
                    ].map((stat) => (
                        <div key={stat.label} className="flex items-center gap-3 bg-white rounded-xl border border-gray-200 p-4">
                            <span className={`material-symbols-outlined text-2xl ${stat.color}`}>{stat.icon}</span>
                            <div>
                                <p className="text-xs text-secondary">{stat.label}</p>
                                <p className="text-lg font-bold text-text-main">{stat.value}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Module Grid */}
                <h2 className="text-xl font-bold text-text-main mb-4">{t('dashboard.services')}</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {modules.map((m) => (
                        <Link
                            key={m.to}
                            to={m.to}
                            className="group flex flex-col items-center gap-3 bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all hover:-translate-y-1 text-center"
                        >
                            <div className={`w-12 h-12 rounded-xl ${m.color} text-white flex items-center justify-center`}>
                                <span className="material-symbols-outlined text-2xl">{m.icon}</span>
                            </div>
                            <h3 className="text-sm font-bold text-text-main">{m.title}</h3>
                            <p className="text-xs text-secondary">{m.desc}</p>
                        </Link>
                    ))}
                </div>
            </main>
        </div>
    )
}
