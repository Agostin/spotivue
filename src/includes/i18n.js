import { createI18n } from 'vue-i18n'
import { en, it } from '@/locales'

export default createI18n({
  locale: 'en',
  fallbackLocale: 'en',
  messages: {
    en,
    it
  }
})
