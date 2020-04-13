<template>
  <a-layout>
    <a-layout-header>
      <div class="header-info">
        <span @click="toIndex" style="cursor:pointer">快餐店收银系统</span>
        <span>
          <a-icon type="user" />
          <a-dropdown>
            <span class="ant-dropdown-link" @click="e => e.preventDefault()">
              {{userInfo}}
              <a-icon type="down" />
            </span>
            <a-menu slot="overlay">
              <a-menu-item>
                <a @click="loginOut">退出登录</a>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </span>
      </div>
    </a-layout-header>

    <a-layout :style="{'min-height':isHeight+'px !important' }">
      <a-layout-sider>
        <a-menu mode="inline" theme="dark">
          <a-menu-item class="homeItem" @click="toIndex" style='padding-left:25px'>
            <a-icon type="home" style="margin-rigth: 0" />
            <span>首页</span>
          </a-menu-item>

          <a-sub-menu class="menuBase">
            <span slot="title">
              <a-icon type="coffee" />
              <span>点餐管理</span>
            </span>
            <a-menu-item class="itemBase">
              <router-link to="/order/orderManage">点餐管理</router-link>
            </a-menu-item>
            <!-- <a-menu-item class="itemBase">
              <router-link to="/grade/decRecord">结账管理</router-link>
            </a-menu-item>-->
          </a-sub-menu>

          <a-sub-menu class="menuBase">
            <span slot="title">
              <a-icon type="pie-chart" />
              <span>报表管理</span>
            </span>
            <a-menu-item class="itemBase">
              <router-link to="/report/sale">营业额度</router-link>
            </a-menu-item>
            <a-menu-item class="itemBase">
              <router-link to="/report/foodSale">菜品销量</router-link>
            </a-menu-item>
          </a-sub-menu>

          <a-sub-menu class="menuBase">
            <span slot="title">
              <a-icon type="setting" />
              <span>系统设置</span>
            </span>
            <a-menu-item class="itemBase">
              <router-link to="/system/addFood">菜品管理</router-link>
            </a-menu-item>
            <a-menu-item class="itemBase">
              <router-link to="/system/sendPreson">配送人员</router-link>
            </a-menu-item>
            <a-menu-item class="itemBase">
              <router-link to="/system/userinfo">用户信息</router-link>
            </a-menu-item>
          </a-sub-menu>
        </a-menu>
      </a-layout-sider>

      <a-layout-content style="background: white;margin: 68px 8px 8px 208px">
        <router-view></router-view>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script>
import headerUser from "../components/header";
export default {
  name: "index",
  data() {
    return {
      isHeight: this.$store.getters.getHeight - 60,
      userInfo: JSON.parse(sessionStorage.getItem("userInfo")).username
    };
  },
  mounted() {},

  methods: {
    toIndex: function() {
      this.$router.push("/index/index");
    },
    loginOut:function(){
      sessionStorage.clear()
      this.$router.push("/login");
    }
  }
  // components:{  //用来注册子组件的节点
  //     "header-user": headerUser
  // }
};
</script>

<style lang="scss" scoped>
.ant-layout-header {
  height: 60px;
  background: rgb(49, 154, 247);
  line-height: 60px;
  padding:0 20px;
  text-align: start;
  position: fixed;
  width: 100%;
  z-index: 99;
}
.ant-layout-sider {
  background: rgb(44, 52, 74);
  margin-top: 60px;
  position: fixed;
  min-height: 100%;
  z-index: 90;
  .ant-menu-dark {
    background: rgb(44, 52, 74);
    .ant-menu-item-selected {
      background: none;
      a{
        color: rgb(24,132,242);
      }
    }
  }
}
.menuBase,.homeItem {
  min-width: 200px;
  text-align: left;
  margin-bottom: 0 !important;
}
.itemBase{
padding-left: 60px;
}
.header-info {
  color: white;
  font-size: 20px;
  display: flex;
  justify-content: space-between;
}
.homeItem{
  i{
    margin-right: 0;
  }
}
.ant-menu-submenu{
  margin:0;
.ant-menu-submenu-title {
  padding-left: 0 !important;
  span{
    i{
      margin-right: 0;
    }
  }
}
}

</style>
