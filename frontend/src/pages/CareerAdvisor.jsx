/**
 * Career Advisor Home — AI-powered career guidance with career paths and alumni stories.
 * Based on Stitch career_advisor_home_career design.
 */

import { Link } from 'react-router-dom'
import { useTranslation, LanguageSwitcher } from '../i18n'

const careerPaths = [
    { icon: 'memory', titleFr: 'Ingénierie & Tech', titleEn: 'Engineering & Tech', descFr: 'Développement logiciel, IA, génie civil, et robotique.', descEn: 'Software development, AI research, civil engineering, and robotics.', color: 'bg-blue-50 text-blue-600' },
    { icon: 'stethoscope', titleFr: 'Sciences Médicales', titleEn: 'Medical Sciences', descFr: 'Médecine, pharmacie, et recherche biotech.', descEn: 'Medicine, pharmacy, and cutting-edge biotech research.', color: 'bg-red-50 text-red-600' },
    { icon: 'gavel', titleFr: 'Commerce & Droit', titleEn: 'Business & Law', descFr: 'Droit international, finance, entrepreneuriat.', descEn: 'Corporate law, international finance, entrepreneurship.', color: 'bg-purple-50 text-purple-600' },
    { icon: 'palette', titleFr: 'Arts & Design', titleEn: 'Arts & Design', descFr: 'Design graphique, architecture, beaux-arts, médias.', descEn: 'Graphic design, architecture, fine arts, digital media.', color: 'bg-orange-50 text-orange-600' },
    { icon: 'eco', titleFr: 'Sciences Environnementales', titleEn: 'Environmental Science', descFr: 'Développement durable, écologie, énergies renouvelables.', descEn: 'Sustainability, ecology, renewable energy.', color: 'bg-green-50 text-green-600' },
    { icon: 'psychology', titleFr: 'Psychologie & Social', titleEn: 'Psychology & Social', descFr: 'Psychologie clinique, travail social, action communautaire.', descEn: 'Clinical psychology, counseling, social work.', color: 'bg-teal-50 text-teal-600' },
]

