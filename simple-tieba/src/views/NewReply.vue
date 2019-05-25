 <template>
    <div>
        <blockquote class="reply_target">
            <div class="reply_title">{{ title }}</div>
            <div class="reply_text">{{ text }}</div>
        </blockquote>
        <md-field>
            <label>回复内容</label>
            <md-textarea v-model="content">
            </md-textarea>
        </md-field>
        <submit-buttons v-on:submit="submit()" :enabled="dirty" :busy="busy">
        </submit-buttons>
    </div>
</template>

<script>
import { set_title, confirm, parse, encode_query, truncate } from '@/tools'
import SubmitButtons from '@/components/SubmitButtons.vue'
import router from '@/router'

export default {
    name: 'new-reply',
    components: {
        SubmitButtons
    },
    beforeRouteLeave: function (t, f, next) {
        if (confirm(this.dirty)) {
            next()
        }
    },
    mounted: function () {
        this.kz = this.$route.params.kz
        this.title = window.reply_title
        this.text = truncate(window.reply_text, 60)
        this.author = window.reply_author
        set_title(`回复给：${this.author}`, this.$route.query.VNK)
    },
    data: () => ({
        kz: null,
        title: null,
        text: null,
        author: null,
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
            let VNK = this.$route.query.VNK
            let kz = this.kz
            let co = this.content
            ;(async () => {
                let res = await fetch(`https://tieba.baidu.com/mo/m?kz=${kz}`)
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
                data.co = co
                let body = encode_query(data)
                let URL_ENCODED = 'application/x-www-form-urlencoded'
                ;(async () => {
                    let SUBMIT_URL = 'https://tieba.baidu.com/mo/m/submit'
                    let res = await fetch(SUBMIT_URL, {
                        method: 'POST',
                        headers: { 'Content-Type': URL_ENCODED },
                        body: body
                    })
                    let text = await res.text()
                    let document = parse(text)
                    let t = document.querySelector('span.light')
                    if (t && t.textContent == '回贴成功') {
                        alert('回帖成功')
                        this.clear()
                        if (this.$route.query.VNK == VNK) {
                            router.back()
                            setTimeout(() => { location.reload() }, 500)
                        }
                    } else {
                        alert('回帖失败')
                    }
                    this.busy = false
                })()
            })()
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
.reply_title {
    overflow-x: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    margin-bottom: 0.2rem;
}
</style>

