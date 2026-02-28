/**
 * Onboarding — 5-step wizard for new users.
 * Step 1: Who are you? (role)
 * Step 2: Education level
 * Step 3: Study abroad preferences
 * Step 4: Language proficiencies
 * Step 5: Summary & results
 */

import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useTranslation, LanguageSwitcher } from '../i18n'
import { completeOnboarding, isAuthenticated } from '../api'

const TOTAL_STEPS = 5

const stepConfig = {
    1: {
        titleFr: 'Bienvenue sur FuturDialk',
        titleEn: 'Welcome to FuturDialk',
        subtitleFr: 'Personnalisons votre expérience. Quelle description vous correspond le mieux ?',
        subtitleEn: "Let's personalize your journey. Which best describes you?",
        field: 'user_type',
        type: 'cards',
        options: [
            { value: 'high_school', labelFr: 'Lycéen', labelEn: 'High School Student', descFr: 'Préparant le Bac', descEn: 'Preparing for Baccalauréat', icon: 'school', img: 'https://images.unsplash.com/photo-1523050854058-8df90110c476?w=400&q=80' },
            { value: 'undergraduate', labelFr: 'Universitaire', labelEn: 'Undergraduate', descFr: 'Actuellement en licence', descEn: 'Currently enrolled in university', icon: 'account_balance', img: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=400&q=80' },
            { value: 'graduate', labelFr: 'Master / Doctorat', labelEn: 'Graduate', descFr: 'Master ou Doctorat', descEn: "Pursuing Master's or PhD", icon: 'biotech', img: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&q=80' },
            { value: 'parent', labelFr: 'Parent', labelEn: 'Parent', descFr: "J'accompagne mon enfant", descEn: "Supporting my child's education", icon: 'family_restroom', img: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=400&q=80' },
        ],
    },
    2: {
        titleFr: 'Votre Parcours Académique',
        titleEn: 'Your Education',
        subtitleFr: 'Dites-nous en plus sur votre formation.',
        subtitleEn: 'Tell us more about your education background.',
        field: 'education_level',
        type: 'cards',
        options: [
            { value: 'bac', labelFr: 'Baccalauréat', labelEn: 'High School Diploma', icon: 'verified' },
            { value: 'licence', labelFr: 'Licence (Bac+3)', labelEn: "Bachelor's Degree", icon: 'school' },
            { value: 'master', labelFr: 'Master (Bac+5)', labelEn: "Master's Degree", icon: 'workspace_premium' },
            { value: 'doctorat', labelFr: 'Doctorat', labelEn: 'PhD', icon: 'psychology' },
        ],
    },
    3: {
        titleFr: 'Où souhaitez-vous étudier ?',
        titleEn: 'Where do you want to study?',
        subtitleFr: 'Sélectionnez les pays qui vous intéressent.',
        subtitleEn: 'Select the countries you are interested in.',
        field: 'target_countries',
        type: 'multi',
        options: [
            { value: 'FR', labelFr: '🇫🇷 France', labelEn: '🇫🇷 France' },
            { value: 'CA', labelFr: '🇨🇦 Canada', labelEn: '🇨🇦 Canada' },
            { value: 'DE', labelFr: '🇩🇪 Allemagne', labelEn: '🇩🇪 Germany' },
            { value: 'ES', labelFr: '🇪🇸 Espagne', labelEn: '🇪🇸 Spain' },
            { value: 'UK', labelFr: '🇬🇧 Royaume-Uni', labelEn: '🇬🇧 United Kingdom' },
            { value: 'US', labelFr: '🇺🇸 États-Unis', labelEn: '🇺🇸 United States' },
            { value: 'TR', labelFr: '🇹🇷 Turquie', labelEn: '🇹🇷 Turkey' },
            { value: 'IT', labelFr: '🇮🇹 Italie', labelEn: '🇮🇹 Italy' },
            { value: 'NL', labelFr: '🇳🇱 Pays-Bas', labelEn: '🇳🇱 Netherlands' },
            { value: 'BE', labelFr: '🇧🇪 Belgique', labelEn: '🇧🇪 Belgium' },
            { value: 'CH', labelFr: '🇨🇭 Suisse', labelEn: '🇨🇭 Switzerland' },
            { value: 'OTHER', labelFr: '🌍 Autre', labelEn: '🌍 Other' },
        ],
    },
    4: {
        titleFr: 'Vos Langues',
        titleEn: 'Your Languages',
        subtitleFr: 'Quelles langues parlez-vous ?',
        subtitleEn: 'Which languages do you speak?',
        field: 'languages',
        type: 'multi',
        options: [
            { value: 'ar', labelFr: '🇲🇦 Arabe (Darija)', labelEn: '🇲🇦 Arabic (Darija)' },
            { value: 'fr', labelFr: '🇫🇷 Français', labelEn: '🇫🇷 French' },
            { value: 'en', labelFr: '🇬🇧 Anglais', labelEn: '🇬🇧 English' },
            { value: 'es', labelFr: '🇪🇸 Espagnol', labelEn: '🇪🇸 Spanish' },
            { value: 'de', labelFr: '🇩🇪 Allemand', labelEn: '🇩🇪 German' },
            { value: 'it', labelFr: '🇮🇹 Italien', labelEn: '🇮🇹 Italian' },
            { value: 'tr', labelFr: '🇹🇷 Turc', labelEn: '🇹🇷 Turkish' },
            { value: 'zh', labelFr: '🇨🇳 Chinois', labelEn: '🇨🇳 Chinese' },
        ],
    },
    5: {
        titleFr: 'Tout est prêt ! 🎉',
        titleEn: 'All set! 🎉',
        subtitleFr: 'Votre profil est configuré. Voici vos prochaines étapes.',
        subtitleEn: 'Your profile is set up. Here are your next steps.',
        type: 'summary',
    },
}

export default function Onboarding() {
    const { step } = useParams()
    const navigate = useNavigate()
    const { lang } = useTranslation()
    const currentStep = parseInt(step) || 1
    const config = stepConfig[currentStep]
    const progress = (currentStep / TOTAL_STEPS) * 100

    const [data, setData] = useState({
        user_type: '',
        education_level: '',
        target_countries: [],
        languages: [],
    })
    const [submitting, setSubmitting] = useState(false)

    function select(field, value, isMulti = false) {
        if (isMulti) {
            setData((prev) => ({
                ...prev,
                [field]: prev[field].includes(value)
                    ? prev[field].filter((v) => v !== value)
                    : [...prev[field], value],
            }))
        } else {
            setData((prev) => ({ ...prev, [field]: value }))
        }
    }

    async function goNext() {
        if (currentStep < TOTAL_STEPS) {
            navigate(`/onboarding/step/${currentStep + 1}`)
        } else {
            // Submit onboarding data to API if authenticated
            if (isAuthenticated()) {
                setSubmitting(true)
                try {
                    await completeOnboarding({
                        education_level: data.education_level,
                        preferred_countries: data.target_countries,
                        preferred_languages: data.languages,
                    })
                } catch { /* best-effort */ }
                setSubmitting(false)
            }
            navigate('/dashboard')
        }
    }

    function goBack() {
        if (currentStep > 1) {
            navigate(`/onboarding/step/${currentStep - 1}`)
        }
    }

    const isFr = lang === 'fr'

    return (
        <div className="min-h-screen bg-bg-light flex flex-col">
            {/* Header */}
            <header className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-3 lg:px-20">
                <Link to="/" className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-3xl text-primary">school</span>
                    <span className="text-xl font-bold text-text-main">FuturDialk</span>
                </Link>
                <div className="flex items-center gap-4">
                    <LanguageSwitcher />
                    <span className="text-sm text-secondary">
                        {isFr ? 'Déjà un compte ?' : 'Already have an account?'}
                    </span>
                    <Link to="/login" className="px-4 py-2 bg-gray-100 rounded-lg text-sm font-bold hover:bg-gray-200">
                        {isFr ? 'Se connecter' : 'Sign In'}
                    </Link>
                </div>
            </header>

            <main className="flex-1 flex justify-center py-10 px-4">
                <div className="flex flex-col w-full max-w-[960px] gap-8">
                    {/* Progress bar */}
                    <div className="flex flex-col gap-3">
                        <div className="flex gap-6 justify-between items-end">
                            <p className="text-lg font-bold text-text-main">
                                {isFr ? `Étape ${currentStep} sur ${TOTAL_STEPS}` : `Step ${currentStep} of ${TOTAL_STEPS}`}
                            </p>
                            <p className="text-primary font-bold text-sm">{Math.round(progress)}%</p>
                        </div>
                        <div className="h-3 w-full rounded-full bg-gray-200 overflow-hidden">
                            <div
                                className="h-full rounded-full bg-primary transition-all duration-500 ease-out"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>

                    {/* Title */}
                    <div className="flex flex-col gap-2">
                        <h1 className="text-4xl md:text-5xl font-bold text-text-main tracking-tight">
                            {isFr ? config.titleFr : config.titleEn}
                        </h1>
                        <p className="text-secondary text-lg max-w-2xl">
                            {isFr ? config.subtitleFr : config.subtitleEn}
                        </p>
                    </div>

                    {/* Content */}
                    {config.type === 'cards' && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {config.options.map((opt) => {
                                const isSelected = data[config.field] === opt.value
                                return (
                                    <button
                                        key={opt.value}
                                        onClick={() => select(config.field, opt.value)}
                                        className={`group relative flex flex-col gap-4 p-4 pb-6 rounded-xl border-2 bg-white shadow-sm cursor-pointer transition-all duration-200 text-left ${isSelected
                                            ? 'border-primary bg-blue-50 shadow-lg'
                                            : 'border-transparent hover:border-primary/30 hover:shadow-md'
                                            }`}
                                    >
                                        {/* Check indicator */}
                                        <div className={`absolute top-4 right-4 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${isSelected ? 'border-primary bg-primary' : 'border-gray-200'
                                            }`}>
                                            {isSelected && (
                                                <span className="material-symbols-outlined text-white text-sm">check</span>
                                            )}
                                        </div>
                                        {/* Image */}
                                        {opt.img && (
                                            <div className="w-full aspect-[4/3] rounded-xl bg-gray-100 overflow-hidden">
                                                <img src={opt.img} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                            </div>
                                        )}
                                        {/* Icon fallback */}
                                        {!opt.img && (
                                            <div className="w-full aspect-[4/3] rounded-xl bg-blue-50 flex items-center justify-center">
                                                <span className="material-symbols-outlined text-5xl text-primary">{opt.icon}</span>
                                            </div>
                                        )}
                                        <div className="flex flex-col gap-1">
                                            <p className="text-lg font-bold text-text-main">{isFr ? opt.labelFr : opt.labelEn}</p>
                                            {opt.descFr && <p className="text-sm text-secondary">{isFr ? opt.descFr : opt.descEn}</p>}
                                        </div>
                                    </button>
                                )
                            })}
                        </div>
                    )}

                    {config.type === 'multi' && (
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                            {config.options.map((opt) => {
                                const isSelected = data[config.field]?.includes(opt.value)
                                return (
                                    <button
                                        key={opt.value}
                                        onClick={() => select(config.field, opt.value, true)}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all ${isSelected
                                            ? 'border-primary bg-blue-50 text-primary font-bold'
                                            : 'border-gray-200 bg-white text-text-main hover:border-primary/30'
                                            }`}
                                    >
                                        {isSelected && <span className="material-symbols-outlined text-primary text-lg">check_circle</span>}
                                        <span className="text-sm">{isFr ? opt.labelFr : opt.labelEn}</span>
                                    </button>
                                )
                            })}
                        </div>
                    )}

                    {config.type === 'summary' && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-gradient-to-br from-primary to-blue-600 rounded-2xl p-6 text-center text-white shadow-lg">
                                <span className="material-symbols-outlined text-4xl mb-3 block">quiz</span>
                                <h3 className="font-bold text-lg mb-1">{isFr ? 'Préparation Examens' : 'Exam Prep'}</h3>
                                <p className="text-blue-100 text-sm">{isFr ? 'Commencez avec un test diagnostic' : 'Start with a diagnostic test'}</p>
                            </div>
                            <div className="bg-white rounded-2xl border border-gray-200 p-6 text-center shadow-sm">
                                <span className="material-symbols-outlined text-4xl text-primary mb-3 block">explore</span>
                                <h3 className="font-bold text-lg text-text-main mb-1">{isFr ? 'Explorer' : 'Explore'}</h3>
                                <p className="text-secondary text-sm">{isFr ? 'Découvrez des programmes adaptés' : 'Discover programs matched to you'}</p>
                            </div>
                            <div className="bg-white rounded-2xl border border-gray-200 p-6 text-center shadow-sm">
                                <span className="material-symbols-outlined text-4xl text-primary mb-3 block">route</span>
                                <h3 className="font-bold text-lg text-text-main mb-1">{isFr ? 'Votre Roadmap' : 'Your Roadmap'}</h3>
                                <p className="text-secondary text-sm">{isFr ? 'Plan personnalisé étape par étape' : 'Personalized step-by-step plan'}</p>
                            </div>
                        </div>
                    )}

                    {/* Navigation */}
                    <div className="flex justify-between items-center pt-8 border-t border-gray-200 mt-4">
                        <button
                            onClick={goBack}
                            className={`flex items-center gap-2 text-secondary font-bold hover:text-text-main transition-colors ${currentStep === 1 ? 'invisible' : ''
                                }`}
                        >
                            <span className="material-symbols-outlined">arrow_back</span>
                            {isFr ? 'Retour' : 'Back'}
                        </button>
                        <button
                            onClick={goNext}
                            disabled={submitting}
                            className="flex min-w-[200px] items-center justify-center gap-2 rounded-xl h-14 px-8 bg-primary text-white text-lg font-bold shadow-lg hover:bg-primary-hover active:scale-95 transition-all disabled:opacity-50"
                        >
                            <span>{submitting ? (isFr ? 'Enregistrement...' : 'Saving...') : currentStep === TOTAL_STEPS ? (isFr ? 'Commencer !' : "Let's Go!") : (isFr ? 'Suivant' : 'Next Step')}</span>
                            {!submitting && <span className="material-symbols-outlined">arrow_forward</span>}
                        </button>
                    </div>
                </div>
            </main>
        </div>
    )
}
