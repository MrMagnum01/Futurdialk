/**
 * Manage Roadmaps — CRUD for roadmap templates.
 */
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation, LanguageSwitcher } from '../i18n'
import { apiFetch } from '../api'

const FLAG = { FR: '🇫🇷', CA: '🇨🇦', DE: '🇩🇪', UK: '🇬🇧', ES: '🇪🇸', MA: '🇲🇦' }

export default function AdminRoadmaps() {
    const { lang } = useTranslation()
    const isFr = lang === 'fr'
    const [templates, setTemplates] = useState([])
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)

    useEffect(() => { apiFetch('/api/roadmap/templates').then(r => r.json()).then(d => setTemplates(d.templates || [])).catch(() => { }).finally(() => setLoading(false)) }, [])

    return (
        <div className="min-h-screen bg-gray-50">
            <AdminHeader />
            <main className="max-w-[1200px] mx-auto px-4 py-8">
                <div className="flex items-center justify-between mb-6">
                    <div><h1 className="text-2xl font-bold">{isFr ? 'Gérer les roadmaps' : 'Manage Roadmaps'}</h1><p className="text-sm text-secondary">{templates.length} {isFr ? 'modèles' : 'templates'}</p></div>
                    <button onClick={() => setShowForm(!showForm)} className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold">+ {isFr ? 'Ajouter' : 'Add'}</button>
                </div>

                {showForm && (
                    <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm mb-6">
                        <h2 className="font-bold mb-4">{isFr ? 'Nouveau modèle' : 'New Template'}</h2>
                        <div className="grid md:grid-cols-3 gap-4">
                            <div><label className="text-xs font-bold block mb-1">{isFr ? 'Nom' : 'Name'}</label><input className="w-full p-2 border border-gray-200 rounded-lg text-sm" /></div>
                            <div><label className="text-xs font-bold block mb-1">{isFr ? 'Pays' : 'Country'}</label><select className="w-full p-2 border border-gray-200 rounded-lg text-sm">{Object.keys(FLAG).map(c => <option key={c} value={c}>{FLAG[c]} {c}</option>)}</select></div>
                            <div><label className="text-xs font-bold block mb-1">{isFr ? 'Parcours' : 'Pathway'}</label><input className="w-full p-2 border border-gray-200 rounded-lg text-sm" placeholder="campus_france, direct_apply..." /></div>
                            <div><label className="text-xs font-bold block mb-1">{isFr ? 'Étapes' : 'Steps'}</label><input type="number" className="w-full p-2 border border-gray-200 rounded-lg text-sm" /></div>
                            <div><label className="text-xs font-bold block mb-1">{isFr ? 'Durée (semaines)' : 'Duration (weeks)'}</label><input type="number" className="w-full p-2 border border-gray-200 rounded-lg text-sm" /></div>
                        </div>
                        <button className="mt-4 px-6 py-2 bg-primary text-white rounded-lg text-sm font-bold">{isFr ? 'Enregistrer' : 'Save'}</button>
                    </div>
                )}

                {loading ? <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div></div> : (
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                        <table className="w-full">
                            <thead><tr className="border-b bg-gray-50 text-xs font-bold text-secondary uppercase">
                                <th className="p-4 text-left">{isFr ? 'Nom' : 'Name'}</th>
                                <th className="p-4 text-left">{isFr ? 'Pays' : 'Country'}</th>
                                <th className="p-4 text-left">{isFr ? 'Parcours' : 'Pathway'}</th>
                                <th className="p-4 text-left">{isFr ? 'Étapes' : 'Steps'}</th>
                                <th className="p-4 text-left">{isFr ? 'Durée' : 'Duration'}</th>
                                <th className="p-4"></th>
                            </tr></thead>
                            <tbody>{templates.map(t => (
                                <tr key={t.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                                    <td className="p-4 font-medium">{t.name}</td>
                                    <td className="p-4 text-sm">{FLAG[t.country_code] || ''} {t.country_code}</td>
                                    <td className="p-4 text-sm text-secondary capitalize">{(t.pathway || '—').replace(/_/g, ' ')}</td>
                                    <td className="p-4 text-sm text-secondary">{t.total_steps || '—'}</td>
                                    <td className="p-4 text-sm text-secondary">{t.estimated_duration_weeks ? `${t.estimated_duration_weeks}w` : '—'}</td>
                                    <td className="p-4 flex gap-2">
                                        <button className="text-primary text-sm font-bold hover:underline">{isFr ? 'Modifier' : 'Edit'}</button>
                                        <button className="text-red-500 text-sm font-bold hover:underline">{isFr ? 'Supprimer' : 'Delete'}</button>
                                    </td>
                                </tr>
                            ))}{templates.length === 0 && <tr><td colSpan={6} className="p-8 text-center text-secondary">{isFr ? 'Aucun modèle' : 'No templates'}</td></tr>}</tbody>
                        </table>
                    </div>
                )}
            </main>
        </div>
    )
}

function AdminHeader() {
    return (
        <header className="sticky top-0 z-50 bg-white border-b border-gray-200 px-6 py-3 shadow-sm">
            <div className="max-w-[1200px] mx-auto flex items-center justify-between">
                <div className="flex items-center gap-4"><Link to="/" className="flex items-center gap-2"><span className="material-symbols-outlined text-3xl text-primary">school</span><span className="text-xl font-bold">FuturDialk</span></Link><span className="text-gray-300">|</span><span className="text-sm font-bold text-red-600">ADMIN</span></div>
                <Link to="/admin" className="px-4 py-2 bg-gray-100 rounded-lg text-sm font-bold">← Dashboard</Link>
            </div>
        </header>
    )
}
