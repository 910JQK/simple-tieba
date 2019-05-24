<template>
    <div class="embbeded">
        <template v-if="items.length > 0">
            <floor-in-floor v-for="(item, index) in items" :data="item" :key="index">
            </floor-in-floor>
            <div :class="['expander',{'loading':expand_loading}]"
                 v-if="remaining > 0" v-on:click="expand()">
                <template v-if="expand_loading">
                    正在加载第 {{ page_current+1 }} 页......
                </template>
                <template v-else >
                    还有 {{ remaining }} 页，点击展开下一页
                </template>
            </div>
        </template>
        <template v-else >
            <div style="text-align: center;">
                <img :src="LoadingImage" />
            </div>
        </template>
    </div>
</template>

<script>
import 'whatwg-fetch'
import { parse, normalize_finf_content } from '@/tools'
import FloorInFloor from '@/components/FloorInFloor'
import Loading from '@/assets/img-loading.gif'


let item_mapper = item => {
    let date = item.querySelector('.b').textContent
    let author = item.querySelector('br+a').textContent
    let content = window.document.createElement('div')
    content.classList.add('finf-content')
    content.classList.add('selectable')
    normalize_finf_content(item, c => content.appendChild(c))
    return { author, date, content }
}


export default {
    name: 'embbeded',
    props: ['pid', 'kz'],
    components: { FloorInFloor },
    created: function () {
        ;(async () => {
            let res = await fetch(this.base_url)
            let text = await res.text()
            let document = parse(text)
            let page_input = document.querySelector('.h > input[type=text]')
            let page_total = page_input? Number(page_input.value): 1
            this.page_total = page_total
            let raw_items = Array.from(document.querySelectorAll('div.i'))
            let items = raw_items.map(item_mapper)
            this.items = items
        })()
    },
    data: () => ({
        items: [],
        page_current: 1,
        page_total: 1,
        expand_loading: false,
        LoadingImage: Loading
    }),
    computed: {
        remaining: function () {
            return this.page_total - this.page_current
        },
        base_url: function () {
            if (this.pid == null) { return null }
            let pid = this.pid
            let kz = this.kz
            return `https://tieba.baidu.com/mo/m/flr?pid=${pid}&kz=${kz}`
        }
    },
    methods: {
        expand: function () {
            if (this.expand_loading) { return }
            this.expand_loading = true
            let fpn = this.page_current + 1
            ;(async () => {
                let res = await fetch(`${this.base_url}&fpn=${fpn}`)
                let text = await res.text()
                let document = parse(text)
                let raw_items = Array.from(document.querySelectorAll('div.i'))
                let items = raw_items.map(item_mapper)
                this.items = [...this.items, ...items]
                this.expand_loading = false
                this.page_current += 1
            })()
        }
    }
}
</script>

<style>
.embbeded {
    margin: 0px 0px;
    border: 1px solid hsla(0, 0%, 70%, 0.5);
    background-color: hsla(0, 0%, 90%, 0.3);
}
.expander {
    text-align: center;
    padding: 0.8rem 0rem;
    color: hsl(233, 80%, 55%);
    cursor: pointer;
    font-size: 108%;
}
.expander.loading {
    color: hsl(0, 0%, 35%);
}
</style>
