<template>
    <div id="app">
        <md-app md-waterfall md-mode="fixed">
            <md-app-toolbar class="md-primary">
                <span class="md-title">极简贴吧</span>
            </md-app-toolbar>
            <md-app-content>
                <navigation>
                    <router-view/>
                </navigation>
            </md-app-content>
        </md-app>
    </div>
</template>

<script>
</script>

<style>
.md-app {
  height: 100vh;
}
</style>
