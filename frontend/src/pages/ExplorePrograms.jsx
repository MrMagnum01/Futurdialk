/**
 * Explore Programs — Browse universities and programs.
 * Based on the Stitch design with sidebar filters, search bar, program cards grid, and pagination.
 */

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation, LanguageSwitcher } from '../i18n'
import { getPrograms } from '../api'

const categories = [
    { id: 'all', icon: 'apps', labelFr: 'Toutes Catégories', labelEn: 'All Categories' },
    { id: 'business', icon: 'business_center', labelFr: 'Commerce', labelEn: 'Business' },
    { id: 'engineering', icon: 'memory', labelFr: 'Ingénierie', labelEn: 'Engineering' },
    { id: 'medicine', icon: 'medical_services', labelFr: 'Médecine', labelEn: 'Medicine' },
    { id: 'arts', icon: 'palette', labelFr: 'Arts & Design', labelEn: 'Arts & Design' },
    { id: 'law', icon: 'gavel', labelFr: 'Droit', labelEn: 'Law' },
    { id: 'sciences', icon: 'science', labelFr: 'Sciences', labelEn: 'Natural Sciences' },
]

const levelColors = {
    "master": 'bg-primary text-white',
    "licence": 'bg-blue-100 text-blue-800',
    "phd": 'bg-purple-100 text-purple-800',
    "mba": 'bg-green-100 text-green-800',
    "diplome_ingenieur": 'bg-orange-100 text-orange-800',
    "certificate": 'bg-teal-100 text-teal-800',
}

const COVER_IMAGES = [
    'https://images.unsplash.com/photo-1562774053-701939374585?w=400&q=80',
    'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=400&q=80',
    'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400&q=80',
    'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&q=80',
    'https://images.unsplash.com/photo-1523050854058-8df90110c476?w=400&q=80',
    'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&q=80',
]

const FLAG_EMOJI = { FR: '🇫🇷', CA: '🇨🇦', DE: '🇩🇪', UK: '🇬🇧', ES: '🇪🇸', MA: '🇲🇦' }

