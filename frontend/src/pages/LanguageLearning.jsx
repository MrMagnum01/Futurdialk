/**
 * Language Learning — Language practice cards with Moroccan student context.
 * Focus on languages most relevant for Moroccan students studying abroad.
 */

import { Link } from 'react-router-dom'
import { useTranslation, LanguageSwitcher } from '../i18n'

const languages = [
    { code: 'fr', flag: '🇫🇷', name: { fr: 'Français', en: 'French' }, level: 'B2', progress: 72, lessons: 24, examFr: 'TCF / DELF B2', examEn: 'TCF / DELF B2', nextFr: 'Subjonctif Présent', nextEn: 'Present Subjunctive', tipFr: 'Requis pour Campus France (B2 minimum)', tipEn: 'Required for Campus France (B2 minimum)' },
    { code: 'en', flag: '🇬🇧', name: { fr: 'Anglais', en: 'English' }, level: 'C1', progress: 88, lessons: 30, examFr: 'IELTS / TOEFL', examEn: 'IELTS / TOEFL', nextFr: 'Academic Writing', nextEn: 'Academic Writing', tipFr: 'IELTS 6.5+ pour les universités anglophones', tipEn: 'IELTS 6.5+ for English-speaking universities' },
    { code: 'de', flag: '🇩🇪', name: { fr: 'Allemand', en: 'German' }, level: 'A2', progress: 25, lessons: 40, examFr: 'TestDaF / Goethe B1', examEn: 'TestDaF / Goethe B1', nextFr: 'Accusatif & Datif', nextEn: 'Accusative & Dative', tipFr: 'Programmes en anglais disponibles aussi', tipEn: 'English-taught programs also available' },
    { code: 'es', flag: '🇪🇸', name: { fr: 'Espagnol', en: 'Spanish' }, level: 'A1', progress: 10, lessons: 35, examFr: 'DELE A2', examEn: 'DELE A2', nextFr: 'Verbes Réguliers', nextEn: 'Regular Verbs', tipFr: 'Utile pour les universités en Espagne', tipEn: 'Useful for universities in Spain' },
    { code: 'tr', flag: '🇹🇷', name: { fr: 'Turc', en: 'Turkish' }, level: 'A1', progress: 5, lessons: 45, examFr: 'TÖMER C1', examEn: 'TÖMER C1', nextFr: 'Alphabet & Salutations', nextEn: 'Alphabet & Greetings', tipFr: 'Cours TÖMER gratuits avec les bourses turques', tipEn: 'Free TÖMER courses with Turkish scholarships' },
]

const examResources = [
    { icon: '📝', titleFr: 'Pack TCF Complet', titleEn: 'Complete TCF Pack', descFr: '80 exercices + 4 simulations complètes', descEn: '80 exercises + 4 full simulations', tag: 'TCF' },
    { icon: '🎧', titleFr: 'IELTS Listening Master', titleEn: 'IELTS Listening Master', descFr: '50 audio exercises avec correction', descEn: '50 audio exercises with corrections', tag: 'IELTS' },
    { icon: '✍️', titleFr: 'DELF B2 Writing Lab', titleEn: 'DELF B2 Writing Lab', descFr: 'Modèles de production écrite + corrigés', descEn: 'Writing templates + model answers', tag: 'DELF' },
    { icon: '🗣️', titleFr: 'Speaking Practice IA', titleEn: 'AI Speaking Practice', descFr: 'Entraînement oral avec feedback IA', descEn: 'Oral practice with AI feedback', tag: 'TOEFL' },
]

