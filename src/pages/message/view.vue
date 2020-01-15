<template>
  <div style="width: 96%;margin: 0 auto">
    <a-row style="display: flex;flex-direction: row">
      <a-col :span="12" style="text-align: left">
        <span>发件人:{{messageDeatail.addressee.name}}</span>
      </a-col>
      <a-col :span="12" style="text-align: right">
        <span>{{messageDeatail.createtime}}</span>
      </a-col>
    </a-row>
    <a-divider />
    <a-row>
      <div style="text-align: left">
        <h3>{{messageDeatail.title}}</h3>
      </div>
      <div style="text-align: left;margin-top: 40px">
        <span>{{messageDeatail.fileName}}</span><a target="_blank" :href="messageDeatail.path" style="margin-left: 60px">点击下载</a>
      </div>
      <div style="text-align: left;margin-top: 40px">
        <span>
          {{messageDeatail.content}}
        </span>
      </div>
    </a-row>
  </div>
</template>

<script>
  import {messageDetail } from '../../axios/api';

  export default {
    data(){
      return{
        messageDeatail:{}
      }
    },
    created(){
      this.getInitData()
    },
    methods:{
      getInitData(){
        let id = this.$route.query.infoId
        messageDetail({id:id}).then(res=>{
          if(res.code==0){
            this.messageDeatail = res.data

          }
        })
      }
    }
  }
</script>

<style scoped>

</style>
