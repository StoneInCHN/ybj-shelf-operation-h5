<template>
  <div class="animated fadeIn">
    <Row>
      <Col :md="24" >          
              <Collapse v-model="panel">
                  <Panel name="1">&nbsp;搜索条件
                    <Row slot="content">
                      <Col span="5">              
                          用户昵称
                          <Input v-model="filterData.nickName" placeholder="用户昵称" class="searchInput" @on-enter="changePage(1)"></Input>
                      </Col>
                      <Col span="5">              
                          所属公司
                          <Input v-model="filterData.companyName" placeholder="所属公司" class="searchInput" @on-enter="changePage(1)"></Input>
                      </Col>
                      <Button type="primary" @click="changePage(1)">查询</Button> 
                      <Button type="primary" @click="exportData">
                          <Icon type="ios-download-outline"></Icon> Excel导出
                        </Button>                     
                    </Row>   
                </Panel>  
              </Collapse>    
                <br>     

            <div style="margin-bottom:5px;">
              <Button type="ghost" icon="android-refresh" @click="refresh">刷新</Button>
            </div>

            <div style="position:relative">
              <Table :columns="userColumns" :data="page_list" ref="table"></Table>
              <div class="list-loadding" v-if="list_loadding">
                    <Spin size="large"></Spin>
                    <h6>正在获取数据...</h6>
              </div>
            </div>
            <Page :total="this.pageTotal" show-total show-elevator @on-change="changePage" class="page-style"></Page>          
      </Col>
    </Row>  
</div>
</template>

<script>
import { getUserList,exportData } from 'api/tourist';
import { parseTime } from 'utils/index';
import PayType from '../order/PaymentType.vue';
import store from 'store';
export default {
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
              filterData:{
                nickName:'',
                companyName:''
              },
              userColumns: [
                          {
                              title: '用户ID',
                              key: 'id',
                              width: 80,
                              align: 'center',
                              ellipsis:'true',
                              className: 'column-style',
                          },
                          {
                              title: '用户识别码',
                              key: 'userName',
                              ellipsis:'true',
                              align: 'center',
                              className: 'column-style',
                          },
                          {
                              title: '用户昵称',
                              key: 'nickName',
                              ellipsis:'true',
                              align: 'center',
                              className: 'column-style',
                          },                          
                          {
                              title: '用户获取渠道',
                              ellipsis:'true',
                              key:'userChannel',
                              align: 'center',
                              className: 'column-style',
                              render: (h, params) => {
                                return h(PayType, {props: {type: params.row.userChannel}})
                              }
                          },
                          {
                              title: '用户性别',
                              ellipsis:'true',
                              key:'gender',
                              align: 'center',
                              className: 'column-style',
                              render: (h, params) => {
                                const gender=params.row.gender;
                                if(gender==='MALE'){                                  
                                    return "男";
                                }else if(gender==='FEMALE'){
                                    return "女";
                                }else{
                                    return "--";
                                }
                              }
                          },
                          {
                              title: '首次使用时间',
                              key: 'regTime',
                              ellipsis:'true',
                              align: 'center',
                              className: 'column-style',
                              render: (h, params) => {
                                return parseTime(params.row.regTime);
                              }
                              
                          },   
                          {
                              title: '所属公司',
                              key: 'companyName',
                              ellipsis:'true',
                              align: 'center',
                              className: 'column-style',
                          },                          
                                                                        
                ],//userColumns
            }//return
  },//data
  methods: {
            refresh () {
              this.changePage(this.pageNumber);
            },
		        changePage(pNum){
              const vue = this;
              this.list_loadding=true;
              this.getUserList(pNum, this.filterData)
		        },
            exportData () {
                    // var form = $("<form>");
                    // form.attr('style', 'display:none');
                    // form.attr('target', '_top');
                    // form.attr('method', 'post');
                    // form.attr('accept-charset', 'utf-8');
                    // form.attr('action', '/yxkj-shelf/admin/user/dataExport.jhtml');
                    // if (store.getters.token && store.getters.user && store.getters.user.userName) {
                    //     var userName = $('<input>');
                    //     userName.attr('type', 'hidden');
                    //     userName.attr('name', "userName");                        
                    //     userName.attr('value', store.getters.user.userName);      
                    //     form.append(userName);
                    //     var token = $('<input>');
                    //     token.attr('type', 'hidden');
                    //     token.attr('name', "token");                        
                    //     token.attr('value', store.getters.token);      
                    //     form.append(token);
                    //   }
                    // if (this.filterData.nickName) {
                    //     var input = $('<input>');
                    //     input.attr('type', 'hidden');
                    //     input.attr('name', "nickName");
                    //     input.attr('value', this.filterData.nickName);    
                    //     console.info(this.filterData.nickName);    
                    //     form.append(input);
                    // }
                    // if (this.filterData.companyName) {
                    //     var input = $('<input>');
                    //     input.attr('type', 'hidden');
                    //     input.attr('name', "companyName");
                    //     input.attr('value', this.filterData.companyName);       
                    //     form.append(input);
                    // }     
                    // $('body').append(form);                
                    // form.submit();
                    // form.remove();    
                    window.open("/yxkj-shelf/admin/user/dataExport?userName="+store.getters.user.userName+"&token="+store.getters.token+"&nickName="+this.filterData.nickName+"&companyName="+this.filterData.companyName, "_top");

            },
            getUserList(pNum, filterData) {
              getUserList(pNum, this.pageSize, filterData).then(response => {
                if (response.code === '0000') {
                  this.pageTotal = response.page.total;
                  this.pageNumber = response.page.pageNumber;
                  console.info(response.msg);
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



