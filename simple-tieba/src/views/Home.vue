<template>
  <div class="home">
    <div class="spinner-wrapper" v-if="signed_in === null">
        <md-progress-spinner md-mode="indeterminate" />
    </div>
    <div class="home-content" v-else-if="signed_in === false">
        <h1>未登入</h1>
    </div>
    <div class="home-content" v-else-if="signed_in === true">
        <div class="home-top">
            <div class="signed-in-user">
                <md-avatar :class="{ 'md-avatar-icon': avatar_url == null }">
                    <img v-if="avatar_url != null" :src="avatar_url" />
                    <template v-else>{{ user }}</template>
                </md-avatar>
                <div class="md-title">
                    {{ user }}
                </div>
            </div>
            <div>
                <md-badge md-content="reply + at" md-dense>
                    <md-button class="md-icon-button">
                    <md-icon>notifications</md-icon>
                    </md-button>
                </md-badge>
            </div>
        </div>
        <div class="fav-list" v-if="fav.length > 0">
            <a class="fav" href="javascript:void(0)" v-for="bar in fav">
                <div class="md-title">{{ bar.name }}</div>
                <div class="md-subhead">{{ bar.level }} 级</div>
            </a>
        </div>
    </div>
  </div>
</template>

<script>
import { set_title, parse } from '@/tools'
import { get_avatar_url } from '@/avatar'

export default {
    name: 'home',
    mounted: function () {
        set_title('极简贴吧', this.$route.query.VNK)
        this.init()
    },
    data: () => ({
        signed_in: null,
        user: null,
        avatar_url: null,
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
                get_avatar_url(user, url => { this.avatar_url = url })
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
        }
    }
}
</script>

<style>
.spinner-wrapper {
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
    border-radius: initial !important;
}
.fav-list {
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;
    padding: 0.4rem 0px;
}
.fav {
    border: 1px solid hsla(0, 0%, 75%, 0.8);
    box-shadow: 1px 1px 5px hsla(0, 0%, 40%, 0.3);
    padding: 0.5rem 1rem;
    margin: 0.5rem 0px;
    flex-grow: 0;
    flex-shrink: 0;
    flex-basis: 43vw;
    overflow: hidden;
    color: initial !important;
}
.fav:hover, .fav:hover > * {
    text-decoration: none !important;
}
.fav:active {
    background-color: hsla(0, 0%, 85%, 0.8);
}
.fav > div {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
</style>
