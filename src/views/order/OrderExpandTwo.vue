<template>
    <div>
        <Row class="expand-row">
            <Col span="8">
                <span class="expand-key">公司名称：</span>
                <span class="expand-value">{{ row.comp.displayName }}</span>
            </Col>
            <Col span="8">
                <span class="expand-key">公司编号：</span>
                <span class="expand-value">{{ row.comp.sn }}</span>
            </Col>
        </Row> 
        <Row class="expand-row">  
            <Col span="8">
                <span class="expand-key">用户昵称：</span>
                <span class="expand-value">{{ row.tourist.nickName }}</span>
            </Col> 
            <Col span="8">
                <span class="expand-key">用户识别码：</span>
                <span class="expand-value">{{ row.tourist.userName }}</span>
            </Col>       
        </Row>
        <Row class="expand-row">      
            <Col span="8">
                <span class="expand-key">订单号：</span>
                <span class="expand-value">{{ row.sn }}</span>
            </Col>
            <Col span="8">
                <span class="expand-key">支付方式：</span>
                <span class="expand-value"><PayType style="display:inline" :type="row.paymentType"/></span>
            </Col>
        </Row>
        <Row class="expand-row">
            <Col span="8">
                <span class="expand-key">订单金额：</span>
                <span class="expand-value">￥{{ row.amount.toFixed(2) }}</span>
            </Col>
            <Col span="8">
                <span class="expand-key">商品数量：</span>
                <span class="expand-value">{{ row.goodsCount }}</span>
            </Col>
        </Row>
        <Row class="expand-last-row">            
            <Col span="8">
                <span class="expand-key">订单状态：</span>
                <span class="expand-value">{{ paymentStatusStr }}</span>
            </Col>
            <Col span="8">
                <span class="expand-key">交易时间：</span>
                <span class="expand-value">{{ paymentTimeStr }}</span>
            </Col>
        </Row>        
    </div>
</template>
<script>
    import { parseTime } from 'utils/index';
    import PayType from '../order/PaymentType.vue';
    export default {
        components: { PayType },
        data(){
            return {
                paymentStatusStr: '',
                paymentTimeStr: '',
            }
        },
        props: {
            row: Object
        },
        methods: {
            paymentStatus (status) {
                if(status==='UNPAID'){
                    return "未交易";
                }else if(status==='PAID'){
                    return "交易成功";
                }else if(status==='PAID_FAILED'){
                    return "交易失败";
                }
            }
        },
        mounted(){
            this.paymentStatusStr = this.paymentStatus(this.row.status);
            this.paymentTimeStr = parseTime(this.row.paymentTime);
        }

    }
</script>
<style scoped>
    .expand-row{
        margin-bottom: 16px;
        margin-left:10px;
    }
    .expand-last-row{
        margin-left:10px;
    }
  
</style>