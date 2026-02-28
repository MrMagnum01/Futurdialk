/**
 * Career Path Detail — Detailed view of a single career path with market data.
 */
import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useTranslation, LanguageSwitcher } from '../i18n'
import { getCareerPath } from '../api'

const RISK_COLORS = { low: 'bg-green-100 text-green-800', medium: 'bg-yellow-100 text-yellow-800', high: 'bg-red-100 text-red-800' }
const FLAG_EMOJI = { morocco: '🇲🇦', france: '🇫🇷', canada: '🇨🇦', germany: '🇩🇪' }

export default function CareerPathDetail() {
    const { id } = useParams()
    const { lang } = useTranslation()
    const isFr = lang === 'fr'
    const [career, setCareer] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        getCareerPath(id)
            .then(setCareer)
            .catch(() => { })
            .finally(() => setLoading(false))
    }, [id])

    if (loading) return <div className="min-h-screen bg-bg-light flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div></div>
    if (!career) return <div className="min-h-screen bg-bg-light flex flex-col items-center justify-center gap-4"><span className="material-symbols-outlined text-6xl text-gray-300">error</span><p className="text-secondary">{isFr ? 'Carrière non trouvée' : 'Career not found'}</p><Link to="/career" className="text-primary font-bold">{isFr ? '← Retour' : '← Back'}</Link></div>

    const marketData = career.market_data || {}
    const snapshots = career.market_snapshots || []

    return (
        <div className="min-h-screen bg-bg-light">
            <header className="sticky top-0 z-50 bg-white border-b border-gray-200 px-6 py-3 shadow-sm">
                <div className="max-w-[1100px] mx-auto flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2"><span className="material-symbols-outlined text-3xl text-primary">school</span><span className="text-xl font-bold text-text-main">FuturDialk</span></Link>
                    <div className="flex items-center gap-3">
                        <LanguageSwitcher />
                        <Link to="/career" className="px-4 py-2 bg-gray-100 rounded-lg text-sm font-bold hover:bg-gray-200">{isFr ? '← Carrières' : '← Careers'}</Link>
                    </div>
                </div>
            </header>

            <main className="max-w-[1100px] mx-auto px-4 py-8 md:px-6">
                {/* Hero */}
                <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-8 md:p-10 mb-8">
                    <div className="flex flex-wrap items-center gap-3 mb-3">
                        <span className={`px-3 py-1 text-xs font-bold rounded-full capitalize ${RISK_COLORS[career.automation_risk] || 'bg-gray-100'}`}>{isFr ? 'Risque auto.' : 'Automation Risk'}: {career.automation_risk}</span>
                        {career.riasec_codes?.map(c => <span key={c} className="px-2 py-1 text-xs font-bold rounded bg-indigo-100 text-indigo-700">{c}</span>)}
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-text-main mb-2">{career.name}</h1>
                    <p className="text-secondary capitalize">{career.category}</p>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 space-y-6">
                        {/* Job Titles */}
                        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                            <h2 className="text-lg font-bold text-text-main mb-4 flex items-center gap-2"><span className="material-symbols-outlined text-blue-500">work</span>{isFr ? 'Métiers typiques' : 'Typical Job Titles'}</h2>
                            <div className="flex flex-wrap gap-2">
                                {(career.job_titles || []).map(t => <span key={t} className="px-3 py-1.5 text-sm bg-gray-50 rounded-lg border border-gray-200 text-text-main">{t}</span>)}
                            </div>
                        </div>

                        {/* Education */}
                        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                            <h2 className="text-lg font-bold text-text-main mb-4 flex items-center gap-2"><span className="material-symbols-outlined text-green-500">school</span>{isFr ? 'Formation requise' : 'Required Education'}</h2>
                            <div className="flex flex-wrap gap-2">
                                {(career.required_education || []).map(e => <span key={e} className="px-3 py-1.5 text-sm font-bold bg-green-50 text-green-800 rounded-lg">{e.toUpperCase()}</span>)}
                            </div>
                        </div>

                        {/* Market Data by Country */}
                        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                            <h2 className="text-lg font-bold text-text-main mb-4 flex items-center gap-2"><span className="material-symbols-outlined text-orange-500">trending_up</span>{isFr ? 'Données marché par pays' : 'Market Data by Country'}</h2>
                            <div className="space-y-4">
                                {Object.entries(marketData).map(([country, data]) => (
                                    <div key={country} className="p-4 rounded-xl border border-gray-100 hover:border-primary/30 transition-colors">
                                        <p className="font-bold text-text-main mb-2 capitalize">{FLAG_EMOJI[country] || ''} {country}</p>
                                        <div className="grid grid-cols-3 gap-4">
                                            <div>
                                                <p className="text-xs text-secondary">{isFr ? 'Demande' : 'Demand'}</p>
                                                <p className="text-sm font-bold text-text-main capitalize">{data.demand}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-secondary">{isFr ? 'Salaire moy.' : 'Avg. Salary'}</p>
                                                <p className="text-sm font-bold text-primary">{data.avg_salary_mad || data.avg_salary_eur || data.avg_salary_cad || '—'}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-secondary">{isFr ? 'Croissance' : 'Growth'}</p>
                                                <p className="text-sm font-bold text-green-600">+{data.growth_pct}%</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Market Snapshots */}
                        {snapshots.length > 0 && (
                            <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                                <h2 className="text-lg font-bold text-text-main mb-4 flex items-center gap-2"><span className="material-symbols-outlined text-cyan-500">analytics</span>{isFr ? 'Snapshots détaillés' : 'Detailed Snapshots'}</h2>
                                {snapshots.map((snap, i) => (
                                    <div key={i} className="p-4 rounded-xl bg-gray-50 mb-3 last:mb-0">
                                        <p className="font-bold text-sm mb-2">{snap.country}</p>
                                        <div className="grid grid-cols-2 gap-3 text-sm">
                                            <div><span className="text-secondary">{isFr ? 'Offres' : 'Postings'}:</span> <span className="font-bold">{snap.job_postings_count?.toLocaleString()}</span></div>
                                            <div><span className="text-secondary">{isFr ? 'Salaire' : 'Salary'}:</span> <span className="font-bold">{snap.avg_salary?.toLocaleString()}</span></div>
                                            <div className="col-span-2"><span className="text-secondary">{isFr ? 'Top employeurs' : 'Top Employers'}:</span> <span className="font-medium">{(snap.top_employers || []).join(', ')}</span></div>
                                            <div className="col-span-2"><span className="text-secondary">{isFr ? 'Compétences' : 'Skills'}:</span> <span className="font-medium">{(snap.required_skills || []).join(', ')}</span></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right sidebar */}
                    <div className="space-y-4">
                        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm space-y-4">
                            <Link to="/career/discover" className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-white font-bold py-3 rounded-xl transition-colors shadow-md">
                                <span className="material-symbols-outlined">psychology</span> {isFr ? 'Test RIASEC' : 'Take RIASEC Quiz'}
                            </Link>
                            <Link to="/explore" className="w-full flex items-center justify-center gap-2 border border-gray-200 hover:border-primary text-secondary hover:text-primary font-medium py-3 rounded-xl transition-colors text-sm">
                                <span className="material-symbols-outlined">search</span> {isFr ? 'Trouver des programmes' : 'Find Programs'}
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
