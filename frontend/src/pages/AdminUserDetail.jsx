/**
 * Admin User Detail — View and manage a single user.
 */
import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useTranslation, LanguageSwitcher } from '../i18n'
import { apiFetch } from '../api'

async function getAdminUser(userId) {
    const res = await apiFetch(`/api/admin/users/${userId}`);
    return res.json();
}

export default function AdminUserDetail() {
    const { id } = useParams()
    const { lang } = useTranslation()
    const isFr = lang === 'fr'
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        getAdminUser(id).then(setUser).catch(() => { }).finally(() => setLoading(false))
    }, [id])

    if (loading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div></div>
    if (!user || user.error) return <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4"><span className="material-symbols-outlined text-6xl text-gray-300">error</span><p className="text-secondary">{isFr ? 'Utilisateur non trouvé' : 'User not found'}</p><Link to="/admin/users" className="text-primary font-bold">{isFr ? '← Retour' : '← Back'}</Link></div>

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="sticky top-0 z-50 bg-white border-b border-gray-200 px-6 py-3 shadow-sm">
                <div className="max-w-[900px] mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link to="/" className="flex items-center gap-2"><span className="material-symbols-outlined text-3xl text-primary">school</span><span className="text-xl font-bold">FuturDialk</span></Link>
                        <span className="text-gray-300">|</span><span className="text-sm font-bold text-red-600">ADMIN</span>
                    </div>
                    <Link to="/admin/users" className="px-4 py-2 bg-gray-100 rounded-lg text-sm font-bold">{isFr ? '← Utilisateurs' : '← Users'}</Link>
                </div>
            </header>

            <main className="max-w-[900px] mx-auto px-4 py-8">
                {/* Profile header */}
                <div className="bg-white rounded-xl border border-gray-100 p-8 shadow-sm mb-6">
                    <div className="flex items-center gap-6">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-blue-600 text-white flex items-center justify-center text-3xl font-bold">
                            {(user.full_name || user.email || '?').charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1">
                            <h1 className="text-2xl font-bold">{user.full_name || 'User'}</h1>
                            <p className="text-secondary">{user.email}</p>
                            <div className="flex items-center gap-3 mt-2">
                                <span className={`px-3 py-1 text-xs font-bold rounded-full ${user.role === 'admin' ? 'bg-red-100 text-red-800' : user.role === 'moderator' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'}`}>{user.role}</span>
                                <span className={`px-3 py-1 text-xs font-bold rounded-full ${user.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{user.is_active ? (isFr ? 'Actif' : 'Active') : (isFr ? 'Inactif' : 'Inactive')}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Details */}
                <div className="grid md:grid-cols-2 gap-4 mb-6">
                    <InfoCard icon="school" label={isFr ? 'Niveau actuel' : 'Current Level'} value={user.current_level || '—'} />
                    <InfoCard icon="public" label={isFr ? 'Pays cibles' : 'Target Countries'} value={(user.target_countries || []).join(', ') || '—'} />
                    <InfoCard icon="work" label={isFr ? 'Domaine cible' : 'Target Field'} value={user.target_field || '—'} />
                    <InfoCard icon="grade" label={isFr ? 'Note BAC' : 'BAC Score'} value={user.bac_score != null ? String(user.bac_score) : '—'} />
                    <InfoCard icon="calendar_month" label={isFr ? 'Inscrit le' : 'Joined'} value={user.created_at ? new Date(user.created_at).toLocaleDateString() : '—'} />
                    <InfoCard icon="id_card" label="ID" value={user.id} />
                </div>

                {/* Actions */}
                <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                    <h2 className="font-bold mb-4">{isFr ? 'Actions' : 'Actions'}</h2>
                    <div className="flex flex-wrap gap-3">
                        <button className="px-4 py-2 bg-yellow-50 text-yellow-800 rounded-lg text-sm font-bold border border-yellow-200 hover:bg-yellow-100">{isFr ? 'Changer le rôle' : 'Change Role'}</button>
                        <button className="px-4 py-2 bg-orange-50 text-orange-800 rounded-lg text-sm font-bold border border-orange-200 hover:bg-orange-100">{isFr ? 'Réinitialiser le mot de passe' : 'Reset Password'}</button>
                        <button className={`px-4 py-2 rounded-lg text-sm font-bold border ${user.is_active ? 'bg-red-50 text-red-800 border-red-200 hover:bg-red-100' : 'bg-green-50 text-green-800 border-green-200 hover:bg-green-100'}`}>{user.is_active ? (isFr ? 'Désactiver' : 'Deactivate') : (isFr ? 'Activer' : 'Activate')}</button>
                    </div>
                </div>
            </main>
        </div>
    )
}

function InfoCard({ icon, label, value }) {
    return (
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-1"><span className="material-symbols-outlined text-lg text-gray-400">{icon}</span><span className="text-xs font-bold text-secondary uppercase">{label}</span></div>
            <p className="font-medium text-text-main text-sm break-all">{value}</p>
        </div>
    )
}
