<template>
  <div style="width: 96%;margin: 0 auto">
    <a-row style="display: flex;flex-direction: row">
      <h2>入职流程</h2>
    </a-row>
    <a-divider />
    <a-row style="display: flex;flex-direction: row-reverse">
      <div>
        <a-button v-on:click="upBtn" style="margin-left: 20px">上传文件</a-button>
        <input type="file" style="display: none" id="upModel" v-on:change="getSource" />
        <a-button v-on:click="entryDown">下载模板</a-button>
      </div>
    </a-row>
    <a-row
      style="text-align: left;color: rgb(153,153,153);border: 1px solid rgb(235,235,235);height: 60px;line-height: 60px;margin-top: 60px"
    >
      <a-col :span="12" style="padding-left: 18px;">
        <span>开始时间：2019-8-1 01:49:10</span>
      </a-col>
      <a-col :span="12">
        <span>跟进人：{{tutorName}}</span>
      </a-col>
    </a-row>
    <a-row style="text-align: left;margin-top: 40px">
      <a-steps
        direction="vertical"
        :current="passList.length"
        style="display: flex;flex-direction: column;justify-content: space-around;height: auto"
      >
        <a-step :title="item.name" v-for="(item,index) in passList" :key="item.id" style='height:200px'>
          <div slot="description" :key="index">
            <a-row>
              <a-col span="6">
                <a style="color:blue" @click='detail(item)'>关卡简介</a>
              </a-col>
              <a-col span="8">
                <span>完成时间:{{item.endTime}}</span>
              </a-col>
              <a-col span="6">
                <span>审核人:{{item.entryApplyVo.auditor.name}}</span>
              </a-col>
                <a-button :type='userStatus[item.flag].type' :disabled='!(item.count==index)' @click="sendRequest(item,index,passList.length,item)">{{userStatus[item.flag].status}}</a-button>
            </a-row>
          </div>
        </a-step>

      </a-steps>
    </a-row>
    <a-modal :title="`关卡介绍 ${passIntroduce.name}`" v-model="visible">
      <span slot="footer">
        <a-button type="primary" @click="modelCancel">关闭</a-button>
      </span>
      <div>
        这里是介绍内容
      </div>
    </a-modal>
  </div>
</template>

<script>
import { download, upEntry, addRecord, checkpointList,passRequest,DownLoade } from "../../axios/api";
const userStatus = [
  { status: "申请审核", type: "primary" },
  { status: "待审核", type: "default" },
  { status: "已通过", type: "default" },
  { status: "已驳回", type: "default" }
];

export default {
  name: "entryStep",
  data() {
    return {
      baseUrl: this.$store.state.baseUrl,
      entryLink: "",
      passList: [],
      userStatus,
      visible:false,
      passIntroduce:{},
      tutorName:""
    };
  },
  mounted() {
    this.getcheckpoint();
  },
  methods: {
    entryDown() {
      download({"systemState": 1}).then(res => {
        if(res.code == 0){
          let url = res.data[0].path
          let link = document.createElement('a')
          link.style.display = 'none'
          link.href = url
          link.setAttribute('download', '模版.xls')
          document.body.appendChild(link)
          link.click()
        }
      })
    },
    upBtn: function() {
      let input = document.getElementById("upModel");
      input.click();
    },
    detail(obj){
      this.visible = true
      this.passIntroduce = obj
    },
    modelCancel() {
      this.visible = false;
    },
    sendRequest(obj,index,len){
      let param = {id:obj.id,flag:1}
      if(!obj.flag){
        if(index == len-1){
          param["type"] = 2
        }
        passRequest(param).then(res=>{
          if(res.code == 0){
            this.getcheckpoint()
            this.$message.success(res.msg)
          }else{
            this.$message.warning(res.msg)
          }
        })
      }
    },
    //
    getcheckpoint() {
      checkpointList({ systemState: 1 }).then(res => {
        if (res.code == 0) {
          this.passList = res.data;
          this.tutorName = res.data[0].entryApplyVo.tutor.name
        }
      });
    },
    getSource: function() {
      //获取文件在这里上传
      let input = document.getElementById("upModel").files[0];
      var form = new FormData();
      form.append("file", input);
      upEntry(form).then(res => {
        if (res.code == 0) {
          addRecord({
            auditor: null,
            tutor: null,
            flag: 1,
            reason: null,
            path: res.data.filePath
          }).then(res => {
            if(res.code == 0){
              this.$message.success(res.msg)
            }else{
              this.$message.error(res.msg)
            }
          });
        }
      });
    }
  }
};
</script>

<style scoped>
</style>
