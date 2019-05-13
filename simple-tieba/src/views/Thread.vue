<template>
    <div class="content loading" v-if="floors.length == 0">
        <md-progress-spinner md-mode="indeterminate" />
    </div>
    <div class="content" v-else >
        <ul>
            <li v-for="floor in floors">
                <floor :data="floor"></floor>
            </li>
        </ul>
    </div>
</template>

<script>
import 'whatwg-fetch'
import { parse, set_title, normalize_content } from '../tools'
import Floor from '@/components/Floor'
import Loading from '@/assets/img-loading.gif'

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
            let floors = Array.from(document.querySelectorAll('.d > .i'))
            this.floors = floors.map(f => {
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
                if (r != null) {
                    pid = r.href.match('pid=([0-9]+)')[1]
                    let r_match = r.textContent.match(/\(([0-9]+)\)$/)
                    if (r_match != null) {
                        reply = parseInt(r_match[1])
                    }
                }
                let need_expand = false
                let expand_pn = '0'
                ;(() => {
                    for (let a of f.querySelectorAll('a')) {
                        if (a.textContent == '下一段') {
                            let m = a.href.match(/pn=([0-9]+)/)
                            if (m != null) {
                                need_expand = true
                                expand_pn = m[1]
                            }
                        }
                    }
                })()
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
            })
            console.log(this.floors)
        })()
    },
    data: () => ({
        kz: null,
        floors: []
    })
}
</script>

<style>
ul {
    list-style: none;
    padding: 0px;
}
</style>
