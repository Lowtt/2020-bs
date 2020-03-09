<template>
  <div id="login">
    <div style="padding-top: 150px">
      <div style="margin-bottom: 30px">
        <h1>设备资产管理系统</h1>
      </div>
      <div style="width: 500px;background: rgb(240,242,245);margin: 0 auto;padding: 50px 0 30px">
        <div>
          <a-input
            maxlength="20"
            style="width: 360px;height: 40px"
            placeholder="请输入用户名/手机号码"
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
            :placeholder="isChange?'请输入旧密码':'请输入密码'"
            v-model="passWord"
            ref="userNameInput"
            @keyup.native.13="toIndex"
          >
            <a-icon slot="prefix" type="lock" />
          </a-input>
        </div>
        <div v-if="isChange" style="margin: 20px auto 20px">
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
        <div v-if="isChange" style="margin-top: 20px">
          <a-input
            maxlenth="20"
            type="password"
            style="width: 360px;height: 40px"
            placeholder="请再次输入新密码"
            v-model="newAassWord2"
            ref="userNameInput"
            @keyup.native.13="toIndex"
          >
            <a-icon slot="prefix" type="lock" />
          </a-input>
        </div>
        <div
          v-if="!isChange"
          style="width: 360px;margin:0 auto;text-align: right;margin-top: 20px;"
        >
          <span class="changeBtn" @click="changePassword">修改密码</span>
        </div>
        <div style="margin-top: 20px">
          <a-button
            style="width: 360px;height: 40px"
            type="primary"
            v-on:click="toIndex"
          >{{isChange?'确定':'登录'}}</a-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { login, changePassWord } from "../../axios/api";
export default {
  name: "login",
  data() {
    return {
      userName: "",
      passWord: "",
      newAassWord1: "",
      newAassWord2: "",
      isChange: false
    };
  },
  created() {},
  beforeMount() {
    let userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
    if (userInfo != "" && userInfo != null) {
      if (userInfo.token != "" && userInfo.token != null) {
        this.$router.push("/index/index");
      }
    }
  },
  methods: {
    changePassword() {
      this.isChange = true;
      this.userName = "";
      this.passWord = "";
    },
    toIndex: function() {
      if (this.userName == "") {
        this.$message.error("请输入账号!");
        return;
      }
      if (this.passWord == "") {
        if (this.isChange) {
          this.$message.error("请输入旧密码!");
          return;
        } else {
          this.$message.error("请输入密码!");
          return;
        }
      }
      if (this.isChange) {
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
          if (res.code == 0) {
            this.$message.success(res.msg);
            this.isChange = false;
            this.userName = "";
            this.passWord = "";
            this.newAassWord2 = "";
            this.newAassWord1 = "";
          } else {
            this.$message.error(res.msg);
          }
        });
      } else {
        login({
          user: {
            username: this.userName,
            password: this.passWord
          },
          type: 2
        }).then(res => {
          if (res.code == 0) {
            this.$router.push("/index/index");
            sessionStorage.setItem("userInfo", JSON.stringify(res.data));
          } else {
            this.$message.error(res.msg);
          }
        });
      }
    }
  }
};
</script>

<style lang="scss">
.changeBtn {
  color: rgb(78, 166, 252);
}
.changeBtn:hover {
  color: blue;
  cursor: pointer;
  text-decoration: underline;
}
</style>
