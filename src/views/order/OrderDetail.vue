<template>
  <div>
        <Card>
            <p slot="title">
                <Icon type="clipboard"></Icon>&nbsp;&nbsp;订单详情
            </p>
            <rowExpand :row="order_info" :key="order_info.id"></rowExpand>
            <Row style="margin:25px auto">   
                <Col span="24">
                    <Table border :columns="order_item_columns" :data="order_info.shelfOrderItems"></Table>
                </Col> 
            </Row>
        </Card>
        <br>
        <router-link to="/orderList" style="color:#fff"><Button type="primary" style="float:right;"><Icon type="chevron-left"></Icon>&nbsp;返回</Button></router-link>
  </div>
</template>   
<script>
    import rowExpand from './OrderExpandTwo.vue';    
    import { getOrderDetail } from 'api/order';
    export default {
        components: { rowExpand },
        data () {
            return {
                order_info: {},
                order_item_columns: [
                    {
                        title: '商品条码',
                        key: 'gSn',
                    },
                    {
                        title: '商品名称',
                        key: 'gName',
                    },
                    {
                        title: '净含量',
                        key: 'spec',
                    },
                    {
                        title: '商品单价',
                        key: 'price',
                    },
                    {
                        title: '商品数量',
                        key: 'count',
                    },
                ],
            }
        },
        created(){

        },
        mounted(){
          var hash = window.location.hash;
          
          if(hash){
              var prams = hash.split("/");
              this.getOrderDetail(prams.pop());
          }
            
        },
        methods: {
            getOrderDetail(id) {
              getOrderDetail(id).then(response => {
                if (response.code === '0000') {
                  this.order_info= response.msg;
                  console.info(this.order_info);
                }                
              }).catch(error => {
                console.log(error)
              });
            }, 
        }
       
    }
</script>
<style scoped>
.expand-row{
  margin-bottom: 16px;
  margin-left:60px;
}
.expand-last-row{
  margin-left:60px;
}
.hr-style{
  height:1px;
  border:none;
  border-top:1px dashed #495060;
}
</style>