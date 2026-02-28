/**
 * Document Vault — Templates, country checklists, and document management.
 * Fetches live data from /api/documents endpoints.
 */

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation, LanguageSwitcher } from '../i18n'
import { getDocumentTemplates, getDocumentChecklist, getAllChecklists } from '../api'

const FLAG_EMOJI = { FR: '🇫🇷', CA: '🇨🇦', DE: '🇩🇪', UK: '🇬🇧', ES: '🇪🇸' }

export default function DocumentVault() {
    const { lang } = useTranslation()
    const isFr = lang === 'fr'
    const [templates, setTemplates] = useState([])
    const [checklists, setChecklists] = useState([])
    const [selectedCountry, setSelectedCountry] = useState(null)
    const [checklist, setChecklist] = useState(null)
    const [loading, setLoading] = useState(true)
    const [checked, setChecked] = useState({})

    useEffect(() => {
        Promise.all([
            getDocumentTemplates().then(d => setTemplates(d.templates || [])),
            getAllChecklists().then(d => setChecklists(d.checklists || [])),
        ]).finally(() => setLoading(false))
    }, [])

    useEffect(() => {
        if (!selectedCountry) { setChecklist(null); return }
        getDocumentChecklist(selectedCountry).then(d => setChecklist(d)).catch(() => { })
    }, [selectedCountry])

    const toggleCheck = (idx) => {
        setChecked(prev => ({ ...prev, [idx]: !prev[idx] }))
    }

    const checkedCount = Object.values(checked).filter(Boolean).length

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
                <div className="bg-gradient-to-r from-red-600 to-red-800 rounded-2xl p-8 md:p-12 mb-10 text-white relative overflow-hidden">
                    <div className="absolute -right-20 -top-20 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
                    <div className="relative z-10 max-w-2xl">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="material-symbols-outlined">description</span>
                            <span className="text-sm font-bold uppercase tracking-wider">{isFr ? 'Coffre-Fort Documents' : 'Document Vault'}</span>
                        </div>
                        <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-3">
                            {isFr ? 'Vos Documents, Organisés' : 'Your Documents, Organized'}
                        </h1>
                        <p className="text-red-100 text-lg">
                            {isFr ? "Checklists par pays, modèles de lettres, et suivi de votre dossier — tout en un." : "Country checklists, letter templates, and application tracking — all in one."}
                        </p>
                    </div>
                </div>

                {/* Document Templates */}
                <h2 className="text-2xl font-bold text-text-main mb-6 flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">edit_document</span>
                    {isFr ? 'Modèles de Documents' : 'Document Templates'}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
                    {templates.map(t => (
                        <div key={t.id} className="group bg-white rounded-xl p-5 border border-gray-200 hover:border-primary hover:shadow-lg transition-all cursor-pointer">
                            <div className="flex items-start gap-4">
                                <span className="text-3xl">{t.icon}</span>
                                <div className="flex-1">
                                    <h3 className="font-bold text-text-main group-hover:text-primary transition-colors">
                                        {isFr ? t.name_fr : t.name_en}
                                    </h3>
                                    <p className="text-sm text-secondary mt-1">{isFr ? t.desc_fr : t.desc_en}</p>
                                    <div className="flex flex-wrap gap-1 mt-3">
                                        {t.countries.map(c => (
                                            <span key={c} className="text-xs bg-gray-100 px-2 py-0.5 rounded">{FLAG_EMOJI[c] || c}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <button className="mt-4 w-full py-2 border border-gray-200 rounded-lg text-sm font-bold text-text-main group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all">
                                {isFr ? 'Utiliser ce modèle' : 'Use Template'}
                            </button>
                        </div>
                    ))}
                </div>

                {/* Country Checklists */}
                <h2 className="text-2xl font-bold text-text-main mb-6 flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">checklist</span>
                    {isFr ? 'Checklist par Pays' : 'Country Checklist'}
                </h2>

                {/* Country selector */}
                <div className="flex flex-wrap gap-3 mb-6">
                    {checklists.map(cl => (
                        <button
                            key={cl.country_code}
                            onClick={() => { setSelectedCountry(cl.country_code); setChecked({}) }}
                            className={`flex items-center gap-2 px-4 py-3 rounded-xl border-2 transition-all ${selectedCountry === cl.country_code ? 'border-primary bg-blue-50' : 'border-gray-200 bg-white hover:border-primary/30'}`}
                        >
                            <span className="text-xl">{FLAG_EMOJI[cl.country_code]}</span>
                            <div className="text-left">
                                <span className="text-sm font-bold text-text-main block">{isFr ? cl.country_fr : cl.country_en}</span>
                                <span className="text-xs text-secondary">{cl.total_items} {isFr ? 'documents' : 'items'} · {cl.total_cost_mad.toLocaleString()} MAD</span>
                            </div>
                        </button>
                    ))}
                </div>

                {/* Checklist items */}
                {checklist && (
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-10">
                        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                            <div>
                                <h3 className="font-bold text-text-main">
                                    {FLAG_EMOJI[selectedCountry]} {isFr ? checklist.country_fr : checklist.country_en} — {checklist.total_items} {isFr ? 'documents requis' : 'required documents'}
                                </h3>
                                <p className="text-sm text-secondary mt-1">
                                    {isFr ? 'Coût total estimé' : 'Estimated total cost'}: <span className="font-bold text-primary">{checklist.total_cost_mad.toLocaleString()} MAD</span>
                                </p>
                            </div>
                            <div className="text-sm font-bold text-primary">
                                {checkedCount}/{checklist.total_items} ✓
                            </div>
                        </div>
                        {/* Progress bar */}
                        <div className="h-1.5 bg-gray-100">
                            <div className="h-full bg-primary transition-all duration-300 rounded-r" style={{ width: `${(checkedCount / checklist.total_items) * 100}%` }} />
                        </div>
                        <div className="divide-y divide-gray-100">
                            {checklist.items.map((item, i) => (
                                <label key={i} className="flex items-center gap-4 p-4 hover:bg-gray-50 cursor-pointer transition-colors">
                                    <input
                                        type="checkbox"
                                        checked={!!checked[i]}
                                        onChange={() => toggleCheck(i)}
                                        className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
                                    />
                                    <div className="flex-1">
                                        <span className={`text-sm font-medium ${checked[i] ? 'line-through text-gray-400' : 'text-text-main'}`}>
                                            {isFr ? item.name_fr : item.name_en}
                                        </span>
                                        {!item.required && <span className="ml-2 text-xs bg-gray-100 px-2 py-0.5 rounded text-secondary">{isFr ? 'Optionnel' : 'Optional'}</span>}
                                    </div>
                                    {item.cost_mad > 0 && (
                                        <span className="text-sm font-semibold text-primary whitespace-nowrap">{item.cost_mad.toLocaleString()} MAD</span>
                                    )}
                                </label>
                            ))}
                        </div>
                    </div>
                )}

                {/* Tips */}
                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                    <h3 className="font-bold text-text-main mb-4 flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">lightbulb</span>
                        {isFr ? 'Conseils pour les Marocains' : 'Tips for Moroccan Students'}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[
                            { i: '🏛️', fr: 'Allez au rectorat tôt pour les copies certifiées', en: 'Go to the academy early for certified copies' },
                            { i: '📝', fr: 'Traduisez tout chez un traducteur assermenté', en: 'Use a sworn translator for all documents' },
                            { i: '💰', fr: 'Banque Populaire et CIH offrent le compte bloqué', en: 'Banque Populaire and CIH offer blocked accounts' },
                        ].map((tip, i) => (
                            <div key={i} className="flex gap-3 items-start p-3 bg-gray-50 rounded-lg">
                                <span className="text-xl">{tip.i}</span>
                                <span className="text-sm font-medium text-text-main">{isFr ? tip.fr : tip.en}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    )
}
