/**
 * Exam Prep Home — Enrolled exams, daily practice CTA, leaderboard, recommended resources.
 * Based on Stitch exam_prep_home_prep design.
 */

import { Link } from 'react-router-dom'
import { useTranslation, LanguageSwitcher } from '../i18n'

const enrolledExams = [
    { code: 'IELTS', name: 'IELTS Academic', desc: { fr: "Test d'anglais pour les études supérieures.", en: 'International English Language Testing System for academic purposes.' }, progress: 65, status: 'active', color: 'bg-blue-100 text-blue-600', barColor: 'bg-primary', next: { fr: 'Écriture Tâche 2', en: 'Writing Task 2' } },
    { code: 'TCF', name: 'TCF Canada', desc: { fr: 'Test de connaissance du français pour le Canada.', en: 'French language proficiency test for Canada.' }, progress: 32, status: 'paused', color: 'bg-purple-100 text-purple-600', barColor: 'bg-purple-500', next: { fr: 'Compréhension Orale', en: 'Listening Comprehension' } },
    { code: 'TOEFL', name: 'TOEFL iBT', desc: { fr: "Test d'anglais langue étrangère - version internet.", en: 'Test of English as a Foreign Language internet-based test prep.' }, progress: 88, status: 'active', color: 'bg-teal-100 text-teal-600', barColor: 'bg-teal-500', next: { fr: 'Examen Blanc Final', en: 'Final Mock Exam' } },
    { code: 'BAC', name: 'Baccalauréat (Sciences)', desc: { fr: 'Examen national du baccalauréat scientifique.', en: 'National scientific baccalauréat examination.' }, progress: 45, status: 'review', color: 'bg-orange-100 text-orange-600', barColor: 'bg-orange-500', next: { fr: 'Physique Unité 3', en: 'Physics Unit 3' } },
]

const leaderboard = [
    { rank: 1, name: 'Fatima Z.', exam: 'IELTS', xp: 2450 },
    { rank: 2, name: 'Youssef R.', exam: 'TCF', xp: 2380 },
    { rank: 3, name: 'Amina B.', exam: 'TOEFL', xp: 2100 },
]

