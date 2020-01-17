<template>
  <a-layout>
    <a-layout-header>
      <div style="color: white;font-size:20px">
        <span>设备资产管理系统</span>
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
            <a-menu-item class="itemBase">
              <router-link to="/grade/decRecord">结账管理</router-link>
            </a-menu-item>
          </a-sub-menu>

          <a-sub-menu class="menuBase">
            <span slot="title">
              <a-icon type="pie-chart" />
              <span>报表管理</span>
            </span>
            <a-menu-item class="itemBase">
              <router-link to="/teaching/barrier">我的闯关</router-link>
            </a-menu-item>
            <a-menu-item class="itemBase">
              <router-link to="/teaching/myclass">我的班级</router-link>
            </a-menu-item>
            <a-menu-item class="itemBase">
              <router-link to="/teach/teachPlan">我的教学安排</router-link>
            </a-menu-item>
            <a-menu-item class="itemBase">
              <router-link to="/teaching/leave">请假</router-link>
            </a-menu-item>
            <a-menu-item class="itemBase">
              <router-link to="/teach/teachSummarize">教学总结</router-link>
            </a-menu-item>
          </a-sub-menu>

          <a-menu-item class="itemBase" style="text-align: left" v-on:click="toInfo">
            <a-icon type="appstore" style="margin-left: 10px" />
            <span>站内消息</span>
          </a-menu-item>

          <a-menu-item class="itemBase" style="text-align: left" v-on:click="toNotice">
            <a-icon type="appstore" style="margin-left: 10px" />
            <span>学校公告</span>
          </a-menu-item>

          <a-menu-item class="itemBase" style="text-align: left" v-on:click="toInform">
            <a-icon type="appstore" style="margin-left: 10px" />
            <span>我要举报</span>
          </a-menu-item>
        </a-menu>
      </a-layout-sider>

      <a-layout-content style="background: white;margin:8px">
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

<style lang="scss">
.ant-layout-header {
  height: 60px;
  background: rgb(49, 154, 247);
  line-height: 60px;
  padding-left: 20px;
  text-align: start;
}
.ant-layout-sider{
  background: rgb(33,43,51);
  .ant-menu-dark{
    background: rgb(33,43,51);
  }
}
.menuBase {
  min-width: 180px;
  text-align: left;
}
</style>
