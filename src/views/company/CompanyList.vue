<template>
  <div class="animated fadeIn">
    <Row>
      <Col :md="24" >     
              <Collapse v-model="panel">
                  <Panel name="1">&nbsp;搜索条件
                    <Row slot="content">
                      <Col span="5">              
                          公司名称
                          <Input placeholder="公司名称" v-model="filterData.displayName" class="searchInput" @on-enter="changePage(1)"></Input>
                      </Col>
                      <Col span="5">              
                          公司编号
                          <Input placeholder="公司编号" v-model="filterData.sn" class="searchInput" @on-enter="changePage(1)"></Input>
                      </Col>                                   
                        <Button type="primary" @click="changePage(1)">查询</Button>
                        <Button type="primary" @click="exportData">
                          <Icon type="ios-download-outline"></Icon> Excel导出
                        </Button> 
                      
                    </Row>     
                </Panel>  
              </Collapse>    
          <br>      
          <div>
            <div id="container" style="margin-bottom:10px;">
              <Button type="ghost" icon="android-add" @click="add">添加</Button>
              <Button type="ghost" icon="trash-a" @click="deleteBatch">批量删除</Button>
              <Button type="ghost" icon="android-refresh" @click="refresh">刷新</Button>
            </div>           
            <div style="position:relative">
              <Table :columns="companyColumns" :data="page_list" ref="table" @on-selection-change="onSelectionChange"></Table>
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
import rowExpand from '../company/companyExpand.vue';
import { getCompanyList, deleteCompany } from 'api/company';
import store from 'store';
export default {
    components: { rowExpand },
    name: 'buttons',
    data () {
            return {
              panel:"1",
              selectedRow: {},
              selectedRows: [],
              pageTotal:0,
              pageNumber:1,
              pageSize:10,
              page_list:[],
              lodding:false,
              list_loadding:false,
              filterData:{
                sn:'',
                displayName:''
              },
              companyColumns: [
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
                              title: '公司编号',
                              key: 'sn',
                              ellipsis:'true',
                              align: 'center',
                              className: 'column-style',
                          },
                          {
                              title: '公司名称',
                              key: 'displayName',
                              ellipsis:'true',
                              align: 'center',
                              className: 'column-style',
                          },
                          {
                              title: '公司地址',
                              key: 'address',
                              ellipsis:'true',
                              align: 'center',
                              className: 'column-style',
                          },
                          {
                              title: '联系人',
                              key: 'contactPerson',
                              ellipsis:'true',
                              align: 'center',
                              className: 'column-style',
                          },
                          {
                              title: '联系电话',
                              key: 'contactPhone',
                              ellipsis:'true',
                              align: 'center',
                              className: 'column-style',
                              align: 'center',
                          },                         
                          {
                              title: '货架情况',
                              ellipsis:'true',
                              align: 'center',
                              width: '220',
                              //key:'status',
                              className: 'column-style',
                              render: (h, params) => {

                                const shelves=params.row.goodsShelves;
                                let htmlText = '';
                                for (var i = 0; i < shelves.length; i++) {
                                  htmlText = htmlText + " "+shelves[i].shelfCate.spec + " x " + shelves[i].count +";"
                                }
                                return htmlText;
                              }
                          },                         
                          {
                              title: '操作',
                              key: 'action',
                              width: '220',
                              className: 'column-width-style',
                              align: 'center',
                              ellipsis:'true',
                              render: (h, params) => {
                                const status=parseInt(params.row.status);                                  
                                return h('div', [ 
                                      h('Button', {
                                          props: {type: 'info', size: 'small'},
                                          style: {marginRight: '5px'},
                                          on: {
                                              click: () => {
                                                  this.$router.push({path:'/companyEdit/'+params.row.id })
                                              }
                                          }
                                      }, '编辑'),
                                      h('Button', {
                                          props: {type: 'ghost', size: 'small'},
                                          on: {
                                              click: () => {
                                                  this.delete(params.row)
                                              }
                                          }
                                      }, '删除'),
                                      h('Tooltip',
                                      {props: {content: '管理二维码'}},
                                      [h('Button', {
                                          props: {type: 'text', icon: 'qr-scanner'},
                                          style: {marginLeft: '-10px', fontSize: '20px'},
                                          on: {
                                              click: () => {
                                                this.setSelectedRow(params.row);
                                                  
                                              }
                                          }
                                      }, '')]),                                      
                                  ]);
                                }
                            },
                ],//orderColumns
                exportColumns: [{title: '公司编号', key: 'sn'},
                          {title: '公司名称', key: 'displayName'},
                          {title: '公司地址', key: 'address'},
                          {title: '联系人', key: 'contactPerson'},
                          {title: '联系电话', key: 'contactPhone'}]
            }//return
    },//data
    methods: {
            refresh () {
              this.changePage(this.pageNumber);
            },
            add () {
              this.$router.push({path:'/companyAdd'});
            },
            edit () {
              this.$router.push({path:'/companyEdit'});
            },  
            setSelectedRow (row) {
                this.$store.dispatch('SetSelectedRow',row).then(() => {
                    this.$router.push({path:'/companyGoodsQr/'+row.id })
                }).catch(err => {
                   console.log(err)
                });              
            },         
		        delete (selectedRow) {
              this.selectedRow = selectedRow;
              this.$Modal.confirm({
                  title:'提示',
                  content:'请确认要删除公司 <b style="color:#f60">'+selectedRow.displayName+'</b> ?',
                  onOk:(()=>{
                      var ids = [];
                      ids.push(this.selectedRow.id);
                      deleteCompany(ids).then(response => {
                        if (response.code === '0000') {
                            if (this.pageTotal - ((this.pageNumber-1)*this.pageSize) == 1) {
                              this.changePage(this.pageNumber - 1);
                            }else{
                              this.changePage(this.pageNumber);
                            } 
                            this.$Message.info('删除成功');
                        }else{
                            this.$Message.info(response.desc);
                        }              
                      }).catch(error => {
                          this.$Message.info('请求异常');
                      });
                  })

              });
		        },
            deleteBatch () {
              if (this.selectedRows.length == 0) {
                  this.$Message.warning('请选择要删除的项!');
              }else{
                this.$Modal.confirm({
                  title:'提示',
                  content:'请确认要删除这 <b style="color:#f60">'+this.selectedRows.length+'</b> 项?',
                  onOk:(()=>{
                      var ids = [];
                      for (var i = 0; i < this.selectedRows.length; i++) {
                        ids.push(this.selectedRows[i].id);
                      }                      
                      deleteCompany(ids).then(response => {
                        if (response.code === '0000') {
                            if (this.pageTotal - ((this.pageNumber-1)*this.pageSize) == this.selectedRows.length) {
                              this.changePage(this.pageNumber - 1);
                            }else{
                              this.changePage(this.pageNumber);
                            } 
                            this.$Message.info('批量'+ response.desc);
                        }else{
                            this.$Message.info(response.desc);
                        }              
                      }).catch(error => {
                          this.$Message.info('请求异常');
                      });
                  })
                });
              }
            },
            onSelectionChange(selection, row) {
              this.selectedRows= selection;
            },
            changePage(pNum){
              this.list_loadding=true;
              this.getCompanyList(pNum, this.filterData); 
            },
            exportData () {
                    // var form = $("<Form>");
                    // form.attr('style', 'display:none');
                    // form.attr('target', '_top');
                    // form.attr('method', 'post');
                    // //form.attr('accept-charset', 'utf-8');
                    // form.attr('action', '/yxkj-shelf/admin/company/dataExport.jhtml');
                    // if (store.getters.token && store.getters.user && store.getters.user.userName) {
                    //     var userName = $('<Input>');
                    //     userName.attr('type', 'hidden');
                    //     userName.attr('name', "userName");                        
                    //     userName.attr('value', store.getters.user.userName);      
                    //     form.append(userName);
                    //     var token = $('<Input>');
                    //     token.attr('type', 'hidden');
                    //     token.attr('name', "token");                        
                    //     token.attr('value', store.getters.token);      
                    //     form.append(token);
                    //   }
                    // if (this.filterData.sn) {
                    //     var input = $('<Input>');
                    //     input.attr('type', 'hidden');
                    //     input.attr('name', "sn");
                    //     input.attr('value', this.filterData.sn);        
                    //     form.append(input);
                    // }
                    // if (this.filterData.displayName) {
                    //     var input = $('<Input>');
                    //     input.attr('type', 'hidden');
                    //     input.attr('name', "displayName");
                    //     input.attr('value', this.filterData.displayName);       
                    //     form.append(input);
                    // }     
                    // $('body').append(form);                
                    // form.submit();
                    // form.remove();    
                    window.open("/yxkj-shelf/admin/company/dataExport?userName="+store.getters.user.userName+"&token="+store.getters.token+"&sn="+this.filterData.sn+"&displayName="+this.filterData.displayName, "_top");            
            },
            getCompanyList(pNum, filterData) {
              getCompanyList(pNum, this.pageSize, filterData).then(response => {
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



