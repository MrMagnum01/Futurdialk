/**
 * Country Detail — Programs and stats for a specific country.
 */
import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useTranslation, LanguageSwitcher } from '../i18n'
import { getPrograms } from '../api'

const COUNTRY_INFO = {
    FR: { name: 'France', flag: '🇫🇷', color: 'from-blue-500 to-red-500' },
    CA: { name: 'Canada', flag: '🇨🇦', color: 'from-red-500 to-white' },
    DE: { name: 'Germany', flag: '🇩🇪', color: 'from-black to-yellow-500' },
    UK: { name: 'United Kingdom', flag: '🇬🇧', color: 'from-blue-800 to-red-600' },
    ES: { name: 'Spain', flag: '🇪🇸', color: 'from-red-600 to-yellow-400' },
    MA: { name: 'Morocco', flag: '🇲🇦', color: 'from-red-600 to-green-600' },
}

export default function CountryDetail() {
    const { countryCode } = useParams()
    const { lang } = useTranslation()
    const isFr = lang === 'fr'
    const [programs, setPrograms] = useState([])
    const [loading, setLoading] = useState(true)

    const country = COUNTRY_INFO[countryCode?.toUpperCase()] || { name: countryCode, flag: '🌍', color: 'from-gray-400 to-gray-600' }

    useEffect(() => {
        getPrograms({ country: countryCode?.toUpperCase(), per_page: 50 })
            .then(d => setPrograms(d.programs || []))
            .catch(() => { })
            .finally(() => setLoading(false))
    }, [countryCode])

    return (
        <div className="min-h-screen bg-bg-light">
            <header className="sticky top-0 z-50 bg-white border-b border-gray-200 px-6 py-3 shadow-sm">
                <div className="max-w-[1100px] mx-auto flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2"><span className="material-symbols-outlined text-3xl text-primary">school</span><span className="text-xl font-bold text-text-main">Tawjihi</span></Link>
                    <div className="flex items-center gap-3"><LanguageSwitcher /><Link to="/explore" className="px-4 py-2 bg-gray-100 rounded-lg text-sm font-bold hover:bg-gray-200">{isFr ? '← Programmes' : '← Programs'}</Link></div>
                </div>
            </header>

            <main className="max-w-[1100px] mx-auto px-4 py-8 md:px-6">
                <div className={`bg-gradient-to-br ${country.color} rounded-2xl p-8 mb-8 text-white relative overflow-hidden`}>
                    <div className="absolute inset-0 bg-black/30" />
                    <div className="relative z-10">
                        <span className="text-5xl mb-3 block">{country.flag}</span>
                        <h1 className="text-3xl md:text-4xl font-bold mb-1">{country.name}</h1>
                        <p className="opacity-90">{programs.length} {isFr ? 'programmes disponibles' : 'programs available'}</p>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div></div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {programs.map(p => (
                            <Link key={p.id} to={`/explore/program/${p.id}`} className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-md hover:border-primary/30 transition-all group">
                                <h3 className="font-bold text-text-main group-hover:text-primary transition-colors mb-1">{p.name}</h3>
                                <p className="text-xs text-secondary mb-3">{p.school?.name}</p>
                                <div className="flex items-center gap-3 text-xs text-secondary">
                                    <span className="capitalize">{(p.degree_type || '').replace('_', ' ')}</span>
                                    <span>•</span>
                                    <span>{p.duration_months ? `${p.duration_months} ${isFr ? 'mois' : 'mo'}` : '—'}</span>
                                </div>
                            </Link>
                        ))}
                        {programs.length === 0 && <p className="text-secondary col-span-full text-center py-10">{isFr ? 'Aucun programme trouvé' : 'No programs found'}</p>}
                    </div>
                )}
            </main>
        </div>
    )
}
