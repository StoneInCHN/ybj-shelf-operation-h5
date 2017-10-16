<template>
  <div>  
        <Card>
            <p slot="title">
                <Icon type="clipboard"></Icon>&nbsp;&nbsp;编辑公司
            </p>  
            <Form ref="dataInfo" :model="dataInfo" :rules="ruleValidate" :label-width="100"  style="width:60%">
                <input type="hidden" v-model="id">
                <FormItem label="公司编号" prop="sn">
                    <Row>
                      <Col span="17">
                        <Input v-model="dataInfo.sn" disabled></Input>
                      </Col>
                      <Col span="1">&nbsp;</Col>        
                      <Col span="6">
                        <Tooltip content="自动生成" placement="right">
                          <Icon size="large" color="#0000ff" type="information-circled"></Icon>
                        </Tooltip>
                      </Col>
                    </Row>
                </FormItem>
                <FormItem label="公司全名" prop="fullName">
                    <Input v-model="dataInfo.fullName" placeholder="请输入公司全名"></Input>
                </FormItem>
                <FormItem label="公司展示名" prop="displayName">
                    <Input v-model="dataInfo.displayName" placeholder="请输入公司展示名(缩写)"></Input>
                </FormItem>
                <FormItem label="联系人" prop="contactPerson">
                    <Input v-model="dataInfo.contactPerson" placeholder="请输入公司地址"></Input>
                </FormItem>     
                <FormItem label="联系电话" prop="contactPhone">
                    <Input v-model="dataInfo.contactPhone" placeholder="请输入公司名称"></Input>
                </FormItem>
                <FormItem label="公司地址">            
                    {{dataInfo.areaFullName}}
                </FormItem>
                <FormItem label="选择新地址">
                    <Cascader placeholder="请选择公司地址" :data="areas" filterable @on-change="selecteArea"></Cascader>
                </FormItem>  
                <FormItem label="详细地址" prop="address">
                    <Input v-model="dataInfo.address" placeholder="请输入详细地址"></Input>
                </FormItem> 
                <FormItem label="货架情况" prop="goodsShelves">
                    <ShelftRow v-for="shelf in dataInfo.goodsShelves" :shelf="shelf" key ="shelf.id"></ShelftRow>
                </FormItem>
                <FormItem label="备注" prop="remark">
                    <Input v-model="dataInfo.remark" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入备注..."></Input>
                </FormItem>
                <FormItem>
                    <Button type="primary" @click="handleSubmit('dataInfo')">提交</Button>
                    <router-link to="/companyList"><Button type="primary">           
                      返回
                    </Button></router-link>
                    <Button type="ghost" @click="handleReset('dataInfo')" style="margin-left: 8px">重置</Button>
                </FormItem>
            </Form>
        </Card>
        <br>    
  </div>
</template>
<script>
    import { isValidMobile } from 'utils/validate';
    import { getShelfList, updateCompany, getCompanyData } from 'api/company'; 
    import ShelftRow from './ShelfRow.vue';    
    import store from 'store'
    export default {
        components: { ShelftRow },
        //name: 'add',
        data () {
            const validMobile = (rule, value, callback) => {
              if (!isValidMobile(value)) {
                callback(new Error('请输入正确的手机号'));
              } else {
                callback();
              }
            };
            return {
                id:null,
                dataInfo: {},
                ruleValidate: {
                    fullName: [
                        { required: true, message: '公司名称不能为空', trigger: 'blur' }
                    ],
                    displayName: [
                        { required: true, message: '公司展示名称不能为空', trigger: 'blur' }
                    ],
                    contactPerson: [
                        { required: true, message: '公司联系人不能为空', trigger: 'blur' }            
                    ],
                    contactPhone: [
                        { required: true, trigger: 'blur', validator: validMobile }
                    ],
                    area: [
                        { required: true, type: 'array', message: '请选择公司地址', trigger: 'change' }
                    ],
                    address: [
                        { required: true, message: '请输入详细地址', trigger: 'blur' }
                    ],
                    goodsShelves: [
                        { required: true, type: 'array', min: 1, message: '至少选择一个货架', trigger: 'change' },
                    ],
                    remark: [
                        { type: 'string', min: 2, message: '备注不能少于2字', trigger: 'blur' }
                    ]
                },
                areas: []
            }
        },
        methods: {
            handleSubmit (name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        updateCompany(this.id,this.dataInfo).then(response => {
                          if (response.code === '0000') {
                            this.$Message.success('更新成功!');
                            this.$router.push({path:'/companyList'})
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
                this.getShelfList();  
            },
            getAreaList () {
                if (store.getters.areas.code == '0000') {
                    console.info("hahhah");
                    this.areas= store.getters.areas.msg;
                }else{
                    this.$store.dispatch('GetAreaList').then(res => {
                        this.areas= res.msg;
                    }).catch(err => {
                        console.log(err)
                    });
                }
            },
            getDataInfo(){
              getCompanyData(this.id).then(response => {
                if (response.code === '0000') {
                  this.dataInfo = response.msg;
                }               
              }).catch(error => {
                console.log(error)
              });
            },
            selecteArea(value, selectedData){
              this.dataInfo.area = value;
            },
        },
        created () {
          this.getAreaList();
          var hash = window.location.hash;          
          if(hash){
              var prams = hash.split("/");
              this.id = prams.pop();
          }
          if (this.id) {
            
            this.getDataInfo();
          }           
        },
        mounted(){

            
        },
    }
</script>