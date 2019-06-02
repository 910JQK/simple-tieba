<template>
    <div id="app">
        <md-app md-waterfall md-mode="fixed">
            <md-app-toolbar class="md-primary">
                <md-button class="md-icon-button"
                           v-on:click="show_menu = !show_menu">
                    <md-icon>menu</md-icon>
                </md-button>
                <span class="md-title" id="title"></span>
            </md-app-toolbar>
            <md-app-drawer :md-active.sync="show_menu">
                <drawer v-on:hide="show_menu = false"></drawer>
            </md-app-drawer>
            <md-app-content>
                <navigation>
                    <router-view />
                </navigation>
            </md-app-content>
        </md-app>
        <md-speed-dial class="md-bottom-right" v-if="sd_type != 'none'">
            <md-speed-dial-target class="md-primary" v-on:click="dial()">
                <md-icon v-if="sd_type == 'reply'">reply</md-icon>
                <md-icon v-if="sd_type == 'add'">add</md-icon>
            </md-speed-dial-target>
        </md-speed-dial>
    </div>
</template>

<script>
import router from './router'
import Drawer from './components/Drawer'
import { recover_title, save_scroll, restore_scroll } from './tools'
import { swipe_init } from './swipe'

function fix_scrollbar_style () {
    for (let e of document.querySelectorAll('.md-scrollbar')) {
        e.classList.remove('md-scrollbar')
    }
}

export default {
    components: {
        Drawer
    },
    created: function () {
        swipe_init(d => {
            if (d == 'L') {
                this.show_menu = false
            }
        })
        router.beforeEach((t, f, next) => {
            recover_title(t.query.VNK)
            save_scroll(f.query.VNK)
            this.update_sd(t)
            next()
        })
        router.afterEach((t, f) => {
            // 当用户 navigate backward 时, vue-navigation 会取出被缓存的组件,
            // 重新 render 它. 由于 VDOM 机制的存在, render 时 DOM 会被 reuse,
            // 那么 .md-app-scroller 的 scroll position 就会不正确, 必须修复之.
            // 然而组件是从缓存拿出的，render 不会触发组件的 lifecycle hooks,
            // 所以 scroll position 的恢复需要异步进行.
            if (window.requestAnimationFrame) {
                requestAnimationFrame(() => {
                    restore_scroll(t.query.VNK)
                    fix_scrollbar_style()
                })
            } else {
                setTimeout(() => {
                    restore_scroll(t.query.VNK)
                    fix_scrollbar_style()
                }, 0)
            }
        })
    },
    mounted: function () {
        this.update_sd(router.currentRoute)
    },
    data: () => ({
        show_menu: false,
        sd_type: 'none'
    }),
    methods: {
        dial: function () {
            let VNK = router.currentRoute.query.VNK
            if (this.sd_type == 'add') {
                router.push({ name: 'new-thread' })
            } else if (this.sd_type == 'reply') {
                if (window.target_info && window.target_info.VNK == VNK) {
                    router.push({ name: 'new-reply' })
                }
            }
        },
        update_sd: function (r) {
            if (r.name == 'thread-list') {
                this.sd_type = 'add'
            } else if (r.name == 'thread') {
                this.sd_type = 'reply'
            } else {
                this.sd_type = 'none'
            }
        }
    }
}
</script>

<style>
.md-app {
  height: 100vh;
}
.md-toolbar {
    flex-wrap: nowrap !important;
}
:not(.selectable) {
    user-select: none;
}
* {
    user-select: text;
}
</style>
