<template>
  <div style="width: 96%;margin: 0 auto">
    <a-row style="margin-top: 20px">
      <a-table :columns="columns" :dataSource="tableData" :pagination="pagination" bordered>
        <span slot="action" slot-scope="text, record">
          <a @click="detail(record)">查看</a>
        </span>
      </a-table>
    </a-row>
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
