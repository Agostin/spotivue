import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import VeeValidatePlugin from './includes/validate'
import i18n from '@/includes/i18n'
import { auth } from './includes/firebase'
import { registerSW } from 'virtual:pwa-register'
import GlobalComponents from '@/includes/_globals'
import progressBar from '@/includes/progress-bar'

import App from './App.vue'

import './assets/base.css'
import './assets/main.css'
import 'nprogress/nprogress.css'

registerSW({ immediate: true })

progressBar(router)

let app = null

auth.onAuthStateChanged(() => {
  if (!app) {
    app = createApp(App)

    app.use(createPinia())
    app.use(router)
    app.use(VeeValidatePlugin)
    app.use(i18n)
    app.use(GlobalComponents)

    app.mount('#app')
  }
})
