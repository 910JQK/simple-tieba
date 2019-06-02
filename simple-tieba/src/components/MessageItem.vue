<template>
    <a class="message-item" v-on:click="goto_thread">
        <div class="message-item-left">
            <avatar :user="item.author"></avatar>
        </div>
        <div class="message-item-right">
            <div class="message-item-right-top">
                <div class="message-author md-subheading">
                    {{ item.author }}
                </div>
                <div class="message-date md-subheading">
                    {{ item.date }}
                </div>
            </div>
            <div class="message-item-right-bottom">
                <div class="message-content md-title">
                    {{ item.content }}
                </div>
                <div class="message-thread md-caption">
                    {{ item.thread }}
                </div>
            </div>
        </div>
    </a>
</template>
 
<script>
import Avatar from '@/components/Avatar'
import router from '@/router'

export default {
    name: 'message-item',
    components: { Avatar },
    props: ['item'],
    methods: {
        goto_thread: function () {
            router.push({ name: 'thread', params: { kz: this.item.kz } })
        }
    }
}
</script>
 
<style>
.message-item {
    display: flex;
    padding: 1rem 0px;
    margin: 0px 0px;
    color: initial !important;
    border-bottom: 1px solid hsla(0, 0%, 75%, 0.8);
}
.message-item:hover, .message-item:hover * {
    text-decoration: none !important;
}
.message-item:active {
    background-color: hsla(0, 0%, 85%, 0.8);
}
.message-item > :first-child {
    flex-shrink: 0;
}
.message-item > :last-child {
    flex-grow: 1;
}
.message-item-left {
    padding: 0px 0.8rem;
}
.message-item-left > * {
    border-radius: 5px !important;
}
.message-item-right-top {
    display: flex;
    align-items: center;
}
.message-item-right-top > :first-child {
    margin-right: 0.8rem;
}
.message-date {
    color: hsl(0, 0%, 40%);
}
.message-content {
    margin-top: 0.2rem;
}
.message-thread {
    margin-top: 0.3rem;
}
</style>
