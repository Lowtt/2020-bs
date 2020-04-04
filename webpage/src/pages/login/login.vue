<template>
  <div id="login">
    <div style="padding-top: 150px">
      <div style="margin-bottom: 30px">
        <h1>xx系统</h1>
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
          <span class="regBtn" @click="regAccount">注册用户</span>
        </div>
        <div style="margin-top: 20px">
          <a-button style="width: 360px;height: 40px" type="primary" v-on:click="toIndex">登录</a-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { login } from "../../axios/api";
export default {
  name: "login",
  data() {
    return {
      userName: "",
      passWord: ""
    };
  },
  created() {},
  beforeMount() {
    let userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
    if (userInfo && userInfo.token) {
      this.$router.push("/index/index");
    }
  },
  methods: {
    regAccount: function() {
      this.$router.push("/reg");
    },
    changePassword() {
      this.$router.push("/update");
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

      login({
        username: this.userName,
        password: this.passWord
      }).then(res => {
        if (res.code == 200) {
          this.$router.push("/index/index");
          sessionStorage.setItem("userInfo", JSON.stringify(res.data));
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
  .changeBtn,
  .regBtn {
    color: rgb(78, 166, 252);
  }
  .changeBtn:hover,
  .regBtn:hover {
    color: blue;
    cursor: pointer;
    text-decoration: underline;
  }
}
</style>
