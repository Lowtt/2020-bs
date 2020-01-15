<template>
  <div style="width: 96%;margin: 0 auto">
    <a-row style="display: flex;flex-direction: row">
      <h2>日常绩分扣分记录</h2>
    </a-row>
    <a-divider />
    <a-row>
      <div class="searchBar">
        <div>
          <span>查询时间:</span>
          <a-date-picker placeholder="选择时间" @ok="timeQuery" showTime format="YYYY-MM-DD HH:mm:ss"/>
        </div>
        <div>
          <a-button>导出Excel</a-button>
        </div>
      </div>

      <div class="content" style="text-align: left;margin-top: 40px">
        <a-table :columns="columns" :dataSource="tableData" bordered></a-table>
      </div>
    </a-row>
  </div>
</template>

<script>
import { dailyDec } from "../../axios/api";
import moment from 'moment'
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
    title: "扣分原因",
    dataIndex: "applyReason",
    align: "center"
  }
];
export default {
  name: "noticeDetail",
  data() {
    return {
      columns,
      tableData: [],
      queryParams: { size: 10, indexPage: 1 }
    };
  },
  created() {
    this.getInitData();
  },
  methods: {
    timeQuery(val) {
      let time = moment(val._d).format("YYYY-MM-DD HH:mm:ss");
      this.queryParams = {
        ...this.queryParams,
        obj: { ...this.queryParams.obj, createTime: time }
      }
       this.getInitData();
    },
    getInitData() {
      dailyDec(this.queryParams).then(res => {
        if (res.code == 0) {
          this.tableData = res.data.list
        }
      });
    }
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
