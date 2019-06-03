<template>
    <div>
        <md-toolbar class="md-transparent" md-elevation="0">菜单</md-toolbar>
        <md-list>
            <md-list-item v-on:click="home">
                <md-icon>home</md-icon>
                <span class="md-list-item-text">首页</span>
            </md-list-item>
            <md-list-item v-on:click="enter_bar">
                <md-icon>send</md-icon>
                <span class="md-list-item-text">进吧</span>
            </md-list-item>
            <md-list-item v-on:click="login">
                <md-icon>account_circle</md-icon>
                <span class="md-list-item-text">登入</span>
            </md-list-item>
            <md-list-item v-on:click="logout">
                <md-icon>exit_to_app</md-icon>
                <span class="md-list-item-text">注销</span>
            </md-list-item>
            <md-list-item v-on:click="about">
                <md-icon>info</md-icon>
                <span class="md-list-item-text">关于</span>
            </md-list-item>
        </md-list>
    </div>
</template>

<script>
import { parse } from '@/tools'
import router from '@/router'

export default {
    methods: {
        home: function () {
            if (router.currentRoute.name != 'home') {
                router.push({ name: 'home' })
            }
        },
        enter_bar: function () {
            this.$emit('hide')
            let kw = prompt('请输入要进入的贴吧')
            if (kw == '') { return }
            kw = kw.split(' ')[0]
            router.push({ name: 'thread-list', params: {kw} })
        },
        login: function () {
            this.$emit('hide')
            if (router.currentRoute.name != 'login') {
                router.push({ name: 'login' })
            }
        },
        logout: function () {
            this.$emit('hide')
            ;(async () => {
                let res = await fetch('https://wapp.baidu.com')
                let text = await res.text()
                let document = parse(text)
                let c = document.querySelector('div.c')
                let al = Array.from(c.lastElementChild.querySelectorAll('a'))
                let url = null
                for (let a of al) {
                    if (a.textContent == '注销') {
                        url = a.href
                        break
                    }
                }
                if (url == null) {
                    alert('注销失败')
                    return
                }
                let res1 = await fetch(url, { credentials: 'include' })
                if (res1.status == 200) {
                    alert('登出成功')
                    if (router.currentRoute.name != 'home') {
                        router.push({ name: 'home' })
                    } else {
                        router.replace({
                            name: 'home',
                            query: { t: Math.random() }
                        })
                    }
                }
            })()
        },
        about: function () {
            this.$emit('hide')
            alert(
                `本程序为 Android 开发实验程序，不作任何担保，`
                + `使用者因使用本程序造成的损失开发者概不负责。`
                + `使用本程序发出的回复容易被*度删除，假如帖子频繁被删，`
                + `请使用右上角菜单中的「用浏览器打开」功能，`
                + `在浏览器中进行回帖。`
            )
        }
    }
}
</script>

<style>
</style>
