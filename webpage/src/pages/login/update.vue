<template>
  <div id="update">
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
            placeholder="请输入旧密码"
            v-model="passWord"
            ref="userNameInput"
            @keyup.native.13="updateOk"
          >
            <a-icon slot="prefix" type="lock" />
          </a-input>
        </div>
        <div style="margin: 20px auto 20px">
          <a-input
            maxlenth="20"
            type="password"
            style="width: 360px;height: 40px"
            placeholder="请输入新密码"
            v-model="newAassWord1"
            ref="userNameInput"
          >
            <a-icon slot="prefix" type="lock" />
          </a-input>
        </div>
        <div style="margin-top: 20px">
          <a-input
            maxlenth="20"
            type="password"
            style="width: 360px;height: 40px"
            placeholder="请再次输入新密码"
            v-model="newAassWord2"
            ref="userNameInput"
            @keyup.native.13="updateOk"
          >
            <a-icon slot="prefix" type="lock" />
          </a-input>
        </div>
        <div class="small-text">
          <span class="loginBtn" @click="toLogin">我要登录</span>
          <span class="regBtn" @click="regAccount">注册用户</span>
        </div>
        <div style="margin-top: 20px">
          <a-button style="width: 360px;height: 40px" type="primary" v-on:click="updateOk">确定</a-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { changePassWord } from "../../axios/api";
export default {
  name: "update",
  data() {
    return {
      userName: "",
      passWord: "",
      newAassWord1: "",
      newAassWord2: ""
    };
  },
  created() {},

  methods: {
    regAccount: function() {
      this.$router.push("/reg");
    },
    toLogin: function() {
      this.$router.push("/login");
    },
    updateOk: function() {
      if (this.userName == "") {
        this.$message.error("请输入账号!");
        return;
      }
      if (this.passWord == "") {
        this.$message.error("请输入旧密码!");
        return;
      }
      if (this.newAassWord1 == "") {
        this.$message.error("请输入新密码!");
        return;
      }
      if (this.newAassWord2 == "") {
        this.$message.error("请再次输入新密码!");
        return;
      }
      if (this.newAassWord1 != this.newAassWord2) {
        this.$message.error("两次新密码不一致,请重新输入!");
        return;
      }
      changePassWord({
        username: this.userName,
        oldPassword: this.passWord,
        newPassword: this.newAassWord2
      }).then(res => {
        if (res.code == 200) {
          this.$message.success("修改成功,请登录!");
          this.$router.push("./login");
        } else {
          this.$message.error(res.message);
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
  .regBtn {
    color: rgb(78, 166, 252);
  }
  .loginBtn:hover,
  .regBtn:hover {
    color: blue;
    cursor: pointer;
    text-decoration: underline;
  }
}
</style>
