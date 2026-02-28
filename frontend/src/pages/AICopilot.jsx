import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { isAuthenticated, copilotSendMessage, copilotGetSessions, copilotGetSession, copilotDeleteSession } from '../api'

export default function AICopilot() {
    const navigate = useNavigate()
    const [message, setMessage] = useState('')
    const [messages, setMessages] = useState([])
    const [sessionId, setSessionId] = useState(null)
    const [sessions, setSessions] = useState([])
    const [loading, setLoading] = useState(false)
    const [showSidebar, setShowSidebar] = useState(true)
    const messagesEndRef = useRef(null)
    const inputRef = useRef(null)

    useEffect(() => {
        if (!isAuthenticated()) { navigate('/login'); return }
        loadSessions()
    }, [])

    useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

    async function loadSessions() {
        try { const d = await copilotGetSessions(); setSessions(d.sessions || []) } catch { }
    }

    async function loadSession(sid) {
        try {
            const d = await copilotGetSession(sid)
            setSessionId(sid)
            setMessages((d.messages || []).map(m => ({ role: m.role, content: m.content })))
        } catch { }
    }

    async function handleSend() {
        if (!message.trim() || loading) return
        const userMsg = message.trim()
        setMessage('')
        setMessages(prev => [...prev, { role: 'user', content: userMsg }])
        setLoading(true)

        try {
            const data = await copilotSendMessage(userMsg, sessionId)
            setMessages(prev => [...prev, { role: 'assistant', content: data.response }])
            if (data.session_id) setSessionId(data.session_id)
            loadSessions()
        } catch (err) {
            setMessages(prev => [...prev, { role: 'assistant', content: '❌ Erreur de connexion. Réessayez.' }])
        } finally { setLoading(false) }
    }

    function startNewChat() { setSessionId(null); setMessages([]) }

    async function deleteSession(sid) {
        try { await copilotDeleteSession(sid); setSessions(s => s.filter(x => x.id !== sid)); if (sessionId === sid) startNewChat() } catch { }
    }

    const suggestions = [
        "🇫🇷 Comment postuler à Campus France ?",
        "📝 Aide-moi à préparer ma lettre de motivation",
        "🎓 Quelles bourses pour le Canada ?",
        "📊 Comparer IELTS vs TOEFL pour le UK",
        "💰 Budget étudiant pour l'Allemagne ?",
        "🏠 Trouver un logement étudiant à Paris",
    ]

    return (
        <div style={{
            display: 'flex', height: '100vh', background: 'linear-gradient(135deg, #0a0a1a 0%, #1a1a2e 100%)',
            fontFamily: "'Inter', -apple-system, sans-serif", color: '#e0e0e0',
        }}>
            {/* Sidebar */}
            <div style={{
                width: showSidebar ? 280 : 0, overflow: 'hidden', transition: 'width 0.3s',
                borderRight: '1px solid rgba(255,255,255,0.08)', display: 'flex', flexDirection: 'column',
                background: 'rgba(255,255,255,0.02)',
            }}>
                <div style={{ padding: 16, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    <button onClick={startNewChat} style={{
                        width: '100%', padding: '12px 16px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                        border: 'none', borderRadius: 12, color: '#fff', cursor: 'pointer', fontSize: 14,
                        fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center',
                    }}>
                        <span style={{ fontSize: 18 }}>+</span> Nouvelle conversation
                    </button>
                </div>
                <div style={{ flex: 1, overflowY: 'auto', padding: '8px' }}>
                    {sessions.map(s => (
                        <div key={s.id} onClick={() => loadSession(s.id)} style={{
                            padding: '10px 12px', borderRadius: 8, cursor: 'pointer', marginBottom: 4,
                            background: sessionId === s.id ? 'rgba(99,102,241,0.15)' : 'transparent',
                            border: sessionId === s.id ? '1px solid rgba(99,102,241,0.3)' : '1px solid transparent',
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                            transition: 'all 0.2s',
                        }}>
                            <span style={{ fontSize: 13, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
                                {s.title || 'Chat'}
                            </span>
                            <button onClick={e => { e.stopPropagation(); deleteSession(s.id) }} style={{
                                background: 'none', border: 'none', color: '#666', cursor: 'pointer',
                                padding: '2px 6px', borderRadius: 4, fontSize: 12,
                            }}>✕</button>
                        </div>
                    ))}
                    {sessions.length === 0 && (
                        <div style={{ textAlign: 'center', color: '#555', padding: 20, fontSize: 13 }}>
                            Aucune conversation
                        </div>
                    )}
                </div>
            </div>

            {/* Main Chat Area */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                {/* Header */}
                <div style={{
                    padding: '12px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)',
                    display: 'flex', alignItems: 'center', gap: 12,
                    background: 'rgba(255,255,255,0.02)', backdropFilter: 'blur(10px)',
                }}>
                    <button onClick={() => setShowSidebar(!showSidebar)} style={{
                        background: 'none', border: 'none', color: '#888', cursor: 'pointer', fontSize: 20, padding: 4,
                    }}>☰</button>
                    <div style={{
                        width: 36, height: 36, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', fontSize: 18,
                    }}>🤖</div>
                    <div>
                        <div style={{ fontWeight: 600, fontSize: 15 }}>FuturDialk Copilot</div>
                        <div style={{ fontSize: 11, color: '#6366f1' }}>● En ligne — Prêt à vous aider</div>
                    </div>
                    <button onClick={() => navigate('/dashboard')} style={{
                        marginLeft: 'auto', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
                        color: '#aaa', padding: '6px 14px', borderRadius: 8, cursor: 'pointer', fontSize: 13,
                    }}>← Dashboard</button>
                </div>

                {/* Messages */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
                    {messages.length === 0 && (
                        <div style={{ textAlign: 'center', maxWidth: 600, margin: '60px auto' }}>
                            <div style={{ fontSize: 48, marginBottom: 16 }}>🎓</div>
                            <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8, color: '#fff' }}>
                                Bienvenue sur FuturDialk Copilot
                            </h2>
                            <p style={{ color: '#888', fontSize: 14, marginBottom: 32, lineHeight: 1.6 }}>
                                Votre assistant IA spécialisé pour les études à l'étranger.<br />
                                Posez n'importe quelle question sur Campus France, les bourses, les visas, la préparation aux examens...
                            </p>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                                {suggestions.map((s, i) => (
                                    <button key={i} onClick={() => { setMessage(s.replace(/^.{2}\s/, '')); inputRef.current?.focus() }}
                                        style={{
                                            padding: '12px 14px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                                            borderRadius: 12, color: '#ccc', cursor: 'pointer', fontSize: 13, textAlign: 'left',
                                            transition: 'all 0.2s', lineHeight: 1.4,
                                        }}
                                        onMouseEnter={e => { e.target.style.background = 'rgba(99,102,241,0.1)'; e.target.style.borderColor = 'rgba(99,102,241,0.3)' }}
                                        onMouseLeave={e => { e.target.style.background = 'rgba(255,255,255,0.04)'; e.target.style.borderColor = 'rgba(255,255,255,0.08)' }}
                                    >{s}</button>
                                ))}
                            </div>
                        </div>
                    )}

                    {messages.map((m, i) => (
                        <div key={i} style={{
                            display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start',
                            marginBottom: 16, animation: 'fadeIn 0.3s ease',
                        }}>
                            <div style={{
                                maxWidth: '75%', padding: '12px 16px', borderRadius: 16,
                                ...(m.role === 'user' ? {
                                    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: '#fff',
                                    borderBottomRightRadius: 4,
                                } : {
                                    background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)',
                                    borderBottomLeftRadius: 4,
                                }),
                                fontSize: 14, lineHeight: 1.7, whiteSpace: 'pre-wrap',
                            }}>
                                {m.content}
                            </div>
                        </div>
                    ))}

                    {loading && (
                        <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: 16 }}>
                            <div style={{
                                padding: '12px 20px', borderRadius: 16, borderBottomLeftRadius: 4,
                                background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)',
                            }}>
                                <div style={{ display: 'flex', gap: 6 }}>
                                    {[0, 1, 2].map(i => (
                                        <div key={i} style={{
                                            width: 8, height: 8, borderRadius: '50%', background: '#6366f1',
                                            animation: `bounce 1.4s ease-in-out ${i * 0.16}s infinite both`,
                                        }} />
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div style={{
                    padding: '16px 24px', borderTop: '1px solid rgba(255,255,255,0.06)',
                    background: 'rgba(255,255,255,0.02)',
                }}>
                    <div style={{
                        display: 'flex', gap: 12, maxWidth: 800, margin: '0 auto',
                        background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: 16, padding: '4px 4px 4px 16px', alignItems: 'center',
                    }}>
                        <input ref={inputRef} value={message} onChange={e => setMessage(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
                            placeholder="Posez votre question..."
                            style={{
                                flex: 1, background: 'none', border: 'none', color: '#e0e0e0',
                                fontSize: 14, outline: 'none', padding: '10px 0',
                            }}
                        />
                        <button onClick={handleSend} disabled={loading || !message.trim()} style={{
                            padding: '10px 20px', borderRadius: 12,
                            background: message.trim() ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : 'rgba(255,255,255,0.06)',
                            border: 'none', color: '#fff', cursor: message.trim() ? 'pointer' : 'default',
                            fontSize: 14, fontWeight: 600, transition: 'all 0.2s',
                            opacity: loading ? 0.6 : 1,
                        }}>
                            {loading ? '...' : 'Envoyer →'}
                        </button>
                    </div>
                    <div style={{ textAlign: 'center', marginTop: 8, fontSize: 11, color: '#555' }}>
                        Propulsé par OpenRouter — GPT-4o-mini
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes bounce { 0%, 80%, 100% { transform: scale(0); } 40% { transform: scale(1); } }
                input::placeholder { color: #555; }
            `}</style>
        </div>
    )
}
