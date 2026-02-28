/**
 * Find Mentors — Browse mentors from the community.
 */
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation, LanguageSwitcher } from '../i18n'

const MOCK_MENTORS = [
    { name: 'Youssef B.', country: '🇫🇷 France', field: 'Engineering', uni: 'INSA Lyon', available: true },
    { name: 'Salma R.', country: '🇨🇦 Canada', field: 'Computer Science', uni: 'UdeM', available: true },
    { name: 'Ahmed K.', country: '🇩🇪 Germany', field: 'Medicine', uni: 'Charité Berlin', available: false },
    { name: 'Fatima Z.', country: '🇫🇷 France', field: 'Business', uni: 'HEC Paris', available: true },
    { name: 'Omar M.', country: '🇬🇧 UK', field: 'Law', uni: 'King\'s College', available: true },
    { name: 'Nadia H.', country: '🇨🇦 Canada', field: 'Architecture', uni: 'McGill', available: false },
]

export default function FindMentors() {
    const { lang } = useTranslation()
    const isFr = lang === 'fr'
    const [filter, setFilter] = useState('')

    const filtered = MOCK_MENTORS.filter(m => !filter || m.country.toLowerCase().includes(filter.toLowerCase()) || m.field.toLowerCase().includes(filter.toLowerCase()))

    return (
        <div className="min-h-screen bg-bg-light">
            <header className="sticky top-0 z-50 bg-white border-b border-gray-200 px-6 py-3 shadow-sm">
                <div className="max-w-[1000px] mx-auto flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2"><span className="material-symbols-outlined text-3xl text-primary">school</span><span className="text-xl font-bold">Tawjihi</span></Link>
                    <div className="flex items-center gap-3"><LanguageSwitcher /><Link to="/community" className="px-4 py-2 bg-gray-100 rounded-lg text-sm font-bold">{isFr ? '← Communauté' : '← Community'}</Link></div>
                </div>
            </header>
            <main className="max-w-[1000px] mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold mb-2">{isFr ? 'Trouver un Mentor' : 'Find a Mentor'}</h1>
                <p className="text-secondary mb-6">{isFr ? 'Connectez-vous avec des étudiants marocains à l\'étranger' : 'Connect with Moroccan students abroad'}</p>
                <input value={filter} onChange={e => setFilter(e.target.value)} className="w-full max-w-md p-3 border border-gray-200 rounded-xl mb-6 outline-none focus:border-primary" placeholder={isFr ? 'Filtrer par pays ou domaine...' : 'Filter by country or field...'} />
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filtered.map((m, i) => (
                        <div key={i} className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-all">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-blue-600 text-white flex items-center justify-center font-bold text-lg">{m.name.charAt(0)}</div>
                                <div>
                                    <p className="font-bold text-text-main">{m.name}</p>
                                    <p className="text-xs text-secondary">{m.uni}</p>
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-2 mb-4">
                                <span className="px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded-full">{m.country}</span>
                                <span className="px-2 py-1 text-xs bg-gray-100 rounded-full">{m.field}</span>
                            </div>
                            <button disabled={!m.available} className={`w-full py-2 rounded-lg text-sm font-bold transition-colors ${m.available ? 'bg-primary text-white hover:bg-primary-hover' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}>
                                {m.available ? (isFr ? 'Contacter' : 'Contact') : (isFr ? 'Indisponible' : 'Unavailable')}
                            </button>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    )
}
