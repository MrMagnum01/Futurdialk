/**
 * Generate Document — Step-by-step document generation wizard.
 */
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation, LanguageSwitcher } from '../i18n'
import { getDocumentTemplates } from '../api'

export default function GenerateDocument() {
    const { lang } = useTranslation()
    const isFr = lang === 'fr'
    const [templates, setTemplates] = useState([])
    const [selected, setSelected] = useState(null)
    const [step, setStep] = useState(1)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        getDocumentTemplates().then(d => setTemplates(d.templates || [])).catch(() => { }).finally(() => setLoading(false))
    }, [])

    return (
        <div className="min-h-screen bg-bg-light">
            <header className="sticky top-0 z-50 bg-white border-b border-gray-200 px-6 py-3 shadow-sm">
                <div className="max-w-[800px] mx-auto flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2"><span className="material-symbols-outlined text-3xl text-primary">school</span><span className="text-xl font-bold">Tawjihi</span></Link>
                    <Link to="/documents" className="px-4 py-2 bg-gray-100 rounded-lg text-sm font-bold">{isFr ? '← Mes documents' : '← My Documents'}</Link>
                </div>
            </header>
            <main className="max-w-[800px] mx-auto px-4 py-8 md:px-6">
                {/* Steps indicator */}
                <div className="flex items-center gap-2 mb-8">
                    {[1, 2, 3].map(s => (
                        <div key={s} className="flex items-center gap-2">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= s ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'}`}>{s}</div>
                            {s < 3 && <div className={`w-12 h-0.5 ${step > s ? 'bg-primary' : 'bg-gray-200'}`} />}
                        </div>
                    ))}
                </div>

                {step === 1 && (
                    <>
                        <h1 className="text-2xl font-bold mb-6">{isFr ? 'Choisir un modèle' : 'Choose a Template'}</h1>
                        {loading ? <p className="text-secondary">Loading...</p> : (
                            <div className="grid gap-3">
                                {templates.map(t => (
                                    <button key={t.id || t.name} onClick={() => { setSelected(t); setStep(2) }} className={`text-left p-5 rounded-xl border-2 bg-white hover:border-primary/30 hover:shadow-md transition-all ${selected?.name === t.name ? 'border-primary bg-primary/5' : 'border-gray-200'}`}>
                                        <p className="font-bold text-text-main">{t.name}</p>
                                        <p className="text-xs text-secondary mt-1">{t.description || t.category}</p>
                                    </button>
                                ))}
                                {templates.length === 0 && <p className="text-secondary text-center py-10">{isFr ? 'Aucun modèle disponible' : 'No templates available'}</p>}
                            </div>
                        )}
                    </>
                )}

                {step === 2 && (
                    <>
                        <h1 className="text-2xl font-bold mb-2">{isFr ? 'Remplir les informations' : 'Fill Information'}</h1>
                        <p className="text-secondary mb-6">{selected?.name}</p>
                        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm space-y-4">
                            <div><label className="text-sm font-bold block mb-1">{isFr ? 'Nom complet' : 'Full Name'}</label><input className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:border-primary" /></div>
                            <div><label className="text-sm font-bold block mb-1">{isFr ? 'Université / Programme' : 'University / Program'}</label><input className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:border-primary" /></div>
                            <div><label className="text-sm font-bold block mb-1">{isFr ? 'Contenu additionnel' : 'Additional Content'}</label><textarea className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:border-primary h-24 resize-none" /></div>
                        </div>
                        <div className="flex justify-between mt-6">
                            <button onClick={() => setStep(1)} className="px-6 py-3 bg-gray-100 rounded-xl font-bold text-sm">← {isFr ? 'Retour' : 'Back'}</button>
                            <button onClick={() => setStep(3)} className="px-6 py-3 bg-primary text-white rounded-xl font-bold text-sm">{isFr ? 'Aperçu →' : 'Preview →'}</button>
                        </div>
                    </>
                )}

                {step === 3 && (
                    <>
                        <h1 className="text-2xl font-bold mb-6">{isFr ? 'Aperçu et téléchargement' : 'Preview & Download'}</h1>
                        <div className="bg-white rounded-xl border border-gray-100 p-8 shadow-sm mb-6 min-h-[300px] flex items-center justify-center">
                            <div className="text-center">
                                <span className="material-symbols-outlined text-5xl text-gray-300 mb-3 block">description</span>
                                <p className="text-secondary">{isFr ? 'Aperçu du document (modèle: ' : 'Document preview (template: '}{selected?.name})</p>
                            </div>
                        </div>
                        <div className="flex justify-between">
                            <button onClick={() => setStep(2)} className="px-6 py-3 bg-gray-100 rounded-xl font-bold text-sm">← {isFr ? 'Modifier' : 'Edit'}</button>
                            <button className="px-6 py-3 bg-green-600 text-white rounded-xl font-bold text-sm hover:bg-green-700">
                                <span className="material-symbols-outlined text-sm mr-1 align-text-bottom">download</span>{isFr ? 'Télécharger PDF' : 'Download PDF'}
                            </button>
                        </div>
                    </>
                )}
            </main>
        </div>
    )
}
