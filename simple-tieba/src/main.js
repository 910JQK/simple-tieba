import Vue from 'vue'
import VueMaterial from 'vue-material'
import { JSDOM } from 'jsdom'
import 'whatwg-fetch'

import 'vue-material/dist/vue-material.min.css'
import 'vue-material/dist/theme/default.css'
import 'material-design-icons/iconfont/material-icons.css'

import App from './App.vue'
import router from './router'
import Navigation from 'vue-navigation'


Vue.config.productionTip = false
Vue.use(VueMaterial)
Vue.use(Navigation, { router })

var vm = new Vue({ router, render: h => h(App) })
vm.$mount('#app')