const alumni = [
    { nameFr: 'Parcours de Dr. Amina', nameEn: "Dr. Amina's Journey", field: { fr: 'Médecine', en: 'Medicine' }, quoteFr: '"Le programme de mentorat m\'a aidée à choisir la bonne spécialisation."', quoteEn: '"The mentorship program helped me choose the right specialization."', img: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&q=80' },
    { nameFr: "Startup Tech d'Amine", nameEn: "Ahmed's Tech Startup", field: { fr: 'Technologie', en: 'Technology' }, quoteFr: '"Le test d\'aptitude a clarifié mes forces en logique de programmation."', quoteEn: '"The aptitude test clarified my strengths in software logic."', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80' },
    { nameFr: 'Carrière Juridique de Leila', nameEn: "Layla's Legal Career", field: { fr: 'Droit', en: 'Law' }, quoteFr: '"J\'avais besoin d\'une feuille de route pour réaliser mon rêve de justice."', quoteEn: '"Advocating for justice was always a dream, but I needed the roadmap."', img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&q=80' },
    { nameFr: "Studio Design d'Omar", nameEn: "Omar's Design Studio", field: { fr: 'Design', en: 'Design' }, quoteFr: '"Mon mentor m\'a encouragé à poursuivre ma créativité professionnellement."', quoteEn: '"My mentor encouraged me to pursue my creative side professionally."', img: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&q=80' },
]

export default function CareerAdvisor() {
    const { lang } = useTranslation()
    const isFr = lang === 'fr'

    return (
        <div className="min-h-screen bg-bg-light flex flex-col">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200 px-6 py-3 lg:px-20 shadow-sm">
                <div className="flex items-center justify-between max-w-[1280px] mx-auto">
                    <Link to="/" className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-3xl text-primary">school</span>
                        <span className="text-xl font-bold text-text-main">FuturDialk</span>
                    </Link>
                    <nav className="hidden md:flex items-center gap-8">
                        <Link to="/" className="text-sm font-medium text-secondary hover:text-primary">{isFr ? 'Accueil' : 'Home'}</Link>
                        <Link to="/explore" className="text-sm font-medium text-secondary hover:text-primary">{isFr ? 'Programmes' : 'Programs'}</Link>
                        <Link to="/career" className="text-sm font-bold text-primary">{isFr ? 'Carrière IA' : 'Career Advisor'}</Link>
                    </nav>
                    <div className="flex items-center gap-3">
                        <LanguageSwitcher />
                        <Link to="/login" className="px-4 py-2 bg-gray-100 rounded-lg text-sm font-bold hover:bg-gray-200">{isFr ? 'Connexion' : 'Sign In'}</Link>
                        <Link to="/register" className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold hover:bg-primary-hover shadow-lg">{isFr ? "S'inscrire" : 'Register'}</Link>
                    </div>
                </div>
            </header>

            <main className="flex-grow">
                {/* Hero */}
                <div className="px-4 py-6 md:px-10">
                    <div className="relative flex min-h-[480px] flex-col gap-6 overflow-hidden rounded-2xl bg-slate-900 px-6 py-16 md:py-24 items-center justify-center text-center shadow-2xl">
                        <div className="absolute inset-0 z-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#3b82f6 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
                        <div className="relative z-10 flex flex-col items-center gap-6 max-w-4xl">
                            <div className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary backdrop-blur-sm">
                                <span className="material-symbols-outlined mr-2 text-lg">auto_awesome</span>
                                {isFr ? 'Orientation IA' : 'AI-Powered Career Guidance'}
                            </div>
                            <h1 className="text-white text-4xl md:text-6xl font-black leading-tight tracking-tight">
                                {isFr ? 'Trouvez Votre Vocation' : 'Find Your True Calling'}
                            </h1>
                            <p className="text-gray-300 text-lg md:text-xl max-w-2xl leading-relaxed">
                                {isFr
                                    ? "Naviguez votre avenir avec confiance grâce à nos outils d'orientation IA et notre mentorat expert."
                                    : 'Navigate your future with confidence using our AI-powered career guidance tools and expert mentorship.'}
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 mt-4">
                                <Link to="/career/discover" className="flex h-14 items-center justify-center gap-3 rounded-xl bg-primary px-8 text-base font-bold text-white shadow-lg hover:scale-105 transition-all">
                                    <span className="material-symbols-outlined">quiz</span>
                                    {isFr ? 'Lancer le Quiz' : 'Start Discovery Quiz'}
                                </Link>
                                <button className="flex h-14 items-center justify-center gap-3 rounded-xl bg-white/10 px-8 text-base font-bold text-white backdrop-blur-sm hover:bg-white/20 transition-all">
                                    <span className="material-symbols-outlined">smart_toy</span>
                                    {isFr ? 'Discuter avec IA' : 'Chat with AI Mentor'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Career Paths Grid */}
                <div className="px-6 py-16 lg:px-20 max-w-[1280px] mx-auto">
                    <div className="flex flex-col gap-12">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-black text-text-main tracking-tight">
                                {isFr ? 'Explorer les Parcours' : 'Explore Career Paths'}
                            </h2>
                            <p className="text-secondary text-lg mt-2 max-w-2xl">
                                {isFr ? 'Découvrez les professions les plus demandées et ce qu\'il faut pour y réussir.' : 'Discover the most in-demand professions and what it takes to succeed.'}
                            </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {careerPaths.map((cp) => (
                                <Link key={cp.icon} to={`/career/path/${cp.icon}`} className="group flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-6 transition-all hover:border-primary hover:shadow-xl">
                                    <div className={`w-12 h-12 rounded-full ${cp.color} flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors`}>
                                        <span className="material-symbols-outlined text-2xl">{cp.icon}</span>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <h3 className="text-xl font-bold text-text-main">{isFr ? cp.titleFr : cp.titleEn}</h3>
                                        <p className="text-secondary">{isFr ? cp.descFr : cp.descEn}</p>
                                    </div>
                                    <span className="mt-auto flex items-center text-sm font-bold text-primary group-hover:translate-x-1 transition-transform">
                                        {isFr ? 'Explorer' : 'Explore Path'} <span className="material-symbols-outlined ml-1 text-lg">arrow_forward</span>
                                    </span>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Alumni Stories */}
                <div className="bg-white py-16">
                    <div className="px-6 lg:px-20 max-w-[1280px] mx-auto mb-8">
                        <h2 className="text-3xl md:text-4xl font-black text-text-main tracking-tight">
                            {isFr ? 'Témoignages Alumni' : 'Alumni Success Stories'}
                        </h2>
                        <p className="text-secondary mt-2">{isFr ? 'Découvrez où leurs choix les ont menés.' : 'See where their choices took them.'}</p>
                    </div>
                    <div className="flex overflow-x-auto pb-8 px-6 lg:px-20 gap-6 scrollbar-hide snap-x">
                        {alumni.map((a, i) => (
                            <div key={i} className="min-w-[280px] md:min-w-[320px] snap-center">
                                <div className="group flex h-full flex-col overflow-hidden rounded-xl bg-gray-50 shadow-sm hover:-translate-y-1 transition-transform">
                                    <div className="relative aspect-[4/5] w-full overflow-hidden">
                                        <img src={a.img} alt="" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                        <div className="absolute bottom-4 left-4 text-white">
                                            <p className="text-xs font-bold uppercase tracking-wider text-primary">{isFr ? a.field.fr : a.field.en}</p>
                                            <h3 className="text-lg font-bold">{isFr ? a.nameFr : a.nameEn}</h3>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-2 p-5">
                                        <p className="text-secondary text-sm leading-relaxed">{isFr ? a.quoteFr : a.quoteEn}</p>
                                        <a href="#" className="text-sm font-bold text-text-main underline decoration-primary decoration-2 underline-offset-4 mt-2">
                                            {isFr ? 'Lire le Témoignage' : 'Read Story'}
                                        </a>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* CTA */}
                <div className="px-6 py-16 lg:px-20 max-w-[1280px] mx-auto">
                    <div className="relative overflow-hidden rounded-2xl bg-slate-900 px-6 py-16 text-center md:px-16 md:py-24">
                        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(45deg, #3b82f6 25%, transparent 25%, transparent 50%, #3b82f6 50%, #3b82f6 75%, transparent 75%, transparent)', backgroundSize: '60px 60px' }} />
                        <div className="relative z-10 flex flex-col items-center gap-6">
                            <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center shadow-lg">
                                <span className="material-symbols-outlined text-3xl">lightbulb</span>
                            </div>
                            <h2 className="text-white text-3xl md:text-5xl font-black max-w-2xl leading-tight">
                                {isFr ? 'Pas sûr par où commencer ?' : 'Not sure where to start?'}
                            </h2>
                            <p className="text-gray-300 text-lg max-w-2xl">
                                {isFr
                                    ? 'Passez notre test de personnalité de 5 minutes pour obtenir des recommandations personnalisées.'
                                    : 'Take our 5-minute personality and aptitude test to get personalized career recommendations.'}
                            </p>
                            <Link to="/career/discover" className="mt-4 flex h-14 min-w-[200px] items-center justify-center rounded-xl bg-primary px-8 text-lg font-bold text-white shadow-lg hover:-translate-y-1 transition-all">
                                {isFr ? 'Passer le Quiz' : 'Take the Quiz'}
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
