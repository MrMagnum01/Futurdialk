/**
 * Step Detail — Detailed view of a single roadmap step with document upload.
 */
import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useTranslation, LanguageSwitcher } from '../i18n'
import { getRoadmap, updateRoadmapStep, isAuthenticated } from '../api'

export default function StepDetail() {
    const { id, stepId } = useParams()
    const { lang } = useTranslation()
    const isFr = lang === 'fr'
    const [roadmap, setRoadmap] = useState(null)
    const [step, setStep] = useState(null)
    const [notes, setNotes] = useState('')
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!isAuthenticated()) { window.location.href = '/login'; return }
        getRoadmap(id).then(rm => {
            setRoadmap(rm)
            const s = (rm.steps_status || [])[parseInt(stepId)] || {}
            setStep(s)
            setNotes(s.notes || '')
        }).catch(() => { }).finally(() => setLoading(false))
    }, [id, stepId])

    const saveNotes = async () => {
        try {
            await updateRoadmapStep(id, parseInt(stepId), step.status || 'pending', notes)
            const updated = await getRoadmap(id)
            setRoadmap(updated)
            setStep((updated.steps_status || [])[parseInt(stepId)] || {})
        } catch { }
    }

    const setStatus = async (status) => {
        try {
            await updateRoadmapStep(id, parseInt(stepId), status, notes)
            const updated = await getRoadmap(id)
            setRoadmap(updated)
            setStep((updated.steps_status || [])[parseInt(stepId)] || {})
        } catch { }
    }

    if (loading) return <div className="min-h-screen bg-bg-light flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div></div>

    const stepNum = parseInt(stepId) + 1

    return (
        <div className="min-h-screen bg-bg-light">
            <header className="sticky top-0 z-50 bg-white border-b border-gray-200 px-6 py-3 shadow-sm">
                <div className="max-w-[800px] mx-auto flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2"><span className="material-symbols-outlined text-3xl text-primary">school</span><span className="text-xl font-bold text-text-main">Tawjihi</span></Link>
                    <div className="flex items-center gap-3">
                        <LanguageSwitcher />
                        <Link to={`/roadmap/${id}`} className="px-4 py-2 bg-gray-100 rounded-lg text-sm font-bold hover:bg-gray-200">{isFr ? '← Roadmap' : '← Roadmap'}</Link>
                    </div>
                </div>
            </header>

            <main className="max-w-[800px] mx-auto px-4 py-8 md:px-6 space-y-6">
                {/* Header */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8">
                    <p className="text-xs font-bold text-primary uppercase mb-2">{isFr ? 'Étape' : 'Step'} {stepNum}</p>
                    <h1 className="text-2xl md:text-3xl font-bold text-text-main">{step?.title || `${isFr ? 'Étape' : 'Step'} ${stepNum}`}</h1>
                    <div className="flex gap-2 mt-4">
                        {['pending', 'in_progress', 'completed', 'blocked'].map(s => (
                            <button key={s} onClick={() => setStatus(s)}
                                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors capitalize ${step?.status === s ? 'bg-primary text-white' : 'bg-white text-secondary border border-gray-200 hover:border-primary hover:text-primary'}`}
                            >{s.replace('_', ' ')}</button>
                        ))}
                    </div>
                </div>

                {/* Notes */}
                <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                    <h2 className="text-lg font-bold text-text-main mb-4 flex items-center gap-2">
                        <span className="material-symbols-outlined text-orange-500">edit_note</span>
                        {isFr ? 'Notes' : 'Notes'}
                    </h2>
                    <textarea
                        value={notes}
                        onChange={e => setNotes(e.target.value)}
                        className="w-full h-32 p-4 border border-gray-200 rounded-xl text-sm text-text-main focus:ring-2 focus:ring-primary focus:border-transparent resize-none outline-none"
                        placeholder={isFr ? 'Ajoutez des notes pour cette étape...' : 'Add notes for this step...'}
                    />
                    <button onClick={saveNotes} className="mt-3 px-6 py-2 bg-primary hover:bg-primary-hover text-white font-bold rounded-lg transition-colors text-sm">
                        <span className="material-symbols-outlined text-sm mr-1 align-text-bottom">save</span>
                        {isFr ? 'Sauvegarder' : 'Save Notes'}
                    </button>
                </div>

                {/* Document Upload */}
                <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                    <h2 className="text-lg font-bold text-text-main mb-4 flex items-center gap-2">
                        <span className="material-symbols-outlined text-blue-500">upload_file</span>
                        {isFr ? 'Documents' : 'Documents'}
                    </h2>
                    <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
                        <span className="material-symbols-outlined text-4xl text-gray-300 mb-3 block">cloud_upload</span>
                        <p className="text-sm text-secondary mb-1">{isFr ? 'Glissez-déposez vos fichiers ici' : 'Drag & drop files here'}</p>
                        <p className="text-xs text-gray-400">{isFr ? 'PDF, JPG, PNG — Max 10 MB' : 'PDF, JPG, PNG — Max 10 MB'}</p>
                    </div>
                </div>

                {/* Tips */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-100 p-6">
                    <h3 className="font-bold text-green-800 mb-3 flex items-center gap-2">
                        <span className="material-symbols-outlined text-green-600">lightbulb</span>
                        {isFr ? 'Conseils pour cette étape' : 'Tips for this step'}
                    </h3>
                    <ul className="space-y-2 text-sm text-green-700">
                        <li className="flex items-start gap-2"><span className="material-symbols-outlined text-green-500 text-sm mt-0.5">check</span>{isFr ? 'Vérifiez les délais avant de commencer' : 'Check deadlines before starting'}</li>
                        <li className="flex items-start gap-2"><span className="material-symbols-outlined text-green-500 text-sm mt-0.5">check</span>{isFr ? 'Gardez une copie de chaque document' : 'Keep a copy of every document'}</li>
                        <li className="flex items-start gap-2"><span className="material-symbols-outlined text-green-500 text-sm mt-0.5">check</span>{isFr ? 'Contactez la communauté si besoin' : 'Reach out to the community if needed'}</li>
                    </ul>
                </div>
            </main>
        </div>
    )
}
