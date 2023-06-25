import { createPinia } from 'pinia'
import piniaPluginPersist from 'pinia-plugin-persist'
import type { App } from 'vue'

export function setupStore(app: App) {
  app.use(createPinia().use(piniaPluginPersist))
}

export * from './modules'
