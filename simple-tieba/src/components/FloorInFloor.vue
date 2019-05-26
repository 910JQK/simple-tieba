<template>
    <div class="finf">
        <div class="finf-info">
            <a class="finf-author" href="javascript:void(0)"
                :style="{ color: get_color(data.author) }">
                {{ data.author }}
            </a>
            <span class="finf-date">{{ data.date }}</span>
        </div>
        <div class="wrapper" ref="wrapper"></div>
        <md-button class="finf-reply-button md-icon-button md-dense"
                    v-on:click="emit_reply">
            <md-icon>reply</md-icon>
        </md-button>
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
    methods: {
        get_color,
        emit_reply: function () {
            let text = this.data.content.textContent
            this.$emit('reply', this.data.author, text)
        }
    }
}
</script>

<style>
.finf {
    padding: 0.5rem 0.8rem;
    position: relative;
}
.finf:not(:last-child) {
    border-bottom: 1px solid hsla(0, 0%, 70%, 0.5);
}
.finf-date {
    margin-left: 0.3rem;
    color: hsl(0, 0%, 40%);
}
.finf-reply-button {
    position: absolute !important;
    right: 0.3rem;
    bottom: 0.3rem;
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
