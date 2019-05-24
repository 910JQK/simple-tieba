<template>
  <div class="home">
    <input type="text" v-model="kw" />
    <router-link v-bind:to="to">进吧</router-link>
  </div>
</template>

<script>
import { set_title } from '@/tools'

export default {
    name: 'home',
    mounted: function () {
        set_title('极简贴吧', this.$route.query.VNK)  
    },
    data: () => ({
        kw: 'linux'
    }),
    computed: {
        to: function () {
            let kw = encodeURIComponent(this.kw)
            return `/thread-list/${kw}`
        }
    }
}
</script>
