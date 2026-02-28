/**
 * StubPage — Placeholder for pages not yet implemented.
 * Clean user-facing message — no system internals.
 */

import { Link } from 'react-router-dom'
import { useTranslation, LanguageSwitcher } from '../i18n'

export default function StubPage({ title = '' }) {
    const { t } = useTranslation()

    return (
        <div className="min-h-screen bg-bg-light flex flex-col">
            {/* Header */}
            <header className="sticky top-0 z-50 flex items-center justify-between border-b border-gray-200 bg-white px-6 py-3 lg:px-20 shadow-sm">
                <Link to="/" className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-3xl text-primary">school</span>
                    <span className="text-xl font-bold text-text-main">Tawjihi</span>
                </Link>
                <div className="flex items-center gap-2">
                    <LanguageSwitcher />
                    <Link to="/login" className="px-4 py-2 text-sm font-bold text-text-main bg-gray-100 rounded-lg hover:bg-gray-200">{t('common.login')}</Link>
                    <Link to="/register" className="px-4 py-2 text-sm font-bold text-white bg-primary rounded-lg hover:bg-primary-hover">{t('common.register')}</Link>
                </div>
            </header>

            {/* Content */}
            <main className="flex-1 flex items-center justify-center p-8">
                <div className="text-center max-w-lg">
                    <span className="material-symbols-outlined text-6xl text-primary mb-4 block">construction</span>
                    <h1 className="text-3xl font-bold text-text-main mb-3">{title || t('stub.comingSoon')}</h1>
                    <p className="text-text-sub text-lg mb-6">{t('stub.comingSoonDesc')}</p>
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg font-bold hover:bg-primary-hover shadow-md"
                    >
                        <span className="material-symbols-outlined text-lg">arrow_back</span>
                        {t('stub.backHome')}
                    </Link>
                </div>
            </main>
        </div>
    )
}
