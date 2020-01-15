<template>
  <div style="width: 96%;margin: 0 auto">
    <a-row style="display: flex;flex-direction: row">
      <h2>我的加分记录</h2>
    </a-row>
    <a-divider />
    <a-row style="display: flex;flex-direction: row;justify-content: flex-start">
      <a-col :span="18" style="display: flex;flex-direction: row;justify-content: flex-start">
        <div>
          <span>选择绩分版块:</span>
          <a-select style="width: 200px" @change="templateChange">
            <a-select-option :value="null">全部</a-select-option>
            <a-select-option
              v-for="item in template"
              :key="item.staticTemplate.id"
              :value="item.staticTemplate.id"
            >{{item.staticTemplate.name}}</a-select-option>
          </a-select>
        </div>
        <div style="margin-left: 20px;">
          <span>查询时间:</span>
          <a-date-picker placeholder="选择时间" @ok="timeQuery" showTime format="YYYY-MM-DD HH:mm:ss" />
        </div>
      </a-col>
      <a-col :span="6" style="display: flex;flex-direction: row;justify-content: space-around">
        <div>
          <a-button v-on:click="applyChangeRecord">申请绩分变更</a-button>
        </div>
        <div style="margin-left:20px">
          <a-button @click="exportFn">导出Excel</a-button>
        </div>
      </a-col>
    </a-row>
    <a-row style="margin-top: 20px">
      <a-table :columns="columns" :dataSource="tableData" :pagination="pagination" bordered>
        <span slot="action" slot-scope="text, record">
          <a @click="detail(record)">查看</a>
        </span>
      </a-table>
    </a-row>
    <a-modal title="申请绩分变更" v-model="visible" :maskClosable='true'>
      <span slot="footer">
        <a-button type="primary" @click="modelCancel">关闭</a-button>
        <a-button v-if="isApply" type="primary" @click="submit">提交</a-button>
      </span>
      <div>
        <a-row v-if="!isApply">
          <a-col
            span="22"
            offset="1"
            style="text-align:center;border:1px solid rgba(208,208,208,.5);color:rgba(208,208,208,.5);height:22px;border-radius:10px"
          >
            <p>{{this.applyStatus[applyResult.applyStatus]}}</p>
          </a-col>
        </a-row>
        <a-row>
          <a-col span="22">
            <a-Form style="width:100%" :form="form">
              <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="申请绩分数">
                <a-input-number
                  :max="100"
                  :min="1"
                  :precision="0"
                  v-decorator="[
                'num',
                {
                  initialValue:applyResult.num,
                  rules: [{
                    required: true,
                    message: '请输入申请绩分数!',
                  }],
                }
              ]"
                  style="width: 100%"
                  :disabled="!isApply"
                />
              </a-form-item>

              <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="绩分类型">
                <a-select
                  style="width: 100%"
                  :disabled="!isApply"
                  
                  v-decorator="[
                'staticTemplateId',
                {initialValue:applyResult.staticTemplateId,
                  rules: [{
                    required: true,
                    message: '请选择绩分类型!',
                  }],
                }
              ]"
                >
                  
                  <a-select-option
                    v-for="item in template"
                    :key="item.staticTemplate.id"
                    :value="item.staticTemplate.id"
                  >{{item.staticTemplate.name}}</a-select-option>
                </a-select>
              </a-form-item>
              <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="申请原因">
                <a-textarea
                  :disabled="!isApply"
                  autosize
                  v-decorator="[
                'applyReason',
                {initialValue:applyResult.applyReason,
                  rules: [{
                    required: true,
                    message: '请输入申请原因!',
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
                  <a-button v-if="isApply">
                    <a-icon type="upload" />上传资料
                  </a-button>
                </a-upload>
              </a-form-item>
              <a-form-item
                v-if="!isApply&&applyResult.applyStatus==2"
                :label-col="labelCol"
                :wrapper-col="wrapperCol"
                label="驳回原因"
              >
                <a-textarea
                  disabled
                  autosize
                  v-decorator="[
                'refusedReason',
               {initialValue:applyResult.applyRejectReason}
              ]"
                />
              </a-form-item>
            </a-Form>
          </a-col>
        </a-row>
      </div>
    </a-modal>
  </div>
</template>

<script>
import {
  staticTemplateList,
  applicationIntegralRecordSave,
  addScrollRecord,
  addScrollDetail,
  upEntry,
  DownLoade,
  url
} from "../../axios/api";
import moment from "moment";
const columns = [
  {
    dataIndex: "processingTime",
    title: "加分时间",
    align: "center"
  },
  {
    title: "分值",
    dataIndex: "num",
    align: "center"
  },
  {
    title: "绩分类型",
    dataIndex: "staticTemplate",
    align: "center"
  },
  {
    title: "加分原因",
    dataIndex: "applyReason",
    align: "center"
  },
  {
    title: "审核状态",
    dataIndex: "applyStatus",
    customRender: text => applyStatus[text],
    align: "center"
  },
  {
    title: "操作",
    scopedSlots: { customRender: "action" },
    align: "center"
  }
];

const applyStatus = {
  1: "待审核",
  2: "驳回",
  3: "已通过"
};

export default {
  data() {
    return {
      isApply: false,
      form: this.$form.createForm(this),
      tableData: [],
      template: [],
      applyResult: {},
      applyStatus,
      url,
      applyFiles: [],
      pagination: {
        size: "small",
        pageSize: 10,
        showQuickJumper: true,
        showSizeChanger: true,
        showTotal: () => `共1000条`
      },
      filePaths: [],
      labelCol: {
        span: 5
      },
      wrapperCol: {
        span: 16
      },
      visible: false,
      columns,
      queryParams: { size: 10, indexPage: 1 }
    };
  },
  created() {
    this.getInitData();
    this.staticTemplateList();
  },
  mounted() {
    let type = this.$route.query.type;
    if (type === "change") {
      this.isApply = true;
      this.visible = true;
    }
  },
  methods: {
    staticTemplateList() {
      staticTemplateList({
        indexPage: 1,
        size: 20
      }).then(res => {
        if (res.code == 0) {
          this.template = res.data.list;
        }
      });
    },
    exportFn() {
      DownLoade("/api/teacher/applicationIntegralRecord/excelCutList").then(
        res => {
          var filename = "加分记录";
          var binaryData = [];
          binaryData.push(res);
          let url = window.URL.createObjectURL(
            new Blob(binaryData, { type: "application/zip" })
          );
          let link = document.createElement("a");
          link.style.display = "none";
          link.href = url;
          link.setAttribute("download", filename + ".xls");
          document.body.appendChild(link);
          link.click();
          link.remove();
        }
      );
    },
    modelCancel() {
      this.visible = false;
      this.applyResult = {};
      this.applyFiles = [];
      this.form.resetFields();
    },
    upLoadFile(file) {
      this.applyFiles = file.fileList;
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
    detail(obj) {
      addScrollDetail({ id: obj.id }).then(res => {
        if (res.code == 0) {
          this.applyResult = res.data;
          this.applyFiles = res.data.paths.map((item, index) => {
            return {
              uid: `-${index}`,
              name: item,
              url: item
            };
          });
          this.visible = true;
          this.isApply = false;
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    getInitData() {
      addScrollRecord(this.queryParams).then(res => {
        if (res.code == 0) {
          this.tableData = res.data.list;
          this.pagination.showTotal = () => `共${res.data.total}条`;
        }
      });
    },
    templateChange(val) {
      this.queryParams = {
        ...this.queryParams,
        obj: { ...this.queryParams.obj, staticTemplateId: val }
      };
      this.getInitData();
    },
    timeQuery(val) {
      let time = moment(val._d).format("YYYY-MM-DD HH:mm:ss");
      this.queryParams = {
        ...this.queryParams,
        obj: { ...this.queryParams.obj, createTime: time }
      };
      this.getInitData();
    },
    applyChangeRecord() {
      this.isApply = true;
      this.visible = true;
    },
    submit() {
      this.form.validateFields((err, val) => {
        if (!err) {
          val.paths = this.filePaths;
          applicationIntegralRecordSave(val).then(res => {
            if (res.code == 0) {
              this.form.resetFields();
              this.visible = false;
              this.getInitData();
              this.applyFiles = [];
              this.$message.success(res.msg);
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
