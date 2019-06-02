<template>
    <md-avatar :class="{ 'md-avatar-icon': url == null }">
        <img v-if="url != null" :src="url" />
        <template v-else>{{ user }}</template>
    </md-avatar>
</template>

<script>
import { get_avatar_url } from '@/avatar'

export default {
    name: 'avatar',
    props: ['user'],
    data: () => ({
        url: null
    }),
    created: function () {
        if (!this.user) { return }
        get_avatar_url(this.user, url => { this.url = url })
    }
}
</script>

<style>
</style>
