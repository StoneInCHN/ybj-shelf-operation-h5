<template>
  <div>    
        <Card>
            <p slot="title">
                <Icon type="clipboard"></Icon>&nbsp;&nbsp;添加商品
            </p>  
            <Form ref="dataInfo" :model="dataInfo" :rules="ruleValidate" :label-width="80"  style="width:60%">
                <FormItem label="商品条码" prop="sn">
                    <Input v-model="dataInfo.sn"  placeholder="请输入商品条码" @on-blur="checkSnExist"></Input>
                </FormItem>
                <FormItem label="商品名称" prop="name">
                    <Input v-model="dataInfo.name" placeholder="请输入商品名称"></Input>
                </FormItem>
                <FormItem label="净含量" prop="spec">
                    <Input v-model="dataInfo.spec" placeholder="请输入净含量"></Input>
                </FormItem>     
                <FormItem label="成本价" prop="costPrice">
                    <Input v-model="dataInfo.costPrice" placeholder="请输入成本价"></Input>
                </FormItem>
                <FormItem label="默认售价" prop="salePrice">
                    <Input v-model="dataInfo.salePrice" placeholder="请输入成本价"></Input>
                </FormItem>          
                <FormItem label="产品图片" prop="url">            
                    <div class="demo-upload" v-if="item != null">
                        <template v-if="item.status === 'finished'">
                            <img :src="item.response.desc">
                            <div class="demo-upload-cover">
                                <Icon type="ios-eye-outline" @click.native="handleView"></Icon>
                                <Icon type="ios-trash-outline" @click.native="handleRemove()"></Icon>
                            </div>
                        </template>
                        <template v-else>
                            <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
                        </template>
                    </div>
                    <Upload 
                        ref="upload"
                        action="/yxkj-shelf/common/uploadImg" 
                        :format="['jpg','jpeg','png']" 
                        :show-upload-list="false"
                        :max-size="2048"
                        :on-success="handleSuccess"
                        :on-format-error="handleFormatError"
                        :on-exceeded-size="handleMaxSize"
                        type="drag"
                        style="display: inline-block;width:59px;">
                        <div class="uploadImg">
                            <Icon type="camera" size="20"></Icon>
                        </div>
                    </Upload> 
                    <Input v-model="dataInfo.url" v-show="false"></Input>           
                    <Modal title="查看图片" v-model="visible" cancel-text="">
                        <img :src="dataInfo.url" v-if="visible" style="width: 100%">
                    </Modal>
                </FormItem>
                <FormItem>
                    <Button type="primary" @click="handleSubmit('dataInfo')">提交</Button>
                    <router-link to="/goodsList"><Button type="primary">           
                      返回
                    </Button></router-link>
                    <Button type="ghost" @click="handleReset('dataInfo')" style="margin-left: 8px">重置</Button>
                </Button>
                </FormItem>
            </Form> 
        </Card>       
  </div>
</template>
<script>
    import { isPositiveNumber, validSn } from 'utils/validate';
    import { addGoods, isExistSn } from 'api/goods';  
    import store from 'store' 
    export default {
        //name: 'add',
        data () {
            const validPrice = (rule, value, callback) => {
              if (! isPositiveNumber(value)) {
                callback(new Error('请输入正确的价格'));
              } else {
                callback();
              }
            };
            const checkSn = (rule, value, callback) => {
              if (!validSn(value)) {
                callback(new Error('请输入正确的商品编号（允许数字、空格、字母）'));
              } else {
                callback();
              }
            };  
            const isExistSn = (rule, value, callback) => {
                  if (this.snExist) {
                    callback(new Error('该商品条码已经存在，请重新填写'));
                  } else {
                    callback();
                  } 
            };                       
            return {
                snExist: false,
                dataInfo: {
                    sn: '',
                    name: '',
                    spec: '',
                    costPrice: '',
                    salePrice: '',
                    url:''
                },
                ruleValidate: {
                    sn: [
                        { required: true, trigger: 'blur', validator: checkSn },
                        { required: true, trigger: 'blur', validator: isExistSn }
                    ],
                    name: [
                        { required: true, message: '商品名称不能为空', trigger: 'blur' }            
                    ],
                    spec: [
                        { required: true, message: '净含量不能为空', trigger: 'blur' }    
                    ],
                    costPrice: [
                        { required: true, trigger: 'blur', validator: validPrice }
                    ],
                    salePrice: [
                        { required: true, trigger: 'blur', validator: validPrice }
                    ],
                    url: [
                        { required: true, message: '请上传商品图片!!!', trigger: 'change' }    
                    ],
                },
                areas: [],
                visible:false,
                item: null,
                items: []
            }
        },
        methods: {
            handleSubmit (name) {
                this.checkSnExist();
                this.$refs[name].validate((valid) => {
                    console.info("hellow");
                    if (valid) {
                        addGoods(this.dataInfo).then(response => {
                            if (response.code === '0000') {
                                this.$Message.success('提交成功!');
                                this.$router.push({path:'/goodsList'})
                            }               
                        }).catch(error => {
                              console.log(error)
                        }); 
                       
                    } else {
                        this.$Message.error('表单验证失败!');
                    }
                })
            },
            handleReset (name) {                
                this.$refs[name].resetFields();
                this.item = null;
            },
            show(){
               console.info(this.dataInfo);
            },
            handleFormatError (file) {
                this.$Notice.warning({
                    title: '文件格式不正确',
                    desc: '文件 ' + file.name + ' 格式不正确，请上传 jpg 或 png 格式的图片。'
                });
            },
            handleMaxSize (file) {
                this.$Notice.warning({
                    title: '超出文件大小限制',
                    desc: '文件 ' + file.name + ' 太大，不能超过 2M。'
                });
            },
            handleSuccess (res, file) {
                this.item = this.items[this.items.length-1];
                this.dataInfo.url = this.item.response.desc;
            },
            handleView () {
                this.visible = true;
            },
            handleRemove (file) {
                this.item = null;
                this.dataInfo.url = '';
            },
            checkSnExist() {
                console.info("checkSnExist");
                isExistSn(this.dataInfo.sn).then(response => {
                    if (response.code === '0000' && response.desc === 'true') {
                        this.snExist =  true;                       
                    }else{
                        this.snExist =  false;
                    }
                }).catch(error => {
                    
                }); 
            }
        },
        created () {          
        },
        mounted () {
            this.items = this.$refs.upload.fileList;
        }
    }
</script>
<style scoped>
    .uploadImg{
        width: 58px;
        height:58px;
        line-height: 58px;
    }
    .demo-upload{
        display: inline-block;
        width: 60px;
        height: 60px;
        text-align: center;
        line-height: 60px;
        border: 1px solid transparent;
        border-radius: 2px;
        overflow: hidden;
        background: #fff;
        position: relative;
        box-shadow: 0 1px 1px rgba(0,0,0,.2);
        margin-right: 4px;
    }
    .demo-upload img{
        width: 100%;
        height: 100%;
        vertical-align: top
    }
    .demo-upload-cover{
        display: none;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background: rgba(0,0,0,.6);
    }
    .demo-upload:hover .demo-upload-cover{
        display: block;
    }
    .demo-upload-cover i{
        color: #fff;
        font-size: 20px;
        cursor: pointer;
        margin: 0 2px;
    }
</style>