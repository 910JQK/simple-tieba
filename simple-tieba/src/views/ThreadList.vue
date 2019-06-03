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
        <div class="next_loading_indicator" v-if="next_loading">
            <img :src="Loading" />
        </div>
    </div>
    <md-snackbar md-position="center" :md-duration="1500"
                :md-active.sync="snackbar_visible">
      <span>{{ snackbar_content }}</span>
    </md-snackbar>
  </div>
</template>


<script>
import { parse, set_title, on_scroll } from '@/tools'
import { extract_submit_info } from '@/submit'
import router from '@/router'
import Loading from '@/assets/img-loading.gif'


let thread_mapper = t => {
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
}


export default {
    name: 'thread-list',
    mounted: function () {
        let VNK = this.$route.query.VNK
        this.kw = this.$route.params.kw
        this.title = `${this.kw} 吧`
        set_title(this.title, this.$route.query.VNK)
        let kw = encodeURIComponent(this.kw)
        ;(async () => {
            let kw_url = `https://tieba.baidu.com/mo/m?kw=${kw}`
            let res = await fetch(kw_url)
            let text = await res.text()
            if (router.currentRoute.query.VNK != VNK) { return }
            let document = parse(text)
            if (document.querySelector('div.i') == null) {
                alert(`该贴吧不存在`)
                router.back()
            }
            extract_submit_info(document, kw_url)
            ;(async () => {
                await new Promise(r => { setTimeout(() => { r() }, 0) })
                let t = document.querySelector('table + table')
                let a = Array.from(t.querySelectorAll('a'))
                let u = a[a.length-1]
                if (u.textContent == '签到') {
                    let q = u.href.match(/\/mo\/(.+)$/)[1]
                    let l = `https://tieba.baidu.com/mo/${q}`
                    let res = await fetch(l)
                    let text = await res.text()
                    let d = parse(text)
                    let s = d.querySelector('span.light')
                    if (s && s.textContent.match(/^签到成功/)) {
                        this.show_snackbar('自动签到成功')
                    } else {
                        this.show_snackbar('自动签到*失败*')
                    }
                }
            })()
            let pnum_input = document.querySelector('input[name=pnum]')
            if (pnum_input != null) {
                this.page_total = Number(pnum_input.value)
            }
            let threads = Array.from(document.querySelectorAll('div.i'))
            this.threads = threads.map(thread_mapper)
            this.update_target()
            console.log(`已加载 ${this.kw}吧 帖子列表 / 第 1 页`)
        })()
    },
    data: () => ({
        threads: [],
        kw: null,
        page_total: 1,
        page_current: 1,
        next_loading: false,
        shown_kz: {},
        snackbar_visible: false,
        snackbar_content: '',
        Loading
    }),
    computed: {
        remaining: function () {
            return (this.page_total - this.page_current)
        }
    },
    beforeRouteEnter: function (t, f, next) {
        next(vm => {
            on_scroll(vm.when_scroll.bind(vm))
            vm.update_target()
        })
    },
    beforeRouteLeave: function (t, f, next) {
        on_scroll(null)
        next()
    },
    methods: {
        goto_kz: function (kz) {
            router.push({ name: 'thread', params: {kz} })
        },
        when_scroll: function (percentage) {
            if (percentage > 0.9) {
                if (!this.next_loading && this.remaining > 0) {
                    this.next_loading = true
                    this.load_next()
                }
            }
        },
        load_next: function () {
            ;(async () => {
                let kw = encodeURIComponent(this.kw)
                let pnum = this.page_current + 1
                let res = await fetch (
                    `https://tieba.baidu.com/mo/m?kw=${kw}&pnum=${pnum}`
                )
                let text = await res.text()
                let document = parse(text)
                let threads = Array.from(document.querySelectorAll('div.i'))
                threads = threads.filter(t => {
                    let a = t.querySelector('a')
                    let match = a.href.match(/kz=([0-9]+)/)
                    let kz = match? match[1]: ''
                    if (!this.shown_kz[kz]) {
                        this.shown_kz[kz] = true
                        return true
                    } else {
                        return false
                    }
                })
                let delta = threads.map(thread_mapper)
                this.threads = [...this.threads, ...delta]
                this.page_current = pnum
                this.next_loading = false
                console.log(`已加载 ${this.kw}吧 帖子列表 / 第 ${pnum} 页`)
            })()
        },
        update_target: function () {
            window.target_info = {
                kw: this.kw,
                VNK: this.$route.query.VNK
            }
        },
        show_snackbar: function (content) {
            this.snackbar_content = content
            this.snackbar_visible = true
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
    border: 1px solid hsl(0, 0%, 75%, 0.9);
    box-shadow: 0px 0px 5px hsla(0, 0%, 40%, 0.3);
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
.next_loading_indicator {
    text-align: center;
}
</style>
