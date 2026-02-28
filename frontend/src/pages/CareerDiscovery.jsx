/**
 * Career Discovery Quiz — RIASEC-based career quiz.
 */
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation, LanguageSwitcher } from '../i18n'
import { discoverCareers } from '../api'

const RIASEC_QUESTIONS = [
    { code: 'R', en: 'I enjoy building or fixing things with my hands.', fr: 'J\'aime construire ou réparer des choses avec mes mains.' },
    { code: 'I', en: 'I like solving complex problems and puzzles.', fr: 'J\'aime résoudre des problèmes complexes et des énigmes.' },
    { code: 'A', en: 'I express myself through art, music, or writing.', fr: 'Je m\'exprime à travers l\'art, la musique ou l\'écriture.' },
    { code: 'S', en: 'I enjoy helping people and working in teams.', fr: 'J\'aime aider les gens et travailler en équipe.' },
    { code: 'E', en: 'I like leading projects and persuading others.', fr: 'J\'aime diriger des projets et persuader les autres.' },
    { code: 'C', en: 'I prefer organized tasks with clear rules.', fr: 'Je préfère les tâches organisées avec des règles claires.' },
    { code: 'R', en: 'I like working outdoors or with machines.', fr: 'J\'aime travailler en plein air ou avec des machines.' },
    { code: 'I', en: 'I enjoy researching and analyzing data.', fr: 'J\'aime la recherche et l\'analyse de données.' },
    { code: 'A', en: 'I am creative and enjoy designing things.', fr: 'Je suis créatif et j\'aime concevoir des choses.' },
    { code: 'S', en: 'I care about social issues and community well-being.', fr: 'Les questions sociales et le bien-être communautaire me tiennent à cœur.' },
    { code: 'E', en: 'I enjoy taking risks and starting new things.', fr: 'J\'aime prendre des risques et lancer de nouvelles choses.' },
    { code: 'C', en: 'I am detail-oriented and good with numbers.', fr: 'Je suis minutieux et bon avec les chiffres.' },
]

