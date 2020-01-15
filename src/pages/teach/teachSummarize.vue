<template>
    <div style="width: 96%;margin: 0 auto">
      <a-row style="display: flex;flex-direction: row">
        <h2>教学总结</h2>
      </a-row>
      <a-divider />

      <a-row style="display: flex;flex-direction: row-reverse">
        <a-button style="margin-left: 20px" @click="download">下载模板</a-button>
        <a-upload
          :action="`${url}/upload/file`"
          :fileList="applyFiles"
          @change="upLoadFile"
        >
          <a-button>
            <a-icon type="upload" />上传资料
          </a-button>
        </a-upload>
      </a-row>

      <a-row style="margin-top: 20px">
        <a-table :columns="columns" :dataSource="data" bordered>
          <span slot="action" slot-scope="text, obj">
          <a @click="detail(obj)">查看</a>
        </span>
        </a-table>
      </a-row>
      <a-modal :title='modalTitle' v-model="visible">
        <div slot='footer'>
          <a-button type='primary' @click="close">关闭</a-button>
        </div>
        <div>{{modalContent}}</div>
      </a-modal>
    </div>
</template>

<script>
  import {teachingSummary,upFile,upEntry,downloadFile,url ,download} from '../../axios/api';
  const status = {
    0:'待审核',
    1:'已通过',
    2:'已驳回'
  }
  const columns = [{
    dataIndex: 'fileName',
    title:'文件',
    align:'center'
  }, {
    title: '状态',
    dataIndex: 'flag',
    align:'center',
    customRender:(text)=>status[text]
  },{
    title: '审核人',
    dataIndex: 'auditor.name',
    align:'center'
  },{
    title: '提交时间',
    dataIndex: 'createTime',
    align:'center'
  },{
    title: '操作',
    dataIndex: 'tags',
    scopedSlots: { customRender: "action" },
    align:'center'
  }];



  export default {
    data() {
      return {
        data:[],
        columns,
        visible:false,
        status,
        url,
        modalTitle:'',
        modalContent:'',
        fileName:[],
        filePaths:[],
        applyFiles:[]
      }
    },
    created() {
      this.getTeachingSummary()
    },
    methods: {
      getTeachingSummary(){
         teachingSummary({"systemState": 1}).then(res=>{
           if(res.code == 0){
             this.data = res.data.list
           }
        })
      },
      close(){
        this.visible = false
      },
      download(){
        download({"systemState": 1}).then(res=>{
          if(res.code == 0) {
            let url = res.data[0].path
            let link = document.createElement('a')
            link.style.display = 'none'
            link.href = url
            link.setAttribute('download', '教学总结.xls')
            document.body.appendChild(link)
            link.click()
            link.remove()
          }
        })
      }
      ,
      upLoadFile(file) {
      this.applyFiles = file.fileList;
      if (file.file.status == "done") {
        let arr = this.fileName;
        arr.push(file.file.name);
        this.fileName = arr;
        this.realyUpload(file);
      }
    },
    realyUpload(file) {
      let form = new FormData();
      form.append("file", file.file.originFileObj);
      upEntry(form).then(res => {
        if (res.code == 0) {
          let arr = this.filePaths;
          arr.push(res.data.filePath);
          this.filePaths = arr;
          this.sendFile()
        }
      });
    },
    sendFile(){
      let val = {
        path:this.filePaths.join(','),
        fileName:this.fileName.join(',')
      }
      upFile(val).then(res=>{
        if(res.code == 0){
          this.$message.success('上传成功!')
          this.fileName = [];
          this.filePaths = []
          this.applyFiles = []
        }else{
          this.$message.error('上传失败!')
        }
      })
    },
      detail(obj){
        this.visible = true
        this.modalTitle = this.status[obj.flag]
        this.modalContent = obj.reason
      }
    }
  }
</script>

<style scoped>

</style>
