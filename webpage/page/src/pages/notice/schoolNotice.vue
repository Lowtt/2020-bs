<template>
  <div style="width: 96%;margin: 0 auto">
    <a-row style="display: flex;flex-direction: row">
      <h2>学校公告</h2>
    </a-row>
    <a-divider />
    <a-row style="display: flex;flex-direction: row;justify-content: flex-start">
      <div style="margin-right: 20px">
        <span>查询时间:</span>

        <a-range-picker
          :showTime="{ format: 'HH:mm:ss' }"
          format="YYYY-MM-DD HH:mm:ss"
          :placeholder="['起始时间', '结束时间']"
          @ok="timeQuery"
        />
      </div>
      <div>
        <span>标题:</span>
        <a-input placeholder="请填写标题" style="width: 200px" v-model="titleQuery" />
      </div>
      <div style="position:absolute;right:0">
        <a-button type="primary" @click="query">查询</a-button>
        <a-button>清空</a-button>
      </div>
    </a-row>
    <a-row style="margin-top: 20px">
      <a-table :columns="columns" :dataSource="data" bordered>
        <span slot="action" slot-scope="text,obj">
          <a @click="checkDetail(obj)">查看</a>
        </span>
      </a-table>
    </a-row>
  </div>
</template>

<script>
import { announcementList } from "../../axios/api";
import moment from "moment";
const columns = [
  {
    dataIndex: "titile",
    title: "标题",
    align: "center"
  },
  {
    title: "推送时间",
    dataIndex: "createTime",
    align: "center"
  },
  {
    title: "操作",
    dataIndex: "tags",
    scopedSlots: { customRender: "action" },
    align: "center"
  }
];

export default {
  data() {
    return {
      data: [{ title: "测试消息" }],
      queryParams: { index: 1, indexSize: 10 },
      columns,
      titleQuery: "",
      createTime:{}
    };
  },
  created() {
    this.getAnnouncementList();
  },
  methods: {
    getAnnouncementList() {
      let querypar = {};
      if (this.createTime) {
        querypar = { ...querypar, ...this.createTime };
      }
      if (this.titleQuery) {
        querypar = { ...querypar, titile: this.titleQuery };
      }
      announcementList(querypar).then(res => {
        if (res.code == 0) {
          this.data = res.data.list;
        }
      });
    },
    query() {
      this.getAnnouncementList();
    },
    timeQuery(val) {
      let startTime0 = moment(val[0]._d).format("YYYY-MM-DD HH:mm:ss");
      this.createTime.startTime = startTime0;
      let endTime0 = moment(val[1]._d).format("YYYY-MM-DD HH:mm:ss");
      this.createTime.endTime = endTime0;
    },
    checkDetail(obj) {
      this.$router.push("/notice/noticeDetail?noticeId=" + obj.id);
    }
  }
};
</script>

<style scoped>
</style>