export default function CareerDiscovery() {
    const { lang } = useTranslation()
    const isFr = lang === 'fr'
    const navigate = useNavigate()
    const [current, setCurrent] = useState(0)
    const [scores, setScores] = useState({})
    const [results, setResults] = useState(null)
    const [loading, setLoading] = useState(false)

    const answer = (value) => {
        const q = RIASEC_QUESTIONS[current]
        setScores(prev => ({ ...prev, [q.code]: (prev[q.code] || 0) + value }))
        if (current < RIASEC_QUESTIONS.length - 1) {
            setCurrent(current + 1)
        } else {
            submitQuiz({ ...scores, [q.code]: (scores[q.code] || 0) + value })
        }
    }

    const submitQuiz = async (finalScores) => {
        setLoading(true)
        const sorted = Object.entries(finalScores).sort((a, b) => b[1] - a[1])
        const topCodes = sorted.slice(0, 3).map(([code]) => code)
        try {
            const data = await discoverCareers({ riasec_codes: topCodes })
            setResults(data)
        } catch { setResults({ careers: [] }) }
        finally { setLoading(false) }
    }

    const q = RIASEC_QUESTIONS[current]
    const likert = [
        { value: 1, label: isFr ? 'Pas du tout' : 'Not at all', emoji: '😕' },
        { value: 2, label: isFr ? 'Un peu' : 'A little', emoji: '🤔' },
        { value: 3, label: isFr ? 'Moyen' : 'Somewhat', emoji: '😐' },
        { value: 4, label: isFr ? 'Beaucoup' : 'A lot', emoji: '😊' },
        { value: 5, label: isFr ? 'Passionné' : 'Passionate', emoji: '🤩' },
    ]

    return (
        <div className="min-h-screen bg-bg-light">
            <header className="sticky top-0 z-50 bg-white border-b border-gray-200 px-6 py-3 shadow-sm">
                <div className="max-w-[700px] mx-auto flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2"><span className="material-symbols-outlined text-3xl text-primary">school</span><span className="text-xl font-bold text-text-main">FuturDialk</span></Link>
                    <div className="flex items-center gap-3"><LanguageSwitcher /><Link to="/career" className="px-4 py-2 bg-gray-100 rounded-lg text-sm font-bold hover:bg-gray-200">{isFr ? '← Carrières' : '← Careers'}</Link></div>
                </div>
            </header>

            <main className="max-w-[700px] mx-auto px-4 py-8 md:px-6">
                {!results ? (
                    <>
                        <div className="text-center mb-8">
                            <h1 className="text-2xl font-bold text-text-main mb-2">{isFr ? 'Découvrez votre profil RIASEC' : 'Discover Your RIASEC Profile'}</h1>
                            <p className="text-secondary">{isFr ? 'Répondez honnêtement — il n\'y a pas de bonnes ou mauvaises réponses' : 'Answer honestly — there are no right or wrong answers'}</p>
                        </div>

                        {/* Progress */}
                        <div className="flex items-center gap-3 mb-8">
                            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${((current + 1) / RIASEC_QUESTIONS.length) * 100}%` }} />
                            </div>
                            <span className="text-sm font-bold text-text-main">{current + 1}/{RIASEC_QUESTIONS.length}</span>
                        </div>

                        {/* Question */}
                        <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm text-center mb-8">
                            <p className="text-lg font-bold text-text-main mb-8">{isFr ? q.fr : q.en}</p>
                            <div className="grid grid-cols-5 gap-2">
                                {likert.map(l => (
                                    <button key={l.value} onClick={() => answer(l.value)} className="flex flex-col items-center gap-2 p-3 rounded-xl border-2 border-gray-200 hover:border-primary hover:bg-primary/5 transition-all">
                                        <span className="text-2xl">{l.emoji}</span>
                                        <span className="text-xs text-secondary">{l.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </>
                ) : loading ? (
                    <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div></div>
                ) : (
                    <>
                        <div className="text-center mb-8">
                            <h1 className="text-3xl font-bold text-text-main mb-2">🎉 {isFr ? 'Vos résultats' : 'Your Results'}</h1>
                            <p className="text-secondary">{isFr ? 'Carrières recommandées pour votre profil' : 'Recommended careers for your profile'}</p>
                        </div>

                        {/* RIASEC Scores */}
                        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm mb-6">
                            <h2 className="font-bold text-text-main mb-4">{isFr ? 'Profil RIASEC' : 'RIASEC Profile'}</h2>
                            <div className="grid grid-cols-6 gap-2">
                                {['R', 'I', 'A', 'S', 'E', 'C'].map(code => {
                                    const s = scores[code] || 0
                                    const max = 10
                                    return (
                                        <div key={code} className="text-center">
                                            <div className="h-20 flex items-end justify-center mb-1">
                                                <div className="w-8 bg-primary/20 rounded-t-lg" style={{ height: `${(s / max) * 100}%`, minHeight: '10%' }}>
                                                    <div className="w-full bg-primary rounded-t-lg" style={{ height: `${(s / max) * 100}%`, minHeight: '10%' }} />
                                                </div>
                                            </div>
                                            <span className="text-sm font-bold text-text-main">{code}</span>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>

                        {/* Careers */}
                        <div className="space-y-3">
                            {(results.careers || []).map(c => (
                                <Link key={c.id || c.name} to={`/career/path/${c.id || ''}`} className="flex items-center justify-between bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:border-primary/30 hover:shadow-md transition-all group">
                                    <div>
                                        <p className="font-bold text-text-main group-hover:text-primary transition-colors">{c.name}</p>
                                        <p className="text-xs text-secondary capitalize mt-1">{c.category} • {isFr ? 'Score' : 'Match'}: {c.match_score || '—'}</p>
                                    </div>
                                    <span className="material-symbols-outlined text-gray-300 group-hover:text-primary transition-colors">chevron_right</span>
                                </Link>
                            ))}
                        </div>
                    </>
                )}
            </main>
        </div>
    )
}
