<template>
  <div style="width: 96%;margin: 0 auto">
    <a-row style="display: flex;flex-direction: row">
      <h2>请假</h2>
    </a-row>
    <a-row style="text-align: left">
      <a-col :span="4">
        <span>本月请假次数:{{lastLeaveCount}}</span>
      </a-col>
      <a-col :span="4">
        <span>剩余可请假次数:{{lastSurplusCount}}</span>
      </a-col>
    </a-row>
    <a-divider />

    <a-row style="display: flex;flex-direction: row-reverse">
      <a-button style="margin-left: 20px" @click="exportFun">导出Excel</a-button>
      <a-button @click="apply">请假申请</a-button>
    </a-row>

    <a-row style="margin-top: 20px">
      <a-table :columns="columns" :dataSource="data" bordered>
      </a-table>
    </a-row>
  </div>
</template>

<script>
  import {messagelistPage,messageDetail} from '../../axios/api';

  const columns = [{
    dataIndex: 'createTime',
    title:'申请时间'
  }, {
    title: '请假时长',
    dataIndex: 'leaveTime',
  },{
    title: '请假原因',
    dataIndex: 'content',
  },{
    title: '审批结果',
    dataIndex: 'tags',
  },{
    title: '审批操作人',
    dataIndex: 'auditor',
  },{
    title: '操作',
    dataIndex: 'tags',
  }];


  export default {
    data() {
      return {
        data: [],
        columns,
        leaveList: [],
        lastSurplusCount: "",
        lastLeaveCount: ""
      }
    },
    mounted(){
      this.getmessagelistPage()
    },
    methods:{
      getmessagelistPage(){
        messagelistPage({systemState: 1}).then(res=>{
          if (res.code == 0) {
            this.data = res.data.list
          }
        })
      },
      apply(){
        leaveApply({
          "content": "睡不醒",
          "leaveTime": "3天",
          "path": "C:\/\/asdasd",
          "startTime": "2019-10-05",
          "endtime":"2019-10-06"}).then(res=>{

        })
      },
      exportFun(){
        exportExcel({"systemState": 1}).then(res=>{
          let a = document.createElement("a")

          a.setAttribute("target","_blank")

          a.href = res

          a.click()

          a.remove()
        })
      }
    }
  }
</script>

<style scoped>

</style>
