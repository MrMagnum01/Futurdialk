/**
 * Profile Page — User's profile with about, achievements, academic progress, and CV.
 * Based on Stitch my_profile_profile design.
 */

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation, LanguageSwitcher } from '../i18n'
import { getProfile, isAuthenticated } from '../api'

export default function Profile() {
    const { lang } = useTranslation()
    const isFr = lang === 'fr'
    const [profile, setProfile] = useState(null)
    const [studentProfile, setStudentProfile] = useState(null)
    const loggedIn = isAuthenticated()

    useEffect(() => {
        if (loggedIn) {
            getProfile()
                .then(data => {
                    setProfile(data.user)
                    setStudentProfile(data.student_profile)
                })
                .catch(() => { })
        }
    }, [loggedIn])

    const userName = profile?.full_name || (isFr ? 'Ahmed El Fassi' : 'Ahmed El Fassi')
    const userInitial = userName.charAt(0).toUpperCase()
    const userCity = profile?.city || 'Casablanca'
    const educationLevel = studentProfile?.education_level?.replace('_', ' ') || (isFr ? 'Terminale' : 'Senior Year')
    const bacAvg = studentProfile?.bac_average || null

    const badges = [
        { icon: 'functions', name: isFr ? 'Matheux' : 'Math Wizard', desc: 'Top 5%', color: 'bg-blue-100 text-primary' },
        { icon: 'science', name: isFr ? 'Pro Physique' : 'Physics Pro', desc: isFr ? 'Module Terminé' : 'Module Completed', color: 'bg-orange-100 text-orange-600' },
        { icon: 'verified', name: isFr ? 'Régulier' : 'Consistent', desc: isFr ? '30 Jours' : '30 Day Streak', color: 'bg-green-100 text-green-600' },
        { icon: 'workspace_premium', name: isFr ? 'Érudit' : 'Scholar', desc: isFr ? 'Niveau Élite' : 'Elite Level', color: 'bg-purple-100 text-purple-600' },
    ]

    const subjects = studentProfile ? [
        { name: isFr ? 'Mathématiques' : 'Mathematics', score: studentProfile.bac_math_score ? Math.round(studentProfile.bac_math_score * 5) : 92 },
        { name: isFr ? 'Physique' : 'Physics', score: studentProfile.bac_physics_score ? Math.round(studentProfile.bac_physics_score * 5) : 88 },
        { name: isFr ? 'Français' : 'French', score: studentProfile.bac_french_score ? Math.round(studentProfile.bac_french_score * 5) : 95 },
    ] : [
        { name: isFr ? 'Mathématiques' : 'Mathematics', score: 92 },
        { name: isFr ? 'Physique' : 'Physics', score: 88 },
        { name: isFr ? 'Français / Anglais' : 'English Literature', score: 95 },
    ]

    return (
        <div className="min-h-screen bg-bg-light flex flex-col">
            {/* Header */}
            <header className="sticky top-0 z-50 flex items-center justify-between border-b border-gray-200 bg-white px-6 py-3 lg:px-20 shadow-sm">
                <Link to="/" className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-3xl text-primary">school</span>
                    <span className="text-xl font-bold text-text-main">Tawjihi</span>
                </Link>
                <div className="flex items-center gap-4">
                    <LanguageSwitcher />
                    <Link to="/notifications" className="p-2 text-secondary hover:text-primary">
                        <span className="material-symbols-outlined">notifications</span>
                    </Link>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-blue-600 text-white flex items-center justify-center font-bold shadow-sm">
                        {userInitial}
                    </div>
                </div>
            </header>

            <main className="flex-1 flex justify-center py-8 px-4 sm:px-8">
                <div className="flex flex-col max-w-[1024px] w-full gap-8">
                    {/* Profile Header Card */}
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                        <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
                            <div className="relative group">
                                <div className="h-32 w-32 rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-white text-4xl font-bold shadow-lg border-4 border-white">
                                    {userInitial}
                                </div>
                                <button className="absolute bottom-1 right-1 bg-white p-2 rounded-full shadow-md text-primary hover:text-primary/80 transition-colors border border-gray-200">
                                    <span className="material-symbols-outlined text-lg">edit</span>
                                </button>
                            </div>
                            <div className="flex-1 flex flex-col items-center md:items-start gap-2 text-center md:text-left">
                                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 w-full justify-between">
                                    <div>
                                        <h1 className="text-2xl font-bold text-text-main">{userName}</h1>
                                        <p className="text-secondary font-medium">{educationLevel} {studentProfile?.bac_filiere ? `| ${studentProfile.bac_filiere}` : ''}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button className="h-9 px-4 rounded-lg bg-gray-100 text-secondary text-sm font-bold hover:bg-gray-200 transition-colors flex items-center gap-2">
                                            <span className="material-symbols-outlined text-lg">share</span>
                                            {isFr ? 'Partager' : 'Share'}
                                        </button>
                                        <Link to="/settings" className="h-9 px-4 rounded-lg bg-primary text-white text-sm font-bold hover:bg-primary-hover transition-colors flex items-center gap-2">
                                            <span className="material-symbols-outlined text-lg">edit_note</span>
                                            {isFr ? 'Modifier' : 'Edit Profile'}
                                        </Link>
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-3 mt-2 justify-center md:justify-start">
                                    {bacAvg && (
                                        <div className="flex items-center gap-1.5 text-sm text-secondary bg-gray-50 px-3 py-1 rounded-full border border-gray-200">
                                            <span className="material-symbols-outlined text-lg text-primary">school</span>
                                            <span>{isFr ? 'Moyenne Bac' : 'Bac Average'}: {bacAvg}/20</span>
                                        </div>
                                    )}
                                    <div className="flex items-center gap-1.5 text-sm text-secondary bg-gray-50 px-3 py-1 rounded-full border border-gray-200">
                                        <span className="material-symbols-outlined text-lg text-primary">location_on</span>
                                        <span>{userCity}, Maroc</span>
                                    </div>
                                    {studentProfile?.preferred_countries?.length > 0 && (
                                        <div className="flex items-center gap-1.5 text-sm text-secondary bg-gray-50 px-3 py-1 rounded-full border border-gray-200">
                                            <span className="material-symbols-outlined text-lg text-primary">flight_takeoff</span>
                                            <span>{studentProfile.preferred_countries.join(', ')}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column */}
                        <div className="lg:col-span-2 flex flex-col gap-8">
                            {/* About */}
                            <section className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                                <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-text-main">
                                    <span className="material-symbols-outlined text-primary">person</span>
                                    {isFr ? 'À propos' : 'About Me'}
                                </h2>
                                <p className="text-secondary leading-relaxed">
                                    {isFr
                                        ? "Étudiant passionné par l'informatique et les mathématiques. Actuellement en préparation du Baccalauréat scientifique, je recherche activement des bourses pour étudier en France ou au Canada. Je participe également à des hackathons et je développe des projets web le weekend."
                                        : "Aspiring computer engineering student with a passion for mathematics and physics. Currently preparing for the Baccalauréat and actively looking for scholarship opportunities in France or Canada. I spend my weekends at coding hackathons and building web projects."}
                                </p>
                            </section>

                            {/* Achievements */}
                            <section className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-bold flex items-center gap-2 text-text-main">
                                        <span className="material-symbols-outlined text-primary">military_tech</span>
                                        {isFr ? 'Réalisations & Badges' : 'Achievements & Badges'}
                                    </h2>
                                    <a href="#" className="text-sm font-medium text-primary hover:underline">{isFr ? 'Voir tout' : 'View all'}</a>
                                </div>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                    {badges.map((badge) => (
                                        <div key={badge.name} className="flex flex-col items-center gap-2 p-4 rounded-lg bg-gray-50 border border-gray-200 hover:border-primary/30 transition-colors group cursor-pointer">
                                            <div className={`w-16 h-16 rounded-full ${badge.color} flex items-center justify-center mb-1 group-hover:scale-110 transition-transform`}>
                                                <span className="material-symbols-outlined text-3xl">{badge.icon}</span>
                                            </div>
                                            <span className="text-sm font-bold text-center text-text-main">{badge.name}</span>
                                            <span className="text-xs text-secondary text-center">{badge.desc}</span>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {/* Academic Progress */}
                            <section className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                                <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-text-main">
                                    <span className="material-symbols-outlined text-primary">monitoring</span>
                                    {isFr ? 'Résumé Académique' : 'Academic Summary'}
                                </h2>
                                <div className="space-y-6">
                                    {subjects.map((s) => (
                                        <div key={s.name}>
                                            <div className="flex justify-between mb-2">
                                                <span className="text-sm font-medium text-text-main">{s.name}</span>
                                                <span className="text-sm font-bold text-primary">{s.score}%</span>
                                            </div>
                                            <div className="w-full bg-gray-100 rounded-full h-2.5">
                                                <div className="bg-primary h-2.5 rounded-full transition-all duration-500" style={{ width: `${s.score}%` }} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        </div>

                        {/* Right Column */}
                        <div className="flex flex-col gap-8">
                            {/* Resume */}
                            <section className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 h-fit">
                                <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-text-main">
                                    <span className="material-symbols-outlined text-primary">description</span>
                                    {isFr ? 'CV' : 'Resume / CV'}
                                </h2>
                                <div className="aspect-[1/1.4] w-full bg-gray-50 rounded-lg mb-4 flex items-center justify-center border-2 border-dashed border-gray-300 group cursor-pointer hover:border-primary transition-colors">
                                    <div className="text-center p-4">
                                        <span className="material-symbols-outlined text-4xl text-gray-400 mb-2 block">picture_as_pdf</span>
                                        <p className="text-xs text-secondary">Ahmed_ElFassi_CV_2026.pdf</p>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2 mb-4">
                                    <div className="flex items-center justify-between text-sm py-2 border-b border-gray-100">
                                        <span className="text-secondary">{isFr ? 'Mis à jour' : 'Last Updated'}</span>
                                        <span className="font-medium text-text-main">{isFr ? 'Il y a 2 jours' : '2 days ago'}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm py-2">
                                        <span className="text-secondary">Format</span>
                                        <span className="font-medium text-text-main">PDF</span>
                                    </div>
                                </div>
                                <button className="w-full flex items-center justify-center gap-2 h-10 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-sm font-bold text-text-main">
                                    <span className="material-symbols-outlined text-lg">upload</span>
                                    {isFr ? 'Télécharger' : 'Upload New Version'}
                                </button>
                            </section>

                            {/* Recommendations */}
                            <section className="bg-blue-50 rounded-xl p-6 shadow-sm border border-primary/20">
                                <h3 className="font-bold text-primary mb-3 text-lg">
                                    {isFr ? 'Recommandé pour vous' : 'Recommended for You'}
                                </h3>
                                <ul className="space-y-4">
                                    <li className="flex gap-3 items-start">
                                        <div className="bg-white p-1.5 rounded-md text-primary shadow-sm shrink-0">
                                            <span className="material-symbols-outlined text-lg">school</span>
                                        </div>
                                        <div>
                                            <a href="#" className="font-medium text-sm hover:text-primary transition-colors block text-text-main">
                                                {isFr ? 'Postuler à HEC Paris' : 'Apply to HEC Paris'}
                                            </a>
                                            <p className="text-xs text-secondary mt-1">
                                                {isFr ? 'Date limite dans 12 jours.' : 'Deadline approaching in 12 days.'}
                                            </p>
                                        </div>
                                    </li>
                                    <li className="flex gap-3 items-start">
                                        <div className="bg-white p-1.5 rounded-md text-primary shadow-sm shrink-0">
                                            <span className="material-symbols-outlined text-lg">menu_book</span>
                                        </div>
                                        <div>
                                            <a href="#" className="font-medium text-sm hover:text-primary transition-colors block text-text-main">
                                                {isFr ? 'Terminer le Module Physique 4' : 'Complete Physics Module 4'}
                                            </a>
                                            <p className="text-xs text-secondary mt-1">
                                                {isFr ? 'Continuez où vous en étiez.' : 'Continue where you left off.'}
                                            </p>
                                        </div>
                                    </li>
                                </ul>
                            </section>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
