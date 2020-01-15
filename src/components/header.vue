<template>
    <div id="header" style="background-color: white">
      <div style="display: flex;flex-direction: row-reverse;height: 80px;line-height: 80px;">
        <a href="javascript:;" @click.stop="layout">退出</a>
        <a href="javascript:;" @click.stop="help">帮助</a>
        <a href="javascript:;" @click.stop="showNotice">通知</a>
        <span>你好，{{isName}}</span>
      </div>
    </div>
</template>

<script>
    export default {
      name: "header.vue",
      data(){
        return {

        }
      },
      mounted(){

      },
      computed:{
        isName:function () {
          let userInfo=JSON.parse(sessionStorage.getItem('userInfo'));
          return userInfo.name
        }
      },
      methods:{
        layout(){
          sessionStorage.removeItem("userInfo");
          this.$router.replace('/login');
        },
        showInform:function () {

        },
        help(){

        },
        showNotice(){
          this.$router.push('/station/stationInfo')
        }
      }
    }
</script>

<style scoped>
  a,span{
    margin-right: 20px;
  }
</style>
