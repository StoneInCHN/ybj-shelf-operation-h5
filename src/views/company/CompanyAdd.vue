<template>
  <div> 
        <Card>
            <p slot="title">
                <Icon type="clipboard"></Icon>&nbsp;&nbsp;公司新增
            </p>   
            <Form ref="dataInfo" :model="dataInfo" :rules="ruleValidate" :label-width="100" style="width:60%">
        <!--         <FormItem label="公司编号" prop="sn">
                    <Row>
                      <Col span="20">
                        <Input v-model="dataInfo.sn" disabled></Input>
                      </Col>
                      <Col span="3" style="margin-left:10px">
                        <Tooltip content="自动生成" placement="right">
                          <Icon size="large" color="#0000ff" type="information-circled"></Icon>
                        </Tooltip>
                      </Col>
                    </Row> 
                </FormItem>-->
                <FormItem label="公司全称" prop="fullName">
                    <Input v-model="dataInfo.fullName" placeholder="请输入公司全称" @on-blur="checkComanyExist"></Input>
                </FormItem>
                <FormItem label="公司展示名" prop="displayName">
                    <Input v-model="dataInfo.displayName" placeholder="请输入公司展示名(缩写)" @on-blur="checkComanyExist"></Input>
                </FormItem>
                <FormItem label="联系人" prop="contactPerson">
                    <Input v-model="dataInfo.contactPerson" placeholder="请输入联系人"></Input>
                </FormItem>     
                <FormItem label="联系电话" prop="contactPhone">
                    <Input v-model="dataInfo.contactPhone" placeholder="请输入联系电话"></Input>
                </FormItem>
                <FormItem label="公司地址" prop="area">
                    <Cascader v-model="dataInfo.area" placeholder="请选择公司地址" :data="areas" filterable @on-change="selecteArea"></Cascader>
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
                </Button>
                </FormItem>
            </Form>
        </Card>
        <br>
  </div>
</template>
<script>
    import { isValidMobile } from 'utils/validate';
    import { getShelfList,addCompany,isExistCompany } from 'api/company'; 
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
            const isExistName = (rule, value, callback) => {
                  if (this.nameExist) {
                    callback(new Error('该公司名称已被使用，请重新填写'));
                  } else {
                    callback();
                  } 
            }; 
            const maxLength = (rule, value, callback) => {
                if (value.length >= 20) {
                  callback(new Error('最多输入20个字符'));
                } else {
                  callback();
                }
            };
            const maxRemark = (rule, value, callback) => {
                if (value.length >= 200) {
                  callback(new Error('最多输入200个字符'));
                } else {
                  callback();
                }
            };
            return {
                nameExist: false,
                dataInfo: {
                    sn: '00000002',
                    fullName: '',
                    displayName: '',
                    contactPerson: '',
                    contactPhone: '',
                    area: [],
                    areaFullName: '',
                    address: '',
                    goodsShelves: [],
                    remark: ''
                },
                ruleValidate: {
                    fullName: [
                        { required: true, message: '公司全名不能为空', trigger: 'blur' },
                        { required: true, trigger: 'blur', validator: isExistName },
                        { required: true, trigger: 'blur', validator: maxLength }
                    ],
                    displayName: [
                        { required: true, message: '公司展示名称不能为空', trigger: 'blur' },
                        { required: true, trigger: 'blur', validator: isExistName },
                        { required: true, trigger: 'blur', validator: maxLength }
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
                        { type: 'string', min: 2, message: '备注不能少于2字', trigger: 'blur' },
                        { required: true, trigger: 'blur', validator: maxRemark }                        
                    ]
                },
                areas: []
            }
        },
        methods: {
            handleSubmit (name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        addCompany(this.dataInfo).then(response => {
                          if (response.code === '0000') {
                            this.$Message.success('提交成功!');
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
                    this.areas= store.getters.areas.msg;
                }else{
                    this.$store.dispatch('GetAreaList').then(res => {
                      this.areas= res.msg;
                    }).catch(err => {
                      console.log(err)
                    });
                }

            },
            selecteArea(value, selectedData){
              this.dataInfo.area = value;
              //console.info(this.dataInfo);
            },
            getShelfList(){
              getShelfList().then(response => {
                if (response.code === '0000') {
                  this.dataInfo.goodsShelves = response.msg;
                }               
              }).catch(error => {
                console.log(error)
              });
            },
            checkComanyExist() {
                console.info("checkComanyExist");
                isExistCompany(this.dataInfo).then(response => {
                    if (response.code === '0000' && response.desc === 'true') {
                        this.nameExist =  true;                       
                    }else{
                        this.nameExist =  false;
                    }
                }).catch(error => {
                    
                }); 
            }
        },
        created () {
           this.getAreaList();
           this.getShelfList();            
        },
    }
</script>