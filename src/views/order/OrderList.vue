<template>
  <div class="animated fadeIn">
    <Row>
      <Col :md="24" >          
          <div>
<!--                   <Collapse v-model="panel">
                      <Panel name="1">
                            &nbsp;搜索条件 -->
                      <Card>
                        <p slot="title">
                            <Icon type="ios-search-strong"></Icon>
                            搜索条件
                        </p>
                        <Row>
                          <Col span="5">              
                              公司名称 <Input placeholder="公司名称" v-model="filterData.companyName" class="searchInput" @on-enter="changePage(1)"></Input>
                          </Col>
                          <Col span="5">
                              公司编号 <Input placeholder="公司编号" v-model="filterData.companySn" class="searchInput" @on-enter="changePage(1)"></Input>
                          </Col>                  
                          <Col span="8">
                              交易时间 
                              <DatePicker type="date" placeholder="选择日期" v-model="filterData.beginDate" class="searchInput"></DatePicker>
                              到 
                              <DatePicker type="date" placeholder="选择日期" v-model="filterData.endDate" class="searchInput"></DatePicker>
                          </Col>
                          <Button type="primary" @click="changePage(1)">查询</Button>
                          <Button type="primary" @click="exportData">
                            <Icon type="ios-download-outline"></Icon> Excel导出
                          </Button> 
                        </Row>
                      </Card>
<!--                       </Panel>
                  </Collapse> -->
        </Panel>
              <br>
            <div style="margin-bottom:5px;">
              <Button type="ghost" icon="android-refresh" @click="refresh">刷新</Button>
            </div>   

            <div style="position:relative">
              <Table :columns="orderColumns" :data="page_list" ref="table"></Table>
              <div class="list-loadding" v-if="list_loadding">
                    <Spin size="large"></Spin>
                    <h6>正在获取数据...</h6>
              </div>
            </div>

            <Page :total="this.pageTotal" show-total show-elevator @on-change="changePage" class="page-style"></Page>


          </div>             
      </Col>
    </Row> 
</div>
</template>

