<template>
    <div class="finf">
        <div class="finf-info">
            <a class="finf-author" :style="{ color: get_color(data.author) }" href="javascript:void(0)">
                {{ data.author }}
            </a>
            <span class="finf-date">{{ data.date }}</span>
        </div>
        <div class="wrapper" ref="wrapper"></div>
    </div>
</template>

<script>
import { get_color } from '@/tools'

export default {
    name: 'floor-in-floor',
    props: ['data'],
    mounted: function () {
        this.$refs.wrapper.appendChild(this.data.content)
    },
    methods: { get_color }
}
</script>

<style>
.finf {
    padding: 0.5rem 0.8rem;
}
.finf:not(:last-child) {
    border-bottom: 1px solid hsla(0, 0%, 70%, 0.5);
}
.finf-date {
    margin-left: 0.3rem;
    color: hsl(0, 0%, 40%);
}
.finf-content {
    margin-top: 0.5rem;
    margin-bottom: 0.6rem;
    padding-left: 1.25rem;
    padding-right: 0.3rem;
    overflow-x: hidden;
    word-wrap: break-word;
}
.finf-reply::after {
    content: ":";
    color: initial;
    margin-right: 0.5rem;
}
</style>
