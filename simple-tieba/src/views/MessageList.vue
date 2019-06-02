<template>
    <div class="message-list">
        <md-tabs class="md-transparent tabs" md-alignment="fixed"
                v-on:md-changed="change_tab">
            <md-tab id="reply" md-label="回复我的"></md-tab>
            <md-tab id="at" md-label="提到我的"></md-tab>
        </md-tabs>
        <div class="spinner-wrapper" v-if="!loaded">
            <md-progress-spinner md-mode="indeterminate" />
        </div>
        <div class="message-list-content" v-else>
            <message-item v-for="(item, i) in list" :item="item"
                            :key="tab + String(i)">
            </message-item>
        </div>
    </div>
</template>

<script>
import { set_title, parse } from '@/tools'
import MessageItem from '@/components/MessageItem'

function load (type, callback) {
    ;(async () => {
        let res = await fetch (
            `https://tieba.baidu.com/mo/q-foobar-1-1-0-wapp/${type}`
        )
        let text = await res.text()
        let document = parse(text)
        let t = document.querySelectorAll('div.ct > div')
        let items = Array.from(t)
        let list = items.map(item => {
            let a = item.querySelectorAll('a')
            let [a_author, a_content] = a
            let t = item.querySelector('span.t')
            let kz = a_content.href.match(/kz=([0-9]+)/)[1]
            let thread = a_content.nextSibling.nodeValue
            if (type == 'replyme') {
                thread = thread.replace(/^对我的主题[：:] */, '')
            } else {
                thread = thread.replace(/^@提到我的主题[：:] */, '')
                thread = thread.replace(/^回复[：:] */, '')
            }
            return {
                author: a_author.textContent,
                content: a_content.textContent,
                date: t.textContent,
                thread, kz
            }
        })
        callback(list)
    })()
}

export default {
    name: 'message-list',
    components: {
        MessageItem
    },
    created: function () {
        set_title('消息通知', this.$route.query.VNK)
        this.init()
    },
    data: () => ({
        reply_list: [],
        at_list: [],
        tab: 'reply'
    }),
    computed: {
        loaded: function () {
            return this.reply_list.length > 0 && this.at_list.length > 0
        },
        list: function () {
            if (this.tab == 'reply') {
                return this.reply_list
            } else {
                return this.at_list
            }
        }
    },
    methods: {
        init: function () {
            load('replyme', list => { this.reply_list = list })
            load('atme', list => { this.at_list = list })
        },
        change_tab: function (id) {
            this.tab = id
        }
    }
}
</script>

<style>
.tabs + .spinner-wrapper {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    top: 2rem;
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>
