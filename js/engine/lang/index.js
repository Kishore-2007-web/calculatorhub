/**
 * Translation & Localization Manager
 * Handles multi-language dictionary resolution and token interpolation
 */
import { en } from './en.js';

export class TranslationEngine {
  constructor() {
    this.dictionaries = { en };
    this.currentLanguage = 'en';
  }

  /**
   * Set active language
   */
  setLanguage(lang) {
    if (this.dictionaries[lang]) {
      this.currentLanguage = lang;
    }
    return this;
  }

  /**
   * Register a new language dictionary
   */
  registerLanguage(lang, dict) {
    this.dictionaries[lang] = dict;
    return this;
  }

  /**
   * Translate a key with token replacements
   * @param {string} key 
   * @param {Object} replacements 
   * @returns {string} translated text
   */
  t(key, replacements = {}) {
    const dict = this.dictionaries[this.currentLanguage] || this.dictionaries.en;
    let translation = dict[key] || key;

    Object.entries(replacements).forEach(([placeholder, value]) => {
      translation = translation.replace(new RegExp(`{${placeholder}}`, 'g'), value);
    });

    return translation;
  }
}

export const translator = new TranslationEngine();
export default translator;
