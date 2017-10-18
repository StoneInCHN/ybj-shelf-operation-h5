<template>
    <div>
        <Card style="padding-left:20px">
            <p slot="title">
                <Icon type="clipboard"></Icon>&nbsp;&nbsp;商品二维码
            </p> 
            <Row style="width:900px">
                <Col span="12">
                    <span>公司名称：</span>
                    <span>{{ companyInfo.displayName }}</span>
                </Col> 
                <Col span="12">
                    <span>公司编号：</span>
                    <span>{{ companyInfo.sn }}</span>
                 </Col>                        
            </Row>
            <br>                
            <Row style="margin-bottom:10px;width:900px">
                <Col span="12">
                    <span>全部商品：</span>
                </Col>     
                 <Col span="12">
                    <span><Button type="primary" size="small" @click="getQr">生成二维码</Button></span>
                </Col>        
            </Row> 
            <Row>
                <Col span="24">
                <Transfer
                    :data="allGoods"
                    :target-keys="selectKeys"
                    :list-style="listStyle"
                    :render-format="render"
                    :titles="['全部商品', '已选商品']"
                    :operations="['删除','添加']"
                    filterable
                    @on-change="handleChange">
                    <div :style="{float: 'right', margin: '5px'}">
                        <Button type="ghost" size="small" @click="reloadData">重置</Button>
                    </div>        
                </Transfer>
                </Col>                        
            </Row>  
            <br>
        </Card>              
        <br>   
        <router-link to="/companyList" style="color:#fff"><Button type="primary" style="float:right;"><Icon type="chevron-left"></Icon>&nbsp;返回</Button></router-link>
</div>
</template>
<script>
    import { getAllGoodsProfile } from 'api/company'; 
    import store from 'store'
    export default {
        data () {
            return {
                companyInfo: {},
                allGoods: [],
                selectKeys: [],
                listStyle: {
                    width: '350px',
                    height: '500px',
                }
            }
        },
        methods: {
            handleChange (targetKeys) {
                this.selectKeys = targetKeys;
            },
            render (item) {
                return item.label + ' - ' + item.spec + ' - ' + item.sn;
            },
            reloadData(){
              getAllGoodsProfile().then(response => {
                if (response.code === '0000') {
                    this.allGoods = response.msg;
                    this.selectKeys = [];
                }               
              }).catch(error => {
                console.log(error)
              });
            },   
            getQr(){
                if (this.selectKeys.length > 0) {
                    //自定义form标签，初始化相关参数
                    var form = $("<form>");
                    form.attr('style', 'display:none');
                    form.attr('target', '_top');
                    form.attr('method', 'post');
                    form.attr('action', '/yxkj-shelf/common/downloadQrPdf.jhtml');

                    var companyId = $('<input>');
                    companyId.attr('type', 'hidden');
                    companyId.attr('name', 'companyId');
                    companyId.attr('value', this.companyInfo.id);        
                    form.append(companyId);

                    for (var i = 0; i < this.selectKeys.length; i++) {
                        var selectKeysInput = $('<input>');
                        selectKeysInput.attr('type', 'hidden');
                        selectKeysInput.attr('name', 'selectKeys');
                        selectKeysInput.attr('value', this.selectKeys[i]);
                        form.append(selectKeysInput);
                    }        

                    $('body').append(form);                

                    form.submit();
                    form.remove();
                }else{
                    this.$Message.error('请添加商品');
                }
            }     
        },
        mounted (){
            this.reloadData();
            if (store.getters.selectedRow) {
                this.companyInfo = store.getters.selectedRow;
            }
            console.info(this.companyInfo);
            
        },  
    }
</script>
<style scoped>

  
</style>