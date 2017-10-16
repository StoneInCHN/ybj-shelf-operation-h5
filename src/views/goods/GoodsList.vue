<template>
  <div class="animated fadeIn">
    <Row>
      <Col :md="24" >          
              <Collapse v-model="panel">
                  <Panel name="1">&nbsp;搜索条件
                    <Row slot="content">
                      <Col span="5">              
                          商品名称
                          <Input placeholder="商品名称"  v-model="filterData.name" class="searchInput" @on-enter="changePage(1)"></Input>
                      </Col>
                      <Col span="5">              
                          商品条码
                          <Input placeholder="商品条码"  v-model="filterData.sn" class="searchInput" @on-enter="changePage(1)"></Input>
                      </Col>
                                   
                        <Button type="primary" @click="changePage(1)">查询</Button>
                        <Button type="primary" @click="importData">
                          <Icon type="ios-upload-outline"></Icon> Excel导入
                        </Button>
                        <Button type="primary" @click="exportData">
                          <Icon type="ios-download-outline"></Icon> Excel导出
                        </Button> 
                      
                    </Row>     
                </Panel>  
              </Collapse>    
          <br>   

            <div style="margin-bottom:5px;">
              <Button type="ghost" icon="android-add" @click="add">添加</Button>
              <Button type="ghost" icon="trash-a" @click="deleteBatch">批量删除</Button>
              <Button type="ghost" icon="android-refresh" @click="refresh">刷新</Button>
            </div>  

            <div style="position:relative">
              <Table :columns="goodsColumns" :data="page_list" ref="table" @on-selection-change="onSelectionChange"></Table>
              <div class="list-loadding" v-if="list_loadding">
                    <Spin size="large"></Spin>
                    <h6>正在获取数据...</h6>
              </div>
            </div>

            <Page :total="this.pageTotal" show-total show-elevator @on-change="changePage" class="page-style"></Page><Modal title="导入Excel" v-model="visible">
                <Upload 
                  action="/yxkj-shelf/common/dataImport"
                  :format="['xls','xlsx']"
                  :max-size="1024"
                  :on-success="handleSuccess"
                  :on-format-error="handleFormatError"
                  :on-exceeded-size="handleMaxSize">
                    <Button type="ghost" icon="ios-cloud-upload-outline">导入Excel</Button>
                </Upload>
                备注：首先下载<a href="/upload/template/goods.xlsx">Excel模板</a>，再导入
            </Modal>      
      </Col>
    </Row> 
</div>
</template>

