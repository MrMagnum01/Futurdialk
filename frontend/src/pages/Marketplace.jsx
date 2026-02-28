/**
 * Marketplace — Student services with real data from /api/marketplace.
 * Verified services curated by FuturDialk.
 */

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation, LanguageSwitcher } from '../i18n'
import { getMarketplaceProviders, getMarketplaceCategories } from '../api'

const CATEGORY_META = {
    translator: { icon: '📄', labelFr: 'Traduction', labelEn: 'Translation' },
    legalization: { icon: '⚖️', labelFr: 'Légalisation', labelEn: 'Legalization' },
    exam_help: { icon: '📚', labelFr: 'Préparation Examens', labelEn: 'Exam Prep' },
    photo: { icon: '📷', labelFr: 'Photo', labelEn: 'Photo' },
    medical: { icon: '🏥', labelFr: 'Médical', labelEn: 'Medical' },
    tutor: { icon: '👨‍🏫', labelFr: 'Tutorat', labelEn: 'Tutoring' },
    blocked_acct: { icon: '🔐', labelFr: 'Compte Bloqué', labelEn: 'Blocked Account' },
    insurance: { icon: '🛡️', labelFr: 'Assurance', labelEn: 'Insurance' },
}

export default function Marketplace() {
    const { lang } = useTranslation()
    const isFr = lang === 'fr'
    const [providers, setProviders] = useState([])
    const [loading, setLoading] = useState(true)
    const [activeCategory, setActiveCategory] = useState(null)

    useEffect(() => {
        const params = activeCategory ? { category: activeCategory } : {}
        setLoading(true)
        getMarketplaceProviders(params)
            .then(data => setProviders(data.providers || []))
            .catch(() => { })
            .finally(() => setLoading(false))
    }, [activeCategory])

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
                <div className="bg-gradient-to-r from-pink-600 to-rose-700 rounded-2xl p-8 md:p-12 mb-10 text-white relative overflow-hidden">
                    <div className="absolute -right-20 -top-20 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
                    <div className="relative z-10 max-w-2xl">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="material-symbols-outlined">storefront</span>
                            <span className="text-sm font-bold uppercase tracking-wider">{isFr ? 'Marché FuturDialk' : 'FuturDialk Marketplace'}</span>
                        </div>
                        <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-3">
                            {isFr ? 'Services Vérifiés' : 'Verified Services'}
                        </h1>
                        <p className="text-pink-100 text-lg">
                            {isFr ? "Accompagnement personnalisé par des experts. Tous les prix en MAD." : "Personalized guidance from experts. All prices in MAD."}
                        </p>
                    </div>
                </div>

                {/* Trust badges */}
                <div className="flex flex-wrap gap-4 mb-8">
                    {[
                        { icon: 'verified', text: isFr ? 'Experts vérifiés' : 'Verified experts' },
                        { icon: 'shield', text: isFr ? 'Paiement sécurisé' : 'Secure payment' },
                        { icon: 'support_agent', text: isFr ? 'Support 24/7' : '24/7 support' },
                        { icon: 'undo', text: isFr ? 'Remboursement garanti' : 'Money-back guarantee' },
                    ].map((b, i) => (
                        <div key={i} className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-gray-200 text-sm text-secondary">
                            <span className="material-symbols-outlined text-primary text-lg">{b.icon}</span>
                            {b.text}
                        </div>
                    ))}
                </div>

                {/* Category filter */}
                <div className="flex flex-wrap gap-2 mb-8">
                    <button onClick={() => setActiveCategory(null)} className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${!activeCategory ? 'bg-primary text-white' : 'bg-white border border-gray-200 text-secondary hover:bg-gray-50'}`}>
                        {isFr ? 'Tous' : 'All'}
                    </button>
                    {Object.entries(CATEGORY_META).map(([code, meta]) => (
                        <button key={code} onClick={() => setActiveCategory(code)} className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${activeCategory === code ? 'bg-primary text-white' : 'bg-white border border-gray-200 text-secondary hover:bg-gray-50'}`}>
                            {meta.icon} {isFr ? meta.labelFr : meta.labelEn}
                        </button>
                    ))}
                </div>

                {/* Services Grid */}
                {loading ? (
                    <p className="text-center text-secondary py-10">{isFr ? 'Chargement...' : 'Loading...'}</p>
                ) : providers.length === 0 ? (
                    <div className="text-center py-20"><span className="material-symbols-outlined text-5xl text-gray-300 mb-3 block">storefront</span><p className="text-secondary">{isFr ? 'Aucun prestataire trouvé' : 'No providers found'}</p></div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {providers.map(p => {
                            const meta = CATEGORY_META[p.category] || { icon: '📋' }
                            return (
                                <div key={p.id} className="group bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg hover:border-primary/30 transition-all flex flex-col">
                                    <div className="flex justify-between items-start mb-3">
                                        <span className="text-3xl">{meta.icon}</span>
                                        {p.is_verified && <span className="text-xs font-bold px-2 py-1 rounded bg-green-100 text-green-700">{isFr ? 'Vérifié' : 'Verified'}</span>}
                                    </div>
                                    <h3 className="text-lg font-bold text-text-main mb-1 group-hover:text-primary transition-colors">{p.name}</h3>
                                    <p className="text-sm text-secondary mb-1">{p.city} • {(p.languages || []).join(', ').toUpperCase()}</p>
                                    <p className="text-sm text-primary font-bold mb-3">{p.price_description}</p>
                                    <div className="mt-auto pt-4 border-t border-gray-100 flex justify-between items-center">
                                        <div className="flex items-center gap-1 text-sm text-secondary">
                                            <span className="material-symbols-outlined text-yellow-500 text-lg">star</span>
                                            <span className="font-bold text-text-main">{p.rating || '—'}</span>
                                            <span>({p.total_reviews || 0})</span>
                                        </div>
                                        {p.turnaround_days != null && p.turnaround_days > 0 && (
                                            <span className="text-xs text-secondary">{p.turnaround_days}j {isFr ? 'délai' : 'turnaround'}</span>
                                        )}
                                    </div>
                                    <button className="mt-4 w-full py-2.5 bg-primary text-white rounded-xl font-bold text-sm hover:bg-primary-hover transition-colors">{isFr ? 'Contacter' : 'Contact'}</button>
                                </div>
                            )
                        })}
                    </div>
                )}
            </main>
        </div>
    )
}
