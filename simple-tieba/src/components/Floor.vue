<template>
    <div class="floor">
        <div class="header">
            <div class="header-left">
                <md-avatar v-bind:class="{ 'md-avatar-icon': portrait == null }">
                    <img v-if="portrait != null" :src="avatar_url" />
                    <template v-else>{{ data.author[0] }}</template>
                </md-avatar>
                <span class="header-info">
                    <span class="author">{{ data.author }}</span>
                    <span class="date">{{ data.date }}</span>
                </span>
            </div>
            <div class="header-right">
                <span class="counter md-title">{{ data.number + 'L' }}</span>
            </div>
        </div>
        <div class="wrapper md-subheading" ref="wrapper"></div>
    </div>
</template>

<script>
import 'whatwg-fetch'
import GBK from 'gbk.js'

export default {
    name: 'floor',
    props: ['data'],
    mounted: function () {
        this.$refs.wrapper.appendChild(this.data.content)
    },
    created: function () {
        if (this.data.author) {
            let username = GBK.URI.encodeURIComponent(this.data.author)
            ;(async () => {
                let res = await fetch(
                    `https://tieba.baidu.com/i/sys/user_json?un=${username}`
                )
                let json = await res.json()
                this.portrait = json.creator.portrait || null
            })()
        }
    },
    data: () => ({
        portrait: null
    }),
    computed: {
        avatar_url: function () {
            return (
                `http://tb.himg.baidu.com/sys/portrait/item/${this.portrait}`
            )
        }
    }
}
</script>

<style>
.floor {
    border-top: 1px solid hsl(0, 0%, 75%);
    padding: 1.5em 0px;
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
.wrapper {
    padding: 1em 1.25em;
}
.display-image {
    margin: 1.25em 0em;
}
.display-image > img {
    display: block;
    margin: 0em auto;
    max-width: 90%;
}
.display-image:not(.loading) > img {
    border-radius: 5px;
    box-shadow: 0px 0px 5px hsla(0, 0%, 50%, 0.6);
}
.display-image.loading > img {
    width: 64px;
}
</style>
