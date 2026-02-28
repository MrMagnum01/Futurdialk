/**
 * Manage Schools — CRUD table for schools.
 */
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation, LanguageSwitcher } from '../i18n'
import { apiFetch } from '../api'

const FLAG = { FR: '🇫🇷', CA: '🇨🇦', DE: '🇩🇪', UK: '🇬🇧', ES: '🇪🇸', MA: '🇲🇦' }

export default function AdminSchools() {
    const { lang } = useTranslation()
    const isFr = lang === 'fr'
    const [schools, setSchools] = useState([])
    const [search, setSearch] = useState('')
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [form, setForm] = useState({ name: '', country_code: 'FR', city: '', type: 'university', is_public: true })

    useEffect(() => {
        apiFetch('/api/explore/schools?per_page=100').then(r => r.json()).then(d => setSchools(d.schools || [])).catch(() => { }).finally(() => setLoading(false))
    }, [])

    const filtered = schools.filter(s => !search || s.name.toLowerCase().includes(search.toLowerCase()))

    return (
        <div className="min-h-screen bg-gray-50">
            <AdminHeader />
            <main className="max-w-[1200px] mx-auto px-4 py-8">
                <div className="flex items-center justify-between mb-6">
                    <div><h1 className="text-2xl font-bold">{isFr ? 'Gérer les écoles' : 'Manage Schools'}</h1><p className="text-sm text-secondary">{schools.length} {isFr ? 'écoles' : 'schools'}</p></div>
                    <div className="flex gap-3">
                        <input value={search} onChange={e => setSearch(e.target.value)} className="px-4 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-primary w-60" placeholder={isFr ? 'Rechercher...' : 'Search...'} />
                        <button onClick={() => setShowForm(!showForm)} className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold">+ {isFr ? 'Ajouter' : 'Add'}</button>
                    </div>
                </div>

                {showForm && (
                    <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm mb-6">
                        <h2 className="font-bold mb-4">{isFr ? 'Nouvelle école' : 'New School'}</h2>
                        <div className="grid md:grid-cols-3 gap-4">
                            <div><label className="text-xs font-bold block mb-1">{isFr ? 'Nom' : 'Name'}</label><input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full p-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-primary" /></div>
                            <div><label className="text-xs font-bold block mb-1">{isFr ? 'Pays' : 'Country'}</label><select value={form.country_code} onChange={e => setForm({ ...form, country_code: e.target.value })} className="w-full p-2 border border-gray-200 rounded-lg text-sm">
                                {Object.keys(FLAG).map(c => <option key={c} value={c}>{FLAG[c]} {c}</option>)}
                            </select></div>
                            <div><label className="text-xs font-bold block mb-1">{isFr ? 'Ville' : 'City'}</label><input value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} className="w-full p-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-primary" /></div>
                            <div><label className="text-xs font-bold block mb-1">Type</label><select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} className="w-full p-2 border border-gray-200 rounded-lg text-sm">
                                {['university', 'grande_ecole', 'community_college', 'language_school', 'prep_school'].map(t => <option key={t} value={t}>{t.replace(/_/g, ' ')}</option>)}
                            </select></div>
                        </div>
                        <button className="mt-4 px-6 py-2 bg-primary text-white rounded-lg text-sm font-bold">{isFr ? 'Enregistrer' : 'Save'}</button>
                    </div>
                )}

                {loading ? <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div></div> : (
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                        <table className="w-full">
                            <thead><tr className="border-b bg-gray-50 text-xs font-bold text-secondary uppercase">
                                <th className="p-4 text-left">{isFr ? 'École' : 'School'}</th>
                                <th className="p-4 text-left">{isFr ? 'Pays' : 'Country'}</th>
                                <th className="p-4 text-left">{isFr ? 'Ville' : 'City'}</th>
                                <th className="p-4 text-left">Type</th>
                                <th className="p-4 text-left">{isFr ? 'Classement' : 'Ranking'}</th>
                                <th className="p-4 text-left">{isFr ? 'Programmes' : 'Programs'}</th>
                                <th className="p-4"></th>
                            </tr></thead>
                            <tbody>{filtered.map(s => (
                                <tr key={s.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                                    <td className="p-4 font-medium">{s.name}</td>
                                    <td className="p-4 text-sm">{FLAG[s.country_code] || ''} {s.country_code}</td>
                                    <td className="p-4 text-sm text-secondary">{s.city || '—'}</td>
                                    <td className="p-4 text-sm text-secondary capitalize">{(s.type || '—').replace(/_/g, ' ')}</td>
                                    <td className="p-4 text-sm text-secondary">{s.ranking_world ? `#${s.ranking_world}` : '—'}</td>
                                    <td className="p-4 text-sm text-secondary">{s.program_count || '—'}</td>
                                    <td className="p-4 flex gap-2">
                                        <button className="text-primary text-sm font-bold hover:underline">{isFr ? 'Modifier' : 'Edit'}</button>
                                        <button className="text-red-500 text-sm font-bold hover:underline">{isFr ? 'Supprimer' : 'Delete'}</button>
                                    </td>
                                </tr>
                            ))}{filtered.length === 0 && <tr><td colSpan={7} className="p-8 text-center text-secondary">{isFr ? 'Aucune école' : 'No schools'}</td></tr>}</tbody>
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
