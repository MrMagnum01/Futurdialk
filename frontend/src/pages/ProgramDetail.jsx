/**
 * Program Detail — Shows full details for a specific program.
 */
import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useTranslation, LanguageSwitcher } from '../i18n'
import { getProgram } from '../api'

const FLAG_EMOJI = { FR: '🇫🇷', CA: '🇨🇦', DE: '🇩🇪', UK: '🇬🇧', ES: '🇪🇸', MA: '🇲🇦' }

export default function ProgramDetail() {
    const { id } = useParams()
    const { lang } = useTranslation()
    const isFr = lang === 'fr'
    const [program, setProgram] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        getProgram(id)
            .then(setProgram)
            .catch(() => { })
            .finally(() => setLoading(false))
    }, [id])

    if (loading) return (
        <div className="min-h-screen bg-bg-light flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
        </div>
    )

    if (!program) return (
        <div className="min-h-screen bg-bg-light flex flex-col items-center justify-center gap-4">
            <span className="material-symbols-outlined text-6xl text-gray-300">error</span>
            <p className="text-secondary text-lg">{isFr ? 'Programme non trouvé' : 'Program not found'}</p>
            <Link to="/explore" className="text-primary font-bold hover:underline">{isFr ? '← Retour' : '← Back'}</Link>
        </div>
    )

    const school = program.school || {}
    const flag = FLAG_EMOJI[school.country_code] || ''

    return (
        <div className="min-h-screen bg-bg-light">
            <header className="sticky top-0 z-50 bg-white border-b border-gray-200 px-6 py-3 shadow-sm">
                <div className="max-w-[1100px] mx-auto flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-3xl text-primary">school</span>
                        <span className="text-xl font-bold text-text-main">FuturDialk</span>
                    </Link>
                    <div className="flex items-center gap-3">
                        <LanguageSwitcher />
                        <Link to="/explore" className="px-4 py-2 bg-gray-100 rounded-lg text-sm font-bold hover:bg-gray-200">{isFr ? '← Programmes' : '← Programs'}</Link>
                    </div>
                </div>
            </header>

            <main className="max-w-[1100px] mx-auto px-4 py-8 md:px-6">
                {/* Hero */}
                <div className="bg-gradient-to-br from-primary/10 to-blue-50 rounded-2xl p-8 md:p-10 mb-8 relative overflow-hidden">
                    <div className="absolute -right-20 -top-20 w-60 h-60 bg-primary/10 rounded-full blur-3xl" />
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-3">
                            <span className="px-3 py-1 text-xs font-bold rounded-full bg-primary text-white uppercase">{(program.degree_type || '').replace('_', ' ')}</span>
                            {school.ranking_world && <span className="px-3 py-1 text-xs font-bold rounded-full bg-yellow-100 text-yellow-800">#{school.ranking_world} 🌍</span>}
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold text-text-main mb-2">{program.name}</h1>
                        <p className="text-lg text-secondary font-medium mb-1">{school.name}</p>
                        <p className="text-secondary flex items-center gap-2">
                            <span className="material-symbols-outlined text-lg">location_on</span>
                            {flag} {school.city}, {school.country_code}
                        </p>
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    {/* Left — Details */}
                    <div className="md:col-span-2 space-y-6">
                        {/* Overview */}
                        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                            <h2 className="text-lg font-bold text-text-main mb-4 flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">info</span>
                                {isFr ? 'Aperçu du programme' : 'Program Overview'}
                            </h2>
                            <div className="grid grid-cols-2 gap-4">
                                <InfoItem icon="schedule" label={isFr ? 'Durée' : 'Duration'} value={program.duration_months ? `${program.duration_months} ${isFr ? 'mois' : 'months'}` : '—'} />
                                <InfoItem icon="school" label={isFr ? 'Diplôme' : 'Degree'} value={(program.degree_type || '').replace('_', ' ')} />
                                <InfoItem icon="category" label={isFr ? 'Domaine' : 'Field'} value={program.field_of_study || '—'} />
                                <InfoItem icon="language" label={isFr ? 'Langue' : 'Language'} value={program.language || '—'} />
                                <InfoItem icon="calendar_month" label={isFr ? 'Rentrée' : 'Start'} value={program.intake || '—'} />
                                <InfoItem icon="payments" label={isFr ? 'Frais / an' : 'Tuition / yr'} value={school.tuition_international_yearly || '—'} />
                            </div>
                        </div>

                        {/* Requirements */}
                        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                            <h2 className="text-lg font-bold text-text-main mb-4 flex items-center gap-2">
                                <span className="material-symbols-outlined text-orange-500">checklist</span>
                                {isFr ? 'Conditions d\'admission' : 'Admission Requirements'}
                            </h2>
                            <div className="space-y-3">
                                {(program.requirements || []).length > 0
                                    ? program.requirements.map((req, i) => (
                                        <div key={i} className="flex items-start gap-3 text-sm">
                                            <span className="material-symbols-outlined text-green-500 mt-0.5">check_circle</span>
                                            <span className="text-text-main">{req}</span>
                                        </div>
                                    ))
                                    : (
                                        <div className="space-y-3">
                                            <div className="flex items-start gap-3 text-sm"><span className="material-symbols-outlined text-green-500 mt-0.5">check_circle</span><span>{isFr ? 'Diplôme de baccalauréat ou équivalent' : 'High school diploma or equivalent'}</span></div>
                                            <div className="flex items-start gap-3 text-sm"><span className="material-symbols-outlined text-green-500 mt-0.5">check_circle</span><span>{isFr ? 'Relevés de notes officiels' : 'Official transcripts'}</span></div>
                                            <div className="flex items-start gap-3 text-sm"><span className="material-symbols-outlined text-orange-500 mt-0.5">warning</span><span>{isFr ? 'Test de langue requis (vérifier le niveau)' : 'Language test required (verify level)'}</span></div>
                                        </div>
                                    )
                                }
                            </div>
                        </div>

                        {/* School Info */}
                        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                            <h2 className="text-lg font-bold text-text-main mb-4 flex items-center gap-2">
                                <span className="material-symbols-outlined text-blue-500">account_balance</span>
                                {isFr ? 'À propos de l\'université' : 'About the University'}
                            </h2>
                            <div className="grid grid-cols-2 gap-4">
                                <InfoItem icon="public" label={isFr ? 'Type' : 'Type'} value={school.type || 'University'} />
                                <InfoItem icon="groups" label={isFr ? 'Étudiants marocains' : 'Moroccan Students'} value={school.has_moroccan_students ? '✅ ' + (isFr ? 'Oui' : 'Yes') : '—'} />
                                <InfoItem icon="apartment" label={isFr ? 'Logement' : 'Housing'} value={school.housing_available ? '✅' : '—'} />
                                <InfoItem icon="savings" label={isFr ? 'Bourses disponibles' : 'Scholarships'} value={school.scholarship_available ? '✅ ' + (isFr ? 'Oui' : 'Yes') : '—'} />
                            </div>
                        </div>
                    </div>

                    {/* Right — Actions sidebar */}
                    <div className="space-y-4">
                        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm space-y-4">
                            <Link to="/register" className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-white font-bold py-3 px-6 rounded-xl transition-colors shadow-md">
                                <span className="material-symbols-outlined">rocket_launch</span>
                                {isFr ? 'Commencer ma candidature' : 'Start My Application'}
                            </Link>
                            <button className="w-full flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-text-main font-bold py-3 px-6 rounded-xl transition-colors">
                                <span className="material-symbols-outlined">bookmark</span>
                                {isFr ? 'Sauvegarder' : 'Save Program'}
                            </button>
                            <Link to={`/explore/school/${school.id || ''}`} className="w-full flex items-center justify-center gap-2 border border-gray-200 hover:border-primary text-secondary hover:text-primary font-medium py-3 px-6 rounded-xl transition-colors text-sm">
                                <span className="material-symbols-outlined">account_balance</span>
                                {isFr ? 'Voir l\'université' : 'View University'}
                            </Link>
                        </div>

                        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-100 p-5">
                            <h3 className="font-bold text-green-800 mb-2 flex items-center gap-2">
                                <span className="material-symbols-outlined text-green-600">tips_and_updates</span>
                                {isFr ? 'Conseil FuturDialk' : 'FuturDialk Tip'}
                            </h3>
                            <p className="text-sm text-green-700">
                                {isFr
                                    ? 'Commencez votre dossier 6 mois avant la date limite. Utilisez notre roadmap pour ne rien oublier!'
                                    : 'Start your application 6 months before the deadline. Use our roadmap to stay on track!'}
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}

function InfoItem({ icon, label, value }) {
    return (
        <div className="flex items-start gap-3">
            <span className="material-symbols-outlined text-gray-400 mt-0.5">{icon}</span>
            <div>
                <p className="text-xs text-secondary">{label}</p>
                <p className="text-sm font-semibold text-text-main capitalize">{value}</p>
            </div>
        </div>
    )
}
