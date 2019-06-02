<template>
    <a class="bar-card" href="javascript:void(0)" v-on:click="$emit('click')">
        <div class="bar-card-left">
            <md-avatar :class="{ 'md-avatar-icon': avatar_url == null }">
                <img class="ba_img" v-if="avatar_url != null"
                    :src="avatar_url" />
                <template v-else>{{ bar.name }}</template>
            </md-avatar>
        </div>
        <div class="bar-card-right">
            <div class="md-title">{{ bar.name }}</div>
            <div class="md-subhead">{{ bar.level }} 级</div>
        </div>
    </a>
</template>

<script>
import { get_bar_avatar_url } from '@/avatar'

export default {
    name: 'bar-card',
    props: ['bar'],
    created: function () {
        get_bar_avatar_url(this.bar.name, url => {
            this.avatar_url = url
        })
    },
    data: () => ({
        avatar_url: null
    }),
}
</script>

<style>
.bar-card {
    border: 1px solid hsla(0, 0%, 75%, 0.8);
    box-shadow: 1px 1px 5px hsla(0, 0%, 40%, 0.3);
    padding: 0.5rem 1rem;
    margin: 0.5rem 0px;
    overflow: hidden;
    color: initial !important;
    display: flex;
    align-items: center;
}
.bar-card:hover, .bar-card:hover > * {
    text-decoration: none !important;
}
.bar-card:active {
    background-color: hsla(0, 0%, 85%, 0.8);
}
.bar-card-left {
    margin-right: 0.8rem;
}
.bar-card-left > * {
    border-radius: 3px !important;
}
.ba_img {
    width: 40px;
    height: 40px;
}
.bar-card-right {
    overflow: hidden;
}
.bar-card-right > div {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
</style>
