/**
 * i18n — Internationalization system for FuturDialk.
 * French (fr) is the default language for the Moroccan market.
 * Translations are loaded from JSON files and managed via admin panel.
 */

import { createContext, useContext, useState, useCallback } from 'react'
import fr from './fr.json'
import en from './en.json'

const translations = { fr, en }

const STORAGE_KEY = 'FuturDialk_lang'

function getInitialLang() {
    if (typeof window !== 'undefined') {
        const stored = localStorage.getItem(STORAGE_KEY)
        if (stored && translations[stored]) return stored
    }
    return 'fr' // Default: French for the Moroccan market
}

const I18nContext = createContext(null)

export function I18nProvider({ children }) {
    const [lang, setLang] = useState(getInitialLang)

    const switchLang = useCallback((newLang) => {
        if (translations[newLang]) {
            setLang(newLang)
            localStorage.setItem(STORAGE_KEY, newLang)
            document.documentElement.lang = newLang
        }
    }, [])

    const t = useCallback((key) => {
        // key format: "section.key" e.g. "landing.heroTitle1"
        const parts = key.split('.')
        let value = translations[lang]
        for (const part of parts) {
            if (value && typeof value === 'object') {
                value = value[part]
            } else {
                return key // Fallback: return the key itself
            }
        }
        return value || key
    }, [lang])

    return (
        <I18nContext.Provider value={{ lang, switchLang, t, availableLangs: Object.keys(translations) }}>
            {children}
        </I18nContext.Provider>
    )
}

export function useTranslation() {
    const ctx = useContext(I18nContext)
    if (!ctx) throw new Error('useTranslation must be used within I18nProvider')
    return ctx
}

export function LanguageSwitcher({ className = '' }) {
    const { lang, switchLang, availableLangs } = useTranslation()

    const labels = {
        fr: '🇫🇷 FR',
        en: '🇬🇧 EN',
        ar: '🇲🇦 AR',
    }

    return (
        <div className={`flex items-center gap-1 ${className}`}>
            {availableLangs.map((l) => (
                <button
                    key={l}
                    onClick={() => switchLang(l)}
                    className={`px-2 py-1 text-xs font-bold rounded-md transition-all ${lang === l
                            ? 'bg-primary text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                >
                    {labels[l] || l.toUpperCase()}
                </button>
            ))}
        </div>
    )
}
