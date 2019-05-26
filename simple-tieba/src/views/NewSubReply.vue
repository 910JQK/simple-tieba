<template>
    <div>
        <blockquote class="reply_target">
            <div class="reply_text">{{ text }}</div>
        </blockquote>
        <md-field>
            <label>回复内容</label>
            <md-textarea v-model="content" spellcheck="false">
            </md-textarea>
        </md-field>
        <submit-buttons v-on:submit="submit()" :enabled="dirty" :busy="busy">
        </submit-buttons>
    </div>
</template>

<script>
import { set_title, confirm, parse, truncate } from '@/tools'
import { get_submit_info, submit } from '@/submit'
import SubmitButtons from '@/components/SubmitButtons.vue'
import router from '@/router'

export default {
    name: 'new-sub-reply',
    components: {
        SubmitButtons
    },
    beforeRouteEnter: function (t, f, next) {
        next()
    },
    beforeRouteLeave: function (t, f, next) {
        if (confirm(this.dirty)) {
            next()
        }
    },
    mounted: function () {
        this.pid = this.$route.query.pid
        this.kz = this.$route.query.kz
        this.info = get_submit_info(`${this.pid}-${this.kz}`)
        this.text = truncate(window.sub_reply_info.text, 60)
        this.author = window.sub_reply_info.author
        this.callback = window.sub_reply_info.callback
        set_title(`回复给：${this.author}`, this.$route.query.VNK)
    },
    data: () => ({
        kz: null,
        pid: null,
        info: null,
        text: null,
        author: null,
        callback: null,
        content: '',
        busy: false
    }),
    computed: {
        dirty: function () {
            return this.content != ''
        }
    },
    methods: {
        clear: function () {
            this.content = ''
        },
        submit: function () {
            if (!this.dirty) { return }
            this.busy = true
            let co = this.content
            submit(this.info, {co}, '回贴成功', ok => {
                if (ok) {
                    alert('回帖成功')
                    this.clear()
                } else {
                    alert('回帖失败')
                }
                this.busy = false
                return this.callback
            })
        }
    }
}
</script>

<style>
.reply_target {
    margin: 0px 0px 1rem 0px;
    padding: 1rem 1rem;
    border: 1px solid hsla(0, 0%, 75%, 0.4);
    border-radius: 5px;
    color: hsl(0, 0%, 25%);
    background-color: hsla(0, 0%, 75%, 0.3);
}
</style>

