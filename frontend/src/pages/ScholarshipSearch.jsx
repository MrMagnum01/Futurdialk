/**
 * Scholarship Search — Browse and filter scholarship opportunities.
 * Fetches live data from /api/scholarships.
 */

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation, LanguageSwitcher } from '../i18n'
import { getScholarships } from '../api'

const FLAG_EMOJI = { FR: '🇫🇷', CA: '🇨🇦', DE: '🇩🇪', UK: '🇬🇧', ES: '🇪🇸', MA: '🇲🇦' }
const COUNTRY_NAMES = { FR: 'France', CA: 'Canada', DE: 'Allemagne', UK: 'Royaume-Uni', ES: 'Espagne', MA: 'Maroc' }

const typeColors = [
    { bg: 'bg-blue-100', text: 'text-primary', badge: 'bg-blue-50 text-primary ring-blue-700/10' },
    { bg: 'bg-purple-100', text: 'text-purple-600', badge: 'bg-purple-50 text-purple-700 ring-purple-700/10' },
    { bg: 'bg-green-100', text: 'text-green-600', badge: 'bg-green-50 text-green-700 ring-green-700/10' },
    { bg: 'bg-orange-100', text: 'text-orange-600', badge: 'bg-orange-50 text-orange-700 ring-orange-700/10' },
    { bg: 'bg-pink-100', text: 'text-pink-600', badge: 'bg-pink-50 text-pink-700 ring-pink-700/10' },
    { bg: 'bg-teal-100', text: 'text-teal-600', badge: 'bg-teal-50 text-teal-700 ring-teal-700/10' },
]

const typeIcons = ['school', 'public', 'science', 'palette', 'emoji_events', 'volunteer_activism']

