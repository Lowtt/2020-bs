<template>
  <div style="width: 96%;margin: 0 auto">
    <a-row>
      <a-col :span="12" style="display: flex;flex-direction: row">
        <h2>我要举报</h2>
      </a-col>
      <a-col :span="12" style="display: flex;flex-direction: row-reverse">
        <a-button @click="toCeoReport">一键向CEO举报</a-button>
      </a-col>
    </a-row>
    <a-divider />

    <a-row style="margin-top: 20px">
      <a-table :columns="columns" :dataSource="tableData" bordered></a-table>
    </a-row>
    <a-modal
      title="举报内容"
      v-model="visible"
      @cancel="modelCancel"
      cancelText="取消"
      okText="提交"
      @ok="supplyReport"
    >
      <a-Form style="width:100%" :form="form">
        <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="我要举报的人">
          <a-input
            v-decorator="[
                'num',
                {

                  rules: [{
                    required: true,
                    message: '请输入被举报人!',
                  },{
                    max:10,
                    message:'最多输入10个字!'
                  }],
                }
              ]"
          />
        </a-form-item>
        <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="举报原因">
          <a-textarea
            autosize
            v-decorator="[
                'content',
                {
                  rules: [{
                    required: true,
                    message: '请输入举报原因!',
                  },{
                    max:200,
                    message:'最多输入200个字!'
                  }],
                }
              ]"
          />
        </a-form-item>
        <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="证明资料">
          <a-upload
            :action="`${url}/upload/file`"
            :fileList="applyFiles"
            @change="upLoadFile"
            v-decorator="[
                'paths',
                {
                  rules: [{
                    required: true,
                    message: '请上传证明资料!',
                  }],
                }
              ]"
          >
            <a-button>
              <a-icon type="upload" />上传资料
            </a-button>
          </a-upload>
        </a-form-item>
      </a-Form>
    </a-modal>
  </div>
</template>

<script>
//
import { reportlist, reportToCeo, upEntry, url } from "../../axios/api";

const columns = [
  {
    dataIndex: "content",
    title: "举报内容",
    width: "80%",
    align: "center"
  },
  {
    title: "发起时间",
    dataIndex: "createTime",
    width: "20%",
    align: "center"
  }
];

export default {
  data() {
    return {
      tableData: [],
      applyFiles: [],
      columns,
      visible: false,
      url,
      labelCol: {
        span: 6
      },
      filePaths: [],
      wrapperCol: {
        span: 16
      },
      form: this.$form.createForm(this)
    };
  },
  mounted() {
    this.getreportlist();
  },
  methods: {
    getreportlist() {
      reportlist({ systemState: 1 }).then(res => {
        if (res.code == 0) {
          this.tableData = res.data.list;
        }
      });
    },
    toCeoReport() {
      this.visible = true;
    },
    modelCancel() {
      this.visible = false;
      this.applyFiles = [];
      this.form.resetFields();
    },
    upLoadFile(file) {
      this.applyFiles = file.fileList;
      console.log(file.file.status);
      if (file.file.status == "done") {
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
    supplyReport() {
      let that = this;
      this.form.validateFields((err, val) => {
        if (!err) {
          val.paths = that.filePaths;
          reportToCeo(val).then(res => {
            if (res.code == 0) {
              that.form.resetFields();
              that.visible = false;
              this.$message.success(res.msg);
              that.applyFiles = [];
              that.getreportlist();
            } else {
              this.$message.error(res.msg);
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
