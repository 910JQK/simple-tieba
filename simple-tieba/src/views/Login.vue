<template>
    <div class="frame-wrapper">
        <iframe class="frame" src="https://wappass.baidu.com/passport/?login">
        </iframe>
    </div>
</template>

<script>
import { set_title } from '@/tools'

export default {
    name: 'login',
    mounted: function () {
        set_title('登入', this.$route.query.VNK)  
    }
}
</script>

<style>
.md-app-scroller {
    position: relative;
}
.frame-wrapper {
    position: absolute;
    top: 0px;
    left: 0px;
    right: 0px;
    bottom: 0px;
    display: flex;
    flex-direction: column;
}
.frame {
    width: 100%;
    flex-grow: 1;
    border: none;
    overflow: auto;
}
</style>
