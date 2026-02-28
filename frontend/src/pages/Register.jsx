/**
 * Register Page — with i18n support
 */

import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation, LanguageSwitcher } from '../i18n'
import { register } from '../api'

export default function Register() {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const [form, setForm] = useState({
        full_name: '',
        email: '',
        password: '',
        role: 'student',
    })
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    function update(field, value) {
        setForm((prev) => ({ ...prev, [field]: value }))
    }

    async function handleSubmit(e) {
        e.preventDefault()
        setLoading(true)
        setError('')
        try {
            await register(form.email, form.password, form.full_name, form.role)
            navigate('/onboarding/step/1')
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    const roles = [
        { value: 'student', label: t('register.student'), icon: 'person' },
        { value: 'parent', label: t('register.parent'), icon: 'family_restroom' },
        { value: 'professional', label: t('register.professional'), icon: 'work' },
    ]

    return (
        <div className="min-h-screen bg-bg-light flex">
            {/* Left: decorative */}
            <div className="hidden lg:flex flex-1 bg-gradient-to-br from-primary to-blue-600 items-center justify-center p-12">
                <div className="text-center text-white max-w-md">
                    <span className="material-symbols-outlined text-6xl mb-6 block">school</span>
                    <h2 className="text-3xl font-bold mb-4">{t('register.sideTitle')}</h2>
                    <p className="text-blue-100 text-lg">{t('register.sideDesc')}</p>
                </div>
            </div>

            {/* Right: form */}
            <div className="flex-1 flex items-center justify-center p-8">
                <div className="w-full max-w-md">
                    <div className="flex items-center justify-between mb-8">
                        <Link to="/" className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-3xl text-primary">school</span>
                            <span className="text-xl font-bold text-text-main">FuturDialk</span>
                        </Link>
                        <LanguageSwitcher />
                    </div>

                    <h1 className="text-3xl font-bold text-text-main mb-2">{t('register.title')}</h1>
                    <p className="text-secondary mb-8">{t('register.subtitle')}</p>

                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        {/* Role selector */}
                        <div>
                            <label className="block text-sm font-medium text-text-main mb-2">{t('register.iAmA')}</label>
                            <div className="grid grid-cols-3 gap-2">
                                {roles.map((r) => (
                                    <button
                                        key={r.value}
                                        type="button"
                                        onClick={() => update('role', r.value)}
                                        className={`flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-all text-center ${form.role === r.value
                                            ? 'border-primary bg-blue-50 text-primary'
                                            : 'border-gray-200 text-secondary hover:border-gray-300'
                                            }`}
                                    >
                                        <span className="material-symbols-outlined text-2xl">{r.icon}</span>
                                        <span className="text-xs font-bold">{r.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-text-main mb-1">{t('register.fullName')}</label>
                            <input
                                type="text"
                                value={form.full_name}
                                onChange={(e) => update('full_name', e.target.value)}
                                className="w-full rounded-lg border border-gray-200 px-4 py-3 text-text-main focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                                placeholder={t('register.fullNamePlaceholder')}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-text-main mb-1">{t('register.email')}</label>
                            <input
                                type="email"
                                value={form.email}
                                onChange={(e) => update('email', e.target.value)}
                                className="w-full rounded-lg border border-gray-200 px-4 py-3 text-text-main focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                                placeholder="your@email.com"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-text-main mb-1">{t('register.password')}</label>
                            <input
                                type="password"
                                value={form.password}
                                onChange={(e) => update('password', e.target.value)}
                                className="w-full rounded-lg border border-gray-200 px-4 py-3 text-text-main focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                                placeholder={t('register.passwordPlaceholder')}
                                minLength={8}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full h-12 bg-primary text-white rounded-lg font-bold hover:bg-primary-hover transition-colors shadow-md disabled:opacity-50"
                        >
                            {loading ? t('register.loading') : t('register.submit')}
                        </button>

                        <p className="text-xs text-secondary text-center">
                            {t('register.terms')}
                        </p>
                    </form>

                    <p className="mt-6 text-center text-sm text-secondary">
                        {t('register.hasAccount')}{' '}
                        <Link to="/login" className="text-primary font-bold hover:underline">
                            {t('register.login')}
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}
