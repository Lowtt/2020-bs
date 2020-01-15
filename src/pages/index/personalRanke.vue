<template>
  <div style="width: 96%;margin: 0 auto">
    <a-row style="display: flex;flex-direction: row">
      <h2>个人绩分排名</h2>
    </a-row>
    <a-divider />
    <a-row>
      <div class="searchBar">
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
        <div>
          <a-button @click="exportFile">导出Excel</a-button>
        </div>
      </div>

      <div class="content" style="text-align: left;margin-top: 40px">
        <a-table :columns="columns" :dataSource="tableData" bordered :pagination="pagination"></a-table>
      </div>
    </a-row>
  </div>
</template>

<script>
import {
  scrollRanke,
  staticTemplateList,
  exportRanke,
  DownLoade
} from "../../axios/api";
const columns = [
  {
    dataIndex: "rank",
    title: "排名",
    align: "center"
  },
  {
    title: "姓名",
    dataIndex: "name",
    align: "center"
  },
  {
    title: "绩分",
    dataIndex: "num",
    align: "center"
  },
  {
    title: "校区",
    dataIndex: "schoolName",
    align: "center"
  },
  {
    title: "角色",
    dataIndex: "roleName",
    align: "center"
  },
  {
    title: "入职时间",
    dataIndex: "createTime",
    align: "center"
  }
];
export default {
  name: "personalRanke",
  data() {
    return {
      columns,
      pageSize: 10,
      total: 1000,
      pagination: {
        size: "small",
        current: 1,
        pageSize: this.pageSize,
        total: 0,
        showQuickJumper: true,
        showSizeChanger: true,
        showTotal: () => "共111条"
      },
      template: [],
      tableData: [],
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
        if (res.code == 0) {
          this.template = res.data.list;
        }
      });
    },
    templateChange(val) {
      this.queryParams = {
        ...this.queryParams,
        obj: { staticTemplateId: val }
      };
      this.getInitData();
    },
    exportFile() {
      let queryparam = {
        ...this.queryParams,
        obj: { ...this.queryParams.obj, type: 0 }
      };
      DownLoade("/api/teacher/ranking/excelList", queryparam).then(res => {
        var filename = "个人绩分排名";
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
      });
    },
    getInitData() {
      let user = JSON.parse(sessionStorage.getItem("userInfo"));
      let userId = user.uId;
      scrollRanke(this.queryParams).then(res => {
        if (res.code == 0) {
          this.tableData = res.data.list;
          this.pagination.showTotal = () => `共${res.data.total}条`;
        }
      });
    }
    // getInitParams(){
    //   this.
    // }
  }
};
</script>

<style scoped>
.searchBar {
  /* text-align: left; */
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
</style>
