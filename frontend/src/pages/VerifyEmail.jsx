/**
 * Email Verification — Verify email after registration.
 */
import { Link } from 'react-router-dom'
import { useTranslation } from '../i18n'

export default function VerifyEmail() {
    const { lang } = useTranslation()
    const isFr = lang === 'fr'
    return (
        <div className="min-h-screen bg-bg-light flex items-center justify-center px-4">
            <div className="w-full max-w-md text-center">
                <span className="material-symbols-outlined text-6xl text-primary mb-4 block">mark_email_read</span>
                <h1 className="text-2xl font-bold mb-2">{isFr ? 'Vérifiez votre email' : 'Verify Your Email'}</h1>
                <p className="text-secondary mb-6">{isFr ? 'Nous avons envoyé un lien de vérification à votre email. Cliquez dessus pour activer votre compte.' : 'We sent a verification link to your email. Click it to activate your account.'}</p>
                <Link to="/login" className="px-6 py-3 bg-primary text-white rounded-xl font-bold text-sm inline-block">{isFr ? 'Aller à la connexion' : 'Go to Login'}</Link>
            </div>
        </div>
    )
}
