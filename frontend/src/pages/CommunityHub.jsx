/**
 * Community Hub — Social feed with posts, groups, trending, and success stories.
 * Fetches live data from /api/community endpoints.
 */

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation, LanguageSwitcher } from '../i18n'
import { getCommunityFeed } from '../api'

export default function CommunityHub() {
    const { lang } = useTranslation()
    const isFr = lang === 'fr'
    const [feed, setFeed] = useState({ posts: [], trending: [], groups: [] })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        getCommunityFeed()
            .then(data => setFeed(data))
            .catch(() => { })
            .finally(() => setLoading(false))
    }, [])

    const avatarColors = ['bg-primary', 'bg-green-600', 'bg-purple-600', 'bg-orange-500', 'bg-teal-600']

    return (
        <div className="min-h-screen bg-bg-light flex flex-col">
            <header className="sticky top-0 z-50 bg-white border-b border-gray-200 px-6 py-3 lg:px-20 shadow-sm">
                <div className="flex items-center justify-between max-w-[1280px] mx-auto">
                    <Link to="/" className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-3xl text-primary">school</span>
                        <span className="text-xl font-bold text-text-main">Tawjihi</span>
                    </Link>
                    <nav className="hidden md:flex gap-8">
                        <Link to="/" className="text-sm font-medium text-secondary hover:text-primary">{isFr ? 'Accueil' : 'Home'}</Link>
                        <Link to="/explore" className="text-sm font-medium text-secondary hover:text-primary">{isFr ? 'Programmes' : 'Programs'}</Link>
                        <Link to="/community" className="text-sm font-bold text-primary">{isFr ? 'Communauté' : 'Community'}</Link>
                    </nav>
                    <div className="flex items-center gap-3">
                        <LanguageSwitcher />
                        <Link to="/login" className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold">{isFr ? 'Connexion' : 'Sign In'}</Link>
                    </div>
                </div>
            </header>

            <main className="flex-1 px-6 lg:px-20 py-8 max-w-[1280px] mx-auto w-full">
                {/* Hero */}
                <div className="bg-gradient-to-r from-purple-600 to-indigo-700 rounded-2xl p-8 md:p-12 mb-10 text-white relative overflow-hidden">
                    <div className="absolute -right-20 -top-20 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
                    <div className="relative z-10 max-w-2xl">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="material-symbols-outlined">groups</span>
                            <span className="text-sm font-bold uppercase tracking-wider">{isFr ? 'Communauté Tawjihi' : 'Tawjihi Community'}</span>
                        </div>
                        <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-3">
                            {isFr ? 'Échangez, Partagez, Réussissez' : 'Connect, Share, Succeed'}
                        </h1>
                        <p className="text-purple-100 text-lg">
                            {isFr ? "Rejoignez des milliers d'étudiants marocains qui s'entraident." : "Join thousands of Moroccan students helping each other."}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Feed */}
                    <div className="lg:col-span-2 space-y-6">
                        <h2 className="text-xl font-bold text-text-main">{isFr ? 'Publications Récentes' : 'Recent Posts'}</h2>

                        {loading ? (
                            <p className="text-secondary py-4">{isFr ? 'Chargement...' : 'Loading...'}</p>
                        ) : feed.posts.map((post, idx) => (
                            <div key={post.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                                <div className="p-5">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className={`w-10 h-10 rounded-full ${avatarColors[idx % avatarColors.length]} text-white flex items-center justify-center font-bold`}>
                                            {post.avatar_initial}
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-bold text-text-main text-sm">{post.author}</p>
                                            <p className="text-xs text-secondary">{isFr ? post.role_fr : post.role_en} · {isFr ? post.time_fr : post.time_en}</p>
                                        </div>
                                    </div>
                                    <h3 className="font-bold text-text-main text-lg mb-2">{isFr ? post.title_fr : post.title_en}</h3>
                                    <p className="text-secondary text-sm mb-3">{isFr ? post.content_fr : post.content_en}</p>
                                    {post.image && <img src={post.image} alt="" className="w-full h-48 object-cover rounded-lg mb-3" />}
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {post.tags.map(tag => (
                                            <span key={tag} className="text-xs bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full font-medium">{tag}</span>
                                        ))}
                                    </div>
                                </div>
                                <div className="px-5 py-3 border-t border-gray-100 flex items-center gap-6">
                                    <button className="flex items-center gap-1.5 text-sm text-secondary hover:text-primary transition-colors">
                                        <span className="material-symbols-outlined text-lg">favorite</span>
                                        {post.likes}
                                    </button>
                                    <button className="flex items-center gap-1.5 text-sm text-secondary hover:text-primary transition-colors">
                                        <span className="material-symbols-outlined text-lg">chat_bubble</span>
                                        {post.comments}
                                    </button>
                                    <button className="flex items-center gap-1.5 text-sm text-secondary hover:text-primary transition-colors ml-auto">
                                        <span className="material-symbols-outlined text-lg">share</span>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Trending */}
                        <div className="bg-white rounded-xl border border-gray-200 p-5">
                            <h3 className="font-bold text-text-main mb-4 flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">trending_up</span>
                                {isFr ? 'Tendances' : 'Trending'}
                            </h3>
                            <div className="space-y-3">
                                {feed.trending.map((t, i) => (
                                    <div key={i} className="flex items-center justify-between group cursor-pointer">
                                        <span className="text-sm font-medium text-primary group-hover:underline">{t.tag}</span>
                                        <span className="text-xs text-secondary">{t.posts_count.toLocaleString()} posts</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Groups */}
                        <div className="bg-white rounded-xl border border-gray-200 p-5">
                            <h3 className="font-bold text-text-main mb-4 flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">group</span>
                                {isFr ? 'Groupes Populaires' : 'Popular Groups'}
                            </h3>
                            <div className="space-y-3">
                                {feed.groups.map(g => (
                                    <div key={g.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                                        <span className="text-xl">{g.icon}</span>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-text-main truncate">{isFr ? g.name_fr : g.name_en}</p>
                                            <p className="text-xs text-secondary">{g.members.toLocaleString()} {isFr ? 'membres' : 'members'}</p>
                                        </div>
                                        <button className="text-xs font-bold text-primary hover:underline">{isFr ? 'Rejoindre' : 'Join'}</button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Create post CTA */}
                        <div className="bg-gradient-to-br from-purple-600 to-indigo-700 rounded-xl p-5 text-white">
                            <h3 className="font-bold mb-2">{isFr ? 'Partagez votre expérience' : 'Share Your Experience'}</h3>
                            <p className="text-sm text-purple-100 mb-4">{isFr ? 'Aidez la communauté marocaine !' : 'Help the Moroccan community!'}</p>
                            <button className="w-full bg-white text-purple-700 font-bold py-2 rounded-lg hover:bg-gray-100 transition-colors text-sm">
                                {isFr ? 'Écrire un Post' : 'Write a Post'}
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
