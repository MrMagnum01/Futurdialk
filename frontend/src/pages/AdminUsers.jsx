/**
 * Admin User Management — Table of all users with role/status management.
 */
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation, LanguageSwitcher } from '../i18n'
import { getAdminUsers } from '../api'

export default function AdminUsers() {
    const { lang } = useTranslation()
    const isFr = lang === 'fr'
    const [users, setUsers] = useState([])
    const [search, setSearch] = useState('')
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        getAdminUsers().then(d => setUsers(d.users || [])).catch(() => { }).finally(() => setLoading(false))
    }, [])

    const filtered = users.filter(u =>
        !search || (u.email + ' ' + u.full_name).toLowerCase().includes(search.toLowerCase())
    )

    const roleBadge = (role) => {
        const c = { admin: 'bg-red-100 text-red-800', moderator: 'bg-yellow-100 text-yellow-800', student: 'bg-blue-100 text-blue-800' }
        return c[role] || 'bg-gray-100 text-gray-600'
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="sticky top-0 z-50 bg-white border-b border-gray-200 px-6 py-3 shadow-sm">
                <div className="max-w-[1200px] mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link to="/" className="flex items-center gap-2"><span className="material-symbols-outlined text-3xl text-primary">school</span><span className="text-xl font-bold">FuturDialk</span></Link>
                        <span className="text-gray-300">|</span>
                        <span className="text-sm font-bold text-red-600">ADMIN</span>
                    </div>
                    <div className="flex items-center gap-3"><LanguageSwitcher /><Link to="/admin" className="px-4 py-2 bg-gray-100 rounded-lg text-sm font-bold">{isFr ? '← Dashboard' : '← Dashboard'}</Link></div>
                </div>
            </header>

            <main className="max-w-[1200px] mx-auto px-4 py-8">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold">{isFr ? 'Gestion des utilisateurs' : 'User Management'}</h1>
                        <p className="text-sm text-secondary">{filtered.length} {isFr ? 'utilisateurs' : 'users'}</p>
                    </div>
                    <input value={search} onChange={e => setSearch(e.target.value)} className="px-4 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-primary w-72" placeholder={isFr ? 'Rechercher par nom ou email...' : 'Search by name or email...'} />
                </div>

                {loading ? (
                    <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div></div>
                ) : (
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                        <table className="w-full">
                            <thead><tr className="border-b bg-gray-50 text-xs font-bold text-secondary uppercase">
                                <th className="p-4 text-left">{isFr ? 'Utilisateur' : 'User'}</th>
                                <th className="p-4 text-left">Email</th>
                                <th className="p-4 text-left">{isFr ? 'Rôle' : 'Role'}</th>
                                <th className="p-4 text-left">{isFr ? 'Niveau' : 'Level'}</th>
                                <th className="p-4 text-left">{isFr ? 'Pays cibles' : 'Target Countries'}</th>
                                <th className="p-4 text-left">{isFr ? 'Statut' : 'Status'}</th>
                                <th className="p-4 text-left">{isFr ? 'Inscrit' : 'Joined'}</th>
                                <th className="p-4"></th>
                            </tr></thead>
                            <tbody>
                                {filtered.map(u => (
                                    <tr key={u.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                                        <td className="p-4 font-medium text-text-main">{u.full_name || '—'}</td>
                                        <td className="p-4 text-sm text-secondary">{u.email}</td>
                                        <td className="p-4"><span className={`px-2 py-1 text-xs font-bold rounded-full ${roleBadge(u.role)}`}>{u.role}</span></td>
                                        <td className="p-4 text-sm text-secondary capitalize">{u.current_level || '—'}</td>
                                        <td className="p-4 text-sm text-secondary">{(u.target_countries || []).join(', ') || '—'}</td>
                                        <td className="p-4">{u.is_active ? <span className="px-2 py-1 text-xs font-bold bg-green-100 text-green-800 rounded-full">{isFr ? 'Actif' : 'Active'}</span> : <span className="px-2 py-1 text-xs font-bold bg-red-100 text-red-800 rounded-full">{isFr ? 'Inactif' : 'Inactive'}</span>}</td>
                                        <td className="p-4 text-xs text-secondary">{u.created_at ? new Date(u.created_at).toLocaleDateString() : '—'}</td>
                                        <td className="p-4"><Link to={`/admin/users/${u.id}`} className="text-primary text-sm font-bold hover:underline">{isFr ? 'Voir' : 'View'}</Link></td>
                                    </tr>
                                ))}
                                {filtered.length === 0 && <tr><td colSpan={8} className="p-8 text-center text-secondary">{isFr ? 'Aucun utilisateur trouvé' : 'No users found'}</td></tr>}
                            </tbody>
                        </table>
                    </div>
                )}
            </main>
        </div>
    )
}
