<template>
  <div id="index">
    <a-layout :style="{'height':isHeight+'px'}">
      <a-layout-sider>
        <div style="color: white;margin:20px auto;font-size:18px">
          <span>设备资产管理系统</span>
        </div>
        <a-menu
          mode="inline"
          theme="dark"
        >
          <a-menu-item class="menuBase" v-on:click="toIndex">
            <a-icon type="home" style="margin-left: 10px" /><span>首页</span>
          </a-menu-item>


          <a-sub-menu class="menuBase">
            <span slot="title"><a-icon type="appstore" /><span>点餐管理</span></span>
            <a-menu-item class="itemBase">
              <router-link to="/grade/incRecord">加分记录</router-link>
            </a-menu-item>
            <a-menu-item class="itemBase">
              <router-link to="/grade/decRecord">减分记录</router-link>
            </a-menu-item>
            <!-- <a-menu-item class="menuBase">
              <router-link to="/grade/datailDec">日常分扣分详情</router-link>
            </a-menu-item>
            <a-menu-item class="menuBase">
              <router-link to="/grade/gradeRank">个人绩分排名</router-link>
            </a-menu-item>
            <a-menu-item class="menuBase">
              <router-link to="/grade/departmentRank">部门绩分排名</router-link>
            </a-menu-item> -->
          </a-sub-menu>

          <a-sub-menu class="menuBase">
            <span slot="title"><a-icon type="appstore" /><span>教学管理</span></span>
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

          <!-- <a-sub-menu class="menuBase">
            <span slot="title"><a-icon type="appstore" /><span>站内消息</span></span>
            <a-menu-item class="itemBase">
              <router-link to="/message/list">提意见</router-link>
            </a-menu-item>
           <a-menu-item class="itemBase">
             <router-link to="/站内消息/上传文件">上传文件</router-link>
           </a-menu-item>
           <a-menu-item class="itemBase">
             <router-link to="/站内消息/查看">查看</router-link>
           </a-menu-item>
          </a-sub-menu> -->

          <a-menu-item class="itemBase" style="text-align: left" v-on:click="toInfo">
            <a-icon type="appstore" style="margin-left: 10px" /><span>站内消息</span>
          </a-menu-item>

          <a-menu-item class="itemBase" style="text-align: left" v-on:click="toNotice">
            <a-icon type="appstore" style="margin-left: 10px" /><span>学校公告</span>
          </a-menu-item>

          <a-menu-item class="itemBase" style="text-align: left" v-on:click="toInform">
            <a-icon type="appstore" style="margin-left: 10px" /><span>我要举报</span>
          </a-menu-item>

        </a-menu>
      </a-layout-sider>
      <a-layout>
        <a-layout-header style="height: 50px;background: white">
          <common-header></common-header>
        </a-layout-header>
        <a-layout-content style="background: white">
          <common-nav style="margin-bottom: 40px"></common-nav>
          <router-view></router-view>
        </a-layout-content>
      </a-layout>
    </a-layout>
  </div>
</template>

<script>
  export default {
    name: 'index',
    data () {
      return {
        isHeight:this.$store.getters.getHeight,
      }
    },
    created(){

    },
    beforeMount(){

    },
    methods:{
      toIndex:function () {
        this.$router.push('/index/index')
      },
      toNotice:function () {
        this.$router.push('/notice/schoolNotice')
      },
      toInform:function () {
        this.$router.push('/inform/informMsg')
      },
      toInfo:function () {
        this.$router.push('/station/stationInfo')
      }
    }
  }
</script>

<style lang="scss">
#index{
  height:100%
}
.menuBase{
  min-width: 180px;
  text-align: left
}
</style>
