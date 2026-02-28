/**
 * Compare Careers — Side-by-side career comparison.
 */
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation, LanguageSwitcher } from '../i18n'
import { getCareerPaths, compareCareers } from '../api'

export default function CompareCareers() {
    const { lang } = useTranslation()
    const isFr = lang === 'fr'
    const [paths, setPaths] = useState([])
    const [selected, setSelected] = useState([])
    const [comparison, setComparison] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        getCareerPaths().then(d => setPaths(d.paths || [])).catch(() => { }).finally(() => setLoading(false))
    }, [])

    const toggle = (id) => setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : prev.length < 3 ? [...prev, id] : prev)

    const compare = async () => {
        if (selected.length < 2) return
        try { const data = await compareCareers(selected); setComparison(data) } catch { }
    }

    const compared = paths.filter(p => selected.includes(p.id))

    return (
        <div className="min-h-screen bg-bg-light">
            <header className="sticky top-0 z-50 bg-white border-b border-gray-200 px-6 py-3 shadow-sm">
                <div className="max-w-[1100px] mx-auto flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2"><span className="material-symbols-outlined text-3xl text-primary">school</span><span className="text-xl font-bold text-text-main">FuturDialk</span></Link>
                    <div className="flex items-center gap-3"><LanguageSwitcher /><Link to="/career" className="px-4 py-2 bg-gray-100 rounded-lg text-sm font-bold hover:bg-gray-200">{isFr ? '← Carrières' : '← Careers'}</Link></div>
                </div>
            </header>

            <main className="max-w-[1100px] mx-auto px-4 py-8 md:px-6">
                <h1 className="text-3xl font-bold text-text-main mb-6">{isFr ? 'Comparer les carrières' : 'Compare Careers'}</h1>

                <div className="grid md:grid-cols-3 gap-3 mb-6">
                    {paths.map(p => (
                        <button key={p.id} onClick={() => toggle(p.id)} className={`text-left p-4 rounded-xl border-2 transition-all ${selected.includes(p.id) ? 'border-primary bg-primary/5' : 'border-gray-200 bg-white hover:border-primary/40'}`}>
                            <p className="font-bold text-text-main text-sm">{p.name}</p>
                            <p className="text-xs text-secondary capitalize">{p.category}</p>
                        </button>
                    ))}
                </div>

                {selected.length >= 2 && !comparison && (
                    <button onClick={compare} className="mb-8 px-6 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary-hover transition-colors">{isFr ? 'Comparer' : 'Compare'} →</button>
                )}

                {comparison && (
                    <div className="overflow-x-auto">
                        <table className="w-full bg-white rounded-xl border border-gray-100 shadow-sm">
                            <thead><tr className="border-b border-gray-100"><th className="p-4 text-left text-xs font-bold text-secondary uppercase">{isFr ? 'Critère' : 'Criteria'}</th>{(comparison.careers || compared).map(c => <th key={c.id || c.name} className="p-4 text-center"><p className="font-bold text-sm">{c.name}</p></th>)}</tr></thead>
                            <tbody className="text-sm">
                                <CompRow label={isFr ? 'Catégorie' : 'Category'} values={(comparison.careers || compared).map(c => c.category)} />
                                <CompRow label={isFr ? 'Risque auto.' : 'Automation Risk'} values={(comparison.careers || compared).map(c => c.automation_risk)} />
                                <CompRow label="RIASEC" values={(comparison.careers || compared).map(c => (c.riasec_codes || []).join(', '))} />
                                <CompRow label={isFr ? 'Formation' : 'Education'} values={(comparison.careers || compared).map(c => (c.required_education || []).join(', '))} />
                            </tbody>
                        </table>
                    </div>
                )}
            </main>
        </div>
    )
}

function CompRow({ label, values }) {
    return <tr className="border-b border-gray-50 hover:bg-gray-50/50"><td className="p-4 font-medium text-text-main">{label}</td>{values.map((v, i) => <td key={i} className="p-4 text-center text-secondary capitalize">{v}</td>)}</tr>
}
