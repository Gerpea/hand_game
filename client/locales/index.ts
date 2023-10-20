import { i18n } from '@/next.config'
import { createI18n } from 'next-international'
import { RuLocale } from './ru'
import { EnLocale } from './en'

export const localesDict = {
    ru: () => import('./ru'),
    en: () => import('./en')
}

export type Locale = { [key in RuLocale | EnLocale]: string }
export type Locales = keyof typeof localesDict;
export const locales = Object.keys(localesDict)
export const defaultLocale = i18n?.defaultLocale || 'ru'

export const { useI18n, useScopedI18n, I18nProvider, getLocaleProps, } = createI18n(localesDict)

// This is only for outside of Component usage!!!
let loadedDict: Locale
/**
 * Call this as soon as you have a locale to set for example in _app.tsx, together with I18nProvider
 * This set locale dictionary for usage outside of functional component
 */
export const setLocaleDict = async (dict: Locale) => {
    loadedDict = dict
}/**
 * Call this where you cant use hooks useI18n or useScopedI18n
 *
 * @param {keyof Locale} key
 * @return {*} - Locale string
 */
export const t = (key: keyof Locale) => {
    return loadedDict?.[key] || key
}