<template>
  <div class="home">
    <div class="spinner-wrapper" v-if="signed_in === null">
        <md-progress-spinner md-mode="indeterminate" />
    </div>
    <div class="home-content empty" v-else-if="signed_in === false">
        <md-empty-state
            md-icon="info_outline"
            md-label="尚未登入"
            md-description="请打开左侧菜单并选择「登入」，登入成功后再按返回键返回此页面，或选择「进吧」，不登入单纯看帖。">
        </md-empty-state>
    </div>
    <div class="home-content" v-else-if="signed_in === true">
        <div class="home-top">
            <div class="signed-in-user">
                <avatar :user="user"></avatar>
                <div class="md-title">
                    {{ user }}
                </div>
            </div>
            <div v-on:click="goto_messages()">
                <md-badge :md-content="reply + at" v-if="reply + at > 0">
                    <md-button class="md-icon-button">
                        <md-icon>notifications</md-icon>
                    </md-button>
                </md-badge>
                <md-button class="md-icon-button" v-else>
                    <md-icon>notifications</md-icon>
                </md-button>
            </div>
        </div>
        <div class="fav-list" v-if="fav.length > 0">
            <bar-card v-for="(bar, i) in fav" :bar="bar" :key="i"
                        v-on:click="goto_kw(bar.name)">
            </bar-card>
        </div>
    </div>
  </div>
</template>

<script>
import { set_title, parse } from '@/tools'
import router from '@/router'
import Avatar from '@/components/Avatar'
import BarCard from '@/components/BarCard'

export default {
    name: 'home',
    components: {
        Avatar, BarCard
    },
    beforeRouteEnter: function (t, f, next) {
        next(vm => {
            if (f.name == 'login') {
                router.replace({
                    name: 'home',
                    query: { t: Math.random() }
                })
            }
        })
    },
    mounted: function () {
        set_title('极简贴吧', this.$route.query.VNK)
        this.init()
    },
    data: () => ({
        signed_in: null,
        user: null,
        reply: 0,
        at: 0,
        fav: [],
    }),
    computed: {
        to: function () {
            let kw = encodeURIComponent(this.kw)
            return `/thread-list/${kw}`
        }
    },
    methods: {
        init: function () {
            ;(async () => {
                let res = await fetch('https://wapp.baidu.com')
                let text = await res.text()
                let document = parse(text)
                let link = document.querySelector('a[name=top] + a')
                if (link.textContent == "登录") {
                    this.signed_in = false
                    return
                }
                let user = link.textContent.replace(/的i贴吧$/, '')
                this.user = user
                this.fetch_favourite()
                let msg_area = document.querySelector('div.bc.h')
                let [reply, at] = Array.from(msg_area.querySelectorAll('a'))
                if (!reply || !at) { return }
                let match = reply.textContent.match(/\(([0-9]+)\)$/)
                if (!match) { return }
                this.reply = Number(match[1])
                match = at.textContent.match(/\(([0-9]+)\)$/)
                if (!match) { return }
                this.at = Number(match[1])
            })()
        },
        fetch_favourite: function () {
            ;(async () => {
                let res = await fetch (
                    'https://tieba.baidu.com/mo/m?tn=bdFBW&tab=favorite'
                )
                let text = await res.text()
                let document = parse(text)
                let rows = Array.from (
                    document.querySelectorAll('table.tb > tr')
                )
                let fav = rows.map(r => {
                    let name = r.querySelector('a').textContent
                    let lv_txt = r.querySelector('td[align=center]').textContent
                    let level = Number(lv_txt.replace(/^等级/, ''))
                    return { name, level }
                })
                this.fav = fav
                this.signed_in = true
            })()
        },
        goto_kw: function (kw) {
            router.push({ name: 'thread-list', params: {kw} })
        },
        goto_messages: function () {
            router.push({ name: 'message-list' })
        }
    }
}
</script>

<style>
.spinner-wrapper, .home-content.empty {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    display: flex;
    justify-content: center;
    align-items: center;
}
.home-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.signed-in-user {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    padding: 0px 0.5rem;
}
.signed-in-user > * {
    margin: 0px 1rem 0px 0px !important;
    border-radius: 5px !important;
}
.fav-list {
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;
    padding: 0.4rem 0px;
}
.bar-card {
    flex-grow: 0;
    flex-shrink: 0;
    flex-basis: 43vw;
}
</style>
