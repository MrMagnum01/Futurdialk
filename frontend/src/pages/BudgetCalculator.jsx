/**
 * Budget Calculator — Study abroad cost estimator powered by live API data.
 */

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation, LanguageSwitcher } from '../i18n'
import { calculateBudget, compareBudgets } from '../api'

const countries = [
    { code: 'FR', flag: '🇫🇷', name: { fr: 'France', en: 'France' } },
    { code: 'CA', flag: '🇨🇦', name: { fr: 'Canada', en: 'Canada' } },
    { code: 'DE', flag: '🇩🇪', name: { fr: 'Allemagne', en: 'Germany' } },
    { code: 'UK', flag: '🇬🇧', name: { fr: 'Royaume-Uni', en: 'United Kingdom' } },
    { code: 'ES', flag: '🇪🇸', name: { fr: 'Espagne', en: 'Spain' } },
    { code: 'MA', flag: '🇲🇦', name: { fr: 'Maroc', en: 'Morocco' } },
]

const categoryIcons = { tuition: 'school', housing: 'home', living: 'restaurant', admin: 'badge', exam: 'quiz', travel: 'flight', misc: 'more_horiz' }
const categoryColors = { tuition: 'text-primary', housing: 'text-green-600', living: 'text-orange-500', admin: 'text-purple-600', exam: 'text-teal-600', travel: 'text-blue-500', misc: 'text-gray-500' }

