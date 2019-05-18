<template>
    <div class="embbeded">
        <template v-if="items.length > 0">
            <floor-in-floor v-for="item in items" :data="item" :key="item.index">
            </floor-in-floor>
        </template>
        <template v-else >
            <div style="text-align: center;">
                <img v-bind:src="LoadingImage" />
            </div>
        </template>
    </div>
</template>

<script>
import 'whatwg-fetch'
import { parse, normalize_finf_content } from '../tools'
import FloorInFloor from '@/components/FloorInFloor'
import Loading from '@/assets/img-loading.gif'

export default {
    name: 'embbeded',
    props: ['pid', 'kz'],
    components: { FloorInFloor },
    created: function () {
        if (this.pid == null) { return }
        let pid = this.pid
        let kz = this.kz
        ;(async () => {
            let res = await fetch (
                `https://tieba.baidu.com/mo/m/flr?pid=${pid}&kz=${kz}`
            )
            let text = await res.text()
            let document = parse(text)
            let raw_items = Array.from(document.querySelectorAll('div.i'))
            let items = raw_items.map((item, index) => {
                let date = item.querySelector('.b').textContent
                let author = item.querySelector('br+a').textContent
                let content = window.document.createElement('div')
                content.classList.add('finf-content')
                content.classList.add('selectable')
                normalize_finf_content(item, c => content.appendChild(c))
                return { author, date, content, index }
            })
            this.items = items
        })()
    },
    data: () => ({
        items: [],
        LoadingImage: Loading
    })
}
</script>

<style>
.embbeded {
    margin: 0px 0px;
    border: 1px solid hsla(0, 0%, 70%, 0.5);
    background-color: hsla(0, 0%, 90%, 0.3);
}
</style>
