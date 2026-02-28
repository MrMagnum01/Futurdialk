/**
 * Career Advisor — Browse career paths from the database.
 * Fetches real data from /api/career.
 */

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation, LanguageSwitcher } from '../i18n'
import { getCareerPaths, getTrendingCareers } from '../api'

const CATEGORY_LABELS = {
    engineering: { icon: '⚙️', fr: 'Ingénierie', en: 'Engineering' },
    business: { icon: '💼', fr: 'Business', en: 'Business' },
    medicine: { icon: '🏥', fr: 'Médecine', en: 'Medicine' },
    sciences: { icon: '🔬', fr: 'Sciences', en: 'Sciences' },
    tech: { icon: '💻', fr: 'Tech & IA', en: 'Tech & AI' },
    humanities: { icon: '📖', fr: 'Sciences Humaines', en: 'Humanities' },
    arts: { icon: '🎨', fr: 'Arts', en: 'Arts' },
}

export default function CareerAdvisor() {
    const { lang } = useTranslation()
    const isFr = lang === 'fr'
    const [paths, setPaths] = useState([])
    const [trending, setTrending] = useState([])
    const [loading, setLoading] = useState(true)
    const [activeCategory, setActiveCategory] = useState(null)

    useEffect(() => {
        Promise.all([
            getCareerPaths().catch(() => ({ paths: [] })),
            getTrendingCareers().catch(() => ({ trending: [] })),
        ]).then(([pathsData, trendingData]) => {
            setPaths(pathsData.paths || pathsData || [])
            setTrending(trendingData.trending || [])
        }).finally(() => setLoading(false))
    }, [])

    const filtered = activeCategory ? paths.filter(p => p.category === activeCategory) : paths
    const categories = [...new Set(paths.map(p => p.category))]

    const demandColors = { very_high: 'bg-green-100 text-green-700', high: 'bg-blue-100 text-blue-700', medium: 'bg-yellow-100 text-yellow-700', low: 'bg-red-100 text-red-700' }

    return (
        <div className="min-h-screen bg-bg-light flex flex-col">
            <header className="sticky top-0 z-50 bg-white border-b border-gray-200 px-6 py-3 lg:px-20 shadow-sm">
                <div className="flex items-center justify-between max-w-[1280px] mx-auto">
                    <Link to="/" className="flex items-center gap-2"><span className="material-symbols-outlined text-3xl text-primary">school</span><span className="text-xl font-bold text-text-main">FuturDialk</span></Link>
                    <div className="flex items-center gap-3"><LanguageSwitcher /><Link to="/dashboard" className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold">Dashboard</Link></div>
                </div>
            </header>
            <main className="flex-1 px-6 lg:px-20 py-8 max-w-[1280px] mx-auto w-full">
                {/* Hero */}
                <div className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-2xl p-8 md:p-12 mb-10 text-white relative overflow-hidden">
                    <div className="absolute -right-20 -top-20 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
                    <div className="relative z-10 max-w-2xl">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="material-symbols-outlined">work</span>
                            <span className="text-sm font-bold uppercase tracking-wider">{isFr ? 'Conseiller Carrière' : 'Career Advisor'}</span>
                        </div>
                        <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-3">
                            {isFr ? 'Explorez Votre Avenir' : 'Explore Your Future'}
                        </h1>
                        <p className="text-emerald-100 text-lg">
                            {isFr ? "Découvrez les carrières, salaires et opportunités pour les étudiants marocains." : "Discover careers, salaries and opportunities for Moroccan students."}
                        </p>
                    </div>
                </div>

                {/* Category filter */}
                <div className="flex flex-wrap gap-2 mb-8">
                    <button onClick={() => setActiveCategory(null)} className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${!activeCategory ? 'bg-primary text-white' : 'bg-white border border-gray-200 text-secondary hover:bg-gray-50'}`}>
                        {isFr ? 'Tous' : 'All'} ({paths.length})
                    </button>
                    {categories.map(cat => {
                        const meta = CATEGORY_LABELS[cat] || { icon: '📋' }
                        return (
                            <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${activeCategory === cat ? 'bg-primary text-white' : 'bg-white border border-gray-200 text-secondary hover:bg-gray-50'}`}>
                                {meta.icon} {isFr ? meta.fr : meta.en}
                            </button>
                        )
                    })}
                </div>

                {loading ? (
                    <p className="text-center text-secondary py-10">{isFr ? 'Chargement...' : 'Loading...'}</p>
                ) : (
                    <>
                        {/* Career cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                            {filtered.map((career, idx) => {
                                const catMeta = CATEGORY_LABELS[career.category] || { icon: '📋' }
                                const maMarket = career.market_data?.MA
                                return (
                                    <Link key={career._id || idx} to={`/career/${career._id}`} className="group bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg hover:border-primary/30 transition-all flex flex-col">
                                        <div className="flex justify-between items-start mb-3">
                                            <span className="text-3xl">{catMeta.icon}</span>
                                            <span className={`text-xs font-bold px-2 py-1 rounded-full ${demandColors[career.demand_level] || 'bg-gray-100'}`}>
                                                {career.demand_level === 'very_high' ? (isFr ? 'Très demandé' : 'Very High') : career.demand_level === 'high' ? (isFr ? 'Demandé' : 'High') : career.demand_level || '—'}
                                            </span>
                                        </div>
                                        <h3 className="text-lg font-bold text-text-main mb-1 group-hover:text-primary">{isFr ? career.name_fr : career.name}</h3>
                                        <p className="text-sm text-secondary mb-3 line-clamp-2">{isFr ? career.description_fr : career.description_en}</p>
                                        {maMarket && (
                                            <div className="mt-auto pt-3 border-t border-gray-100 space-y-1">
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-secondary">{isFr ? 'Salaire Maroc' : 'Morocco Salary'}</span>
                                                    <span className="font-bold text-emerald-600">{(maMarket.avg_salary_mad / 1000).toFixed(0)}K MAD/{isFr ? 'an' : 'yr'}</span>
                                                </div>
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-secondary">{isFr ? 'Croissance' : 'Growth'}</span>
                                                    <span className="font-bold text-primary">+{maMarket.growth_pct}%</span>
                                                </div>
                                            </div>
                                        )}
                                    </Link>
                                )
                            })}
                        </div>

                        {/* Trending Section */}
                        {trending.length > 0 && (
                            <div>
                                <h2 className="text-xl font-bold text-text-main mb-4 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary">trending_up</span>
                                    {isFr ? 'Carrières en Croissance' : 'Trending Careers'}
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {trending.slice(0, 6).map((t, i) => (
                                        <div key={i} className="bg-white rounded-xl p-4 border border-gray-200">
                                            <p className="font-bold text-text-main text-sm">{isFr ? t.name_fr : t.name}</p>
                                            <p className="text-primary font-bold text-sm">+{t.avg_growth_pct?.toFixed(0) || '?'}% {isFr ? 'croissance' : 'growth'}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </>
                )}
            </main>
        </div>
    )
}
