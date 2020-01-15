<template>
  <div style="width: 96%;margin: 0 auto">
    <a-row style="display: flex;flex-direction: row">
      <h2>我的扣分记录</h2>
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
          <a-date-picker placeholder="选择时间" @ok="timeQuery" showTime format="YYYY-MM-DD HH:mm:ss"/>
        </div>
      </a-col>
      <a-col :span="6" style="text-align:right">
          <a-button @click="exportFn">导出Excel</a-button>
      </a-col>
    </a-row>
    <a-row style="margin-top: 20px">
      <a-table :columns="columns" :dataSource="tableData" bordered></a-table>
    </a-row>
  </div>
</template>

<script>
import { staticTemplateList, decScrollRecord,DownLoade } from "../../axios/api";
import moment from "moment";
const columns = [
  {
    dataIndex: "createTime",
    title: "扣分时间",
    align: "center"
  },
  {
    title: "扣减分值",
    dataIndex: "num",
    align: "center"
  },
  {
    title: "绩分类型",
    dataIndex: "staticTemplate",
    align: "center"
  },
  {
    title: "扣分原因",
    dataIndex: "applyReason",
    align: "center"
  }
];

export default {
  data() {
    return {
      tableData: [],
      columns,
      template: [],
      queryParams: { size: 10, indexPage: 1 }
    };
  },
  created() {
    this.getInitData();
    this.staticTemplateList();
  },

  methods: {
    staticTemplateList() {
      staticTemplateList({
        indexPage: 1,
        size: 20
      }).then(res => {
        this.template = res.data.list;
      });
    },
    exportFn(){
      DownLoade("/api/teacher/applicationIntegralRecord/excelList").then(res => {
        var filename = '减分记录';
        var binaryData = [];
        binaryData.push(res);
        let url = window.URL.createObjectURL(new Blob(binaryData, {type: "application/zip"}))
        let link = document.createElement('a')
        link.style.display = 'none'
        link.href = url
        link.setAttribute('download', filename + '.xls')
        document.body.appendChild(link)
        link.click()
        link.remove()
      })
    },
    templateChange(val) {
      this.queryParams = {
        ...this.queryParams,
        obj: { ...this.queryParams.obj, staticTemplateId: val }
      };
      this.getInitData();
    },
    getInitData() {
      let queryParams = this.queryParams;
      decScrollRecord({ ...queryParams }).then(res => {
        if (res.code == 0) {
          this.tableData = res.data.list;
        }
      });
    },
    timeQuery(val) {
      let time = moment(val._d).format("YYYY-MM-DD HH:mm:ss");
      this.queryParams = {
        ...this.queryParams,
        obj: { ...this.queryParams.obj, createTime: time }
      };
      this.getInitData();
    }
  }
};
</script>

<style scoped>
</style>
