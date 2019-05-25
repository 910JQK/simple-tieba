<template>
    <div>
        <md-field>
            <label>标题</label>
            <md-input v-model="title"></md-input>
        </md-field>
        <md-field>
            <label>内容</label>
            <md-textarea v-model="content" spellcheck="false"></md-textarea>
        </md-field>
        <submit-buttons v-on:submit="submit()" :enabled="dirty" :busy="busy">
        </submit-buttons>
    </div>
</template>

<script>
import { set_title, confirm, parse } from '@/tools'
import { get_submit_info, submit } from '@/submit'
import SubmitButtons from '@/components/SubmitButtons.vue'
import router from '@/router'

export default {
    name: 'new-thread',
    components: {
        SubmitButtons
    },
    beforeRouteEnter: function (t, f, next) {
        next(vm => {
            vm.info = get_submit_info(f.query.VNK)
        })
    },
    beforeRouteLeave: function (t, f, next) {
        if (confirm(this.dirty)) {
            next()
        }
    },
    mounted: function () {
        let kw = window.target_info.kw
        set_title(`发表主题帖（${kw}吧）`, vm.$route.query.VNK)
    },
    data: () => ({
        info: null,
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
            let ti = this.title
            let co = this.content
            submit(this.info, { ti, co }, '发贴成功', ok => {
                if (ok) {
                    alert('发帖成功')
                    this.clear()
                } else {
                    alert('发帖失败')
                }
                this.busy = false
            })
        }
    }
}
</script>

<style>
</style>
