/**
 * Admin Dashboard — Platform overview with stats, users, and content management.
 * Fetches live data from /api/admin endpoints.
 */

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation, LanguageSwitcher } from '../i18n'
import { getAdminStats, getAdminUsers, getAdminContentOverview, getAdminRecentActivity } from '../api'

const FLAG_EMOJI = { FR: '🇫🇷', CA: '🇨🇦', DE: '🇩🇪', UK: '🇬🇧', ES: '🇪🇸', MA: '🇲🇦' }

export default function AdminDashboard() {
    const { lang } = useTranslation()
    const isFr = lang === 'fr'
    const [stats, setStats] = useState(null)
    const [users, setUsers] = useState([])
    const [content, setContent] = useState(null)
    const [recent, setRecent] = useState(null)
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState('overview')

    useEffect(() => {
        Promise.all([
            getAdminStats().then(d => setStats(d)),
            getAdminUsers().then(d => setUsers(d.users || [])),
            getAdminContentOverview().then(d => setContent(d)),
            getAdminRecentActivity().then(d => setRecent(d)),
        ]).finally(() => setLoading(false))
    }, [])

    const tabs = [
        { id: 'overview', label_fr: 'Vue d\'ensemble', label_en: 'Overview', icon: 'dashboard' },
        { id: 'users', label_fr: 'Utilisateurs', label_en: 'Users', icon: 'group' },
        { id: 'content', label_fr: 'Contenu', label_en: 'Content', icon: 'inventory_2' },
    ]

    return (
        <div className="min-h-screen bg-gray-900 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-gray-800 border-r border-gray-700 flex flex-col">
                <div className="p-6 border-b border-gray-700">
                    <Link to="/" className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-2xl text-primary">school</span>
                        <span className="text-lg font-bold text-white">FuturDialk</span>
                    </Link>
                    <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded mt-2 inline-block font-bold">ADMIN</span>
                </div>
                <nav className="flex-1 p-4 space-y-1">
                    {tabs.map(t => (
                        <button
                            key={t.id}
                            onClick={() => setActiveTab(t.id)}
                            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === t.id ? 'bg-primary text-white' : 'text-gray-400 hover:text-white hover:bg-gray-700'}`}
                        >
                            <span className="material-symbols-outlined text-lg">{t.icon}</span>
                            {isFr ? t.label_fr : t.label_en}
                        </button>
                    ))}
                    <Link to="/admin/translations" className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-gray-700 transition-colors">
                        <span className="material-symbols-outlined text-lg">translate</span>
                        {isFr ? 'Traductions' : 'Translations'}
                    </Link>
                </nav>
                <div className="p-4 border-t border-gray-700">
                    <Link to="/dashboard" className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
                        <span className="material-symbols-outlined text-lg">arrow_back</span>
                        {isFr ? 'Retour Plateforme' : 'Back to Platform'}
                    </Link>
                </div>
            </aside>

            {/* Main */}
            <main className="flex-1 overflow-y-auto">
                <header className="bg-gray-800 border-b border-gray-700 px-8 py-4 flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-bold text-white">{isFr ? 'Panneau d\'Administration' : 'Admin Dashboard'}</h1>
                        <p className="text-sm text-gray-400">{isFr ? 'Gérez votre plateforme' : 'Manage your platform'}</p>
                    </div>
                    <LanguageSwitcher />
                </header>

                <div className="p-8">
                    {loading ? (
                        <p className="text-gray-400 py-8">{isFr ? 'Chargement...' : 'Loading...'}</p>
                    ) : (
                        <>
                            {/* Overview Tab */}
                            {activeTab === 'overview' && (
                                <div className="space-y-8">
                                    {/* Stats Grid */}
                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                                        {[
                                            { label: isFr ? 'Utilisateurs' : 'Users', value: stats?.users || 0, icon: 'group', color: 'from-blue-500 to-blue-600' },
                                            { label: isFr ? 'Écoles' : 'Schools', value: stats?.schools || 0, icon: 'school', color: 'from-purple-500 to-purple-600' },
                                            { label: isFr ? 'Programmes' : 'Programs', value: stats?.programs || 0, icon: 'menu_book', color: 'from-green-500 to-green-600' },
                                            { label: isFr ? 'Bourses' : 'Scholarships', value: stats?.scholarships || 0, icon: 'emoji_events', color: 'from-amber-500 to-amber-600' },
                                            { label: isFr ? 'Modèles' : 'Templates', value: stats?.roadmap_templates || 0, icon: 'route', color: 'from-teal-500 to-teal-600' },
                                            { label: isFr ? 'Roadmaps' : 'Roadmaps', value: stats?.user_roadmaps || 0, icon: 'map', color: 'from-red-500 to-red-600' },
                                        ].map((s, i) => (
                                            <div key={i} className={`bg-gradient-to-br ${s.color} rounded-xl p-4 text-white`}>
                                                <span className="material-symbols-outlined text-2xl opacity-80">{s.icon}</span>
                                                <p className="text-3xl font-black mt-2">{s.value}</p>
                                                <p className="text-sm opacity-80 font-medium">{s.label}</p>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Content Distribution + Recent Activity */}
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        {/* Schools by Country */}
                                        <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
                                            <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                                                <span className="material-symbols-outlined text-primary">public</span>
                                                {isFr ? 'Écoles par Pays' : 'Schools by Country'}
                                            </h3>
                                            <div className="space-y-3">
                                                {content?.schools_by_country && Object.entries(content.schools_by_country).map(([code, count]) => (
                                                    <div key={code} className="flex items-center gap-3">
                                                        <span className="text-xl">{FLAG_EMOJI[code] || code}</span>
                                                        <div className="flex-1">
                                                            <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                                                                <div className="h-full bg-primary rounded-full" style={{ width: `${Math.min(100, count * 6)}%` }} />
                                                            </div>
                                                        </div>
                                                        <span className="text-sm font-bold text-white">{count}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Recent Activity */}
                                        <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
                                            <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                                                <span className="material-symbols-outlined text-primary">history</span>
                                                {isFr ? 'Activité Récente' : 'Recent Activity'}
                                            </h3>
                                            <div className="space-y-3">
                                                {recent?.recent_registrations?.map((u, i) => (
                                                    <div key={i} className="flex items-center gap-3 p-2 rounded-lg bg-gray-700/50">
                                                        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold">
                                                            {(u.full_name || u.email)?.[0]?.toUpperCase() || '?'}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm text-white font-medium truncate">{u.full_name || u.email}</p>
                                                            <p className="text-xs text-gray-400">{isFr ? 'Inscrit' : 'Registered'}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                                {(!recent?.recent_registrations || recent.recent_registrations.length === 0) && (
                                                    <p className="text-gray-500 text-sm">{isFr ? 'Aucune inscription récente' : 'No recent registrations'}</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Quick Actions */}
                                    <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
                                        <h3 className="font-bold text-white mb-4">{isFr ? 'Actions Rapides' : 'Quick Actions'}</h3>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                            {[
                                                { label: isFr ? 'Ajouter École' : 'Add School', icon: 'add_business', path: '/admin/content/schools' },
                                                { label: isFr ? 'Ajouter Programme' : 'Add Program', icon: 'post_add', path: '/admin/content/programs' },
                                                { label: isFr ? 'Ajouter Bourse' : 'Add Scholarship', icon: 'volunteer_activism', path: '/admin/content/scholarships' },
                                                { label: isFr ? 'Voir Analytics' : 'View Analytics', icon: 'analytics', path: '/admin/analytics' },
                                            ].map((action, i) => (
                                                <Link key={i} to={action.path} className="flex items-center gap-3 p-3 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors group">
                                                    <span className="material-symbols-outlined text-primary group-hover:text-white transition-colors">{action.icon}</span>
                                                    <span className="text-sm font-medium text-gray-300 group-hover:text-white">{action.label}</span>
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Users Tab */}
                            {activeTab === 'users' && (
                                <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
                                    <div className="p-6 border-b border-gray-700 flex items-center justify-between">
                                        <h3 className="font-bold text-white text-lg">{isFr ? 'Utilisateurs' : 'Users'} ({users.length})</h3>
                                    </div>
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead>
                                                <tr className="border-b border-gray-700">
                                                    <th className="text-left text-xs font-medium text-gray-400 uppercase px-6 py-3">{isFr ? 'Utilisateur' : 'User'}</th>
                                                    <th className="text-left text-xs font-medium text-gray-400 uppercase px-6 py-3">Email</th>
                                                    <th className="text-left text-xs font-medium text-gray-400 uppercase px-6 py-3">{isFr ? 'Rôle' : 'Role'}</th>
                                                    <th className="text-left text-xs font-medium text-gray-400 uppercase px-6 py-3">{isFr ? 'Niveau' : 'Level'}</th>
                                                    <th className="text-left text-xs font-medium text-gray-400 uppercase px-6 py-3">{isFr ? 'Pays Cibles' : 'Target Countries'}</th>
                                                    <th className="text-left text-xs font-medium text-gray-400 uppercase px-6 py-3">Status</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-700">
                                                {users.map(u => (
                                                    <tr key={u.id} className="hover:bg-gray-700/50 transition-colors">
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold">
                                                                    {(u.full_name || u.email)?.[0]?.toUpperCase()}
                                                                </div>
                                                                <span className="text-sm font-medium text-white">{u.full_name || '—'}</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 text-sm text-gray-300">{u.email}</td>
                                                        <td className="px-6 py-4">
                                                            <span className={`text-xs font-bold px-2 py-0.5 rounded ${u.role === 'admin' ? 'bg-red-900/50 text-red-400' : 'bg-blue-900/50 text-blue-400'}`}>
                                                                {u.role || 'student'}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 text-sm text-gray-300">{u.current_level || '—'}</td>
                                                        <td className="px-6 py-4">
                                                            <div className="flex gap-1">
                                                                {(u.target_countries || []).map(c => (
                                                                    <span key={c} className="text-xs bg-gray-700 px-1.5 py-0.5 rounded text-gray-300">{FLAG_EMOJI[c] || c}</span>
                                                                ))}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <span className={`w-2 h-2 rounded-full inline-block ${u.is_active ? 'bg-green-500' : 'bg-gray-500'}`} />
                                                        </td>
                                                    </tr>
                                                ))}
                                                {users.length === 0 && (
                                                    <tr><td colSpan="6" className="px-6 py-8 text-center text-gray-500">{isFr ? 'Aucun utilisateur' : 'No users yet'}</td></tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            {/* Content Tab */}
                            {activeTab === 'content' && (
                                <div className="space-y-6">
                                    {/* Programs by Field */}
                                    <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
                                        <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                                            <span className="material-symbols-outlined text-primary">category</span>
                                            {isFr ? 'Programmes par Domaine' : 'Programs by Field'}
                                        </h3>
                                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                                            {content?.programs_by_field && Object.entries(content.programs_by_field).map(([field, count]) => (
                                                <div key={field} className="bg-gray-700/50 rounded-lg p-4 text-center">
                                                    <p className="text-2xl font-black text-white">{count}</p>
                                                    <p className="text-xs text-gray-400 capitalize">{field}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Scholarships by Country */}
                                    <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
                                        <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                                            <span className="material-symbols-outlined text-primary">emoji_events</span>
                                            {isFr ? 'Bourses par Pays' : 'Scholarships by Country'}
                                        </h3>
                                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                                            {content?.scholarships_by_country && Object.entries(content.scholarships_by_country).map(([code, count]) => (
                                                <div key={code} className="bg-gray-700/50 rounded-lg p-4 text-center">
                                                    <span className="text-2xl">{FLAG_EMOJI[code] || code}</span>
                                                    <p className="text-xl font-bold text-white mt-1">{count}</p>
                                                    <p className="text-xs text-gray-400">{isFr ? 'bourses' : 'scholarships'}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Content Management Links */}
                                    <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
                                        <h3 className="font-bold text-white mb-4">{isFr ? 'Gestion du Contenu' : 'Content Management'}</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                            {[
                                                { label: isFr ? 'Gérer les Écoles' : 'Manage Schools', icon: 'school', count: stats?.schools, path: '/admin/content/schools' },
                                                { label: isFr ? 'Gérer les Programmes' : 'Manage Programs', icon: 'menu_book', count: stats?.programs, path: '/admin/content/programs' },
                                                { label: isFr ? 'Gérer les Bourses' : 'Manage Scholarships', icon: 'emoji_events', count: stats?.scholarships, path: '/admin/content/scholarships' },
                                                { label: isFr ? 'Gérer les Roadmaps' : 'Manage Roadmaps', icon: 'route', count: stats?.roadmap_templates, path: '/admin/content/roadmaps' },
                                                { label: isFr ? 'Gérer les Examens' : 'Manage Exams', icon: 'quiz', count: '–', path: '/admin/content/exams' },
                                                { label: isFr ? 'Traductions' : 'Translations', icon: 'translate', count: '–', path: '/admin/translations' },
                                            ].map((item, i) => (
                                                <Link key={i} to={item.path} className="flex items-center gap-4 p-4 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors group">
                                                    <span className="material-symbols-outlined text-2xl text-primary">{item.icon}</span>
                                                    <div className="flex-1">
                                                        <p className="text-sm font-medium text-white group-hover:text-primary transition-colors">{item.label}</p>
                                                        <p className="text-xs text-gray-400">{item.count} {isFr ? 'éléments' : 'items'}</p>
                                                    </div>
                                                    <span className="material-symbols-outlined text-gray-500 group-hover:text-primary">arrow_forward</span>
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </main>
        </div>
    )
}
