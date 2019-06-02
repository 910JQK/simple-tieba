<template>
    <div class="floor">
        <div class="header">
            <div class="header-left">
                <md-avatar v-bind:class="{ 'md-avatar-icon': avatar_url == null }">
                    <img v-if="avatar_url != null" :src="avatar_url" />
                    <template v-else>{{ data.author[0] }}</template>
                </md-avatar>
                <span class="header-info">
                    <span class="author" :style="{ color: get_color(data.author) }">
                        {{ data.author }}
                    </span>
                    <span class="date">{{ data.date }}</span>
                </span>
            </div>
            <div class="header-right">
                <span class="counter md-title">{{ data.number + 'L' }}</span>
            </div>
        </div>
        <div class="wrapper md-subheading" ref="wrapper">
        </div>
        <div class="button-wrapper">
            <a class="reply-button md-subheading" href="javascript:void(0)"
                v-if="data.number != 1" v-on:click="reply()">
                回复
            </a>
        </div>
        <template v-if="data.pid != null">
            <embbeded :pid="data.pid" :kz="data.kz"
                      :show="data.reply > 0 || e_force_show" :key="e_key"
                      v-on:reply-ready="set_ready()"
                      v-on:reply-to="reply_to">
            </embbeded>
        </template>
    </div>
</template>

<script>
import Embbeded from '@/components/Embbeded'
import { get_color } from '@/tools'
import { get_avatar_url } from '@/avatar'
import router from '@/router'

export default {
    name: 'floor',
    props: ['data'],
    components: { Embbeded },
    mounted: function () {
        this.$refs.wrapper.appendChild(this.data.content)
    },
    created: function () {
        if (this.data.author) {
            get_avatar_url(this.data.author, url => {
                this.avatar_url = url
            })
        }
    },
    data: () => ({
        portrait: null,
        e_key: Math.random(),
        e_force_show: false,
        reply_ready: false,
        avatar_url: null
    }),
    methods: {
        get_color,
        reload_embbeded: function () {
            if (!this.e_force_show) {
                this.e_force_show = true
            }
            this.e_key = Math.random()
        },
        set_ready: function () {
            this.reply_ready = true
        },
        reply: function () {
            if (!this.reply_ready) { return }
            window.sub_reply_info = {
                text: this.data.content.textContent,
                author: this.data.author,
                callback: this.reload_embbeded.bind(this)
            }
            let { pid, kz } = this.data
            router.push({ name: 'new-sub-reply', query: {pid, kz} })
        },
        reply_to: function (author, text) {
            if (!this.reply_ready) { return }
            window.sub_reply_info = {
                text, author,
                fill: `@${author} `,
                callback: this.reload_embbeded.bind(this)
            }
            let { pid, kz } = this.data
            router.push({ name: 'new-sub-reply', query: {pid, kz} })
        }
    }
}
</script>

<style>
.floor {
    border-bottom: 1px solid hsla(0, 0%, 75%, 0.8);
    padding: 1.5rem 0px 0.5rem 0px;
}
li:first-child > .floor {
    padding-top: 0.75rem;
}
.header {
    display: flex;
    justify-content: space-between;
}
.header-left {
    display: flex;
    align-items: center;
}
.header-left > :first-child {
    margin-right: 0.5em;
}
.header-info {
    display: flex;
    flex-direction: column;
    align-items: space-between;
}
.header-right {
    display: flex;
    justify-content: center;
    align-items: center;
}
.date {
    color: hsl(0, 0%, 40%);
}
.thread-content {
    padding: 1rem 0.85rem 0rem 0.85rem;
    overflow-x: hidden;
    word-wrap: break-word;
}
.display-image {
    margin: 1.25rem 0rem;
}
.display-image > img {
    display: block;
    margin: 0rem auto;
    max-width: 90%;
}
.display-image:not(.loading) > img {
    border-radius: 5px;
    box-shadow: 0px 0px 5px hsla(0, 0%, 50%, 0.6);
}
.display-image.loading > img {
    width: 64px;
}
.emoticon {
    margin: 0rem 0.25rem;
}
.button-wrapper {
    position: relative;
    height: 1.5rem;
    margin-bottom: 1rem;
}
.reply-button {
    position: absolute !important;
    right: 0rem;
    bottom: 0rem;
}
</style>
