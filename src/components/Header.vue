<template>
  <navbar>
    <button class="navbar-toggler mobile-sidebar-toggler d-lg-none" type="button" @click="mobileSidebarToggle">&#9776;</button>
    <a class="navbar-brand" >Mini优比家(货架)</a>
    <ul class="nav navbar-nav d-md-down-none">
      <li class="nav-item">
        <a class="nav-link navbar-toggler sidebar-toggler"  @click="sidebarMinimize">&#9776;</a>
      </li>  
    </ul>
    <ul class="nav navbar-nav ml-auto">
      
      <li class="nav-item d-md-down-none">
        <a class="nav-link" ><Icon type="android-notifications" size="20"></Icon><span class="badge badge-pill badge-danger">5</span></a>
      </li>
      <Dropdown class="nav-item">
        <a href="javascript:void(0)">
           <span slot="button">
          <img src="static/img/avatars/6.jpg" class="img-avatar" alt="o">
          <span class="d-md-down-none">{{user.userName}}</span>
          </span>
        </a>
        <Dropdown-menu slot="list">
            <Dropdown-item>
              <p class="dropdown-itemp">  <Icon type="chatbox-working"></Icon> 系统消息 <span class="badge badge-danger">42</span></p>
            </Dropdown-item>
            <Dropdown-item divided>
              <p class="dropdown-itemp" @click="ChangePwd"><Icon type="android-contact"></Icon> 修改密码</p>
            </Dropdown-item>
            <Dropdown-item > 
              <a href="" @click="Logout"><p class="dropdown-itemp"><Icon type="power"></Icon>注销</p></a>
            </Dropdown-item>
        </Dropdown-menu>
    </Dropdown>
      <li class="nav-item d-md-down-none">
        <a class="nav-link navbar-toggler aside-menu-toggler"  @click="asideToggle">&#9776;</a>
      </li>
    </ul>
  </navbar>
</template>
<script>
import {getCurrentUser} from 'api/common';
import navbar from './Navbar'

export default {
  name: 'header',
  components: {
    navbar,    
  },
  data () {
        return {
            user: {},
        }
  },
  mounted(){
      this.user = getCurrentUser();
  },
  methods: {
    Logout(e){
         e.preventDefault();
         this.$store.dispatch('LogOut').then(() => {
                this.$router.push({ path: '/login' });
              }).catch(err => {
                this.$message.error(err);
              });
    },
    ChangePwd(){
        this.$router.push({path:'/changePwd'})
    },
    sidebarToggle (e) {
      e.preventDefault()
      document.body.classList.toggle('sidebar-hidden')
    },
    sidebarMinimize (e) {
      e.preventDefault()
      document.body.classList.toggle('sidebar-minimized')
    },
    mobileSidebarToggle (e) {
      e.preventDefault()
      document.body.classList.toggle('sidebar-mobile-show')
    },
    asideToggle (e) {
      e.preventDefault()
      document.body.classList.toggle('aside-menu-hidden')
    }
  }
}
</script>

<style type="text/css">
  .dropdown-itemp{
    text-align: left;
    font-size: 15px;
    padding: 10px;
  }
</style>