export default function BudgetCalculator() {
    const { lang } = useTranslation()
    const isFr = lang === 'fr'
    const [selected, setSelected] = useState('FR')
    const [scholarship, setScholarship] = useState(0)
    const [budget, setBudget] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setLoading(true)
        calculateBudget(selected)
            .then(data => setBudget(data))
            .catch(() => { })
            .finally(() => setLoading(false))
    }, [selected])

    const country = countries.find((c) => c.code === selected)
    const totalAfterScholarship = budget ? budget.total_yearly_mad - scholarship : 0

    return (
        <div className="min-h-screen bg-bg-light flex flex-col">
            <header className="sticky top-0 z-50 bg-white border-b border-gray-200 px-6 py-3 lg:px-20 shadow-sm">
                <div className="flex items-center justify-between max-w-[1280px] mx-auto">
                    <Link to="/" className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-3xl text-primary">school</span>
                        <span className="text-xl font-bold text-text-main">FuturDialk</span>
                    </Link>
                    <div className="flex items-center gap-3">
                        <LanguageSwitcher />
                        <Link to="/login" className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold">{isFr ? 'Connexion' : 'Sign In'}</Link>
                    </div>
                </div>
            </header>

            <main className="flex-1 px-6 lg:px-20 py-8 max-w-[1280px] mx-auto w-full">
                <div className="mb-8">
                    <h1 className="text-4xl font-black text-text-main tracking-tight">{isFr ? 'Calculateur de Budget' : 'Budget Calculator'}</h1>
                    <p className="text-secondary text-lg mt-1">{isFr ? 'Estimez le coût total de vos études à l\'étranger (en MAD).' : 'Estimate the total cost of studying abroad (in MAD).'}</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left: Configuration */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Country Selection */}
                        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                            <h2 className="text-lg font-bold text-text-main mb-4">{isFr ? 'Choisir un Pays' : 'Select Country'}</h2>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                {countries.map((c) => (
                                    <button key={c.code} onClick={() => setSelected(c.code)}
                                        className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${selected === c.code ? 'border-primary bg-blue-50' : 'border-gray-200 hover:border-primary/30'}`}>
                                        <span className="text-2xl">{c.flag}</span>
                                        <span className="text-sm font-bold text-text-main">{isFr ? c.name.fr : c.name.en}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Scholarship deduction */}
                        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                            <h2 className="text-lg font-bold text-text-main mb-4">{isFr ? 'Paramètres' : 'Parameters'}</h2>
                            <div>
                                <label className="text-sm font-semibold text-text-main block mb-2">{isFr ? 'Bourse obtenue (MAD)' : 'Scholarship Amount (MAD)'}</label>
                                <input type="number" min="0" step="5000" value={scholarship} onChange={(e) => setScholarship(Number(e.target.value))}
                                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-text-main focus:ring-2 focus:ring-primary focus:border-primary outline-none" placeholder="0" />
                            </div>
                        </div>

                        {/* Breakdown from API */}
                        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                            <h2 className="text-lg font-bold text-text-main mb-4">{isFr ? 'Répartition des Coûts (annuel)' : 'Cost Breakdown (yearly)'}</h2>
                            {loading ? (
                                <p className="text-secondary py-4">{isFr ? 'Chargement...' : 'Loading...'}</p>
                            ) : budget && (
                                <div className="space-y-4">
                                    {budget.items.map((item, i) => (
                                        <div key={i} className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <span className={`material-symbols-outlined ${categoryColors[item.category] || 'text-gray-500'}`}>{categoryIcons[item.category] || 'payments'}</span>
                                                <span className="text-sm font-medium text-text-main">{item.label}</span>
                                            </div>
                                            <span className="text-sm font-bold text-text-main">{item.amount_mad.toLocaleString()} MAD</span>
                                        </div>
                                    ))}
                                    {scholarship > 0 && (
                                        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                                            <div className="flex items-center gap-3">
                                                <span className="material-symbols-outlined text-green-600">savings</span>
                                                <span className="text-sm font-medium text-green-600">{isFr ? 'Bourse' : 'Scholarship'}</span>
                                            </div>
                                            <span className="text-sm font-bold text-green-600">-{scholarship.toLocaleString()} MAD</span>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right: Summary */}
                    <div className="space-y-6">
                        <div className="bg-gradient-to-br from-primary to-blue-700 rounded-2xl p-6 text-white shadow-lg sticky top-24">
                            <h3 className="text-sm font-bold uppercase tracking-wider opacity-80 mb-4">{isFr ? 'Coût Total Estimé / An' : 'Total Estimated Cost / Year'}</h3>
                            {budget ? (
                                <>
                                    <div className="text-5xl font-black mb-2">{totalAfterScholarship.toLocaleString()} <span className="text-2xl">MAD</span></div>
                                    <p className="text-blue-200 text-sm mb-2">
                                        {country.flag} {isFr ? country.name.fr : country.name.en}
                                    </p>
                                    {budget.currency_code && budget.total_yearly_foreign && (
                                        <p className="text-blue-200 text-sm mb-6">
                                            ≈ {budget.total_yearly_foreign.toLocaleString()} {budget.currency_code}
                                        </p>
                                    )}
                                    <div className="space-y-3 border-t border-white/20 pt-4">
                                        <div className="flex justify-between text-sm">
                                            <span className="opacity-80">{isFr ? 'Par mois' : 'Per Month'}</span>
                                            <span className="font-bold">{budget.total_monthly_mad.toLocaleString()} MAD</span>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <p className="text-blue-200">{isFr ? 'Chargement...' : 'Loading...'}</p>
                            )}
                            <button className="mt-6 w-full bg-white text-primary font-bold py-3 rounded-xl hover:bg-gray-100 transition-colors">
                                {isFr ? 'Télécharger le Rapport' : 'Download Report'}
                            </button>
                        </div>

                        <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
                            <h3 className="font-bold text-text-main mb-3 flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">tips_and_updates</span>
                                {isFr ? 'Astuces Budget' : 'Budget Tips'}
                            </h3>
                            <ul className="space-y-3 text-sm text-secondary">
                                <li className="flex gap-2"><span className="text-primary">•</span>{isFr ? 'Postulez aux bourses avant les dates limites.' : 'Apply for scholarships before deadlines.'}</li>
                                <li className="flex gap-2"><span className="text-primary">•</span>{isFr ? 'Envisagez un job étudiant (20h/semaine max).' : 'Consider a part-time student job (20h/week max).'}</li>
                                <li className="flex gap-2"><span className="text-primary">•</span>{isFr ? 'Comparez les logements CROUS vs privé.' : 'Compare CROUS vs private housing costs.'}</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
