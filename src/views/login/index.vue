 <template>
    <div class="login-container" style="background-color: #fff;margin: 0px;overflow: hidden;">
      <div style="height:60px;background-color:#2DA2F0;width:100%"><img src="static/img/loginLogo.png"  style="margin:8px 10px;"/></div>
      <H3 style="text-align:center;margin-top:60px;margin-bottom:30px">登录</H3>
      <Form ref="loginForm" autoComplete="on" :model="loginForm" :rules="loginRules" class="card-box login-form">
        <Form-item prop="userName">
          <Input type="text" v-model="loginForm.userName" placeholder="用户名" autoComplete="on">
          <Icon type="ios-person-outline" slot="prepend" style="color:#fff"></Icon>
          </Input>
        </Form-item>
        <Form-item prop="password">
          <Input type="password" v-model="loginForm.password" placeholder="密码" @keyup.enter.native="handleLogin">
          <Icon type="ios-locked-outline" slot="prepend" style="color:#fff"></Icon>
          </Input>
        </Form-item>
        <Form-item prop="captcha">
          <Row>
            <Col span="18">
              <Input type="text" v-model="loginForm.captcha" placeholder="验证码" @keyup.enter.native="handleLogin">
                <Icon type="ios-locked-outline" slot="prepend" style="color:#fff"></Icon>
              </Input>
            </Col>
            <Col span="6">
              <span style="padding-left:20px;height:47px;line-height:47px;cursor:pointer">
                <img style="border-radius:3px" :src="captchaUrl" @click="changeCaptcha"/>
              </span>
            </Col>                        
          </Row>
        </Form-item>          
        <Form-item>
          <Button type="primary" @click="handleLogin('loginForm')" style="font-size:16px;height:45px;width:100%">登 录</Button>
        </Form-item>          
        <Form-item>
          <Checkbox v-model="loginForm.rememberMe" style="color:#2d8cf0;margin-left:2px;">&nbsp;记住用户名及密码</Checkbox>
          <span class='tips'>{{errorTips}}</span>
        </Form-item>        
      </Form>
    </div>
  </template>
  <script>
  import { isValidUserName, isValidPassword } from 'utils/validate';
  import { uuid } from 'utils/index';
  import Cookies from 'js-cookie';
  import store from 'store'
  export default {
    name: 'login',
    data() {
      const validateUserName = (rule, value, callback) => {
        if (!isValidUserName(value)) {
          callback(new Error('请输入正确的用户名'));
        } else {
          callback();
        }
      };
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
      return {        
        captchaUrl: '',
        successTips: '',
        errorTips: store.getters.tips,
        loginForm: {
          userName: Cookies.get('Admin-userName'),
          password: Cookies.get('Admin-password'),
          captcha: '',
          captchaId: '',
          rememberMe: false,
          autoLogin: false
        },
        loginRules: {
          userName: [
            { required: true, trigger: 'blur', validator: validateUserName }
          ],
          password: [
            { required: true, trigger: 'blur', validator: lengthPassword },
            { required: true, trigger: 'blur', validator: validatePassword }
          ]
        },
        loading: false,
        showDialog: false
      }
    },
    mounted() {

    },
    methods: {
      handleLogin() {
        this.$refs.loginForm.validate(valid => {
          if (valid) {
            this.loading = true;
            this.$store.dispatch('Login', this.loginForm).then(res => {
              this.loading = false;
              //console.info("res:"+res);
              if(res.code === '0000') {  
                this.successTips = res.desc;   
                this.$Message.success(this.successTips);        
                this.$router.push({ path: '/' });
              } else {
                this.errorTips = res.desc;
                this.$Message.error(this.errorTips);    
                this.changeCaptcha();            
              }
            }).catch(err => {
              this.$message.error(err);
              this.loading = false;
            });
          } else {
            this.$message.error('请检查输入');
            return false;
          }
        });
      },
    changeCaptcha(){          
          this.loginForm.captchaId = uuid();
          this.captchaUrl = '/yxkj-shelf/common/captcha.jhtml?captchaId='+ this.loginForm.captchaId;
          console.info(this.captchaUrl);
    }
    },
    init() {

    },
    destroyed() {

    },
    mounted(){

    },    
    created () {
        if (this.errorTips) {
          this.$Message.error(this.errorTips); 
        }
        this.loginForm.captchaId = uuid();
        this.captchaUrl = '/yxkj-shelf/common/captcha.jhtml?captchaId='+ this.loginForm.captchaId;
        if (Cookies.get('RememberMe') == 'true') {
            this.loginForm.rememberMe = true;
        }
    },
  }
  </script>
  <style scope>
  .login-container a {
    color: #0078de;
  }

  #canvascontainer {
    position: absolute;
    top: 0px;
  }

  .wz-input-group-prepend {
    background-color: #141a48;
    border: 1px solid #2d8cf0;
    border-right: none;
    color: #2d8cf0;
  }
  </style>
  <style rel="stylesheet/scss" lang="scss">
  .login-container {
    height: 100vh;
    background-color: #2d3a4b;

    .ivu-btn-primary{
      color: #fff;
      background-color: #2DA2F0;
      border-color: #2DA2F0;
    }
    .ivu-input-group-prepend{
      background-color: #2DA2F0;
      border: 1px solid #2DA2F0;
    }
    .tips {
      font-size: 14px;
      color: #ed3f14;
      margin-bottom: 5px;
      float:right;
    }

    input:-webkit-autofill {
      -webkit-box-shadow: 0 0 0px 1000px #293444 inset !important;
      -webkit-text-fill-color: #fff !important;
    }
    input {
      background: transparent;
      border: 1px solid #2DA2F0;
      -webkit-appearance: none;
      border-radius: 3px;
      padding: 12px 5px 12px 15px;
      height: 47px;
    }
    .el-input {
      display: inline-block;
      height: 47px;
      width: 85%;
    }
    .svg-container {
      padding: 6px 5px 6px 15px;
      color: #889aa4;
    }

    .title {
      font-size: 26px;
      font-weight: 400;
      color: #eeeeee;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }

    .login-form {
      position: absolute;
      left: 0;
      right: 0;
      width: 400px;
      margin: 0 auto;
    }

    .el-form-item {
      border: 1px solid rgba(255, 255, 255, 0.1);
      background: rgba(0, 0, 0, 0.1);
      border-radius: 5px;
      color: #454545;
    }

    .forget-pwd {
      color: #fff;
    }
  }
  </style>