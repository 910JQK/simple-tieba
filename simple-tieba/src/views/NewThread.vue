<template>
    <div>
        <md-field>
            <md-input v-model="title" placeholder="标题"></md-input>
        </md-field>
        <md-field>
            <md-textarea v-model="content" placeholder="内容"></md-textarea>
        </md-field>
        <submit-buttons v-on:submit="submit()" :enabled="dirty" :busy="busy">
        </submit-buttons>
    </div>
</template>

<script>
import { set_title, confirm, parse, encode_query } from '@/tools'
import SubmitButtons from '@/components/SubmitButtons.vue'
import router from '@/router'

export default {
    name: 'new-thread',
    components: {
        SubmitButtons
    },
    beforeRouteLeave: function (t, f, next) {
        if (confirm(this.dirty)) {
            next()
        }
    },
    mounted: function () {
        let kw = this.$route.params.kw
        this.kw = kw
        set_title(`发表主题帖（${kw}吧）`, this.$route.query.VNK)
    },
    data: () => ({
        kw: null,
        title: '',
        content: '',
        busy: false
    }),
    computed: {
        dirty: function () {
            return (this.title != '' || this.content != '')
        }
    },
    methods: {
        clear: function () {
            this.title = ''
            this.content = ''
        },
        submit: function () {
            if (!this.dirty) { return }
            this.busy = true
            let kw = encodeURIComponent(this.kw)
            let ti = this.title
            let co = this.content
            ;(async () => {
                let res = await fetch(`https://tieba.baidu.com/mo/m?kw=${kw}`)
                let text = await res.text()
                let document = parse(text)
                let form = document.querySelector('form[method=post]')
                let fields = Array.from(form.querySelectorAll('input[name]'))
                let need_remove = new Set(['insert_smile', 'insert_pic'])
                let data = {}
                for (let field of fields) {
                    if (!need_remove.has(field.name)) {
                        data[field.name] = field.value
                    }
                }
                data.ti = ti
                data.co = co
                let body = encode_query(data)
                ;(async () => {
                    let SUBMIT_URL = 'https://tieba.baidu.com/mo/m/submit'
                    let res = await fetch(SUBMIT_URL, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        },
                        body: body
                    })
                    let text = await res.text()
                    let document = parse(text)
                    let t = document.querySelector('span.light')
                    if (t && t.textContent == '发贴成功') {
                        alert('发帖成功')
                        this.clear()
                        router.back()
                        setTimeout(() => { location.reload() }, 500)
                    } else {
                        alert('发帖失败')
                    }
                    this.busy = false
                })()
            })()
        }
    }
}
</script>

<style>
</style>
