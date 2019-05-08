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
import { parse, set_title } from '../tools'
import Floor from '@/components/Floor'

export default {
    name: 'thread',
    components: {
        Floor
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
            set_title(title)
            let floors = Array.from(document.querySelectorAll('.d > .i'))
            this.floors = floors.map(f => {
                let author = f.querySelector('.g').textContent
                let date = f.querySelector('.b').textContent
                let r = f.querySelector('.r > a')
                let pid = null
                if (r != null) {
                    pid = r.href.match('pid=([0-9]+)')[1]
                }
                let number = f.innerText.match(/^([0-9]+)楼/)[1]
                let content = document.createElement('div')
                content.className = 'thread-content'
                let children = Array.from(f.childNodes)
                children.pop()
                for (let child of children) {
                    if (child.querySelector && child.querySelector('.BDE_Image') != null) {
                        let extract = child.href.match(/src=([^&]+)/)[1]
                        let real_src = decodeURIComponent(extract)
                        let img = window.document.createElement('img')
                        img.src = real_src
                        img.className = 'display-image'
                        content.appendChild(img)
                    } else {
                        content.appendChild(child)
                    }
                }
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
</style>
