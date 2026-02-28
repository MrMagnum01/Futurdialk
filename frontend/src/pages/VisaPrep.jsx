/**
 * Visa Prep — Interview simulator with per-country questions and tips.
 * Fetches live data from /api/visa-prep endpoints.
 */

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation, LanguageSwitcher } from '../i18n'
import { getVisaCountries, getVisaQuestions, getVisaTips } from '../api'

const FLAG_EMOJI = { FR: '🇫🇷', CA: '🇨🇦', DE: '🇩🇪', UK: '🇬🇧', US: '🇺🇸', ES: '🇪🇸', TR: '🇹🇷' }
const DIFFICULTY_COLORS = { 'Facile': 'bg-green-100 text-green-700', 'Easy': 'bg-green-100 text-green-700', 'Modéré': 'bg-yellow-100 text-yellow-700', 'Moderate': 'bg-yellow-100 text-yellow-700', 'Élevé': 'bg-orange-100 text-orange-700', 'Hard': 'bg-orange-100 text-orange-700', 'Très Élevé': 'bg-red-100 text-red-700', 'Very Hard': 'bg-red-100 text-red-700' }

export default function VisaPrep() {
    const { lang } = useTranslation()
    const isFr = lang === 'fr'
    const [countries, setCountries] = useState([])
    const [tips, setTips] = useState([])
    const [selectedCountry, setSelectedCountry] = useState(null)
    const [questions, setQuestions] = useState(null)
    const [activeQ, setActiveQ] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        Promise.all([
            getVisaCountries().then(d => setCountries(d.countries || [])),
            getVisaTips().then(d => setTips(d.tips || [])),
        ]).finally(() => setLoading(false))
    }, [])

    useEffect(() => {
        if (!selectedCountry) { setQuestions(null); setActiveQ(null); return }
        getVisaQuestions(selectedCountry).then(d => setQuestions(d)).catch(() => { })
    }, [selectedCountry])

    const categoryIcons = { motivation: 'psychology', program: 'school', financial: 'payments', logistics: 'apartment', return_plan: 'flight_land', personal: 'person', language: 'translate' }
    const categoryColors = { motivation: 'text-purple-600', program: 'text-primary', financial: 'text-green-600', logistics: 'text-orange-500', return_plan: 'text-red-600', personal: 'text-teal-600', language: 'text-indigo-600' }

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
                        <Link to="/dashboard" className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold">{isFr ? 'Dashboard' : 'Dashboard'}</Link>
                    </div>
                </div>
            </header>

            <main className="flex-1 px-6 lg:px-20 py-8 max-w-[1280px] mx-auto w-full">
                {/* Hero */}
                <div className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-2xl p-8 md:p-12 mb-10 text-white relative overflow-hidden">
                    <div className="absolute -right-20 -top-20 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
                    <div className="relative z-10 max-w-2xl">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="material-symbols-outlined">assignment</span>
                            <span className="text-sm font-bold uppercase tracking-wider">{isFr ? 'Préparation Visa' : 'Visa Prep'}</span>
                        </div>
                        <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-3">
                            {isFr ? "Simulateur d'Entretien Visa" : 'Visa Interview Simulator'}
                        </h1>
                        <p className="text-emerald-100 text-lg">
                            {isFr ? "Préparez-vous avec les vraies questions posées aux étudiants marocains." : "Prepare with real questions asked to Moroccan students."}
                        </p>
                    </div>
                </div>

                {/* Country Selection */}
                <h2 className="text-2xl font-bold text-text-main mb-6 flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">public</span>
                    {isFr ? 'Choisir un Pays' : 'Select a Country'}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
                    {countries.map(c => {
                        const diff = isFr ? c.difficulty_fr : c.difficulty_en
                        return (
                            <button
                                key={c.country_code}
                                onClick={() => setSelectedCountry(c.country_code)}
                                className={`flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all ${selectedCountry === c.country_code ? 'border-primary bg-blue-50' : 'border-gray-200 bg-white hover:border-primary/30'}`}
                            >
                                <span className="text-3xl">{FLAG_EMOJI[c.country_code]}</span>
                                <div className="flex-1">
                                    <span className="font-bold text-text-main block">{isFr ? c.country_fr : c.country_en}</span>
                                    <span className="text-xs text-secondary">{c.visa_type} · {c.total_questions} questions</span>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${DIFFICULTY_COLORS[diff] || ''}`}>{diff}</span>
                                        <span className="text-xs text-secondary">~{c.avg_duration_min} min</span>
                                    </div>
                                </div>
                            </button>
                        )
                    })}
                </div>

                {/* Questions */}
                {questions && (
                    <div className="mb-10">
                        <h2 className="text-2xl font-bold text-text-main mb-6 flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary">quiz</span>
                            {FLAG_EMOJI[selectedCountry]} {isFr ? questions.country_fr : questions.country_en} — {questions.questions.length} {isFr ? 'questions' : 'questions'}
                        </h2>
                        <div className="space-y-3">
                            {questions.questions.map((q, i) => (
                                <div key={i} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                                    <button
                                        onClick={() => setActiveQ(activeQ === i ? null : i)}
                                        className="w-full p-4 flex items-center gap-3 text-left hover:bg-gray-50 transition-colors"
                                    >
                                        <span className={`material-symbols-outlined ${categoryColors[q.category] || 'text-gray-500'}`}>{categoryIcons[q.category] || 'help'}</span>
                                        <div className="flex-1">
                                            <span className="font-medium text-text-main">{isFr ? q.q_fr : q.q_en}</span>
                                        </div>
                                        <span className={`material-symbols-outlined transition-transform ${activeQ === i ? 'rotate-180' : ''}`}>expand_more</span>
                                    </button>
                                    {activeQ === i && (
                                        <div className="px-4 pb-4 pt-0 ml-9">
                                            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
                                                <p className="text-sm font-medium text-emerald-800 flex items-center gap-2">
                                                    <span className="material-symbols-outlined text-emerald-600">lightbulb</span>
                                                    {isFr ? 'Conseil' : 'Tip'}
                                                </p>
                                                <p className="text-sm text-emerald-700 mt-1">{isFr ? q.tip_fr : q.tip_en}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* General Tips */}
                <h2 className="text-2xl font-bold text-text-main mb-6 flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">tips_and_updates</span>
                    {isFr ? 'Conseils Généraux' : 'General Tips'}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {tips.map((tip, i) => (
                        <div key={i} className="bg-white rounded-xl p-5 border border-gray-200 hover:shadow-md transition-shadow">
                            <span className="text-2xl mb-3 block">{tip.icon}</span>
                            <h3 className="font-bold text-text-main mb-1">{isFr ? tip.title_fr : tip.title_en}</h3>
                            <p className="text-sm text-secondary">{isFr ? tip.desc_fr : tip.desc_en}</p>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    )
}
