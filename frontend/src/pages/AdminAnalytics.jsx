/**
 * Admin Analytics — Platform analytics dashboard with charts.
 */
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation, LanguageSwitcher } from '../i18n'
import { getAdminStats, getAdminContentOverview } from '../api'

export default function AdminAnalytics() {
    const { lang } = useTranslation()
    const isFr = lang === 'fr'
    const [stats, setStats] = useState(null)
    const [content, setContent] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        Promise.all([
            getAdminStats().catch(() => ({})),
            getAdminContentOverview().catch(() => ({})),
        ]).then(([s, c]) => { setStats(s); setContent(c) }).finally(() => setLoading(false))
    }, [])

    if (loading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div></div>

    const FLAG = { FR: '🇫🇷', CA: '🇨🇦', DE: '🇩🇪', UK: '🇬🇧', ES: '🇪🇸', MA: '🇲🇦' }

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="sticky top-0 z-50 bg-white border-b border-gray-200 px-6 py-3 shadow-sm">
                <div className="max-w-[1200px] mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4"><Link to="/" className="flex items-center gap-2"><span className="material-symbols-outlined text-3xl text-primary">school</span><span className="text-xl font-bold">FuturDialk</span></Link><span className="text-gray-300">|</span><span className="text-sm font-bold text-red-600">ADMIN</span></div>
                    <Link to="/admin" className="px-4 py-2 bg-gray-100 rounded-lg text-sm font-bold">← Dashboard</Link>
                </div>
            </header>

            <main className="max-w-[1200px] mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold mb-6">{isFr ? 'Analytiques' : 'Analytics'}</h1>

                {/* KPIs */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
                    {[
                        { label: isFr ? 'Utilisateurs' : 'Users', value: stats?.users || 0, icon: 'group', color: 'text-blue-500' },
                        { label: isFr ? 'Écoles' : 'Schools', value: stats?.schools || 0, icon: 'apartment', color: 'text-green-500' },
                        { label: isFr ? 'Programmes' : 'Programs', value: stats?.programs || 0, icon: 'menu_book', color: 'text-purple-500' },
                        { label: isFr ? 'Bourses' : 'Scholarships', value: stats?.scholarships || 0, icon: 'payments', color: 'text-orange-500' },
                        { label: 'Templates', value: stats?.roadmap_templates || 0, icon: 'route', color: 'text-teal-500' },
                        { label: 'Roadmaps', value: stats?.user_roadmaps || 0, icon: 'map', color: 'text-red-500' },
                    ].map(kpi => (
                        <div key={kpi.label} className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
                            <span className={`material-symbols-outlined text-2xl ${kpi.color}`}>{kpi.icon}</span>
                            <p className="text-2xl font-bold mt-2">{kpi.value}</p>
                            <p className="text-xs text-secondary">{kpi.label}</p>
                        </div>
                    ))}
                </div>

                {/* Distribution Charts */}
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                    {/* Programs by Field */}
                    <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                        <h2 className="font-bold mb-4">{isFr ? 'Programmes par domaine' : 'Programs by Field'}</h2>
                        <div className="space-y-3">
                            {Object.entries(content?.programs_by_field || {}).sort((a, b) => b[1] - a[1]).map(([field, count]) => {
                                const max = Math.max(...Object.values(content?.programs_by_field || { _: 1 }))
                                return (
                                    <div key={field}>
                                        <div className="flex justify-between text-sm mb-1"><span className="capitalize">{field || 'Other'}</span><span className="font-bold">{count}</span></div>
                                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-primary rounded-full" style={{ width: `${(count / max) * 100}%` }} /></div>
                                    </div>
                                )
                            })}
                            {Object.keys(content?.programs_by_field || {}).length === 0 && <p className="text-secondary text-sm">{isFr ? 'Pas de données' : 'No data'}</p>}
                        </div>
                    </div>

                    {/* Schools by Country */}
                    <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                        <h2 className="font-bold mb-4">{isFr ? 'Écoles par pays' : 'Schools by Country'}</h2>
                        <div className="space-y-3">
                            {Object.entries(content?.schools_by_country || {}).sort((a, b) => b[1] - a[1]).map(([country, count]) => {
                                const max = Math.max(...Object.values(content?.schools_by_country || { _: 1 }))
                                return (
                                    <div key={country}>
                                        <div className="flex justify-between text-sm mb-1"><span>{FLAG[country] || '🌍'} {country}</span><span className="font-bold">{count}</span></div>
                                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-green-500 rounded-full" style={{ width: `${(count / max) * 100}%` }} /></div>
                                    </div>
                                )
                            })}
                            {Object.keys(content?.schools_by_country || {}).length === 0 && <p className="text-secondary text-sm">{isFr ? 'Pas de données' : 'No data'}</p>}
                        </div>
                    </div>
                </div>

                {/* Scholarships by Country */}
                <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                    <h2 className="font-bold mb-4">{isFr ? 'Bourses par pays' : 'Scholarships by Country'}</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {Object.entries(content?.scholarships_by_country || {}).map(([c, count]) => (
                            <div key={c} className="text-center p-4 bg-gray-50 rounded-xl">
                                <span className="text-2xl block mb-1">{FLAG[c] || '🌍'}</span>
                                <p className="text-xl font-bold">{count}</p>
                                <p className="text-xs text-secondary">{c}</p>
                            </div>
                        ))}
                        {Object.keys(content?.scholarships_by_country || {}).length === 0 && <p className="text-secondary text-sm col-span-full text-center">{isFr ? 'Pas de données' : 'No data'}</p>}
                    </div>
                </div>
            </main>
        </div>
    )
}
