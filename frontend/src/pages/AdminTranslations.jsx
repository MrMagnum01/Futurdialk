/**
 * Admin Translation Manager — Page for managing i18n translations.
 * Lists all translation keys, allows editing, and supports bulk import.
 */

import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation, LanguageSwitcher } from '../i18n'

export default function AdminTranslations() {
    const { t } = useTranslation()
    const [activeLang, setActiveLang] = useState('fr')
    const [translations, setTranslations] = useState({})
    const [editKey, setEditKey] = useState(null)
    const [editValue, setEditValue] = useState('')
    const [search, setSearch] = useState('')
    const [saving, setSaving] = useState(false)
    const [message, setMessage] = useState('')

    // Flatten nested JSON to dot-notation keys
    function flatten(obj, prefix = '') {
        const result = {}
        for (const key of Object.keys(obj)) {
            const fullKey = prefix ? `${prefix}.${key}` : key
            if (typeof obj[key] === 'object' && obj[key] !== null) {
                Object.assign(result, flatten(obj[key], fullKey))
            } else {
                result[fullKey] = obj[key]
            }
        }
        return result
    }

    // Load translations from the local JSON files
    useEffect(() => {
        async function load() {
            try {
                const mod = await import(`../i18n/${activeLang}.json`)
                setTranslations(flatten(mod.default || mod))
            } catch {
                setTranslations({})
            }
        }
        load()
    }, [activeLang])

    const filteredKeys = Object.keys(translations).filter(
        (key) => key.toLowerCase().includes(search.toLowerCase()) ||
            translations[key]?.toLowerCase().includes(search.toLowerCase())
    )

    // Group keys by section
    const sections = {}
    filteredKeys.forEach((key) => {
        const section = key.split('.')[0]
        if (!sections[section]) sections[section] = []
        sections[section].push(key)
    })

    function startEdit(key) {
        setEditKey(key)
        setEditValue(translations[key] || '')
    }

    async function saveEdit() {
        if (!editKey) return
        setSaving(true)
        setTranslations((prev) => ({ ...prev, [editKey]: editValue }))
        setMessage(`✅ Saved: ${editKey}`)
        setEditKey(null)
        setSaving(false)
        setTimeout(() => setMessage(''), 3000)
    }

    async function exportJson() {
        // Unflatten to nested object
        const nested = {}
        for (const [key, value] of Object.entries(translations)) {
            const parts = key.split('.')
            let current = nested
            for (let i = 0; i < parts.length - 1; i++) {
                if (!current[parts[i]]) current[parts[i]] = {}
                current = current[parts[i]]
            }
            current[parts[parts.length - 1]] = value
        }
        const blob = new Blob([JSON.stringify(nested, null, 2)], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${activeLang}.json`
        a.click()
        URL.revokeObjectURL(url)
    }

    return (
        <div className="min-h-screen bg-bg-light">
            {/* Header */}
            <header className="sticky top-0 z-50 flex items-center justify-between border-b border-gray-200 bg-white px-6 py-3 lg:px-20 shadow-sm">
                <Link to="/admin" className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-3xl text-primary">school</span>
                    <span className="text-xl font-bold text-text-main">Tawjihi</span>
                    <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-bold ml-2">Admin</span>
                </Link>
                <div className="flex items-center gap-4">
                    <LanguageSwitcher />
                    <Link to="/dashboard" className="text-sm text-secondary hover:text-primary">← Dashboard</Link>
                </div>
            </header>

            <main className="max-w-[1200px] mx-auto p-6 lg:p-10">
                {/* Title */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-text-main mb-1">Gestion des Traductions</h1>
                        <p className="text-secondary text-sm">Modifiez les textes de l'interface pour chaque langue</p>
                    </div>
                    <button
                        onClick={exportJson}
                        className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg font-bold text-sm hover:bg-primary-hover shadow-md"
                    >
                        <span className="material-symbols-outlined text-lg">download</span>
                        Exporter JSON
                    </button>
                </div>

                {/* Language tabs + search */}
                <div className="flex items-center gap-4 mb-6 flex-wrap">
                    <div className="flex rounded-lg overflow-hidden border border-gray-200">
                        {['fr', 'en'].map((lang) => (
                            <button
                                key={lang}
                                onClick={() => setActiveLang(lang)}
                                className={`px-4 py-2 text-sm font-bold transition-colors ${activeLang === lang
                                        ? 'bg-primary text-white'
                                        : 'bg-white text-gray-600 hover:bg-gray-50'
                                    }`}
                            >
                                {lang === 'fr' ? '🇫🇷 Français' : '🇬🇧 English'}
                            </button>
                        ))}
                    </div>
                    <div className="flex-1 max-w-md">
                        <div className="relative">
                            <span className="material-symbols-outlined text-gray-400 absolute left-3 top-2.5 text-lg">search</span>
                            <input
                                type="text"
                                placeholder="Rechercher une clé ou un texte..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                            />
                        </div>
                    </div>
                    <span className="text-xs text-secondary">{filteredKeys.length} clés</span>
                </div>

                {/* Success message */}
                {message && (
                    <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
                        {message}
                    </div>
                )}

                {/* Translation sections */}
                {Object.entries(sections).map(([section, keys]) => (
                    <div key={section} className="mb-6">
                        <h3 className="text-sm font-bold text-primary uppercase tracking-wide mb-3 flex items-center gap-2">
                            <span className="material-symbols-outlined text-lg">folder</span>
                            {section}
                            <span className="text-xs text-secondary font-normal">({keys.length})</span>
                        </h3>
                        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                            {keys.map((key, idx) => (
                                <div
                                    key={key}
                                    className={`flex items-center gap-4 px-4 py-3 ${idx < keys.length - 1 ? 'border-b border-gray-100' : ''
                                        } hover:bg-gray-50 transition-colors`}
                                >
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs text-secondary font-mono truncate">{key}</p>
                                        {editKey === key ? (
                                            <div className="flex gap-2 mt-1">
                                                <input
                                                    type="text"
                                                    value={editValue}
                                                    onChange={(e) => setEditValue(e.target.value)}
                                                    className="flex-1 px-3 py-1.5 border border-primary rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none"
                                                    autoFocus
                                                    onKeyDown={(e) => e.key === 'Enter' && saveEdit()}
                                                />
                                                <button
                                                    onClick={saveEdit}
                                                    disabled={saving}
                                                    className="px-3 py-1.5 bg-primary text-white rounded-lg text-xs font-bold hover:bg-primary-hover"
                                                >
                                                    ✓
                                                </button>
                                                <button
                                                    onClick={() => setEditKey(null)}
                                                    className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg text-xs font-bold hover:bg-gray-200"
                                                >
                                                    ✕
                                                </button>
                                            </div>
                                        ) : (
                                            <p className="text-sm text-text-main mt-0.5 truncate">{translations[key]}</p>
                                        )}
                                    </div>
                                    {editKey !== key && (
                                        <button
                                            onClick={() => startEdit(key)}
                                            className="text-secondary hover:text-primary transition-colors flex-shrink-0"
                                        >
                                            <span className="material-symbols-outlined text-lg">edit</span>
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </main>
        </div>
    )
}
