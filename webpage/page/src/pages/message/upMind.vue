<template>
  <div style="width: 96%;margin: 0 auto">
    <a-row style="display: flex;flex-direction: row">
      <div>
        <span>收件人:</span>
        <a-select style="width: 385px" placeholder="请选择收件人" v-model="receiver">
          <a-select-option v-for="item in department" :key="item.id" :value="item.id">{{item.name}}</a-select-option>
        </a-select>
      </div>
    </a-row>
    <a-divider />
    <a-row>
      <a-row style="display: flex;flex-direction: row">
        <div style="margin-top: 20px">
          <span>建议事项:</span>
          <a-input style="width: 400px" placeholder="请填写标题" v-model="title" />
        </div>
      </a-row>
      <a-row>
        <div style="margin-top: 20px">
          <a-textarea placeholder="请填写建议内容" style="height: 200px" v-model="content" />
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
import { queryDepartment, sendFile, upEntry,url } from "../../axios/api";
export default {
  data() {
    return {
      title: "",
      content: "",
      applyFiles: [],
      filePaths: [],
       fileName: [],
      teacherList: [],
      department: [],
      receiver: "",
      url
    };
  },
  created() {
    this.queryDepartment();
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
    queryDepartment() {
      queryDepartment({}).then(res => {
        if (res.code == 0) {
          this.department = res.data;
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
      if (!this.receiver) {
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
        departmentId: this.receiver
      };
      sendFile(val).then(res => {
        if (res.code == 0) {
          this.applyFiles = [];
          this.title = "";
          this.content = "";
          this.$message.success("文件发送成功!");
        }
      });
    }
  }
};
</script>

<style scoped>
</style>