export default function ExamPrepHome() {
    const { lang } = useTranslation()
    const isFr = lang === 'fr'

    const statusLabels = {
        active: { fr: 'Actif', en: 'Active', class: 'bg-green-100 text-green-700' },
        paused: { fr: 'En Pause', en: 'Paused', class: 'bg-gray-100 text-gray-600' },
        review: { fr: 'Révision', en: 'Review', class: 'bg-orange-100 text-orange-700' },
    }

    return (
        <div className="min-h-screen bg-bg-light flex flex-col">
            {/* Header */}
            <header className="sticky top-0 z-50 flex items-center justify-between border-b border-gray-200 bg-white px-6 py-3 lg:px-20 shadow-sm">
                <div className="flex items-center gap-8">
                    <Link to="/" className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-3xl text-primary">school</span>
                        <span className="text-xl font-bold text-text-main">FuturDialk</span>
                    </Link>
                    <nav className="hidden lg:flex items-center gap-8">
                        <Link to="/" className="text-sm font-medium text-secondary hover:text-primary">{isFr ? 'Accueil' : 'Home'}</Link>
                        <Link to="/explore" className="text-sm font-medium text-secondary hover:text-primary">{isFr ? 'Programmes' : 'Programs'}</Link>
                        <Link to="/prep" className="text-sm font-bold text-primary">{isFr ? 'Examens' : 'Exam Prep'}</Link>
                        <Link to="/scholarships" className="text-sm font-medium text-secondary hover:text-primary">{isFr ? 'Bourses' : 'Scholarships'}</Link>
                    </nav>
                </div>
                <div className="flex items-center gap-3">
                    <LanguageSwitcher />
                    <Link to="/login" className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold hover:bg-primary-hover shadow-md">
                        {isFr ? 'Connexion' : 'Log In'}
                    </Link>
                </div>
            </header>

            <main className="flex-1 px-6 lg:px-20 py-8 w-full max-w-[1440px] mx-auto">
                {/* Hero Section */}
                <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-10">
                    <div className="flex flex-col gap-3 max-w-2xl">
                        <h1 className="text-4xl md:text-5xl font-black text-text-main tracking-tight">
                            {isFr ? 'Centre de Préparation' : 'Exam Prep Center'}
                        </h1>
                        <p className="text-lg text-secondary">
                            {isFr
                                ? 'Suivez votre progression, entraînez-vous quotidiennement et réussissez vos examens.'
                                : 'Track your progress, access daily practice, and ace your upcoming exams.'}
                        </p>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-3 flex items-center gap-3 border border-primary/20">
                        <span className="material-symbols-outlined text-primary">calendar_today</span>
                        <div>
                            <p className="text-xs text-secondary font-medium uppercase">{isFr ? 'Prochain Examen' : 'Next Exam'}</p>
                            <p className="text-sm font-bold text-text-main">IELTS - {isFr ? '12 Oct' : 'Oct 12'}</p>
                        </div>
                    </div>
                </div>

                {/* Quick Start & Leaderboard */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
                    {/* Quick Start CTA */}
                    <div className="lg:col-span-2 bg-gradient-to-r from-primary to-blue-600 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="material-symbols-outlined">bolt</span>
                                    <span className="font-bold tracking-wide uppercase text-sm opacity-90">
                                        {isFr ? 'Série Quotidienne : 5 Jours' : 'Daily Streak: 5 Days'}
                                    </span>
                                </div>
                                <h3 className="text-2xl font-bold mb-2">
                                    {isFr ? "Prêt pour l'entraînement ?" : "Ready for today's practice?"}
                                </h3>
                                <p className="text-white/80 mb-6 max-w-md">
                                    {isFr
                                        ? "Complétez votre mix quotidien de 15 minutes. Focus d'aujourd'hui : Compréhension Écrite."
                                        : "Complete your 15-minute daily mix. Today's focus: Reading Comprehension."}
                                </p>
                                <Link
                                    to="/prep/ielts/practice"
                                    className="bg-white text-primary px-6 py-2.5 rounded-lg font-bold hover:bg-gray-100 transition-colors shadow-sm inline-flex items-center gap-2"
                                >
                                    {isFr ? "Commencer l'Entraînement" : 'Start Practice'}
                                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                                </Link>
                            </div>
                            <div className="hidden md:block">
                                <div className="w-32 h-32 rounded-full border-4 border-white/20 flex items-center justify-center relative">
                                    <span className="material-symbols-outlined text-6xl">timer</span>
                                    <div className="absolute top-0 right-0 bg-green-400 w-4 h-4 rounded-full border-2 border-primary" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Mini Leaderboard */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 flex flex-col">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold text-text-main flex items-center gap-2">
                                <span className="material-symbols-outlined text-yellow-500">trophy</span>
                                {isFr ? 'Classement' : 'Leaderboard'}
                            </h3>
                            <Link to="/prep/leaderboard" className="text-primary text-sm font-medium hover:underline">
                                {isFr ? 'Voir tout' : 'View All'}
                            </Link>
                        </div>
                        <div className="flex-1 flex flex-col gap-4">
                            {leaderboard.map((entry) => (
                                <div key={entry.rank} className="flex items-center gap-3">
                                    <div className="font-bold text-gray-400 w-4">{entry.rank}</div>
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-blue-600 text-white flex items-center justify-center text-xs font-bold">
                                        {entry.name[0]}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-text-main truncate">{entry.name}</p>
                                        <p className="text-xs text-secondary">{entry.exam} • {entry.xp} XP</p>
                                    </div>
                                    {entry.rank === 1 && <span className="material-symbols-outlined text-yellow-500 text-sm">workspace_premium</span>}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Enrolled Exams */}
                <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-text-main">
                        {isFr ? 'Vos Examens' : 'Your Enrolled Exams'}
                    </h2>
                    <button className="text-primary font-medium text-sm flex items-center gap-1 hover:gap-2 transition-all">
                        {isFr ? 'Ajouter un Examen' : 'Add New Exam'}
                        <span className="material-symbols-outlined text-sm">add_circle</span>
                    </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                    {enrolledExams.map((exam) => (
                        <Link
                            key={exam.code}
                            to={`/prep/${exam.code.toLowerCase()}`}
                            className="group bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col h-full"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className={`w-12 h-12 rounded-lg ${exam.color} flex items-center justify-center font-bold text-lg`}>
                                    {exam.code.substring(0, 2)}
                                </div>
                                <span className={`text-xs font-bold px-2 py-1 rounded ${statusLabels[exam.status].class}`}>
                                    {isFr ? statusLabels[exam.status].fr : statusLabels[exam.status].en}
                                </span>
                            </div>
                            <h3 className="text-lg font-bold text-text-main mb-1">{exam.name}</h3>
                            <p className="text-sm text-secondary mb-6 line-clamp-2">{isFr ? exam.desc.fr : exam.desc.en}</p>
                            <div className="mt-auto">
                                <div className="flex justify-between items-end mb-2">
                                    <span className="text-sm font-medium text-text-main">{isFr ? 'Progression' : 'Progress'}</span>
                                    <span className={`text-sm font-bold ${exam.status === 'active' ? 'text-primary' : 'text-secondary'}`}>{exam.progress}%</span>
                                </div>
                                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                                    <div className={`h-full ${exam.barColor} rounded-full transition-all`} style={{ width: `${exam.progress}%` }} />
                                </div>
                                <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                                    <span className="text-xs text-secondary font-medium">
                                        {isFr ? 'Suivant' : 'Next'}: {isFr ? exam.next.fr : exam.next.en}
                                    </span>
                                    <span className="material-symbols-outlined text-gray-400 group-hover:text-primary transition-colors text-xl">arrow_right_alt</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Recommended Resources */}
                <div className="mt-12">
                    <h2 className="text-2xl font-bold text-text-main mb-6">
                        {isFr ? 'Recommandé Pour Vous' : 'Recommended For You'}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            {
                                titleFr: 'Grammaire Essentielle en Usage', titleEn: 'Essential Grammar in Use',
                                descFr: 'Livre auto-didactique pour apprenants intermédiaires.', descEn: 'A self-study reference and practice book.',
                                tag: { fr: 'Livre', en: 'Book' }, tagClass: 'bg-white/90 text-text-main',
                                img: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&q=80',
                            },
                            {
                                titleFr: 'Masterclass Maths BAC', titleEn: 'SAT Math Masterclass',
                                descFr: 'Cours complet sur tous les concepts mathématiques du BAC.', descEn: 'Complete breakdown of every math concept tested.',
                                tag: { fr: 'Cours Vidéo', en: 'Video Course' }, tagClass: 'bg-primary/90 text-white',
                                img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&q=80',
                            },
                            {
                                titleFr: 'Conseils de Dernière Minute BAC', titleEn: 'Last Minute Tips',
                                descFr: 'Session live avec les meilleurs mentors pour la stratégie du jour J.', descEn: 'Live session with top mentors on exam day strategy.',
                                tag: { fr: 'Atelier Live', en: 'Live Workshop' }, tagClass: 'bg-purple-500/90 text-white',
                                img: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&q=80',
                            },
                        ].map((resource, i) => (
                            <div key={i} className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200 flex flex-col">
                                <div className="h-40 bg-cover bg-center relative" style={{ backgroundImage: `url('${resource.img}')` }}>
                                    <div className={`absolute top-3 right-3 text-xs font-bold px-2 py-1 rounded ${resource.tagClass}`}>
                                        {isFr ? resource.tag.fr : resource.tag.en}
                                    </div>
                                </div>
                                <div className="p-5 flex-1 flex flex-col">
                                    <h4 className="font-bold text-text-main text-lg mb-2">{isFr ? resource.titleFr : resource.titleEn}</h4>
                                    <p className="text-sm text-secondary mb-4 flex-1">{isFr ? resource.descFr : resource.descEn}</p>
                                    <button className="w-full mt-auto py-2 border border-gray-200 rounded-lg text-sm font-semibold text-secondary hover:bg-gray-50 transition-colors">
                                        {isFr ? 'Voir Détails' : 'View Details'}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    )
}
