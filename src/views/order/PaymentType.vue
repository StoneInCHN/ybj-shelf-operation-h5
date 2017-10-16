<template>
    <div class="demo-upload">
        <span v-if="type =='ALIPAY'"><img src="static/img/alipay.png" width="25" height="25">支付宝</span>
        <span v-if="type =='WECHAT'"><img src="static/img/wechat.png" width="22" height="22"> 微&nbsp;&nbsp;&nbsp;信</span>
        <span v-if="type =='alipay'"><img src="static/img/alipay.png" width="25" height="25">支付宝</span>
        <span v-if="type =='wx'"><img src="static/img/wechat.png" width="22" height="22"> 微&nbsp;&nbsp;&nbsp;信</span>
    </div>
</template>
<script>
    export default {
        props: ['type'],
        data () {
            return {
                visible:false,
            }
        },
        methods: {
            handleView () {
                this.visible = true;
            },
        }

    }
</script>
<style scoped>

  
</style>