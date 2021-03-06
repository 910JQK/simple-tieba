import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Thread from './views/Thread.vue'
import ThreadList from './views/ThreadList.vue'
import Login from './views/Login.vue'
import MessageList from './views/MessageList.vue'
import NewThread from './views/NewThread.vue'
import NewReply from './views/NewReply.vue'
import NewSubReply from './views/NewSubReply.vue'

Vue.use(Router)


let router = new Router({
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
        },
        {
            path: '/message-list',
            name: 'message-list',
            component: MessageList
        },
        {
            path: '/new-thread',
            name: 'new-thread',
            component: NewThread
        },
        {
            path: '/new-reply',
            name: 'new-reply',
            component: NewReply
        },
        {
            path: '/new-sub-reply',
            name: 'new-sub-reply',
            component: NewSubReply
        }
    ]
})


window.router = router

export default router
