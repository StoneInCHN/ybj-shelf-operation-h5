<template>
    <div>
                    <Row class="expand-row">
                        <Col span="8">
                            <span class="expand-key">公司ID：</span>
                            <span class="expand-value">{{ row.id }}</span>
                        </Col>
                        <Col span="8">
                            <span class="expand-key">公司编号：</span>
                            <span class="expand-value">{{ row.sn }}</span>
                        </Col>                        
                    </Row>
                    <Row class="expand-row">    
                        <Col span="8">
                            <span class="expand-key">公司展示名：</span>
                            <span class="expand-value">{{ row.displayName }}</span>
                        </Col>                            
                        <Col span="8">
                            <span class="expand-key">公司全名：</span>
                            <span class="expand-value">{{ row.fullName }}</span>
                        </Col>
                    </Row>
                    <Row class="expand-row">      
                        <Col span="8">
                            <span class="expand-key">公司地址：</span>
                            <span class="expand-value">{{ row.area.fullName }}</span>
                        </Col>                                       
                        <Col span="8">
                            <span class="expand-key">详细地址：</span>
                            <span class="expand-value">{{ row.address }}</span>
                        </Col>
                    </Row>
                    <Row class="expand-row">            
                        <Col span="8">
                            <span class="expand-key">联系人：</span>
                            <span class="expand-value">{{ row.contactPerson }}</span>
                        </Col>
                        <Col span="8">
                            <span class="expand-key">联系电话：</span>
                            <span class="expand-value">{{ row.contactPhone }}</span>
                        </Col>
                    </Row>  
                    <Row class="expand-row">            
                        <Col span="16">
                            <span class="expand-key">备注：</span>
                            <span class="expand-value">{{ row.remark }}</span>
                        </Col>
                    </Row>  
                    <Row class="expand-row">
                        <Col span="8">
                            <Table size ="small" :columns="goods_shelve_columns" :data="row.goodsShelves"></Table>
                        </Col> 
                    </Row>        
    </div>
</template>
<script>
    import { parseTime } from 'utils/index';
    export default {
        data(){
            return {
                goods_shelve_columns: [
                    {
                        title: '货架类型',
                        key: 'shelfCate',
                        align: 'center',
                        render: (h, params) => {
                            return params.row.shelfCate.spec;
                        }
                    },
                    {
                        title: '货架数量',
                        key: 'count',
                        align: 'center',
                    }
                ],
            }
        },
        props: {
            row: Object
        },
        methods: {},
        mounted(){}

    }
</script>
<style scoped>
    .expand-row{
        margin-bottom: 15px;
        margin-left:60px;
    }
    .expand-last-row{
        margin-left:60px;
    }
  
</style>