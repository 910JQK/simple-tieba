 <template>
  <div>
    <div class="content loading" v-if="threads.length == 0">
        <md-progress-spinner md-mode="indeterminate" />
    </div>
    <div class="content" v-else >
        <ul class="list">
            <li class="item" v-for="thread in threads" :key="thread.kz" v-on:click="goto_kz(thread.kz)">
                <div class="reply_count md-headline">
                    <div>{{ thread.reply }}</div>
                </div>
                <div class="description">
                    <div class="title md-title">{{ thread.title }}</div>
                    <div class="info md-body-1">
                        {{ thread.author }} {{ thread.date }}
                    </div>
                </div>
            </li>
        </ul>
    </div>
    <div style="display: none" ref="helper"></div>
  </div>
</template>


<script>
import 'whatwg-fetch'
import router from '../router'
import { parse, set_title } from '../tools'

export default {
    name: 'thread-list',
    mounted: function () {
        this.kw = this.$route.params.kw
        this.title = `${this.kw} 吧`
        set_title(this.title, this.$route.query.VNK)
        this.$refs.helper.onload = () => set_title(this.title)
        let kw = encodeURIComponent(this.kw)
        ;(async () => {
            let res = await fetch('http://tieba.baidu.com/mo/m?kw=' + kw)
            let text = await res.text()
            let document = parse(text)
            let threads = Array.from(document.querySelectorAll('div.i'))
            console.log(threads.map(t => t.textContent.split(' ')))
            this.threads = threads.map(t => {
                let a = t.querySelector('a')
                let match = a.href.match(/kz=([0-9]+)/)
                let kz = match? match[1]: ''
                let title = a.textContent.replace(/^[0-9]+./, '').trim()
                let light = Array.from(t.querySelectorAll('span.light'))
                let flags = light.map(l => l.textContent)
                let p = t.querySelector('p')
                let fields = p.textContent.split(/[ \u00a0]+/)
                let author = (fields.length == 4)? (fields[2] || ''): ''
                let date = fields[fields.length-1] || ''
                let match1 = p.textContent.match(/回([0-9]+)/)
                let reply = match1? match1[1]: 0
                return { kz, title, flags, author, date, reply }
            })
            // console.log(this.threads)
        })()
    },
    data: () => ({
        threads: [],
        kw: null
    }),
    methods: {
        goto_kz: function (kz) {
            router.push({ name: 'thread', params: {kz} })
        }
    }
}
</script>


<style>
.content.loading {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    display: flex;
    justify-content: center;
    align-items: center;
}
.list {
    list-style: none;
    padding: 0;
}
.item {
    margin: 1em calc(50% - 50vw);
    padding: 1em 1em 1em 0em;
    border: 1px solid hsl(0, 0%, 75%);
    box-shadow: 0px 0px 5px hsla(0, 0%, 40%, 0.5);
    display: flex;
    align-items: center;
    overflow: hidden;
    cursor: pointer;
}
.reply_count {
    box-sizing: border-box;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 3.5em;
    flex-shrink: 0;
    overflow: hidden;
}
.reply_count > :first-child {
    color: hsl(5, 90%, 56%);
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}
.description {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    overflow-x: hidden;
}
.title {
    margin-bottom: 0.3ex;
    color: hsl(233, 90%, 56%);
    overflow-x: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}
.info {
    color: hsl(0, 0%, 30%);
}
</style>
