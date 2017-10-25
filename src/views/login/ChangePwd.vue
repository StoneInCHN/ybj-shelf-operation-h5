<template>
  <div> 
        <Card>
            <p slot="title">
                <Icon type="clipboard"></Icon>&nbsp;&nbsp;修改密码
            </p>   
            <Form ref="dataInfo" :model="dataInfo" :rules="ruleValidate" :label-width="150" style="width:60%">
                <FormItem label="账号" prop="userName">
                    <Input v-model="dataInfo.userName" disabled></Input>
                </FormItem>
                <FormItem label="旧密码" prop="oldPwd">
                    <Input v-model="dataInfo.oldPwd" placeholder="请输入旧密码"></Input>
                </FormItem>
                <FormItem label="新密码" prop="newPwd">
                    <Input v-model="dataInfo.newPwd" placeholder="请输入新密码"></Input>
                </FormItem>
                <FormItem label="再次输入新密码" prop="reNewPwd">
                    <Input v-model="dataInfo.reNewPwd" placeholder="请再次输入新密码"></Input>
                </FormItem>
                <FormItem>
                    <Button type="primary" @click="handleSubmit('dataInfo')">提交</Button>
                    <Button type="ghost" @click="handleReset('dataInfo')" style="margin-left: 8px">重置</Button>
                </FormItem>
            </Form>
        </Card>
        <br>
  </div>
</template>
<script>
    import { getCurrentUser,changePwd } from 'api/common';
    import { isValidPassword } from 'utils/validate';
    export default {
        data () {
            const lengthPassword = (rule, value, callback) => {
                if (value.length < 6 || value.length > 16) {
                  callback(new Error('密码长度必须为6~16位'));
                } else {
                  callback();
                }
            };
            const validatePassword = (rule, value, callback) => {
                if (!isValidPassword(value)) {
                  callback(new Error('请输入合法的密码'));
                } else {
                  callback();
                }
            };
            const notEqual = (rule, value, callback) => {
                if(value){
                    if(this.dataInfo.newPwd != this.dataInfo.reNewPwd){
                        callback(new Error('两次输入新密码不一致，请重新输入'));
                    }else{
                        callback();
                    }
                }else{
                    callback(new Error('请再次输入新密码'));
                }
            };            
            return {
                user: {},
                dataInfo: {
                    userName: '',
                    oldPwd: '',
                    newPwd: '',
                    reNewPwd: '',
                },
                ruleValidate: {
                  oldPwd: [
                    { required: true, trigger: 'blur', validator: lengthPassword },
                    { required: true, trigger: 'blur', validator: validatePassword }
                  ],
                  newPwd: [
                    { required: true, trigger: 'blur', validator: lengthPassword },
                    { required: true, trigger: 'blur', validator: validatePassword }
                  ],
                  reNewPwd: [
                    { required: true, trigger: 'blur', validator: lengthPassword },
                    { required: true, trigger: 'blur', validator: validatePassword },
                    { required: true, trigger: 'blur', validator: notEqual }                    
                  ]
                },
            }
        },
        mounted(){
            this.user = getCurrentUser();
            this.dataInfo.userName = this.user.userName;
        },
        methods: {
            handleSubmit (name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        changePwd(this.dataInfo).then(response => {
                        if (response.code === '0000') {
                            this.$Modal.success({
                              title:'提示',
                              content:'密码修改成功！',
                              okText:'重新登录',
                              //cancelText:'暂不',
                              onOk:(()=>{
                                this.$store.dispatch('LogOut').then(() => {
                                    this.$router.push({ path: '/login' });
                                }).catch(err => {
                                    this.$message.error(err);
                                });
                              }),
                              // onCancel:(()=>{
                              //    this.$router.push({path:'/dashboard'})
                              // }),
                            });                          
                        }else{
                            this.$Message.error(response.desc);
                        }              
                        }).catch(error => {
                          console.log(error)
                        });                        
                    }
                })
            },
            handleReset (name) {
                this.$refs[name].resetFields();  
                this.dataInfo.userName = this.user.userName;
            },           
        },
        created () {
        
        },
    }
</script>
