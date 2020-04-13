<template>
<!-- 整个页面的入口 -->
  <div id="app">
    <!-- 全页面中文化 -->
    <a-locale-provider :locale='zhCN'>
      <router-view></router-view>
    </a-locale-provider>
  </div>
</template>

<script>
import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN';
export default {
  name: 'app',
  data () {
    return {
     zhCN
    }
  },
  created(){
    let isHeight=document.documentElement.clientHeight;//获取当前屏幕可见高度
    this.$store.commit('setHeight',isHeight);//存至中间库(可以理解成一个中间介质)
  }
}
</script>

<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100%;
  overflow-y: auto;
  min-width: 1280px;
}
.ant-layout-content{
  overflow: auto
}
h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}
.ant-layout.ant-layout-has-sider{
  height: 100% !important;
  overflow: hidden;
  min-width: 1080px;
}
li {
  display: inline-block;
  margin: 0 10px;
}

// a {
//   color: #42b983;
// }
</style>
