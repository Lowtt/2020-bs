<template>
  <div style="width: 96%;margin: 0 auto">
    <a-row style="display: flex;flex-direction: row">
      
      <a-col :span="24" style="text-align: right">
        <span>{{time}}</span>
      </a-col>
    </a-row>
    <a-divider />
    <a-row>
      <div style="text-align: left">
        <h2>{{pageData.titile}}</h2>
      </div>
     
      <div style="text-align: left;margin-top: 40px">
        <span>
          {{pageData.content}}
        </span>
      </div>
    </a-row>
  </div>
</template>

<script>
  import {noticeDeatil} from '../../axios/api';

  export default {
      name:'noticeDetail',
      data(){
          return{
              time:new Date().toLocaleString(),
              pageData:{}
          }
      },
      created(){
        this.getInitData()
      },
      methods:{
        getInitData(){
          let id = this.$route.query.noticeId
          noticeDeatil({id:id}).then(res=>{
            if(res.code == 0){
              this.pageData = res.data
            }
          })
        }
      }
  }
</script>

<style scoped>

</style>
