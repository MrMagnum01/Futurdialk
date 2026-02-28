/**
 * My Roadmaps — Personalized step-by-step study abroad plans.
 * Fetches live data from /api/roadmap/templates and /api/roadmap/mine.
 */

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation, LanguageSwitcher } from '../i18n'
import { getRoadmapTemplates, getMyRoadmaps, generateRoadmap, isAuthenticated } from '../api'

const FLAG_EMOJI = { FR: '🇫🇷', CA: '🇨🇦', DE: '🇩🇪', UK: '🇬🇧', ES: '🇪🇸', MA: '🇲🇦' }

export default function RoadmapList() {
    const { lang } = useTranslation()
    const isFr = lang === 'fr'
    const [templates, setTemplates] = useState([])
    const [myRoadmaps, setMyRoadmaps] = useState([])
    const [loading, setLoading] = useState(true)
    const [generating, setGenerating] = useState(null)
    const loggedIn = isAuthenticated()

    useEffect(() => {
        setLoading(true)
        const promises = [
            getRoadmapTemplates().then(d => setTemplates(d.templates || [])).catch(() => { }),
        ]
        if (loggedIn) {
            promises.push(getMyRoadmaps().then(d => setMyRoadmaps(d.roadmaps || [])).catch(() => { }))
        }
        Promise.all(promises).finally(() => setLoading(false))
    }, [loggedIn])

    async function handleGenerate(templateId) {
        if (!loggedIn) { window.location.href = '/login'; return }
        setGenerating(templateId)
        try {
            await generateRoadmap(templateId)
            const data = await getMyRoadmaps()
            setMyRoadmaps(data.roadmaps || [])
        } catch { }
        setGenerating(null)
    }

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
                        {loggedIn ? (
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-blue-600 text-white flex items-center justify-center font-bold">A</div>
                        ) : (
                            <Link to="/login" className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold">{isFr ? 'Connexion' : 'Sign In'}</Link>
                        )}
                    </div>
                </div>
            </header>

            <main className="flex-1 px-6 lg:px-20 py-8 max-w-[1280px] mx-auto w-full">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-10">
                    <div>
                        <h1 className="text-4xl font-black text-text-main tracking-tight">{isFr ? 'Mes Roadmaps' : 'My Roadmaps'}</h1>
                        <p className="text-secondary text-lg mt-1">{isFr ? 'Plans personnalisés étape par étape pour votre parcours.' : 'Personalized step-by-step plans for your journey.'}</p>
                    </div>
                </div>

                {loading && <p className="text-secondary mb-8">{isFr ? 'Chargement...' : 'Loading...'}</p>}

                {/* My Active Roadmaps */}
                {myRoadmaps.length > 0 && (
                    <>
                        <h2 className="text-xl font-bold text-text-main mb-4">{isFr ? 'Mes Plans Actifs' : 'My Active Plans'}</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                            {myRoadmaps.map((rm) => {
                                const steps = rm.steps_status || []
                                const completed = steps.filter(s => s.status === 'completed').length
                                const progress = steps.length > 0 ? Math.round((completed / steps.length) * 100) : 0
                                const nextStep = steps.find(s => s.status !== 'completed')
                                const templateName = rm.template?.name || ''
                                const countryCode = rm.template?.country_code || ''

                                return (
                                    <Link key={rm.id} to={`/roadmap/${rm.id}`} className="group bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-lg hover:border-primary/30 transition-all flex flex-col">
                                        <div className="flex justify-between items-start mb-4">
                                            <span className="text-4xl">{FLAG_EMOJI[countryCode] || '🗺️'}</span>
                                            <span className={`text-xs font-bold px-2 py-1 rounded-md ${rm.status === 'completed' ? 'bg-green-100 text-green-700' : progress > 60 ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'}`}>
                                                {rm.status === 'completed' ? '✅ ' : ''}{(rm.status || 'not_started').replace('_', ' ')}
                                            </span>
                                        </div>
                                        <h3 className="text-xl font-bold text-text-main mb-1 group-hover:text-primary transition-colors">{templateName}</h3>
                                        <div className="mt-auto space-y-4 pt-4">
                                            <div>
                                                <div className="flex justify-between text-sm mb-1.5">
                                                    <span className="text-secondary">{completed}/{steps.length} {isFr ? 'étapes' : 'steps'}</span>
                                                    <span className="font-bold text-primary">{progress}%</span>
                                                </div>
                                                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                                    <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${progress}%` }} />
                                                </div>
                                            </div>
                                            {nextStep && (
                                                <div className="pt-3 border-t border-gray-100">
                                                    <div className="flex items-center gap-2 text-sm text-secondary">
                                                        <span className="material-symbols-outlined text-lg text-orange-500">arrow_forward</span>
                                                        <span>{isFr ? 'Prochaine étape' : 'Next step'}: {nextStep.title}</span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </Link>
                                )
                            })}
                        </div>
                    </>
                )}

                {/* Available Templates */}
                <h2 className="text-xl font-bold text-text-main mb-4">{isFr ? 'Modèles Disponibles' : 'Available Templates'}</h2>
                <p className="text-secondary mb-6">{isFr ? 'Choisissez un modèle pour créer votre plan personnalisé.' : 'Pick a template to create your personalized plan.'}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {templates.map((t) => (
                        <div key={t.id} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-lg transition-all flex flex-col">
                            <div className="flex justify-between items-start mb-4">
                                <span className="text-4xl">{FLAG_EMOJI[t.country_code] || '🗺️'}</span>
                                <span className="text-xs font-medium text-secondary bg-gray-100 px-2 py-1 rounded-md">
                                    {t.total_steps} {isFr ? 'étapes' : 'steps'}
                                </span>
                            </div>
                            <h3 className="text-lg font-bold text-text-main mb-2">{t.name}</h3>
                            <p className="text-sm text-secondary mb-4">{t.pathway?.replace(/_/g, ' ')}</p>
                            <div className="mt-auto space-y-2 text-sm text-secondary">
                                {t.estimated_duration_weeks && (
                                    <div className="flex items-center gap-2">
                                        <span className="material-symbols-outlined text-lg text-primary">schedule</span>
                                        <span>~{t.estimated_duration_weeks} {isFr ? 'semaines' : 'weeks'}</span>
                                    </div>
                                )}
                            </div>
                            <button
                                onClick={() => handleGenerate(t.id)}
                                disabled={generating === t.id}
                                className="mt-4 w-full py-2.5 bg-primary text-white font-bold rounded-xl hover:bg-primary-hover transition-colors disabled:opacity-50"
                            >
                                {generating === t.id ? (isFr ? 'Création...' : 'Creating...') : (isFr ? 'Créer Mon Plan' : 'Create My Plan')}
                            </button>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    )
}
