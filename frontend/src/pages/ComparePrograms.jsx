/**
 * Compare Programs — Side-by-side comparison of up to 3 programs.
 */
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation, LanguageSwitcher } from '../i18n'
import { getPrograms } from '../api'

const FLAG_EMOJI = { FR: '🇫🇷', CA: '🇨🇦', DE: '🇩🇪', UK: '🇬🇧', ES: '🇪🇸', MA: '🇲🇦' }

export default function ComparePrograms() {
    const { lang } = useTranslation()
    const isFr = lang === 'fr'
    const [programs, setPrograms] = useState([])
    const [selected, setSelected] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        getPrograms({ per_page: 50 }).then(d => setPrograms(d.programs || [])).catch(() => { }).finally(() => setLoading(false))
    }, [])

    const toggle = (id) => {
        setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : prev.length < 3 ? [...prev, id] : prev)
    }

    const compared = programs.filter(p => selected.includes(p.id))

    return (
        <div className="min-h-screen bg-bg-light">
            <header className="sticky top-0 z-50 bg-white border-b border-gray-200 px-6 py-3 shadow-sm">
                <div className="max-w-[1200px] mx-auto flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2"><span className="material-symbols-outlined text-3xl text-primary">school</span><span className="text-xl font-bold text-text-main">Tawjihi</span></Link>
                    <div className="flex items-center gap-3"><LanguageSwitcher /><Link to="/explore" className="px-4 py-2 bg-gray-100 rounded-lg text-sm font-bold hover:bg-gray-200">{isFr ? '← Programmes' : '← Programs'}</Link></div>
                </div>
            </header>

            <main className="max-w-[1200px] mx-auto px-4 py-8 md:px-6">
                <h1 className="text-3xl font-bold text-text-main mb-2">{isFr ? 'Comparer les programmes' : 'Compare Programs'}</h1>
                <p className="text-secondary mb-6">{isFr ? 'Sélectionnez jusqu\'à 3 programmes' : 'Select up to 3 programs'}</p>

                {/* Selector */}
                <div className="bg-white rounded-xl border border-gray-100 p-4 mb-8 shadow-sm max-h-60 overflow-y-auto">
                    {loading ? <p className="text-secondary text-sm">Loading...</p> : programs.map(p => (
                        <label key={p.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                            <input type="checkbox" checked={selected.includes(p.id)} onChange={() => toggle(p.id)} className="rounded border-gray-300 text-primary focus:ring-primary" />
                            <span className="text-sm font-medium text-text-main">{p.name}</span>
                            <span className="text-xs text-secondary ml-auto">{FLAG_EMOJI[p.school?.country_code] || ''} {p.school?.name}</span>
                        </label>
                    ))}
                </div>

                {/* Comparison Table */}
                {compared.length >= 2 && (
                    <div className="overflow-x-auto">
                        <table className="w-full bg-white rounded-xl border border-gray-100 shadow-sm">
                            <thead>
                                <tr className="border-b border-gray-100">
                                    <th className="p-4 text-left text-xs font-bold text-secondary uppercase">{isFr ? 'Critère' : 'Criteria'}</th>
                                    {compared.map(p => <th key={p.id} className="p-4 text-center"><p className="font-bold text-text-main text-sm">{p.name}</p><p className="text-xs text-secondary">{p.school?.name}</p></th>)}
                                </tr>
                            </thead>
                            <tbody className="text-sm">
                                <CompRow label={isFr ? 'Pays' : 'Country'} values={compared.map(p => `${FLAG_EMOJI[p.school?.country_code] || ''} ${p.school?.country_code}`)} />
                                <CompRow label={isFr ? 'Diplôme' : 'Degree'} values={compared.map(p => (p.degree_type || '').replace('_', ' '))} />
                                <CompRow label={isFr ? 'Durée' : 'Duration'} values={compared.map(p => p.duration_months ? `${p.duration_months} ${isFr ? 'mois' : 'months'}` : '—')} />
                                <CompRow label={isFr ? 'Domaine' : 'Field'} values={compared.map(p => p.field_of_study || '—')} />
                                <CompRow label={isFr ? 'Langue' : 'Language'} values={compared.map(p => p.language || '—')} />
                                <CompRow label={isFr ? 'Frais / an' : 'Tuition / yr'} values={compared.map(p => p.school?.tuition_international_yearly || '—')} />
                                <CompRow label={isFr ? 'Classement' : 'Ranking'} values={compared.map(p => p.school?.ranking_world ? `#${p.school.ranking_world}` : '—')} />
                                <CompRow label={isFr ? 'Bourses' : 'Scholarships'} values={compared.map(p => p.school?.scholarship_available ? '✅' : '❌')} />
                                <CompRow label="🇲🇦" values={compared.map(p => p.school?.has_moroccan_students ? '✅' : '—')} />
                            </tbody>
                        </table>
                    </div>
                )}
                {compared.length < 2 && <p className="text-secondary text-center py-10">{isFr ? 'Sélectionnez au moins 2 programmes pour comparer' : 'Select at least 2 programs to compare'}</p>}
            </main>
        </div>
    )
}

function CompRow({ label, values }) {
    return (
        <tr className="border-b border-gray-50 hover:bg-gray-50/50">
            <td className="p-4 font-medium text-text-main">{label}</td>
            {values.map((v, i) => <td key={i} className="p-4 text-center text-secondary capitalize">{v}</td>)}
        </tr>
    )
}
