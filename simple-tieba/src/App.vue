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
            setTimeout(() => {
                restore_scroll(t.query.VNK)
            }, 0)
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
