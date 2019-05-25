<template>
    <div class="content loading" v-if="floors.length == 0">
        <md-progress-spinner md-mode="indeterminate" />
    </div>
    <div class="content" v-else >
        <ul>
            <li v-for="(floor, index) in floors" :key="index">
                <floor :data="floor"></floor>
            </li>
        </ul>
        <div class="next_loading_indicator" v-if="next_loading">
            <img :src="Loading" />
        </div>
    </div>
</template>

<script>
import 'whatwg-fetch'
import { parse, set_title, on_scroll, normalize_content } from '@/tools'
import Floor from '@/components/Floor'
import Loading from '@/assets/img-loading.gif'


let floor_mapper = kz => f => {
    let author_url = f.querySelector('.g > a').href
    let match = author_url.match(/un=([^&]+)/)
    let author = (
        match?
            decodeURIComponent(match[1]):
            f.querySelector('.g').textContent
    )
    let date = f.querySelector('.b').textContent
    let number = f.innerText.match(/^([0-9]+)楼/)[1]
    let pid = null
    let reply = 0
    let r = f.querySelector('a.reply_to')
    if (r != null && r.href.match('pid=([0-9]+)') != null) {
        pid = r.href.match('pid=([0-9]+)')[1]
        let r_match = r.textContent.match(/\(([0-9]+)\)$/)
        if (r_match != null) {
            reply = parseInt(r_match[1])
        }
    }
    let need_expand = false
    let expand_pn = '0'
    for (let a of f.querySelectorAll('a')) {
        if (a.textContent == '下一段') {
            let m = a.href.match(/pn=([0-9]+)/)
            if (m != null) {
                need_expand = true
                expand_pn = m[1]
                break
            }
        }
    }
    let content = window.document.createElement('div')
    content.classList.add('thread-content')
    content.classList.add('selectable')
    if (need_expand) {
        let placeholder = window.document.createElement('div')
        placeholder.style.textAlign = 'center'
        let img = window.document.createElement('img')
        img.src = Loading
        placeholder.appendChild(img)
        content.appendChild(placeholder)
        ;(async () => {
            let res = await fetch(`https://tieba.baidu.com/mo/m?kz=${kz}&pn=${expand_pn}&global=1&expand=${number}`)
            let text = await res.text()
            let doc = parse(text)
            let f = doc.querySelector('div.i')
            content.removeChild(placeholder)
            normalize_content(f, c => content.appendChild(c))
        })()
    } else {
        normalize_content(f, c => content.appendChild(c))
    }
    return { kz, pid, reply, number, author, date, content }
}


export default {
    name: 'thread',
    components: { Floor },
    updated: function () {
        set_title(this.title)
    },
    mounted: function () {
        set_title('帖子内容')
        ;(async () => {
            this.kz = this.$route.params.kz
            let kz = this.kz
            let res = await fetch('https://tieba.baidu.com/mo/m?kz=' + kz)
            let text = await res.text()
            let document = parse(text)
            let title = document.querySelector('.bc > strong').textContent
            this.title = title
            set_title(title, this.$route.query.VNK)
            let pn_input = document.querySelector('input[name=pnum]')
            if (pn_input != null) {
                this.page_total = Number(pn_input.value)
            }
            let floors = Array.from(document.querySelectorAll('.d > .i'))
            this.floors = floors.map(floor_mapper(kz))
            console.log(`已加载 帖子 ${kz} / 第 1 页`)
        })()
    },
    data: () => ({
        kz: null,
        floors: [],
        page_total: 1,
        page_current: 1,
        next_loading: false,
        Loading
    }),
    computed: {
        remaining: function () {
            return (this.page_total - this.page_current)
        }
    },
    beforeRouteEnter: function (t, f, next) {
        next(vm => { on_scroll(vm.when_scroll.bind(vm)) })
    },
    beforeRouteLeave: function (t, f, next) {
        on_scroll(null)
        next()
    },
    methods: {
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
                let kz = this.kz
                let pnum = this.page_current + 1
                let res = await fetch (
                    `https://tieba.baidu.com/mo/m?kz=${kz}&pnum=${pnum}`
                )
                let text = await res.text()
                let document = parse(text)
                let floors = Array.from(document.querySelectorAll('.d > .i'))
                let delta = floors.map(floor_mapper(kz))
                this.floors = [...this.floors, ...delta]
                this.page_current = pnum
                this.next_loading = false
                console.log(`已加载 帖子 ${kz} / 第 ${pnum} 页`)
            })()
        }
    }
}
</script>

<style>
ul {
    list-style: none;
    padding: 0px;
}
.next_loading_indicator {
    text-align: center;
}
</style>