export default function ScholarshipSearch() {
    const { lang } = useTranslation()
    const isFr = lang === 'fr'
    const [search, setSearch] = useState('')
    const [scholarships, setScholarships] = useState([])
    const [total, setTotal] = useState(0)
    const [loading, setLoading] = useState(true)
    const [countryFilter, setCountryFilter] = useState('')

    useEffect(() => {
        setLoading(true)
        const params = {}
        if (search) params.search = search
        if (countryFilter) params.country = countryFilter
        getScholarships(params)
            .then(data => { setScholarships(data.scholarships); setTotal(data.total) })
            .catch(() => { })
            .finally(() => setLoading(false))
    }, [search, countryFilter])

    return (
        <div className="min-h-screen bg-bg-light flex flex-col">
            <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
                <div className="max-w-[1280px] mx-auto px-6 h-16 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-3xl text-primary">school</span>
                        <span className="text-xl font-bold text-text-main">Tawjihi</span>
                    </Link>
                    <nav className="hidden md:flex items-center gap-8">
                        <Link to="/" className="text-sm font-medium text-secondary hover:text-primary">{isFr ? 'Accueil' : 'Home'}</Link>
                        <Link to="/explore" className="text-sm font-medium text-secondary hover:text-primary">{isFr ? 'Programmes' : 'Programs'}</Link>
                        <Link to="/scholarships" className="text-sm font-bold text-primary">{isFr ? 'Bourses' : 'Scholarships'}</Link>
                    </nav>
                    <div className="flex items-center gap-3">
                        <LanguageSwitcher />
                        <Link to="/login" className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold hover:bg-primary-hover">{isFr ? 'Connexion' : 'Sign In'}</Link>
                    </div>
                </div>
            </header>

            <main className="flex-1 w-full max-w-[1280px] mx-auto px-6 py-8">
                {/* Hero */}
                <div className="flex flex-col gap-8 mb-10">
                    <div className="max-w-2xl">
                        <h1 className="text-4xl md:text-5xl font-black text-text-main tracking-tight leading-tight">
                            {isFr ? 'Trouvez Votre ' : 'Find Your '}<span className="text-primary">{isFr ? 'Bourse' : 'Scholarship'}</span>
                        </h1>
                        <p className="text-secondary text-lg mt-3">
                            {isFr ? "Découvrez des opportunités de financement pour soutenir votre parcours." : 'Discover funding opportunities to support your educational journey.'}
                        </p>
                    </div>
                    {/* Search */}
                    <div className="bg-white p-2 rounded-xl shadow-sm border border-gray-200">
                        <div className="flex gap-2">
                            <div className="flex-1 relative">
                                <span className="absolute inset-y-0 left-3 flex items-center text-gray-400 material-symbols-outlined">search</span>
                                <input
                                    type="text"
                                    value={search} onChange={(e) => setSearch(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-3 border-none rounded-lg bg-gray-50 text-text-main placeholder-gray-400 focus:ring-2 focus:ring-primary outline-none"
                                    placeholder={isFr ? 'Rechercher par nom...' : 'Search by name...'}
                                />
                            </div>
                            <button className="bg-primary hover:bg-primary-hover text-white font-bold py-3 px-8 rounded-lg transition-colors">{isFr ? 'Rechercher' : 'Search'}</button>
                        </div>
                    </div>
                    {/* Country filters */}
                    <div className="flex flex-wrap gap-3">
                        <button
                            onClick={() => setCountryFilter('')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${!countryFilter ? 'bg-primary text-white' : 'bg-white border border-gray-200 text-text-main hover:border-primary'}`}
                        >
                            {isFr ? 'Tous' : 'All'}
                        </button>
                        {Object.entries(FLAG_EMOJI).map(([code, flag]) => (
                            <button
                                key={code}
                                onClick={() => setCountryFilter(code)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${countryFilter === code ? 'bg-primary text-white' : 'bg-white border border-gray-200 text-text-main hover:border-primary'}`}
                            >
                                {flag} {COUNTRY_NAMES[code]}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Results */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-text-main">
                        {loading ? (isFr ? 'Chargement...' : 'Loading...') : `${total} ${isFr ? 'bourses trouvées' : 'Scholarships Found'}`}
                    </h2>
                    <select className="bg-transparent border-none font-semibold text-text-main focus:ring-0 cursor-pointer text-sm">
                        <option>{isFr ? 'Pertinence' : 'Relevance'}</option>
                        <option>{isFr ? 'Date limite' : 'Deadline: Soonest'}</option>
                    </select>
                </div>

                {/* Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {scholarships.map((s, idx) => {
                        const c = typeColors[idx % typeColors.length]
                        const icon = typeIcons[idx % typeIcons.length]
                        return (
                            <div key={s.id} className="flex flex-col bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow group">
                                <div className="p-6 flex flex-col flex-1 gap-4">
                                    <div className="flex justify-between items-start">
                                        <div className={`w-10 h-10 rounded-full ${c.bg} ${c.text} flex items-center justify-center`}>
                                            <span className="material-symbols-outlined">{icon}</span>
                                        </div>
                                        <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${c.badge}`}>
                                            {FLAG_EMOJI[s.country_code] || ''} {s.country_code}
                                        </span>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-text-main group-hover:text-primary transition-colors">{s.name}</h3>
                                        <p className="text-sm text-secondary mt-1">{s.provider || ''}</p>
                                    </div>
                                    <div className="py-3 border-y border-gray-100">
                                        <p className="text-sm font-medium text-text-main line-clamp-2">{s.amount_description || '—'}</p>
                                    </div>
                                    <div className="flex flex-col gap-2 mt-auto">
                                        {s.target_level && (
                                            <div className="flex items-center gap-2 text-sm text-secondary">
                                                <span className={`material-symbols-outlined text-lg ${c.text}`}>school</span>
                                                <span>{isFr ? 'Niveau' : 'Level'}: {s.target_level}</span>
                                            </div>
                                        )}
                                        {s.deadline && (
                                            <div className="flex items-center gap-2 text-sm text-secondary">
                                                <span className={`material-symbols-outlined text-lg ${c.text}`}>calendar_month</span>
                                                <span>{isFr ? 'Date limite' : 'Deadline'}: {s.deadline}</span>
                                            </div>
                                        )}
                                        {s.eligibility?.min_gpa && (
                                            <div className="flex items-center gap-2 text-sm text-secondary">
                                                <span className={`material-symbols-outlined text-lg ${c.text}`}>check_circle</span>
                                                <span>Min GPA: {s.eligibility.min_gpa}/20</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="p-4 bg-gray-50 border-t border-gray-200 flex gap-2">
                                    {s.url && (
                                        <a href={s.url} target="_blank" rel="noopener noreferrer" className="flex-1 py-2.5 border border-primary rounded-lg text-sm font-bold text-primary bg-white hover:bg-blue-50 transition-all text-center">
                                            {isFr ? 'Postuler' : 'Apply'}
                                        </a>
                                    )}
                                    <button className="flex-1 py-2.5 border border-gray-200 rounded-lg text-sm font-bold text-text-main bg-white hover:bg-gray-50 transition-all">
                                        {isFr ? 'Voir Détails' : 'View Details'}
                                    </button>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </main>
        </div>
    )
}
