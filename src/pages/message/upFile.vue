<template>
  <div style="width: 96%;margin: 0 auto">
    <a-row style="display: flex;flex-direction: row">
      <div>
        <span>收件人:</span>
        <a-select mode="multiple" style="width: 385px" placeholder="请选择收件人" v-model="receiver">
          <a-select-option
            v-for="item in teacherList"
            :key="item.user.id"
            :value="item.user.id"
          >{{item.user.name}}</a-select-option>
        </a-select>
      </div>
    </a-row>
    <a-divider />
    <a-row>
      <a-row style="display: flex;flex-direction: row">
        <div>
          <span>标题:</span>
          <a-input style="width: 400px" placeholder="请填写标题" v-model="title" />
        </div>
      </a-row>
      <a-row>
        <div style="margin-top: 20px">
          <a-textarea placeholder="请填写内容" style="height: 200px" v-model="content" />
        </div>
      </a-row>
      <a-row style="margin-top: 20px;display: flex;flex-direction: row">
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
    </a-row>
    <a-row style="margin-top: 40px;display: flex;flex-direction: row-reverse">
      <a-button style="margin-left: 20px" @click="goBack">返回</a-button>
      <a-button type="primary" @click="submit">提交</a-button>
    </a-row>
  </div>
</template>

<script>
import { upEntry, teacherList, sendFile,url } from "../../axios/api";
export default {
  data() {
    return {
      applyFiles: [],
      title: "",
      content: "",
      teacherList: [],
      receiver: [],
      filePaths: [],
      fileName: [],
      url
    };
  },
  created() {
    this.getTeacherList();
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },

    getTeacherList() {
      teacherList({}).then(res => {
        if (res.code == 0) {
          this.teacherList = res.data.list;
        }
      });
    },
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
        }
      });
    },
    submit() {
      if (!this.receiver.length) {
        this.$message.warning("请选择收件人!");
        return;
      }
      if (this.title == "" || this.content == "" || !this.filePaths.length) {
        this.$message.warning("请输入完整内容!");
        return;
      }
      let val = {
        title: this.title,
        content: this.content,
        path: this.filePaths.join(","),
        fileName: this.fileName.join(","),
        addresseeId: this.receiver.join(",")
      };
      sendFile(val).then(res => {
        if (res.code == 0) {
          this.applyFiles = [];
          this.title = "";
          this.content = "";
          this.receiver = [];
          this.$message.success("文件发送成功!");
        }
      });
    }
  }
};
</script>

<style scoped>
</style>
