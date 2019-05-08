<template>
    <div id="app">
        <md-app md-waterfall md-mode="fixed">
            <md-app-toolbar class="md-primary">
                <span class="md-title" id="title">极简贴吧</span>
            </md-app-toolbar>
            <md-app-content>
                <navigation>
                    <router-view :key="$route.fullPath" />
                </navigation>
            </md-app-content>
        </md-app>
    </div>
</template>

<script>
import router from './router'
import { recover_title } from './tools'

export default {
    created: function () {
        router.beforeEach((t, f, next) => {
            recover_title(t.query.VNK)
            next()
        })
    }
}
</script>

<style>
.md-app {
  height: 100vh;
}
* {
    user-select: none;
}
</style>
