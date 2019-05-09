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
import router from '../router'
import { parse, set_title, normalize_content } from '../tools'
import Floor from '@/components/Floor'

export default {
    name: 'thread',
    components: {
        Floor
    },
    updated: function () {
        set_title(this.title)
    },
    mounted: function () {
        set_title('帖子内容')
        ;(async () => {
            this.kz = this.$route.params.kz
            let kz = encodeURIComponent(this.kz)
            let res = await fetch('http://tieba.baidu.com/mo/m?kz=' + kz)
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
                let r = f.querySelector('.r > a')
                let pid = null
                if (r != null) {
                    pid = r.href.match('pid=([0-9]+)')[1]
                }
                let number = f.innerText.match(/^([0-9]+)楼/)[1]
                let content = document.createElement('div')
                content.classList.add('thread-content')
                content.classList.add('selectable')
                normalize_content(f, c => content.appendChild(c))
                return { pid, number, author, date, content }
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
