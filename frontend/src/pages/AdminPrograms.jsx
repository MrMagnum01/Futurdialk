/**
 * Manage Programs — CRUD table for programs.
 */
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation, LanguageSwitcher } from '../i18n'
import { getPrograms } from '../api'

export default function AdminPrograms() {
    const { lang } = useTranslation()
    const isFr = lang === 'fr'
    const [programs, setPrograms] = useState([])
    const [search, setSearch] = useState('')
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)

    useEffect(() => { getPrograms({ per_page: 200 }).then(d => setPrograms(d.programs || [])).catch(() => { }).finally(() => setLoading(false)) }, [])

    const filtered = programs.filter(p => !search || p.name.toLowerCase().includes(search.toLowerCase()))

    return (
        <div className="min-h-screen bg-gray-50">
            <AdminHeader />
            <main className="max-w-[1200px] mx-auto px-4 py-8">
                <div className="flex items-center justify-between mb-6">
                    <div><h1 className="text-2xl font-bold">{isFr ? 'Gérer les programmes' : 'Manage Programs'}</h1><p className="text-sm text-secondary">{programs.length} {isFr ? 'programmes' : 'programs'}</p></div>
                    <div className="flex gap-3">
                        <input value={search} onChange={e => setSearch(e.target.value)} className="px-4 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-primary w-60" placeholder={isFr ? 'Rechercher...' : 'Search...'} />
                        <button onClick={() => setShowForm(!showForm)} className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold">+ {isFr ? 'Ajouter' : 'Add'}</button>
                    </div>
                </div>

                {showForm && (
                    <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm mb-6">
                        <h2 className="font-bold mb-4">{isFr ? 'Nouveau programme' : 'New Program'}</h2>
                        <div className="grid md:grid-cols-3 gap-4">
                            <div><label className="text-xs font-bold block mb-1">{isFr ? 'Nom' : 'Name'}</label><input className="w-full p-2 border border-gray-200 rounded-lg text-sm" /></div>
                            <div><label className="text-xs font-bold block mb-1">{isFr ? 'Diplôme' : 'Degree'}</label><select className="w-full p-2 border border-gray-200 rounded-lg text-sm">
                                {['licence', 'master', 'phd', 'dut', 'bts', 'cpge', 'diplome_ingenieur', 'mba', 'certificate'].map(t => <option key={t} value={t}>{t.replace(/_/g, ' ')}</option>)}
                            </select></div>
                            <div><label className="text-xs font-bold block mb-1">{isFr ? 'Domaine' : 'Field'}</label><input className="w-full p-2 border border-gray-200 rounded-lg text-sm" /></div>
                            <div><label className="text-xs font-bold block mb-1">{isFr ? 'Langue' : 'Language'}</label><select className="w-full p-2 border border-gray-200 rounded-lg text-sm"><option value="fr">FR</option><option value="en">EN</option><option value="de">DE</option></select></div>
                            <div><label className="text-xs font-bold block mb-1">{isFr ? 'Durée (mois)' : 'Duration (months)'}</label><input type="number" className="w-full p-2 border border-gray-200 rounded-lg text-sm" /></div>
                        </div>
                        <button className="mt-4 px-6 py-2 bg-primary text-white rounded-lg text-sm font-bold">{isFr ? 'Enregistrer' : 'Save'}</button>
                    </div>
                )}

                {loading ? <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div></div> : (
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                        <table className="w-full">
                            <thead><tr className="border-b bg-gray-50 text-xs font-bold text-secondary uppercase">
                                <th className="p-4 text-left">{isFr ? 'Programme' : 'Program'}</th>
                                <th className="p-4 text-left">{isFr ? 'École' : 'School'}</th>
                                <th className="p-4 text-left">{isFr ? 'Diplôme' : 'Degree'}</th>
                                <th className="p-4 text-left">{isFr ? 'Domaine' : 'Field'}</th>
                                <th className="p-4 text-left">{isFr ? 'Durée' : 'Duration'}</th>
                                <th className="p-4"></th>
                            </tr></thead>
                            <tbody>{filtered.map(p => (
                                <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                                    <td className="p-4 font-medium">{p.name}</td>
                                    <td className="p-4 text-sm text-secondary">{p.school?.name || '—'}</td>
                                    <td className="p-4 text-sm capitalize">{(p.degree_type || '—').replace(/_/g, ' ')}</td>
                                    <td className="p-4 text-sm text-secondary">{p.field_of_study || p.field_category || '—'}</td>
                                    <td className="p-4 text-sm text-secondary">{p.duration_months ? `${p.duration_months}m` : '—'}</td>
                                    <td className="p-4 flex gap-2">
                                        <button className="text-primary text-sm font-bold hover:underline">{isFr ? 'Modifier' : 'Edit'}</button>
                                        <button className="text-red-500 text-sm font-bold hover:underline">{isFr ? 'Supprimer' : 'Delete'}</button>
                                    </td>
                                </tr>
                            ))}{filtered.length === 0 && <tr><td colSpan={6} className="p-8 text-center text-secondary">{isFr ? 'Aucun programme' : 'No programs'}</td></tr>}</tbody>
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
