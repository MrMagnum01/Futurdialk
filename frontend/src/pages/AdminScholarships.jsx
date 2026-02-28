/**
 * Manage Scholarships — CRUD table for scholarships.
 */
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation, LanguageSwitcher } from '../i18n'
import { apiFetch } from '../api'

const FLAG = { FR: '🇫🇷', CA: '🇨🇦', DE: '🇩🇪', UK: '🇬🇧', ES: '🇪🇸', MA: '🇲🇦' }

export default function AdminScholarships() {
    const { lang } = useTranslation()
    const isFr = lang === 'fr'
    const [scholarships, setScholarships] = useState([])
    const [search, setSearch] = useState('')
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)

    useEffect(() => { apiFetch('/api/scholarships?per_page=100').then(r => r.json()).then(d => setScholarships(d.scholarships || [])).catch(() => { }).finally(() => setLoading(false)) }, [])

    const filtered = scholarships.filter(s => !search || s.name.toLowerCase().includes(search.toLowerCase()))
    const compBadge = c => ({ low: 'bg-green-100 text-green-800', medium: 'bg-yellow-100 text-yellow-800', high: 'bg-orange-100 text-orange-800', very_high: 'bg-red-100 text-red-800' }[c] || 'bg-gray-100')

    return (
        <div className="min-h-screen bg-gray-50">
            <AdminHeader />
            <main className="max-w-[1200px] mx-auto px-4 py-8">
                <div className="flex items-center justify-between mb-6">
                    <div><h1 className="text-2xl font-bold">{isFr ? 'Gérer les bourses' : 'Manage Scholarships'}</h1><p className="text-sm text-secondary">{scholarships.length} {isFr ? 'bourses' : 'scholarships'}</p></div>
                    <div className="flex gap-3">
                        <input value={search} onChange={e => setSearch(e.target.value)} className="px-4 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-primary w-60" placeholder={isFr ? 'Rechercher...' : 'Search...'} />
                        <button onClick={() => setShowForm(!showForm)} className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold">+ {isFr ? 'Ajouter' : 'Add'}</button>
                    </div>
                </div>

                {showForm && (
                    <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm mb-6">
                        <h2 className="font-bold mb-4">{isFr ? 'Nouvelle bourse' : 'New Scholarship'}</h2>
                        <div className="grid md:grid-cols-3 gap-4">
                            <div><label className="text-xs font-bold block mb-1">{isFr ? 'Nom' : 'Name'}</label><input className="w-full p-2 border border-gray-200 rounded-lg text-sm" /></div>
                            <div><label className="text-xs font-bold block mb-1">{isFr ? 'Fournisseur' : 'Provider'}</label><input className="w-full p-2 border border-gray-200 rounded-lg text-sm" /></div>
                            <div><label className="text-xs font-bold block mb-1">{isFr ? 'Pays' : 'Country'}</label><select className="w-full p-2 border border-gray-200 rounded-lg text-sm">{Object.keys(FLAG).map(c => <option key={c} value={c}>{FLAG[c]} {c}</option>)}</select></div>
                            <div><label className="text-xs font-bold block mb-1">{isFr ? 'Date limite' : 'Deadline'}</label><input className="w-full p-2 border border-gray-200 rounded-lg text-sm" placeholder="Mars 2026" /></div>
                            <div><label className="text-xs font-bold block mb-1">{isFr ? 'URL' : 'URL'}</label><input className="w-full p-2 border border-gray-200 rounded-lg text-sm" /></div>
                        </div>
                        <button className="mt-4 px-6 py-2 bg-primary text-white rounded-lg text-sm font-bold">{isFr ? 'Enregistrer' : 'Save'}</button>
                    </div>
                )}

                {loading ? <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div></div> : (
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                        <table className="w-full">
                            <thead><tr className="border-b bg-gray-50 text-xs font-bold text-secondary uppercase">
                                <th className="p-4 text-left">{isFr ? 'Bourse' : 'Scholarship'}</th>
                                <th className="p-4 text-left">{isFr ? 'Fournisseur' : 'Provider'}</th>
                                <th className="p-4 text-left">{isFr ? 'Pays' : 'Country'}</th>
                                <th className="p-4 text-left">{isFr ? 'Date limite' : 'Deadline'}</th>
                                <th className="p-4 text-left">{isFr ? 'Compétitivité' : 'Competitiveness'}</th>
                                <th className="p-4 text-left">{isFr ? 'Statut' : 'Status'}</th>
                                <th className="p-4"></th>
                            </tr></thead>
                            <tbody>{filtered.map(s => (
                                <tr key={s.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                                    <td className="p-4 font-medium">{s.name}</td>
                                    <td className="p-4 text-sm text-secondary">{s.provider || '—'}</td>
                                    <td className="p-4 text-sm">{FLAG[s.country_code] || ''} {s.country_code}</td>
                                    <td className="p-4 text-sm text-secondary">{s.application_deadline || '—'}</td>
                                    <td className="p-4"><span className={`px-2 py-0.5 text-xs font-bold rounded-full capitalize ${compBadge(s.competitiveness)}`}>{(s.competitiveness || '—').replace(/_/g, ' ')}</span></td>
                                    <td className="p-4">{s.is_active ? <span className="px-2 py-0.5 text-xs font-bold bg-green-100 text-green-800 rounded-full">{isFr ? 'Actif' : 'Active'}</span> : <span className="px-2 py-0.5 text-xs font-bold bg-gray-200 text-gray-600 rounded-full">{isFr ? 'Inactif' : 'Inactive'}</span>}</td>
                                    <td className="p-4 flex gap-2">
                                        <button className="text-primary text-sm font-bold hover:underline">{isFr ? 'Modifier' : 'Edit'}</button>
                                        <button className="text-red-500 text-sm font-bold hover:underline">{isFr ? 'Supprimer' : 'Delete'}</button>
                                    </td>
                                </tr>
                            ))}{filtered.length === 0 && <tr><td colSpan={7} className="p-8 text-center text-secondary">{isFr ? 'Aucune bourse' : 'No scholarships'}</td></tr>}</tbody>
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
                <div className="flex items-center gap-4"><Link to="/" className="flex items-center gap-2"><span className="material-symbols-outlined text-3xl text-primary">school</span><span className="text-xl font-bold">Tawjihi</span></Link><span className="text-gray-300">|</span><span className="text-sm font-bold text-red-600">ADMIN</span></div>
                <Link to="/admin" className="px-4 py-2 bg-gray-100 rounded-lg text-sm font-bold">← Dashboard</Link>
            </div>
        </header>
    )
}
