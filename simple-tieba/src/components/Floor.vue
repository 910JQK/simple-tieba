<template>
    <div class="floor">
        <md-avatar v-bind:class="{ 'md-avatar-icon': portrait == null }">
            <img v-if="portrait != null" :src="avatar_url" />
            <template v-else>{{ data.author[0] }}</template>
        </md-avatar>
        <span>{{ data.author }}</span>
        <div class="wrapper" ref="wrapper">
            
        </div>
    </div>
</template>

<script>
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
                    `http://tieba.baidu.com/i/sys/user_json?un=${username}`
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
</style>
