<template>
    <div class="floor">
        <div class="wrapper" ref="wrapper">
            
        </div>
    </div>
</template>

<script>
export default {
    name: 'floor',
    props: ['data'],
    mounted: function () {
        this.$refs.wrapper.appendChild(this.data.content)
    }
}
</script>

<style>
</style>
