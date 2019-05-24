import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Thread from './views/Thread.vue'
import ThreadList from './views/ThreadList.vue'
import Login from './views/Login.vue'

Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/',
            name: 'home',
            component: Home
        },
        {
            path: '/thread-list/:kw',
            name: 'thread-list',
            component: ThreadList
        },
        {
            path: '/thread/:kz',
            name: 'thread',
            component: Thread
        },
        {
            path: '/login',
            name: 'login',
            component: Login
        }
    ]
})
