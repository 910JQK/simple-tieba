import Vue from 'vue'
import {
    MdApp, MdToolbar, MdContent, MdProgress, MdAvatar,
    MdIcon, MdDrawer, MdButton, MdList, MdSpeedDial, MdField,
    MdCard, MdBadge, MdTabs, MdSnackbar, MdMenu, MdEmptyState
} from 'vue-material/dist/components'

import App from './App.vue'
import router from './router'
import Navigation from 'vue-navigation'

import 'vue-material/dist/vue-material.min.css'
import 'vue-material/dist/theme/default.css'
import 'material-design-icons/iconfont/material-icons.css'


Vue.config.productionTip = false
Vue.use(Navigation, { router })
;[
    MdApp, MdToolbar, MdContent, MdProgress, MdAvatar,
    MdIcon, MdDrawer, MdButton, MdList, MdSpeedDial, MdField,
    MdCard, MdBadge, MdTabs, MdSnackbar, MdMenu, MdEmptyState
].forEach(c => Vue.use(c))


var vm = new Vue({ router, render: h => h(App) })
vm.$mount('#app')
window.vm = vm

