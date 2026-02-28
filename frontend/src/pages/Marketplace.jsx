/**
 * Marketplace — Student services with MAD pricing for Moroccan market.
 * Verified services curated by FuturDialk.
 */

import { Link } from 'react-router-dom'
import { useTranslation, LanguageSwitcher } from '../i18n'

const services = [
    { id: 1, icon: '📝', titleFr: 'Relecture de Dossier Campus France', titleEn: 'Campus France Application Review', descFr: 'Vérification complète de votre dossier par un expert Campus France.', descEn: 'Complete review by a Campus France expert.', price: 490, rating: 4.9, reviews: 128, tag: { fr: 'Populaire', en: 'Popular' }, tagColor: 'bg-blue-100 text-primary' },
    { id: 2, icon: '🎤', titleFr: 'Coaching Entretien Visa', titleEn: 'Visa Interview Coaching', descFr: 'Simulation d\'entretien 1-1 avec un coach certifié. Spécial consulat.', descEn: '1-on-1 interview simulation with certified coach. Consulate-specific.', price: 790, rating: 4.8, reviews: 87, tag: { fr: 'Premium', en: 'Premium' }, tagColor: 'bg-purple-100 text-purple-700' },
    { id: 3, icon: '📄', titleFr: 'Traduction Certifiée', titleEn: 'Certified Translation', descFr: 'Traduction assermentée arabe-français / arabe-anglais.', descEn: 'Sworn translation Arabic-French / Arabic-English.', price: 350, rating: 4.7, reviews: 203, tag: { fr: 'Rapide (24h)', en: 'Fast (24h)' }, tagColor: 'bg-green-100 text-green-700' },
    { id: 4, icon: '✈️', titleFr: 'Pack Pré-Départ', titleEn: 'Pre-Departure Pack', descFr: 'Checklist, ouverture de compte bancaire, assurance, carte SIM.', descEn: 'Checklist, bank account, insurance, SIM card.', price: 290, rating: 4.6, reviews: 342, tag: null },
    { id: 5, icon: '🏡', titleFr: 'Recherche Logement', titleEn: 'Housing Search', descFr: 'Agent dédié pour trouver votre logement étudiant en France/Canada.', descEn: 'Dedicated agent for student housing in France/Canada.', price: 990, rating: 4.9, reviews: 56, tag: { fr: 'Nouveau', en: 'New' }, tagColor: 'bg-orange-100 text-orange-700' },
    { id: 6, icon: '📚', titleFr: 'Tutorat Académique', titleEn: 'Academic Tutoring', descFr: 'Aide aux devoirs, préparation BAC et mise à niveau universitaire.', descEn: 'Homework help, BAC prep, and university readiness.', price: 250, priceNote: '/h', rating: 4.8, reviews: 178, tag: null },
    { id: 7, icon: '💬', titleFr: 'Préparation TCF/TEF', titleEn: 'TCF/TEF Preparation', descFr: 'Pack de 10 sessions de préparation pour le TCF ou TEF Canada.', descEn: '10-session prep pack for TCF or TEF Canada.', price: 1500, rating: 4.9, reviews: 95, tag: { fr: 'Meilleure vente', en: 'Best seller' }, tagColor: 'bg-amber-100 text-amber-700' },
    { id: 8, icon: '🎓', titleFr: 'Accompagnement Complet', titleEn: 'Full Guidance Package', descFr: 'De l\'orientation à l\'obtention du visa — accompagnement A-Z.', descEn: 'From orientation to visa approval — full A-Z guidance.', price: 4900, rating: 5.0, reviews: 34, tag: { fr: 'Elite', en: 'Elite' }, tagColor: 'bg-gray-800 text-white' },
    { id: 9, icon: '🔐', titleFr: 'Compte Bloqué Allemagne', titleEn: 'Blocked Account Germany', descFr: 'Aide à l\'ouverture du Sperrkonto (Expatrio/Fintiba).', descEn: 'Help opening Sperrkonto (Expatrio/Fintiba).', price: 190, rating: 4.5, reviews: 67, tag: null },
]

export default function Marketplace() {
    const { lang } = useTranslation()
    const isFr = lang === 'fr'
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

                {/* Services Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {services.map(s => (
                        <div key={s.id} className="group bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg hover:border-primary/30 transition-all flex flex-col">
                            <div className="flex justify-between items-start mb-3">
                                <span className="text-3xl">{s.icon}</span>
                                {s.tag && <span className={`text-xs font-bold px-2 py-1 rounded ${s.tagColor}`}>{isFr ? s.tag.fr : s.tag.en}</span>}
                            </div>
                            <h3 className="text-lg font-bold text-text-main mb-1 group-hover:text-primary transition-colors">{isFr ? s.titleFr : s.titleEn}</h3>
                            <p className="text-sm text-secondary mb-4">{isFr ? s.descFr : s.descEn}</p>
                            <div className="mt-auto pt-4 border-t border-gray-100 flex justify-between items-center">
                                <div>
                                    <span className="text-2xl font-black text-primary">{s.price.toLocaleString()}</span>
                                    <span className="text-sm text-secondary ml-1">MAD{s.priceNote || ''}</span>
                                </div>
                                <div className="flex items-center gap-1 text-sm text-secondary">
                                    <span className="material-symbols-outlined text-yellow-500 text-lg">star</span>
                                    <span className="font-bold text-text-main">{s.rating}</span>
                                    <span>({s.reviews})</span>
                                </div>
                            </div>
                            <button className="mt-4 w-full py-2.5 bg-primary text-white rounded-xl font-bold text-sm hover:bg-primary-hover transition-colors">{isFr ? 'Réserver' : 'Book Now'}</button>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    )
}
