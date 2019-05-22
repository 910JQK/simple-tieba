<template>
    <div id="app">
        <md-app md-waterfall md-mode="fixed">
            <md-app-toolbar class="md-primary">
                <span class="md-title" id="title">极简贴吧</span>
            </md-app-toolbar>
            <md-app-content>
                <navigation>
                    <router-view />
                </navigation>
            </md-app-content>
        </md-app>
    </div>
</template>

<script>
import router from './router'
import { recover_title, save_scroll, restore_scroll } from './tools'

export default {
    created: function () {
        router.beforeEach((t, f, next) => {
            recover_title(t.query.VNK)
            save_scroll(f.query.VNK)
            next()
        })
        router.afterEach((t, f) => {
            // 当用户 navigate backward 时, vue-navigation 会取出被缓存的组件,
            // 重新 render 它. 由于 VDOM 机制的存在, render 时 DOM 会被 reuse,
            // 那么 .md-app-scroller 的 scroll position 就会不正确, 必须修复之.
            // 然而组件是从缓存拿出的，render 不会触发组件的 lifecycle hooks,
            // 所以 scroll position 的恢复需要异步进行.
            if (window.requestAnimationFrame) {
                requestAnimationFrame(() => restore_scroll(t.query.VNK))
            } else {
                setTimeout(() => restore_scroll(t.query.VNK), 0)
            }
        })
    }
}
</script>

<style>
.md-app {
  height: 100vh;
}
:not(.selectable) {
    user-select: none;
}
* {
    user-select: text;
}
</style>
