/**
 * Login Page — with i18n support
 */

import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation, LanguageSwitcher } from '../i18n'
import { login, isAuthenticated } from '../api'

export default function Login() {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (isAuthenticated()) navigate('/dashboard', { replace: true })
    }, [])

    async function handleSubmit(e) {
        e.preventDefault()
        setLoading(true)
        setError('')
        try {
            await login(email, password)
            navigate('/dashboard')
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-bg-light flex">
            {/* Left: form */}
            <div className="flex-1 flex items-center justify-center p-8">
                <div className="w-full max-w-md">
                    <div className="flex items-center justify-between mb-8">
                        <Link to="/" className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-3xl text-primary">school</span>
                            <span className="text-xl font-bold text-text-main">FuturDialk</span>
                        </Link>
                        <LanguageSwitcher />
                    </div>

                    <h1 className="text-3xl font-bold text-text-main mb-2">{t('login.title')}</h1>
                    <p className="text-secondary mb-8">{t('login.subtitle')}</p>

                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <div>
                            <label className="block text-sm font-medium text-text-main mb-1">{t('login.email')}</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full rounded-lg border border-gray-200 px-4 py-3 text-text-main focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                                placeholder="your@email.com"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-text-main mb-1">{t('login.password')}</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full rounded-lg border border-gray-200 px-4 py-3 text-text-main focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center gap-2 text-secondary">
                                <input type="checkbox" className="rounded border-gray-300" />
                                {t('login.rememberMe')}
                            </label>
                            <Link to="/forgot-password" className="text-primary hover:underline font-medium">
                                {t('login.forgotPassword')}
                            </Link>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full h-12 bg-primary text-white rounded-lg font-bold hover:bg-primary-hover transition-colors shadow-md disabled:opacity-50"
                        >
                            {loading ? t('login.loading') : t('login.submit')}
                        </button>
                    </form>

                    <p className="mt-6 text-center text-sm text-secondary">
                        {t('login.noAccount')}{' '}
                        <Link to="/register" className="text-primary font-bold hover:underline">
                            {t('login.register')}
                        </Link>
                    </p>
                </div>
            </div>

            {/* Right: decorative */}
            <div className="hidden lg:flex flex-1 bg-gradient-to-br from-primary to-blue-600 items-center justify-center p-12">
                <div className="text-center text-white max-w-md">
                    <span className="material-symbols-outlined text-6xl mb-6 block">rocket_launch</span>
                    <h2 className="text-3xl font-bold mb-4">{t('login.sideTitle')}</h2>
                    <p className="text-blue-100 text-lg">{t('login.sideDesc')}</p>
                </div>
            </div>
        </div>
    )
}
