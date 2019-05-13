<template>
    <div class="finf">
        <div class="wrapper" ref="wrapper"></div>
        <div class="finf-info">
            <span class="finf-author">{{ data.author }}</span>
            <span class="finf-date">{{ data.date }}</span>
        </div>
    </div>
</template>

<script>
export default {
    name: 'floor-in-floor',
    props: ['data'],
    mounted: function () {
        this.$refs.wrapper.appendChild(this.data.content)
    }
}
</script>

<style>
</style>
