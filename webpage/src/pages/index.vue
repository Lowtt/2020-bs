<template>
  <a-layout>
    <a-layout-header>
      <div style="color: white;font-size:20px">
        <span>xx系统</span>
      </div>
    </a-layout-header>

    <a-layout :style="{'min-height':isHeight+'px !important' }">
      <a-layout-sider>
        <a-menu mode="inline" theme="dark">
          <a-menu-item class="menuBase" v-on:click="toIndex">
            <a-icon type="home" style="margin-left: 10px" />
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
            </a-menu-item> -->
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
export default {
  name: "index",
  data() {
    return {
      isHeight: this.$store.getters.getHeight - 60
    };
  },
  created() {},
  beforeMount() {},
  methods: {
    toIndex: function() {
      this.$router.push("/index/index");
    },
    toNotice: function() {
      this.$router.push("/notice/schoolNotice");
    },
    toInform: function() {
      this.$router.push("/inform/informMsg");
    },
    toInfo: function() {
      this.$router.push("/station/stationInfo");
    }
  }
};
</script>

<style lang="scss" scoped>
.ant-layout-header {
  height: 60px;
  background: rgb(49, 154, 247);
  line-height: 60px;
  padding-left: 20px;
  text-align: start;
  position: fixed;
  width: 100%;
  z-index: 99;
}
.ant-layout-sider {
  background: rgb(44,52,74);
  margin-top: 60px;
  position: fixed;
  min-height: 100%;
  z-index: 90;
  .ant-menu-dark {
    background: rgb(44,52,74);
     .ant-menu-item-selected{
       background: rgb(47,67,89);
     }
  }
}
.menuBase {
  min-width: 180px;
  text-align: left;
  
}
.ant-menu-submenu-title {
    padding-left: 0 !important;
  }
</style>
