/**
 * Landing Page — Tawjihi homepage.
 * All text via i18n — French default for Moroccan market.
 */

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation, LanguageSwitcher } from '../i18n'
import { getPrograms, getScholarships, getSchools } from '../api'

export default function Landing() {
    const { t } = useTranslation()
    const [stats, setStats] = useState({ programs: '60+', schools: '30+', scholarships: '15+' })

    useEffect(() => {
        Promise.all([
            getPrograms({ per_page: 1 }).then(d => d.total).catch(() => 60),
            getSchools({ per_page: 1 }).then(d => d.total).catch(() => 30),
            getScholarships({}).then(d => d.total).catch(() => 15),
        ]).then(([p, s, sc]) => setStats({ programs: `${p}+`, schools: `${s}+`, scholarships: `${sc}+` }))
    }, [])

    return (
        <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-bg-light">
            {/* Header */}
            <header className="sticky top-0 z-50 flex items-center justify-between whitespace-nowrap border-b border-gray-200 bg-white px-6 py-3 lg:px-20 shadow-sm">
                <Link to="/" className="flex items-center gap-3 text-text-main">
                    <span className="material-symbols-outlined text-3xl text-primary">school</span>
                    <h2 className="text-xl font-bold tracking-tight">Tawjihi</h2>
                </Link>
                <div className="hidden lg:flex flex-1 justify-end gap-8">
                    <nav className="flex items-center gap-9">
                        <Link to="/explore" className="text-sm font-medium text-text-main hover:text-primary transition-colors">{t('header.explore')}</Link>
                        <Link to="/prep" className="text-sm font-medium text-text-main hover:text-primary transition-colors">{t('header.examPrep')}</Link>
                        <Link to="/career" className="text-sm font-medium text-text-main hover:text-primary transition-colors">{t('header.careerAI')}</Link>
                        <Link to="/community" className="text-sm font-medium text-text-main hover:text-primary transition-colors">{t('header.community')}</Link>
                    </nav>
                    <div className="flex items-center gap-2">
                        <LanguageSwitcher />
                        <Link to="/login" className="flex min-w-[84px] items-center justify-center rounded-lg h-10 px-4 bg-gray-100 text-text-main text-sm font-bold hover:bg-gray-200 transition-colors">
                            {t('header.login')}
                        </Link>
                        <Link to="/register" className="flex min-w-[84px] items-center justify-center rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold hover:bg-primary-hover transition-colors shadow-md">
                            {t('header.register')}
                        </Link>
                    </div>
                </div>
                <div className="lg:hidden flex items-center gap-2">
                    <LanguageSwitcher />
                    <span className="material-symbols-outlined text-text-main">menu</span>
                </div>
            </header>

            <main className="flex-1">
                <div className="w-full flex flex-1 justify-center py-5">
                    <div className="flex flex-col max-w-[1200px] flex-1 px-4 md:px-8">

                        {/* Hero */}
                        <div className="mb-12">
                            <div className="rounded-2xl overflow-hidden shadow-xl">
                                <div
                                    className="flex min-h-[560px] flex-col gap-6 bg-cover bg-center bg-no-repeat items-start justify-end px-6 pb-12 pt-32 md:px-16"
                                    style={{
                                        backgroundImage: `linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.3) 60%, rgba(0,0,0,0.1) 100%), url("https://images.unsplash.com/photo-1523050854058-8df90110c476?w=1600&q=80")`
                                    }}
                                >
                                    <div className="flex flex-col gap-4 text-left max-w-3xl">
                                        <div className="inline-flex items-center rounded-full bg-blue-500/20 px-3 py-1 text-xs font-medium text-blue-100 backdrop-blur-md border border-blue-400/30 w-fit">
                                            <span className="material-symbols-outlined text-sm mr-1">star</span>
                                            {t('landing.badge')}
                                        </div>
                                        <h1 className="text-white text-4xl font-black leading-tight tracking-tight md:text-6xl drop-shadow-lg">
                                            {t('landing.heroTitle1')}<br />
                                            <span className="text-primary">{t('landing.heroTitle2')}</span>
                                        </h1>
                                        <p className="text-gray-200 text-lg font-normal leading-relaxed md:text-xl max-w-2xl drop-shadow-md">
                                            {t('landing.heroDesc')}
                                        </p>
                                    </div>
                                    <div className="flex flex-wrap gap-4 mt-4">
                                        <Link
                                            to="/register"
                                            className="flex min-w-[140px] items-center justify-center rounded-lg h-12 px-6 bg-primary text-white text-base font-bold hover:bg-primary-hover transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                                        >
                                            {t('landing.getStarted')}
                                        </Link>
                                        <Link
                                            to="/explore"
                                            className="flex min-w-[140px] items-center justify-center rounded-lg h-12 px-6 bg-white/10 backdrop-blur-sm border border-white/30 text-white text-base font-bold hover:bg-white/20 transition-all"
                                        >
                                            {t('landing.browsePrograms')}
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Stats — live from API */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16 py-8 border-y border-gray-200">
                            {[
                                { value: stats.programs, label: t('landing.statsExams') },
                                { value: stats.schools, label: t('landing.statsSchools') },
                                { value: '10K+', label: t('landing.statsStudents') },
                                { value: stats.scholarships, label: t('landing.statsCountries') },
                            ].map((stat) => (
                                <div key={stat.label} className="flex flex-col items-center text-center">
                                    <span className="text-3xl font-black text-primary mb-1">{stat.value}</span>
                                    <span className="text-sm font-medium text-secondary">{stat.label}</span>
                                </div>
                            ))}
                        </div>

                        {/* Features — user-facing value props, no system details */}
                        <div className="flex flex-col gap-10 py-10">
                            <div className="flex flex-col gap-4 text-center">
                                <h2 className="text-3xl font-bold text-text-main leading-tight md:text-4xl">
                                    {t('landing.featuresTitle')}
                                </h2>
                                <p className="text-secondary text-lg max-w-2xl mx-auto">
                                    {t('landing.featuresSubtitle')}
                                </p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {[
                                    { icon: 'quiz', title: t('landing.feature1Title'), desc: t('landing.feature1Desc') },
                                    { icon: 'psychology', title: t('landing.feature2Title'), desc: t('landing.feature2Desc') },
                                    { icon: 'route', title: t('landing.feature3Title'), desc: t('landing.feature3Desc') },
                                    { icon: 'description', title: t('landing.feature4Title'), desc: t('landing.feature4Desc') },
                                    { icon: 'groups', title: t('landing.feature5Title'), desc: t('landing.feature5Desc') },
                                    { icon: 'smart_toy', title: t('landing.feature6Title'), desc: t('landing.feature6Desc') },
                                ].map((feature) => (
                                    <div key={feature.title} className="group flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-6 hover:shadow-lg transition-all hover:-translate-y-1">
                                        <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-primary">
                                            <span className="material-symbols-outlined text-3xl">{feature.icon}</span>
                                        </div>
                                        <h3 className="text-xl font-bold text-text-main">{feature.title}</h3>
                                        <p className="text-secondary text-base leading-relaxed">{feature.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* CTA */}
                        <div className="my-16 rounded-2xl bg-gradient-to-r from-primary to-blue-600 p-8 md:p-12 text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl">
                            <div className="flex flex-col gap-4 max-w-xl">
                                <h2 className="text-3xl font-bold text-white">{t('landing.ctaTitle')}</h2>
                                <p className="text-blue-100 text-lg">{t('landing.ctaDesc')}</p>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link to="/register" className="px-8 py-4 bg-white text-primary rounded-lg font-bold hover:bg-gray-100 transition-colors shadow-lg">
                                    {t('landing.getStarted')}
                                </Link>
                                <Link to="/explore" className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-lg font-bold hover:bg-white/10 transition-colors">
                                    {t('landing.browsePrograms')}
                                </Link>
                            </div>
                        </div>

                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-white border-t border-gray-200 pt-16 pb-8">
                <div className="container mx-auto px-6 lg:px-20">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                        <div>
                            <div className="flex items-center gap-2 text-text-main mb-4">
                                <span className="material-symbols-outlined text-primary">school</span>
                                <span className="text-lg font-bold">Tawjihi</span>
                            </div>
                            <p className="text-secondary text-sm leading-relaxed">
                                {t('landing.footerDesc')}
                            </p>
                        </div>
                        <div>
                            <h4 className="font-bold text-text-main mb-4">{t('landing.footerPlatform')}</h4>
                            <ul className="space-y-2 text-sm text-secondary">
                                <li><Link to="/explore" className="hover:text-primary">{t('landing.footerExplore')}</Link></li>
                                <li><Link to="/prep" className="hover:text-primary">{t('landing.footerExamPrep')}</Link></li>
                                <li><Link to="/career" className="hover:text-primary">{t('landing.footerCareer')}</Link></li>
                                <li><Link to="/scholarships" className="hover:text-primary">{t('landing.footerScholarships')}</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold text-text-main mb-4">{t('landing.footerResources')}</h4>
                            <ul className="space-y-2 text-sm text-secondary">
                                <li><Link to="/community" className="hover:text-primary">{t('landing.footerCommunity')}</Link></li>
                                <li><Link to="/community/stories" className="hover:text-primary">{t('landing.footerStories')}</Link></li>
                                <li><Link to="/housing" className="hover:text-primary">{t('landing.footerHousing')}</Link></li>
                                <li><Link to="/marketplace" className="hover:text-primary">{t('landing.footerServices')}</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold text-text-main mb-4">{t('landing.footerSupport')}</h4>
                            <ul className="space-y-2 text-sm text-secondary">
                                <li><a href="#" className="hover:text-primary">{t('landing.footerContact')}</a></li>
                                <li><a href="#" className="hover:text-primary">{t('landing.footerPrivacy')}</a></li>
                                <li><a href="#" className="hover:text-primary">{t('landing.footerTerms')}</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-gray-200 pt-8 text-center">
                        <p className="text-sm text-secondary">{t('landing.footerCopyright')}</p>
                    </div>
                </div>
            </footer>
        </div>
    )
}
