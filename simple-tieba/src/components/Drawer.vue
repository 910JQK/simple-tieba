<template>
    <div>
        <md-toolbar class="md-transparent" md-elevation="0">菜单</md-toolbar>
        <md-list>
            <md-list-item v-on:click="enter_bar">
                <md-icon>send</md-icon>
                <span class="md-list-item-text">进吧</span>
            </md-list-item>
            <md-list-item v-on:click="login">
                <md-icon>account_circle</md-icon>
                <span class="md-list-item-text">登入</span>
            </md-list-item>
            <md-list-item>
                <md-icon>delete</md-icon>
                <span class="md-list-item-text">Trash</span>
            </md-list-item>
            <md-list-item>
                <md-icon>error</md-icon>
                <span class="md-list-item-text">Spam</span>
            </md-list-item>
        </md-list>
    </div>
</template>

<script>
import router from '@/router'

export default {
    methods: {
        enter_bar: function () {
            this.$emit('hide')
            let kw = prompt('请输入要进入的帖吧')
            if (kw == '') { return }
            kw = kw.split(' ')[0]
            router.push({ name: 'thread-list', params: {kw} })
        },
        login: function () {
            this.$emit('hide')
            router.push({ name: 'login' })
        }
    }
}
</script>

<style>
</style>
