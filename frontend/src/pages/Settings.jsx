/**
 * Settings — Account settings with live profile data from API.
 */

import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation, LanguageSwitcher } from '../i18n'
import { getProfile, updateProfile, isAuthenticated, logout } from '../api'

export default function Settings() {
    const { lang } = useTranslation()
    const isFr = lang === 'fr'
    const navigate = useNavigate()
    const [notifs, setNotifs] = useState({ email: true, push: true, sms: false })
    const [form, setForm] = useState({ full_name: '', email: '', phone: '', city: '' })
    const [saving, setSaving] = useState(false)
    const [saved, setSaved] = useState(false)
    const [userInitial, setUserInitial] = useState('U')

    useEffect(() => {
        if (!isAuthenticated()) { navigate('/login'); return }
        getProfile()
            .then(data => {
                const u = data.user || {}
                setForm({
                    full_name: u.full_name || '',
                    email: u.email || '',
                    phone: u.phone || '',
                    city: u.city || '',
                })
                setUserInitial((u.full_name || 'U').charAt(0).toUpperCase())
            })
            .catch(() => { })
    }, [])

    async function handleSave() {
        setSaving(true)
        try {
            await updateProfile({ full_name: form.full_name, phone: form.phone, city: form.city })
            setSaved(true)
            setTimeout(() => setSaved(false), 2000)
        } catch { }
        setSaving(false)
    }

    return (
        <div className="min-h-screen bg-bg-light flex flex-col">
            <header className="sticky top-0 z-50 bg-white border-b border-gray-200 px-6 py-3 lg:px-20 shadow-sm">
                <div className="flex items-center justify-between max-w-[1280px] mx-auto">
                    <Link to="/" className="flex items-center gap-2"><span className="material-symbols-outlined text-3xl text-primary">school</span><span className="text-xl font-bold text-text-main">Tawjihi</span></Link>
                    <div className="flex items-center gap-3"><LanguageSwitcher /><div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-blue-600 text-white flex items-center justify-center font-bold">{userInitial}</div></div>
                </div>
            </header>
            <main className="flex-1 px-6 lg:px-20 py-8 max-w-[960px] mx-auto w-full">
                <h1 className="text-3xl font-black text-text-main mb-8">{isFr ? 'Paramètres' : 'Settings'}</h1>
                <div className="space-y-6">
                    {/* Profile */}
                    <section className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                        <h2 className="font-bold text-text-main mb-4 flex items-center gap-2"><span className="material-symbols-outlined text-primary">person</span>{isFr ? 'Profil' : 'Profile'}</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div><label className="text-sm font-semibold text-text-main block mb-1">{isFr ? 'Nom Complet' : 'Full Name'}</label><input className="w-full border border-gray-200 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary" value={form.full_name} onChange={e => setForm(p => ({ ...p, full_name: e.target.value }))} /></div>
                            <div><label className="text-sm font-semibold text-text-main block mb-1">Email</label><input className="w-full border border-gray-200 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary bg-gray-50" value={form.email} disabled /></div>
                            <div><label className="text-sm font-semibold text-text-main block mb-1">{isFr ? 'Téléphone' : 'Phone'}</label><input className="w-full border border-gray-200 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} placeholder="+212 6XX-XXX-XXX" /></div>
                            <div><label className="text-sm font-semibold text-text-main block mb-1">{isFr ? 'Ville' : 'City'}</label><input className="w-full border border-gray-200 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary" value={form.city} onChange={e => setForm(p => ({ ...p, city: e.target.value }))} placeholder="Casablanca" /></div>
                        </div>
                        <div className="mt-4 flex items-center gap-3">
                            <button onClick={handleSave} disabled={saving} className="bg-primary text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-primary-hover disabled:opacity-50">{saving ? '...' : (isFr ? 'Enregistrer' : 'Save Changes')}</button>
                            {saved && <span className="text-green-600 text-sm font-medium flex items-center gap-1"><span className="material-symbols-outlined text-sm">check_circle</span>{isFr ? 'Enregistré !' : 'Saved!'}</span>}
                        </div>
                    </section>
                    {/* Notifications */}
                    <section className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                        <h2 className="font-bold text-text-main mb-4 flex items-center gap-2"><span className="material-symbols-outlined text-primary">notifications</span>Notifications</h2>
                        {[{ key: 'email', fr: 'Email', en: 'Email' }, { key: 'push', fr: 'Push', en: 'Push' }, { key: 'sms', fr: 'SMS', en: 'SMS' }].map(n => (
                            <div key={n.key} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                                <span className="text-sm font-medium text-text-main">{n.fr} notifications</span>
                                <button onClick={() => setNotifs(p => ({ ...p, [n.key]: !p[n.key] }))} className={`w-12 h-6 rounded-full transition-colors ${notifs[n.key] ? 'bg-primary' : 'bg-gray-300'} relative`}>
                                    <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${notifs[n.key] ? 'left-6' : 'left-0.5'}`} />
                                </button>
                            </div>
                        ))}
                    </section>
                    {/* Security */}
                    <section className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                        <h2 className="font-bold text-text-main mb-4 flex items-center gap-2"><span className="material-symbols-outlined text-primary">lock</span>{isFr ? 'Sécurité' : 'Security'}</h2>
                        <div className="space-y-4">
                            <div><label className="text-sm font-semibold text-text-main block mb-1">{isFr ? 'Mot de passe actuel' : 'Current Password'}</label><input type="password" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary" /></div>
                            <div><label className="text-sm font-semibold text-text-main block mb-1">{isFr ? 'Nouveau mot de passe' : 'New Password'}</label><input type="password" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary" /></div>
                        </div>
                        <button className="mt-4 bg-primary text-white px-6 py-2.5 rounded-xl font-bold text-sm">{isFr ? 'Modifier' : 'Update Password'}</button>
                    </section>
                    {/* Danger */}
                    <section className="bg-white rounded-xl p-6 border border-red-200 shadow-sm">
                        <h2 className="font-bold text-red-600 mb-2">{isFr ? 'Zone Dangereuse' : 'Danger Zone'}</h2>
                        <p className="text-sm text-secondary mb-4">{isFr ? 'Se déconnecter ou supprimer votre compte.' : 'Sign out or delete your account.'}</p>
                        <div className="flex gap-3">
                            <button onClick={logout} className="bg-gray-100 text-text-main px-4 py-2 rounded-lg text-sm font-bold hover:bg-gray-200 flex items-center gap-2">
                                <span className="material-symbols-outlined text-lg">logout</span>
                                {isFr ? 'Se déconnecter' : 'Sign Out'}
                            </button>
                            <button className="bg-red-100 text-red-700 px-4 py-2 rounded-lg text-sm font-bold hover:bg-red-200">{isFr ? 'Supprimer le Compte' : 'Delete Account'}</button>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    )
}
