<template>
  <div class="home">
    <input type="text" v-model="kw" />
    <router-link v-bind:to="'/thread-list/'+kw">进吧</router-link>
  </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue'

export default {
    name: 'home',
    data: () => ({
        kw: 'linux'
    })
}
</script>
