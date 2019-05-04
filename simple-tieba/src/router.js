import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import ThreadList from './views/ThreadList.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/thread-list',
      name: 'thread-list',
      component: ThreadList
    }
  ]
})
