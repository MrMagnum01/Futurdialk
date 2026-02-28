/**
 * Forgot Password — Password reset request.
 */
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation, LanguageSwitcher } from '../i18n'

export default function ForgotPassword() {
    const { lang } = useTranslation()
    const isFr = lang === 'fr'
    const [email, setEmail] = useState('')
    const [sent, setSent] = useState(false)

    const handleSubmit = (e) => { e.preventDefault(); setSent(true) }

    return (
        <div className="min-h-screen bg-bg-light flex items-center justify-center px-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <Link to="/" className="inline-flex items-center gap-2 mb-4"><span className="material-symbols-outlined text-3xl text-primary">school</span><span className="text-xl font-bold">Tawjihi</span></Link>
                    <h1 className="text-2xl font-bold">{isFr ? 'Mot de passe oublié' : 'Forgot Password'}</h1>
                    <p className="text-secondary text-sm mt-1">{isFr ? 'Entrez votre email pour recevoir un lien de réinitialisation' : 'Enter your email for a reset link'}</p>
                </div>
                {sent ? (
                    <div className="bg-green-50 rounded-xl p-8 text-center border border-green-100">
                        <span className="material-symbols-outlined text-4xl text-green-500 mb-3 block">mark_email_read</span>
                        <p className="font-bold text-green-800 mb-1">{isFr ? 'Email envoyé!' : 'Email sent!'}</p>
                        <p className="text-sm text-green-700">{isFr ? 'Vérifiez votre boîte de réception' : 'Check your inbox'}</p>
                        <Link to="/login" className="mt-4 inline-block text-primary font-bold text-sm hover:underline">{isFr ? '← Connexion' : '← Login'}</Link>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-100 p-8 shadow-sm space-y-4">
                        <div><label className="text-sm font-bold block mb-1">Email</label><input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:border-primary" /></div>
                        <button type="submit" className="w-full py-3 bg-primary text-white rounded-lg font-bold hover:bg-primary-hover transition-colors">{isFr ? 'Envoyer le lien' : 'Send Reset Link'}</button>
                        <Link to="/login" className="block text-center text-sm text-primary font-bold">{isFr ? '← Retour à la connexion' : '← Back to Login'}</Link>
                    </form>
                )}
            </div>
        </div>
    )
}