export default function LanguageLearning() {
    const { lang } = useTranslation()
    const isFr = lang === 'fr'
    return (
        <div className="min-h-screen bg-bg-light flex flex-col">
            <header className="sticky top-0 z-50 bg-white border-b border-gray-200 px-6 py-3 lg:px-20 shadow-sm">
                <div className="flex items-center justify-between max-w-[1280px] mx-auto">
                    <Link to="/" className="flex items-center gap-2"><span className="material-symbols-outlined text-3xl text-primary">school</span><span className="text-xl font-bold text-text-main">Tawjihi</span></Link>
                    <div className="flex items-center gap-3"><LanguageSwitcher /><Link to="/dashboard" className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold">Dashboard</Link></div>
                </div>
            </header>
            <main className="flex-1 px-6 lg:px-20 py-8 max-w-[1280px] mx-auto w-full">
                {/* Hero */}
                <div className="bg-gradient-to-r from-cyan-600 to-sky-700 rounded-2xl p-8 md:p-12 mb-10 text-white relative overflow-hidden">
                    <div className="absolute -right-20 -top-20 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
                    <div className="relative z-10 max-w-2xl">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="material-symbols-outlined">translate</span>
                            <span className="text-sm font-bold uppercase tracking-wider">{isFr ? 'Apprentissage des Langues' : 'Language Learning'}</span>
                        </div>
                        <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-3">
                            {isFr ? 'Maîtrisez Vos Langues' : 'Master Your Languages'}
                        </h1>
                        <p className="text-cyan-100 text-lg">
                            {isFr ? "Préparez-vous aux examens de langue requis pour étudier à l'étranger." : "Prepare for the language exams required for studying abroad."}
                        </p>
                    </div>
                </div>

                {/* Daily streak */}
                <div className="bg-gradient-to-r from-primary to-blue-600 rounded-2xl p-6 text-white mb-8 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <span className="material-symbols-outlined text-4xl">local_fire_department</span>
                        <div><p className="font-bold text-lg">{isFr ? 'Série de 12 Jours !' : '12 Day Streak!'}</p><p className="text-blue-200 text-sm">{isFr ? 'Continuez à pratiquer quotidiennement.' : 'Keep practicing daily.'}</p></div>
                    </div>
                    <div className="text-center"><span className="text-3xl font-black block">156</span><span className="text-xs text-blue-200">XP {isFr ? "aujourd'hui" : 'today'}</span></div>
                </div>

                {/* Language cards */}
                <h2 className="text-2xl font-bold text-text-main mb-6">{isFr ? 'Vos Langues' : 'Your Languages'}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                    {languages.map(l => (
                        <Link key={l.code} to={`/learn/${l.code}`} className="group bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-lg hover:border-primary/30 transition-all flex flex-col">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <span className="text-3xl">{l.flag}</span>
                                    <div>
                                        <h3 className="text-xl font-bold text-text-main group-hover:text-primary">{isFr ? l.name.fr : l.name.en}</h3>
                                        <p className="text-sm text-secondary">{isFr ? 'Niveau' : 'Level'}: <span className="font-bold">{l.level}</span></p>
                                    </div>
                                </div>
                                <div className="w-14 h-14 rounded-full border-4 border-primary flex items-center justify-center">
                                    <span className="text-sm font-black text-primary">{l.progress}%</span>
                                </div>
                            </div>
                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-3">
                                <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${l.progress}%` }} />
                            </div>
                            <div className="bg-blue-50 rounded-lg p-2 mb-3">
                                <p className="text-xs font-medium text-primary flex items-center gap-1">
                                    <span className="material-symbols-outlined text-sm">info</span>
                                    {isFr ? l.examFr : l.examEn} — {isFr ? l.tipFr : l.tipEn}
                                </p>
                            </div>
                            <div className="flex justify-between text-sm text-secondary mt-auto">
                                <span>{l.lessons} {isFr ? 'leçons' : 'lessons'}</span>
                                <span className="text-primary font-medium">{isFr ? 'Suivant' : 'Next'}: {isFr ? l.nextFr : l.nextEn}</span>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Exam Resources */}
                <h2 className="text-2xl font-bold text-text-main mb-6 flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">library_books</span>
                    {isFr ? 'Ressources Examens' : 'Exam Resources'}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {examResources.map((r, i) => (
                        <div key={i} className="bg-white rounded-xl p-5 border border-gray-200 hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-2xl">{r.icon}</span>
                                <span className="text-xs font-bold bg-gray-100 px-2 py-0.5 rounded text-secondary">{r.tag}</span>
                            </div>
                            <h4 className="font-bold text-text-main mb-1">{isFr ? r.titleFr : r.titleEn}</h4>
                            <p className="text-sm text-secondary">{isFr ? r.descFr : r.descEn}</p>
                            <button className="mt-4 w-full text-sm font-bold text-primary py-2 border border-primary/20 rounded-lg hover:bg-blue-50 transition-colors">
                                {isFr ? 'Commencer' : 'Start'}
                            </button>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    )
}
