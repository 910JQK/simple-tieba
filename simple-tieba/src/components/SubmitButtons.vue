<template>
    <div class="buttons">
        <md-button class="md-raised md-accent" disabled.if="busy"
                   v-on:click="cancel()">
            取消
        </md-button>
        <md-button class="md-raised md-primary" disabled.if="!enabled || busy"
                   v-on:click="$emit('submit')">
            发表
        </md-button>
    </div>
</template>

<script>
import router from '@/router'

export default {
    name: 'submit-buttons',
    props: ['enabled', 'busy'],
    methods: {
        cancel: function () {
            router.back()
        }
    }
}
</script>

<style>
.buttons {
    display: flex;
    justify-content: space-between;
}
.buttons > * {
    flex-grow: 1;
}
.buttons > :first-child {
    margin-left: 0px;
}
.buttons > :last-child {
    margin-right: 0px;
}
</style>