<script>
import { getGoodsList,deleteGoods } from 'api/goods';
import goodsImg from '../goods/GoodsImg.vue';
import { parseTime } from 'utils/index';
import store from 'store';
//var vue;
export default {
  name: 'buttons',
  data(){
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
              visible:false,
              filterData:{
                sn:'',
                name:''
              },
              goodsColumns: [
                          {
                              type: 'selection',
                              width: 60,
                              align: 'center',
                              fixed: 'left',
                          },
                          {
                              title: '商品条码',
                              key: 'sn',
                              ellipsis:'true',
                              align: 'center',
                              className: 'column-style',
                          },
                          {
                              title: '商品名称',
                              key: 'name',
                              ellipsis:'true',
                              align: 'center',
                              className: 'column-style',
                              render: (h, params) => {
                              return h('div', [ 
                              h('Tooltip',
                                      {props: {content: params.row.name}},
                                      params.row.name)
                              ]);
                            }

                          },
                          {
                              title: '净含量',
                              key: 'spec',
                              ellipsis:'true',
                              align: 'center',
                              className: 'column-style',
                          },                            
                          {
                              title: '成本价',
                              key: 'costPrice',
                              ellipsis:'true',
                              align: 'center',
                              className: 'column-style',     
                              render: (h, params) => {
                                return "￥"+params.row.costPrice.toFixed(2);
                              }                         
                          },         
                          {
                              title: '默认售价',
                              key: 'salePrice',
                              ellipsis:'true',
                              align: 'center',
                              className: 'column-style',   
                              render: (h, params) => {
                                return "￥"+params.row.salePrice.toFixed(2);
                              }                          
                          },  
                          {
                              title: '图片',
                              key: 'goodsPics',
                              align: 'center',
                              className: 'column-style',      
                              render: (h, params) => {
                                if (params.row.goodsPics && params.row.goodsPics.length > 0) {
                                  return h(goodsImg, {props: {url: params.row.goodsPics[0].source}})
                                }else{
                                  return "无";
                                } 
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
                                                  this.$router.push({path:'/goodsEdit/'+params.row.id })
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
                                      }, '删除')                                     
                                  ]);
                                }
                            },                                                                    
                                                                        
                ],//goodsColumns
                exportColumns: [
                          {title: '商品条码',key: 'sn'},
                          {title: '商品名称',key: 'name'},
                          {title: '净含量',key: 'spec'},                            
                          {title: '成本价',key: 'costPrice'},         
                          {title: '默认售价',key: 'salePrice'}]
            }//return
  },//data
  methods: {
            refresh () {
              this.changePage(this.pageNumber);
            },
            add () {
              this.$router.push({path:'/goodsAdd'});
            },
            delete (selectedRow) {
              this.selectedRow = selectedRow;
              this.$Modal.confirm({
                  title:'提示',
                  content:'请确认要删除商品 <b style="color:#f60">'+selectedRow.name+'</b> ?',
                  onOk:(()=>{
                      var ids = [];
                      ids.push(this.selectedRow.id);
                      deleteGoods(ids).then(response => {
                        if (response.code === '0000') {
                            if (this.pageTotal - ((this.pageNumber-1)*this.pageSize) == 1) {
                              this.changePage(this.pageNumber - 1);
                            }else{
                              this.changePage(this.pageNumber);
                            } 
                            this.$Message.info('删除成功');
                        }else{
                            this.$Message.info('请求错误');
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
                      deleteGoods(ids).then(response => {
                        if (response.code === '0000') {
                            if (this.pageTotal - ((this.pageNumber-1)*this.pageSize) == this.selectedRows.length) {
                              this.changePage(this.pageNumber - 1);
                            }else{
                              this.changePage(this.pageNumber);
                            } 
                            this.$Message.info('批量删除成功');
                        }else{
                            this.$Message.info('请求错误');
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
              const vue = this;
              this.list_loadding=true;
              this.getGoodsList(pNum, this.filterData)
		        },
            importData () {
              this.visible = true;
            },  
            exportData () {
                    var form = $("<form>");
                    form.attr('style', 'display:none');
                    form.attr('target', '_top');
                    form.attr('method', 'post');
                    form.attr('action', '/yxkj-shelf/admin/goods/dataExport.jhtml');
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
                    if (this.filterData.sn) {
                        var input = $('<input>');
                        input.attr('type', 'hidden');
                        input.attr('name', "sn");
                        input.attr('value', this.filterData.sn);        
                        form.append(input);
                    }
                    if (this.filterData.name) {
                        var input = $('<input>');
                        input.attr('type', 'hidden');
                        input.attr('name', "name");
                        input.attr('value', this.filterData.name);       
                        form.append(input);
                    }     
                    $('body').append(form);                
                    form.submit();
                    form.remove();                
            },
            getGoodsList(pNum, filterData) {
              getGoodsList(pNum, this.pageSize, filterData).then(response => {
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
            handleFormatError (file) {
                this.$Notice.warning({
                    title: '文件格式不正确',
                    desc: '文件 ' + file.name + ' 格式不正确，请上传正确格式的Excel'
                });
            },
            handleMaxSize (file) {
                this.$Notice.warning({
                    title: '超出文件大小限制',
                    desc: '文件 ' + file.name + '太大，不能超过 1M'
                });
            },
            handleSuccess (res, file) {
                this.visible = false;
                this.$Message.success('导入成功！');
                this.changePage(1);
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