export default function ExplorePrograms() {
    const { lang } = useTranslation()
    const isFr = lang === 'fr'
    const [search, setSearch] = useState('')
    const [activeCategory, setActiveCategory] = useState('all')
    const [programs, setPrograms] = useState([])
    const [total, setTotal] = useState(0)
    const [page, setPage] = useState(1)
    const [loading, setLoading] = useState(true)
    const perPage = 9

    useEffect(() => {
        setLoading(true)
        const params = { page, per_page: perPage }
        if (activeCategory !== 'all') params.field = activeCategory
        if (search) params.search = search
        getPrograms(params)
            .then(data => { setPrograms(data.programs); setTotal(data.total) })
            .catch(() => { })
            .finally(() => setLoading(false))
    }, [page, activeCategory, search])

    const totalPages = Math.ceil(total / perPage)

    return (
        <div className="min-h-screen bg-bg-light flex flex-col">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-white border-b border-gray-200 px-6 py-3 shadow-sm">
                <div className="max-w-[1280px] mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link to="/" className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-3xl text-primary">school</span>
                            <span className="text-xl font-bold text-text-main">Tawjihi</span>
                        </Link>
                    </div>
                    <nav className="hidden md:flex gap-8">
                        <Link to="/" className="text-sm font-medium text-secondary hover:text-primary">{isFr ? 'Accueil' : 'Home'}</Link>
                        <Link to="/explore" className="text-sm font-bold text-primary border-b-2 border-primary pb-1">{isFr ? 'Programmes' : 'Programs'}</Link>
                        <Link to="/prep" className="text-sm font-medium text-secondary hover:text-primary">{isFr ? 'Examens' : 'Exam Prep'}</Link>
                        <Link to="/community" className="text-sm font-medium text-secondary hover:text-primary">{isFr ? 'Communauté' : 'Community'}</Link>
                    </nav>
                    <div className="flex items-center gap-3">
                        <LanguageSwitcher />
                        <Link to="/login" className="px-4 py-2 bg-gray-100 rounded-lg text-sm font-bold hover:bg-gray-200">{isFr ? 'Connexion' : 'Log In'}</Link>
                        <Link to="/register" className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold hover:bg-primary-hover shadow-md">{isFr ? "S'inscrire" : 'Sign Up'}</Link>
                    </div>
                </div>
            </header>

            {/* Main content */}
            <main className="flex-1 w-full max-w-[1280px] mx-auto px-4 py-8 md:px-6 lg:py-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Sidebar */}
                <aside className="hidden lg:block lg:col-span-3 sticky top-28 h-fit space-y-8">
                    {/* Categories */}
                    <div className="flex flex-col gap-4">
                        <div>
                            <h3 className="text-lg font-bold text-text-main">{isFr ? 'Catégories' : 'Categories'}</h3>
                            <p className="text-secondary text-sm">{isFr ? 'Explorer par domaine' : 'Browse by field'}</p>
                        </div>
                        <div className="flex flex-col gap-1">
                            {categories.map((cat) => (
                                <button
                                    key={cat.id}
                                    onClick={() => setActiveCategory(cat.id)}
                                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm ${activeCategory === cat.id
                                        ? 'bg-blue-50 text-primary font-bold'
                                        : 'text-secondary hover:bg-gray-50 hover:text-text-main'
                                        }`}
                                >
                                    <span className={`material-symbols-outlined ${activeCategory === cat.id ? 'text-primary' : ''}`}>{cat.icon}</span>
                                    <span>{isFr ? cat.labelFr : cat.labelEn}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Quick filters */}
                    <div className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                        <h3 className="text-xs font-bold mb-4 uppercase tracking-wider text-secondary">{isFr ? 'Filtrer par' : 'Filter By'}</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-semibold mb-1.5 block">{isFr ? 'Durée' : 'Duration'}</label>
                                <div className="flex gap-2 flex-wrap">
                                    {['1 An', '2 Ans', '3+ Ans'].map((d) => (
                                        <span key={d} className="px-3 py-1 text-xs rounded-full border border-gray-200 cursor-pointer hover:border-primary hover:text-primary transition-colors">
                                            {d}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-semibold mb-1.5 block">{isFr ? 'Mode' : 'Mode'}</label>
                                <div className="flex flex-col gap-2">
                                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                                        <input type="checkbox" defaultChecked className="rounded border-gray-300 text-primary focus:ring-primary" />
                                        <span>{isFr ? 'Sur Campus' : 'On Campus'}</span>
                                    </label>
                                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                                        <input type="checkbox" className="rounded border-gray-300 text-primary focus:ring-primary" />
                                        <span>{isFr ? 'En Ligne / Distance' : 'Online / Distance'}</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Program results */}
                <div className="col-span-1 lg:col-span-9 flex flex-col gap-6">
                    {/* Search header */}
                    <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 relative overflow-hidden">
                        <div className="absolute -right-10 -top-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl" />
                        <h1 className="text-3xl md:text-4xl font-bold mb-2 relative z-10 text-text-main">
                            {isFr ? 'Trouvez Votre Programme' : 'Find Your Future Program'}
                        </h1>
                        <p className="text-secondary mb-6 relative z-10">
                            {isFr ? 'Explorez des milliers de programmes dans les meilleures universités.' : 'Explore thousands of programs from top universities worldwide.'}
                        </p>
                        <div className="relative z-10">
                            <div className="flex items-center bg-bg-light border border-gray-200 rounded-xl p-2 shadow-sm focus-within:ring-2 focus-within:ring-primary transition-all">
                                <span className="material-symbols-outlined text-secondary px-3">search</span>
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="flex-1 bg-transparent border-none focus:ring-0 text-text-main placeholder-gray-400 h-10 outline-none"
                                    placeholder={isFr ? 'Rechercher un programme, une université...' : 'Search for degrees, majors, or universities...'}
                                />
                                <button className="hidden sm:block bg-primary hover:bg-primary-hover text-white font-bold py-2 px-6 rounded-lg transition-colors">
                                    {isFr ? 'Rechercher' : 'Search'}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Results count */}
                    <div className="flex items-center justify-between px-2">
                        <p className="text-text-main font-medium">
                            {loading ? (isFr ? 'Chargement...' : 'Loading...') : (
                                <>{isFr ? 'Affichage de' : 'Showing'} <span className="font-bold">{total}</span> {isFr ? 'programmes' : 'programs'}</>
                            )}
                        </p>
                        <select className="bg-transparent border-none text-sm font-bold text-text-main focus:ring-0 cursor-pointer">
                            <option>{isFr ? 'Pertinence' : 'Relevance'}</option>
                            <option>{isFr ? 'Frais (croissant)' : 'Tuition (Low to High)'}</option>
                        </select>
                    </div>

                    {/* Cards grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {programs.map((program, idx) => (
                            <Link
                                key={program.id}
                                to={`/explore/program/${program.id}`}
                                className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-lg hover:border-primary/30 transition-all duration-300 flex flex-col h-full"
                            >
                                <div className="h-48 bg-gray-200 relative overflow-hidden">
                                    <img src={COVER_IMAGES[idx % COVER_IMAGES.length]} alt={program.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    <div className="absolute top-3 right-3">
                                        <button className="bg-white/90 p-2 rounded-full hover:bg-primary hover:text-white transition-colors text-gray-500">
                                            <span className="material-symbols-outlined text-xl">bookmark</span>
                                        </button>
                                    </div>
                                    <div className="absolute bottom-3 left-3">
                                        <span className={`text-xs font-bold px-2 py-1 rounded-md ${levelColors[program.degree_type] || 'bg-primary text-white'}`}>
                                            {(program.degree_type || '').replace('_', ' ').toUpperCase()}
                                        </span>
                                    </div>
                                </div>
                                <div className="p-5 flex flex-col flex-1">
                                    <h3 className="font-bold text-lg leading-snug group-hover:text-primary transition-colors text-text-main">
                                        {program.name}
                                    </h3>
                                    <p className="text-sm text-secondary font-medium mb-2">{program.school?.name || 'University'}</p>
                                    {/* Moroccan badges */}
                                    <div className="flex flex-wrap gap-1.5 mb-3">
                                        {program.school?.has_moroccan_students && (
                                            <span className="inline-flex items-center gap-1 text-xs font-medium bg-green-50 text-green-700 px-2 py-0.5 rounded-full">🇲🇦 {isFr ? 'Étudiants marocains' : 'Moroccan Students'}</span>
                                        )}
                                        {program.school?.scholarship_available && (
                                            <span className="inline-flex items-center gap-1 text-xs font-medium bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full">💰 {isFr ? 'Bourses' : 'Scholarships'}</span>
                                        )}
                                    </div>
                                    <div className="mt-auto space-y-2 pt-3 border-t border-gray-100">
                                        <div className="flex items-center gap-2 text-sm text-secondary">
                                            <span className="material-symbols-outlined text-lg">location_on</span>
                                            <span>{FLAG_EMOJI[program.school?.country_code] || ''} {program.school?.city || ''}, {program.school?.country_code || ''}</span>
                                        </div>
                                        <div className="flex items-center justify-between text-sm">
                                            <div className="flex items-center gap-2 text-secondary">
                                                <span className="material-symbols-outlined text-lg">schedule</span>
                                                <span>{program.duration_months ? `${program.duration_months} ${isFr ? 'mois' : 'months'}` : '—'}</span>
                                            </div>
                                            <span className="font-bold text-text-main text-xs">{program.school?.ranking_world ? `#${program.school.ranking_world} 🌍` : ''}</span>
                                        </div>
                                        {program.school?.tuition_international_yearly && (
                                            <div className="flex items-center gap-2 text-sm">
                                                <span className="material-symbols-outlined text-lg text-primary">payments</span>
                                                <span className="font-semibold text-primary">{program.school.tuition_international_yearly}{isFr ? '/an' : '/yr'}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-center gap-2 mt-8">
                            <button
                                onClick={() => setPage(Math.max(1, page - 1))}
                                disabled={page === 1}
                                className="w-10 h-10 rounded-full bg-white border border-gray-200 hover:border-primary transition-colors flex items-center justify-center disabled:opacity-50"
                            >
                                <span className="material-symbols-outlined">chevron_left</span>
                            </button>
                            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map(p => (
                                <button
                                    key={p}
                                    onClick={() => setPage(p)}
                                    className={`w-10 h-10 rounded-full font-bold transition-colors ${p === page ? 'bg-primary text-white shadow-md' : 'bg-white hover:bg-gray-50 text-secondary'
                                        }`}
                                >
                                    {p}
                                </button>
                            ))}
                            {totalPages > 5 && <span className="text-secondary">...</span>}
                            <button
                                onClick={() => setPage(Math.min(totalPages, page + 1))}
                                disabled={page === totalPages}
                                className="w-10 h-10 rounded-full bg-white border border-gray-200 hover:border-primary transition-colors flex items-center justify-center disabled:opacity-50"
                            >
                                <span className="material-symbols-outlined">chevron_right</span>
                            </button>
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}