<script>
import rowExpand from './OrderExpandThree.vue';
import { getOrderList } from 'api/order';
import { parseTime } from 'utils/index';
import PayType from '../order/PaymentType.vue';
import store from 'store';
export default {
  components: { rowExpand },
  name: 'buttons',
  data(){
            return {
              panel:"1",
              pageTotal:0,
              pageNumber:1,
              pageSize:10,
              page_list:[],
              lodding:false,
              list_loadding:false,
              companyPram:'name',
              filterData:{
                beginDate:'',
                endDate:'',
                paymentType:'',
                status:[],
                companySn:'',
                companyName:''
              },
              orderColumns: [
                          {
                              type: 'selection',
                              width: 60,
                              align: 'center',
                              fixed: 'left',
                          },
                          {
                              type: 'expand',
                              width: 30,
                              align: 'center',
                              ellipsis:'true',
                              render: (h, params) => {
                                return h(rowExpand, {props: {row: params.row}})
                              }
                          },
                          {
                              title: '公司名称',
                              key: 'comp',
                              ellipsis:'true',
                              align: 'center',
                              className: 'column-style',
                              render: (h, params) => {
                                return params.row.comp.displayName;
                              }
                          },
                          {
                              title: '用户识别码',
                              key: 'tourist',
                              ellipsis:'true',
                              align: 'center',
                              className: 'column-style',
                              render: (h, params) => {
                                return params.row.tourist.userName;
                              }
                          },
                          {
                              title: '交易时间',
                              key: 'paymentTime',
                              ellipsis:'true',
                              align: 'center',
                              // sortable: 'true',
                              // sortType: 'desc',
                              // sortMethod: (a,b,type) => {
                              //   console.info(a,b,type);
                              // },
                              className: 'column-style',
                              render: (h, params) => {
                                return parseTime(params.row.paymentTime);
                              }
                              
                          },
                          {
                              title: '订单号',
                              key: 'sn',
                              ellipsis:'true',
                              align: 'center',
                              className: 'column-style',
                          },
                          {
                              title: '支付方式',
                              ellipsis:'true',
                              key:'paymentType',
                              align: 'center',
                              className: 'column-style',
                              filterMultiple: false,
                              filters: [
                                {label: '微信', value: 'wx'},
                                {label: '支付宝', value: 'alipay'}
                              ],
                              filterMethod (value, row) {
                                return row.paymentType===value;
                              },
                              filterRemote: (value,key) => {
                                this.filterData.paymentType = value[0];
                                this.changePage(1);
                              },
                              render: (h, params) => {
                                // if (params.row.paymentType == 'wx') {
                                //   return h(PayType, {props: {type: 'WECHAT'}})
                                // }else if(params.row.paymentType == 'alipay'){
                                //   return h(PayType, {props: {type: 'ALIPAY'}})
                                // }
                                if (params.row.paymentType) {
                                  return h(PayType, {props: {type: params.row.paymentType}})
                                }else{
                                  return ""
                                }
                              } 
                          },
                          {
                              title: '订单金额',
                              key: 'amount',
                              ellipsis:'true',
                              align: 'center',
                              className: 'column-style',
                              render: (h, params) => {
                                return h('span','￥'+params.row.amount.toFixed(2));
                              }
                          },
                          {
                              title: '商品数量',
                              key: 'goodsCount',
                              ellipsis:'true',
                              align: 'center',
                              className: 'column-style'   
                          },                         
                          {
                              title: '订单状态',
                              ellipsis:'true',
                              key:'paymentStatus',
                              align: 'center',
                              className: 'column-style',
                              filters: [
                                {label: '未交易', value: 'UNPAID'},    
                                {label: '交易成功', value: 'PAID'},
                                {label: '交易失败', value: 'PAID_FAILED' }
                              ],
                              filterMultiple: true,
                              filterMethod (value, row) {
                                return row.status===value;
                              },
                              filterRemote: (value,key) => {
                                this.filterData.status = value;
                                this.changePage(1);
                              },
                              render: (h, params) => {
                                const status=params.row.status;
                                if(status==='UNPAID'){                                  
                                    return h('div', [h('Tag', {props: {type: 'border', color: "yellow"}}, "未交易")]);
                                }else if(status==='PAID'){
                                    return h('div', [h('Tag', {props: {type: 'border', color: "green"}}, "交易成功")]);
                                }else if(status==='PAID_FAILED'){
                                    return h('div', [h('Tag', {props: {type: 'border', color: "red"}}, "交易失败")]);
                                }
                              }
                          },                         
                          {
                              title: '操作',
                              key: 'action',
                              className: 'column-width-style',
                              align: 'center',
                              ellipsis:'true',
                              render: (h, params) => {
                                const status=parseInt(params.row.status);
                                  return h('div', [
                                    h('Tooltip',
                                      {props: {content: '点击查看详情'}},
                                      [h('Button',
                                        {
                                          props: {type: 'primary', size: 'small'},
                                          style: {marginRight: '5px'},
                                          on: {
                                              click: () => {
                                                this.$router.push({path:'/orderDetail/'+params.row.id })
                                              }
                                          },
                                        }, '查看')]),
                                  ]);
                                }
                            },
                ],//orderColumns
                exportColumns: [{title: '公司名称', key: 'comp'},
                                {title: '用户识别码', key: 'tourist'},
                                {title: '交易时间', key: 'paymentTime'},
                                {title: '订单号', key: 'sn'},
                                {title: '支付方式', key:'paymentType'},
                                {title: '订单金额', key: 'amount'},
                                {title: '商品数量', key: 'goodsCount'},
                                {title: '订单状态', key:'paymentStatus'}],                
            }//return
  },//data
  methods: {
            refresh () {
              this.changePage(this.pageNumber);
            },
            getThis(){
                const vue = this;
                return vue;
            },
		        changePage(pNum){
              this.list_loadding=true;
              this.getOrderList(pNum,this.filterData)
		        },
            exportData () {
                    var form = $("<form>");
                    form.attr('style', 'display:none');
                    form.attr('target', '_top');
                    form.attr('method', 'post');
                    form.attr('action', '/yxkj-shelf/admin/order/dataExport.jhtml');
                    if (store.getters.token && store.getters.user && store.getters.user.userName) {
                        var userName = $('<input>');
                        userName.attr('type', 'hidden');
                        userName.attr('name', "userName");                        
                        userName.attr('value', store.getters.user.userName);      
                        form.append(userName);
                        var token = $('<input>');
                        token.attr('type', 'hidden');
                        token.attr('name', "token");                        
                        token.attr('value', store.getters.token);      
                        form.append(token);
                      }
                    if (this.filterData.companyName) {
                        var input = $('<input>');
                        input.attr('type', 'hidden');
                        input.attr('name', "companyName");
                        input.attr('value', this.filterData.companyName);        
                        form.append(input);
                    }
                    if (this.filterData.companySn) {
                        var input = $('<input>');
                        input.attr('type', 'hidden');
                        input.attr('name', "companySn");
                        input.attr('value', this.filterData.companySn);       
                        form.append(input);
                    }     
                    $('body').append(form);                
                    form.submit();
                    form.remove();                
            },
            getOrderList(pNum,filterData) {
              getOrderList(pNum, this.pageSize, filterData).then(response => {
                if (response.code === '0000') {
                  this.pageTotal = response.page.total;
                  this.pageNumber = response.page.pageNumber;
                  this.page_list= response.msg;
                  this.list_loadding=false;
                }                
              }).catch(error => {
                console.log(error)
              });
            },        
  },
  mounted(){
          this.changePage(1);          
  },
  created () {
        
  },
}

</script>


<style type="text/css" scoped>
.searchInput{
  min-width:50px;
  width:120px
}
.column-style{
  min-width: 90px;
}
.column-width-style{
  color:#0000ff;
  min-width: 150px;
}
.list-loadding{
  position:absolute;
  top:0px;
  width:100%;
  height:100%;
  display: flex;
  align-items: center; 
  justify-content: center;
  background: rgba(210, 216, 222, 0.5);
}
.list-loadding h6{
  color:#2d8cf0;
  margin-top:10px;
}
.page-style{
  text-align:right;
  margin-top:50px;
}
</style>



