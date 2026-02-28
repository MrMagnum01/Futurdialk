/**
 * Housing Guides — City guides with rent, tips, and neighborhoods.
 * Fetches live data from /api/housing endpoints.
 */

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation, LanguageSwitcher } from '../i18n'
import { getHousingCities, getHousingByCountry } from '../api'

const FLAG_EMOJI = { FR: '🇫🇷', CA: '🇨🇦', DE: '🇩🇪', UK: '🇬🇧' }
const COUNTRIES = [
    { code: 'FR', fr: 'France', en: 'France' },
    { code: 'CA', fr: 'Canada', en: 'Canada' },
    { code: 'DE', fr: 'Allemagne', en: 'Germany' },
    { code: 'UK', fr: 'Royaume-Uni', en: 'United Kingdom' },
]

export default function HousingGuides() {
    const { lang } = useTranslation()
    const isFr = lang === 'fr'
    const [selectedCountry, setSelectedCountry] = useState('FR')
    const [cities, setCities] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setLoading(true)
        getHousingByCountry(selectedCountry)
            .then(d => setCities(d.cities || []))
            .catch(() => setCities([]))
            .finally(() => setLoading(false))
    }, [selectedCountry])

    return (
        <div className="min-h-screen bg-bg-light flex flex-col">
            <header className="sticky top-0 z-50 bg-white border-b border-gray-200 px-6 py-3 lg:px-20 shadow-sm">
                <div className="flex items-center justify-between max-w-[1280px] mx-auto">
                    <Link to="/" className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-3xl text-primary">school</span>
                        <span className="text-xl font-bold text-text-main">Tawjihi</span>
                    </Link>
                    <div className="flex items-center gap-3">
                        <LanguageSwitcher />
                        <Link to="/dashboard" className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold">Dashboard</Link>
                    </div>
                </div>
            </header>

            <main className="flex-1 px-6 lg:px-20 py-8 max-w-[1280px] mx-auto w-full">
                {/* Hero */}
                <div className="bg-gradient-to-r from-orange-500 to-amber-600 rounded-2xl p-8 md:p-12 mb-10 text-white relative overflow-hidden">
                    <div className="absolute -right-20 -top-20 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
                    <div className="relative z-10 max-w-2xl">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="material-symbols-outlined">home</span>
                            <span className="text-sm font-bold uppercase tracking-wider">{isFr ? 'Guides Logement' : 'Housing Guides'}</span>
                        </div>
                        <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-3">
                            {isFr ? 'Trouvez Votre Logement' : 'Find Your Housing'}
                        </h1>
                        <p className="text-orange-100 text-lg">
                            {isFr ? "Guides de villes, coûts en MAD, quartiers et astuces pour étudiants marocains." : "City guides, MAD costs, neighborhoods, and tips for Moroccan students."}
                        </p>
                    </div>
                </div>

                {/* Country Selector */}
                <div className="flex flex-wrap gap-3 mb-8">
                    {COUNTRIES.map(c => (
                        <button
                            key={c.code}
                            onClick={() => setSelectedCountry(c.code)}
                            className={`flex items-center gap-2 px-5 py-3 rounded-xl border-2 transition-all font-medium ${selectedCountry === c.code ? 'border-primary bg-blue-50 text-primary' : 'border-gray-200 bg-white text-text-main hover:border-primary/30'}`}
                        >
                            <span className="text-xl">{FLAG_EMOJI[c.code]}</span>
                            {isFr ? c.fr : c.en}
                        </button>
                    ))}
                </div>

                {/* City Guides */}
                {loading ? (
                    <p className="text-secondary py-8">{isFr ? 'Chargement...' : 'Loading...'}</p>
                ) : (
                    <div className="space-y-8">
                        {cities.map((city, idx) => (
                            <div key={idx} className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                                {/* City Header */}
                                <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-6 text-white">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h2 className="text-2xl font-bold">{FLAG_EMOJI[city.country_code]} {city.city}</h2>
                                            <p className="text-gray-300 text-sm mt-1">{isFr ? city.rent_range_fr : city.rent_range_en}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-3xl font-black">{city.rent_avg_mad.toLocaleString()}</p>
                                            <p className="text-gray-400 text-xs">MAD/{isFr ? 'mois (moyenne)' : 'month (avg)'}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-6">
                                    {/* Cost Breakdown */}
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                        <div className="bg-blue-50 rounded-lg p-3 text-center">
                                            <span className="material-symbols-outlined text-primary">home</span>
                                            <p className="text-lg font-bold text-text-main">{city.rent_avg_mad.toLocaleString()}</p>
                                            <p className="text-xs text-secondary">MAD/{isFr ? 'mois' : 'mo'} — {isFr ? 'Loyer' : 'Rent'}</p>
                                        </div>
                                        <div className="bg-green-50 rounded-lg p-3 text-center">
                                            <span className="material-symbols-outlined text-green-600">directions_bus</span>
                                            <p className="text-lg font-bold text-text-main">{city.transport_mad.toLocaleString()}</p>
                                            <p className="text-xs text-secondary">MAD/{isFr ? 'mois' : 'mo'} — Transport</p>
                                        </div>
                                        <div className="bg-orange-50 rounded-lg p-3 text-center">
                                            <span className="material-symbols-outlined text-orange-500">restaurant</span>
                                            <p className="text-lg font-bold text-text-main">{city.food_mad.toLocaleString()}</p>
                                            <p className="text-xs text-secondary">MAD/{isFr ? 'mois' : 'mo'} — {isFr ? 'Alimentation' : 'Food'}</p>
                                        </div>
                                        <div className="bg-purple-50 rounded-lg p-3 text-center">
                                            <span className="material-symbols-outlined text-purple-600">calculate</span>
                                            <p className="text-lg font-bold text-text-main">{(city.rent_avg_mad + city.transport_mad + city.food_mad).toLocaleString()}</p>
                                            <p className="text-xs text-secondary">MAD/{isFr ? 'mois' : 'mo'} — Total</p>
                                        </div>
                                    </div>

                                    {/* CROUS badge */}
                                    {city.crous_available && (
                                        <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center gap-3 mb-6">
                                            <span className="material-symbols-outlined text-green-600">verified</span>
                                            <div>
                                                <span className="font-bold text-green-800 text-sm">CROUS {isFr ? 'disponible' : 'available'}</span>
                                                <span className="text-sm text-green-700 ml-1">— {city.crous_rent_mad.toLocaleString()} MAD/{isFr ? 'mois' : 'month'}</span>
                                            </div>
                                        </div>
                                    )}

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Tips */}
                                        <div>
                                            <h3 className="font-bold text-text-main mb-3 flex items-center gap-2">
                                                <span className="material-symbols-outlined text-primary">lightbulb</span>
                                                {isFr ? 'Conseils' : 'Tips'}
                                            </h3>
                                            <ul className="space-y-2">
                                                {(isFr ? city.tips_fr : city.tips_en).map((tip, i) => (
                                                    <li key={i} className="flex items-start gap-2 text-sm text-text-main">
                                                        <span className="text-primary mt-0.5">•</span>
                                                        {tip}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                        {/* Neighborhoods */}
                                        <div>
                                            <h3 className="font-bold text-text-main mb-3 flex items-center gap-2">
                                                <span className="material-symbols-outlined text-primary">location_on</span>
                                                {isFr ? 'Quartiers Recommandés' : 'Recommended Neighborhoods'}
                                            </h3>
                                            <div className="flex flex-wrap gap-2">
                                                {(isFr ? city.neighborhoods_fr : city.neighborhoods_en).map((n, i) => (
                                                    <span key={i} className="bg-gray-100 px-3 py-1.5 rounded-lg text-sm font-medium text-text-main">{n}</span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    )
}
