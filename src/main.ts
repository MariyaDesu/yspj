import '@/styles/reset.css'
import '@/styles/index.scss'
import 'uno.css'
import 'virtual:svg-icons-register'

import { createApp } from 'vue'
import mitt from 'mitt'
import VXETable from 'vxe-table'
import XEUtils from 'xe-utils'
import App from './App.vue'
import { setupStore } from './store'
import { setupRouter } from './router'

import 'vxe-table/lib/style.css'
const Mit = mitt()

declare module 'vue' {
  export interface ComponentCustomProperties {
    $Bus: typeof Mit
  }
}

VXETable.formats.mixin({

  formatAmount({ cellValue }, digits = 3) {
    return Number(XEUtils.commafy(Number(cellValue), { digits }).slice(0, -1)) === 0 ? '-' : XEUtils.commafy(Number(cellValue), { digits }).slice(0, -1)
  },

})

const app = createApp(App)

setupStore(app)
setupRouter(app)
app.config.globalProperties.$Bus = Mit
app.use(VXETable)
app.mount('#app')
