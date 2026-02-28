/**
 * Roadmap Detail — Shows all steps for a user's roadmap with status tracking.
 */
import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useTranslation, LanguageSwitcher } from '../i18n'
import { getRoadmap, updateRoadmapStep, isAuthenticated } from '../api'

const STATUS_STYLES = {
    completed: { bg: 'bg-green-100', text: 'text-green-800', icon: 'check_circle', dot: 'bg-green-500' },
    in_progress: { bg: 'bg-blue-100', text: 'text-blue-800', icon: 'pending', dot: 'bg-blue-500' },
    blocked: { bg: 'bg-red-100', text: 'text-red-800', icon: 'block', dot: 'bg-red-500' },
    pending: { bg: 'bg-gray-100', text: 'text-gray-600', icon: 'radio_button_unchecked', dot: 'bg-gray-300' },
}

export default function RoadmapDetail() {
    const { id } = useParams()
    const { lang } = useTranslation()
    const isFr = lang === 'fr'
    const [roadmap, setRoadmap] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!isAuthenticated()) { window.location.href = '/login'; return }
        getRoadmap(id).then(setRoadmap).catch(() => { }).finally(() => setLoading(false))
    }, [id])

    const handleStatusChange = async (stepIdx, newStatus) => {
        try {
            await updateRoadmapStep(id, stepIdx, newStatus)
            const updated = await getRoadmap(id)
            setRoadmap(updated)
        } catch { }
    }

    if (loading) return <div className="min-h-screen bg-bg-light flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div></div>
    if (!roadmap) return <div className="min-h-screen bg-bg-light flex flex-col items-center justify-center gap-4"><span className="material-symbols-outlined text-6xl text-gray-300">error</span><p className="text-secondary">{isFr ? 'Roadmap non trouvée' : 'Roadmap not found'}</p><Link to="/roadmap" className="text-primary font-bold">{isFr ? '← Retour' : '← Back'}</Link></div>

    const steps = roadmap.steps_status || []
    const completed = steps.filter(s => s.status === 'completed').length
    const progress = steps.length > 0 ? Math.round((completed / steps.length) * 100) : 0

    return (
        <div className="min-h-screen bg-bg-light">
            <header className="sticky top-0 z-50 bg-white border-b border-gray-200 px-6 py-3 shadow-sm">
                <div className="max-w-[900px] mx-auto flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2"><span className="material-symbols-outlined text-3xl text-primary">school</span><span className="text-xl font-bold text-text-main">FuturDialk</span></Link>
                    <div className="flex items-center gap-3">
                        <LanguageSwitcher />
                        <Link to="/roadmap" className="px-4 py-2 bg-gray-100 rounded-lg text-sm font-bold hover:bg-gray-200">{isFr ? '← Mes roadmaps' : '← My Roadmaps'}</Link>
                    </div>
                </div>
            </header>

            <main className="max-w-[900px] mx-auto px-4 py-8 md:px-6">
                {/* Header */}
                <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-8 mb-8">
                    <h1 className="text-3xl font-bold text-text-main mb-2">{roadmap.template_name || (isFr ? 'Ma Roadmap' : 'My Roadmap')}</h1>
                    <p className="text-secondary mb-4">{roadmap.target_date ? `${isFr ? 'Date cible' : 'Target'}: ${roadmap.target_date}` : ''}</p>
                    {/* Progress bar */}
                    <div className="flex items-center gap-4">
                        <div className="flex-1 h-3 bg-white rounded-full overflow-hidden shadow-inner">
                            <div className="h-full bg-gradient-to-r from-primary to-green-500 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
                        </div>
                        <span className="font-bold text-text-main text-lg">{progress}%</span>
                    </div>
                    <p className="text-sm text-secondary mt-2">{completed}/{steps.length} {isFr ? 'étapes complétées' : 'steps completed'}</p>
                </div>

                {/* Timeline */}
                <div className="relative">
                    {/* Vertical line */}
                    <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200" />

                    <div className="space-y-1">
                        {steps.map((step, idx) => {
                            const s = STATUS_STYLES[step.status] || STATUS_STYLES.pending
                            return (
                                <div key={idx} className="relative pl-16 pb-6">
                                    {/* Dot */}
                                    <div className={`absolute left-4 top-2 w-5 h-5 rounded-full ${s.dot} ring-4 ring-white z-10`} />

                                    <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow">
                                        <div className="flex items-start justify-between mb-2">
                                            <div>
                                                <p className="text-xs text-secondary font-medium mb-1">{isFr ? 'Étape' : 'Step'} {idx + 1}</p>
                                                <h3 className="font-bold text-text-main">{step.title || `${isFr ? 'Étape' : 'Step'} ${idx + 1}`}</h3>
                                            </div>
                                            <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${s.bg} ${s.text} flex items-center gap-1`}>
                                                <span className="material-symbols-outlined text-sm">{s.icon}</span>
                                                {step.status}
                                            </span>
                                        </div>

                                        {step.notes && <p className="text-sm text-secondary mb-3">{step.notes}</p>}

                                        {/* Status buttons */}
                                        <div className="flex gap-2 mt-3">
                                            {step.status !== 'completed' && (
                                                <button onClick={() => handleStatusChange(idx, 'completed')} className="px-3 py-1.5 text-xs font-bold bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors flex items-center gap-1">
                                                    <span className="material-symbols-outlined text-sm">check</span>{isFr ? 'Terminé' : 'Done'}
                                                </button>
                                            )}
                                            {step.status !== 'in_progress' && step.status !== 'completed' && (
                                                <button onClick={() => handleStatusChange(idx, 'in_progress')} className="px-3 py-1.5 text-xs font-bold bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors flex items-center gap-1">
                                                    <span className="material-symbols-outlined text-sm">play_arrow</span>{isFr ? 'En cours' : 'Start'}
                                                </button>
                                            )}
                                            <Link to={`/roadmap/${id}/step/${idx}`} className="px-3 py-1.5 text-xs font-bold bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-1">
                                                <span className="material-symbols-outlined text-sm">open_in_new</span>{isFr ? 'Détails' : 'Details'}
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </main>
        </div>
    )
}
