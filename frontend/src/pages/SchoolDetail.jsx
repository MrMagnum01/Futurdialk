/**
 * School Detail — Shows university/school information with its programs.
 */
import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useTranslation, LanguageSwitcher } from '../i18n'
import { getSchool, getPrograms } from '../api'

const FLAG_EMOJI = { FR: '🇫🇷', CA: '🇨🇦', DE: '🇩🇪', UK: '🇬🇧', ES: '🇪🇸', MA: '🇲🇦' }

export default function SchoolDetail() {
    const { id } = useParams()
    const { lang } = useTranslation()
    const isFr = lang === 'fr'
    const [school, setSchool] = useState(null)
    const [programs, setPrograms] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        Promise.all([
            getSchool(id).catch(() => null),
            getPrograms({ search: '' }).catch(() => ({ programs: [] })),
        ]).then(([s, p]) => {
            setSchool(s)
            setPrograms((p.programs || []).filter(pr => pr.school_id === id || pr.school?.id === id))
        }).finally(() => setLoading(false))
    }, [id])

    if (loading) return (
        <div className="min-h-screen bg-bg-light flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
        </div>
    )

    if (!school) return (
        <div className="min-h-screen bg-bg-light flex flex-col items-center justify-center gap-4">
            <span className="material-symbols-outlined text-6xl text-gray-300">error</span>
            <p className="text-secondary text-lg">{isFr ? 'Université non trouvée' : 'School not found'}</p>
            <Link to="/explore" className="text-primary font-bold hover:underline">{isFr ? '← Retour' : '← Back'}</Link>
        </div>
    )

    const flag = FLAG_EMOJI[school.country_code] || ''

    return (
        <div className="min-h-screen bg-bg-light">
            <header className="sticky top-0 z-50 bg-white border-b border-gray-200 px-6 py-3 shadow-sm">
                <div className="max-w-[1100px] mx-auto flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-3xl text-primary">school</span>
                        <span className="text-xl font-bold text-text-main">Tawjihi</span>
                    </Link>
                    <div className="flex items-center gap-3">
                        <LanguageSwitcher />
                        <Link to="/explore" className="px-4 py-2 bg-gray-100 rounded-lg text-sm font-bold hover:bg-gray-200">{isFr ? '← Programmes' : '← Programs'}</Link>
                    </div>
                </div>
            </header>

            <main className="max-w-[1100px] mx-auto px-4 py-8 md:px-6">
                {/* Hero */}
                <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl p-8 md:p-10 mb-8 relative overflow-hidden">
                    <div className="absolute -right-20 -bottom-20 w-60 h-60 bg-indigo-200/30 rounded-full blur-3xl" />
                    <div className="flex items-start gap-6 relative z-10">
                        <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center shadow-md border border-gray-100 shrink-0">
                            <span className="material-symbols-outlined text-4xl text-primary">account_balance</span>
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-text-main mb-1">{school.name}</h1>
                            <p className="text-secondary flex items-center gap-2">
                                <span className="material-symbols-outlined text-lg">location_on</span>
                                {flag} {school.city}, {school.country_code}
                            </p>
                            <div className="flex flex-wrap gap-2 mt-3">
                                <span className="px-3 py-1 text-xs font-bold rounded-full bg-blue-100 text-blue-800 capitalize">{school.type || 'University'}</span>
                                {school.ranking_world && <span className="px-3 py-1 text-xs font-bold rounded-full bg-yellow-100 text-yellow-800">#{school.ranking_world} 🌍</span>}
                                {school.has_moroccan_students && <span className="px-3 py-1 text-xs font-bold rounded-full bg-green-100 text-green-800">🇲🇦 {isFr ? 'Étudiants marocains' : 'Moroccan Students'}</span>}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    {/* Left — Info + Programs */}
                    <div className="md:col-span-2 space-y-6">
                        {/* Key Facts */}
                        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                            <h2 className="text-lg font-bold text-text-main mb-4">{isFr ? 'Informations clés' : 'Key Facts'}</h2>
                            <div className="grid grid-cols-2 gap-4">
                                <Stat icon="payments" label={isFr ? 'Frais internationaux' : 'Intl. Tuition'} value={school.tuition_international_yearly || '—'} />
                                <Stat icon="apartment" label={isFr ? 'Logement' : 'Housing'} value={school.housing_available ? (isFr ? 'Disponible' : 'Available') : '—'} />
                                <Stat icon="savings" label={isFr ? 'Bourses' : 'Scholarships'} value={school.scholarship_available ? '✅' : '—'} />
                                <Stat icon="public" label={isFr ? 'Pays' : 'Country'} value={`${flag} ${school.country_code}`} />
                            </div>
                        </div>

                        {/* Programs at this school */}
                        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                            <h2 className="text-lg font-bold text-text-main mb-4">{isFr ? `Programmes (${programs.length})` : `Programs (${programs.length})`}</h2>
                            {programs.length === 0 ? (
                                <p className="text-secondary text-sm">{isFr ? 'Programmes en cours de chargement...' : 'Programs loading...'}</p>
                            ) : (
                                <div className="space-y-3">
                                    {programs.map(p => (
                                        <Link key={p.id} to={`/explore/program/${p.id}`} className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-primary/30 hover:bg-blue-50/30 transition-all group">
                                            <div>
                                                <p className="font-bold text-text-main group-hover:text-primary transition-colors">{p.name}</p>
                                                <p className="text-xs text-secondary mt-1 capitalize">{(p.degree_type || '').replace('_', ' ')} • {p.field_of_study || ''}</p>
                                            </div>
                                            <span className="material-symbols-outlined text-gray-300 group-hover:text-primary transition-colors">chevron_right</span>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right sidebar */}
                    <div className="space-y-4">
                        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm space-y-4">
                            {school.website && (
                                <a href={school.website} target="_blank" rel="noopener noreferrer"
                                    className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-white font-bold py-3 px-6 rounded-xl transition-colors shadow-md">
                                    <span className="material-symbols-outlined">open_in_new</span>
                                    {isFr ? 'Site officiel' : 'Official Website'}
                                </a>
                            )}
                            <Link to={`/budget`} className="w-full flex items-center justify-center gap-2 border border-gray-200 hover:border-primary text-secondary hover:text-primary font-medium py-3 px-6 rounded-xl transition-colors text-sm">
                                <span className="material-symbols-outlined">calculate</span>
                                {isFr ? 'Calculer le budget' : 'Calculate Budget'}
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}

function Stat({ icon, label, value }) {
    return (
        <div className="flex items-start gap-3">
            <span className="material-symbols-outlined text-gray-400 mt-0.5">{icon}</span>
            <div>
                <p className="text-xs text-secondary">{label}</p>
                <p className="text-sm font-semibold text-text-main">{value}</p>
            </div>
        </div>
    )
}
