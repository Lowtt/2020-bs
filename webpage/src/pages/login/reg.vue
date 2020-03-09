<template>
  <div id="reg">
    <div style="padding-top: 150px">
      <div style="margin-bottom: 30px">
        <h1>设备资产管理系统</h1>
      </div>
      <div style="width: 500px;background: rgb(240,242,245);margin: 0 auto;padding: 50px 0 30px">
        <div>
          <a-input
            maxlength="20"
            style="width: 360px;height: 40px"
            placeholder="请输入用户名"
            v-model="userName"
            ref="userNameInput"
          >
            <a-icon slot="prefix" type="user" />
          </a-input>
        </div>
        <div style="margin-top: 20px">
          <a-input
            maxlenth="20"
            type="password"
            style="width: 360px;height: 40px"
            placeholder="请输入密码"
            v-model="passWord"
            ref="userNameInput"
            @keyup.native.13="toIndex"
          >
            <a-icon slot="prefix" type="lock" />
          </a-input>
        </div>

     
          <div class="small-text">
          <span class="changeBtn" @click="changePassword">修改密码</span>
          <span class="loginBtn" @click="toLogin">我要登录</span>
        </div>
          
        
        <div style="margin-top: 20px">
          <a-button style="width: 360px;height: 40px" type="primary" v-on:click="toIndex">注册</a-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { regUser } from "../../axios/api";
export default {
  name: "reg",
  data() {
    return {
      userName: "",
      passWord: ""
    };
  },
  created() {},

  methods: {
    changePassword() {
      this.$router.push("/update");
    },
    toLogin: function(){
      this.$router.push("/login");
    },

    toIndex: function() {
      if (this.userName == "") {
        this.$message.error("请输入账号!");
        return;
      }
      if (this.passWord == "") {
        this.$message.error("请输入密码!");
        return;
      }
      regUser({
        username: this.userName,
        password: this.passWord
      }).then(res => {
        if (res.code == 200) {
          this.$message.success("注册成功,请登录!");
          this.$router.push("/login");
        }else{
          this.$message.error(res.message)
        }
      });
    }
  }
};
</script>

<style lang="scss">
.small-text {
  width: 360px;
  margin: 0 auto;
  text-align: right;
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
  .loginBtn,
  .changeBtn {
    color: rgb(78, 166, 252);
  }
  .loginBtn:hover,
  .changeBtn:hover {
    color: blue;
    cursor: pointer;
    text-decoration: underline;
  }
}
</style>
