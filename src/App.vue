<template>
  <div id="app">
    <a-locale-provider>
      <router-view></router-view>
    </a-locale-provider>
  </div>
</template>

<script>
export default {
  name: 'app',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  },
  created(){
    // this.$router.push('/login');
    // alert(document.documentElement.clientHeight)
    let isHeight=document.documentElement.clientHeight;
    this.$store.commit('setHeight',isHeight);
    //console.log(this.$store.getters.getHeight)
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

a {
  color: #42b983;
}
</style>
