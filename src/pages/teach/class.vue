<template>
  <div style="width: 96%;margin: 0 auto">
    <a-row style="display: flex;flex-direction: row;height: 66px; align-items: center;">
      <h2>我的班级</h2>
      <p class="headInfo">当月总课时数:{{count}}</p>
      <p class="headInfo">当月总课时提成:{{monthRoyalty}}</p>
      <p class="headInfo">
        选择要查看的月份:
        <a-month-picker :defaultValue="defaultDate" format="YYYY-MM" @change="headChange" />
      </p>
    </a-row>
    <a-divider />

    <a-row>
      <div
        class="search-container"
        style="display: flex;flex-direction: row;justify-content: flex-start"
      >
        <div class="item">
          <span class="item-title">学段:</span>
          <a-select
            :size="size"
            style="width: 200px"
            placeholder="请选择学段"
            v-model="searchCriteria.learningtimeId"
          >
            <a-select-option v-for="item in learning" :key="item.id">{{item.name}}</a-select-option>
          </a-select>
        </div>
        <div class="item">
          <span class="item-title">年级:</span>
          <a-select
            :size="size"
            style="width: 200px"
            placeholder="请选择年级"
            v-model="searchCriteria.gradeId"
          >
            <a-select-option v-for="item in grade" :key="item.id" :value="item.id">{{item.name}}</a-select-option>
          </a-select>
        </div>
        <div class="item">
          <span class="item-title">班级:</span>
          <a-select
            placeholder="请选择班级"
            mode="multiple"
            style="width: 200px"
            v-model="searchCriteria.classIdList"
          >
            <a-select-option
              v-for="item in queryClass"
              :value="item.id"
              :key="item.id"
            >{{item.name}}</a-select-option>
          </a-select>
        </div>
      </div>
      <div
        class="search-container"
        style="display: flex;flex-direction: row;justify-content: flex-start"
      >
        <div class="item">
          <span class="item-title">招生情况:</span>
          <a-select
            :size="size"
            style="width: 200px"
            placeholder="请招生情况"
            v-model="searchCriteria.isMaxCount"
          >
            <a-select-option value="1">未满员</a-select-option>
            <a-select-option value="2">已满员</a-select-option>
          </a-select>
        </div>
        <div class="item">
          <span class="item-title">上课时间:</span>
          <a-date-picker
            v-model="searchCriteria.startTime"
            placeholder="请选择上课时间"
            :showTime="{ format: 'HH:mm' }"
            format="YYYY-MM-DD HH:mm"
            style="width:200px"
          />
        </div>
        <div class="item" style="margin-left:75px">
          <a-button type="primary" @click="search">查询</a-button>
          <a-button :style="{ margin: '0px 8px' }" @click="reset">清空</a-button>
        </div>
        <a-button @click="downLoad">导出EXCEL</a-button>
      </div>
    </a-row>

    <a-row style="margin-top: 20px">
      <a-table :columns="columns" :scroll="{ x: '130%' }" :dataSource="data" bordered>
        <span slot="action" slot-scope="text,obj">
          <a @click="checkDetail(obj)">详情</a>
        </span>
        <span slot="teachingTime" slot-scope="text">
          <span :key="index" v-for="(item,index) in text">{{item}}</span>
        </span>
      </a-table>
    </a-row>
  </div>
</template>

<script>
import {
  myClassList,
  listTeachingCount,
  queryLarning,
  queryClass,
  getGrade,
  DownLoade
} from "../../axios/api";
import moment from "moment";
const columns = [
  {
    key: "className",
    dataIndex: "className",
    title: "班级",
    align: "center",
    width: 120,
    fixed: "left"
  },
  {
    key: "gradeName",
    title: "年级",
    dataIndex: "gradeName",
    align: "center"
  },
  {
    key: "learningtimeName",
    title: "学段",
    dataIndex: "learningtimeName",
    align: "center"
  },
  {
    key: "classTypeName",
    title: "班型",
    dataIndex: "classTypeName",
    align: "center"
  },
  {
    key: "teachingList",
    title: "上课时间",
    dataIndex: "teachingList",
    align: "center",

    scopedSlots: {
      customRender: "teachingTime"
    }
  },
  {
    key: "classCount",
    title: "学生人数",
    dataIndex: "classCount",
    align: "center"
  },
  {
    key: "nowMouthTime",
    title: "当月消耗课时",
    dataIndex: "nowMouthTime",
    align: "center"
  },
  {
    key: "nowMouthRoyalty",
    title: "当月课时提成",
    dataIndex: "nowMouthRoyalty",
    align: "center"
  },
  {
    key: "action",
    title: "操作",
    dataIndex: "action",
    fixed: "right",
    width: 120,
    scopedSlots: {
      customRender: "action"
    },
    align: "center"
  }
];

export default {
  data() {
    return {
      size: "default",
      data: [],
      columns,
      monthRoyalty: 0,
      count: 0,
      learning: [],
      queryClass: [],
      grade: [],
      searchCriteria: {},
      startTime: null,
      defaultDate: moment(new Date(), "YYYY-MM"),
      headTime: null
    };
  },
  created() {
    this.getList();
    this.getListTeachingCount();
    this.queryLarning();
    this.getClass();
    this.queryGrade();
  },
  methods: {
    headChange(val) {
      this.headTime = moment(val._d).format("YYYY-MM");
      this.getListTeachingCount();
    },
    getClass() {
      queryClass({ ...this.searchCriteria }).then(res => {
        if (res.code == 0) {
          this.queryClass = res.data;
        }
      });
    },
    reset() {
      this.searchCriteria = {};
    },
    search() {
      if (this.searchCriteria.startTime) {
        let time = moment(this.searchCriteria.startTime).format(
          "YYYY-MM-DD HH:mm"
        );
        this.searchCriteria.time = time;
      }
      myClassList({ ...this.searchCriteria }).then(res => {
        if (res.code == 0) {
          this.data = res.data.list;
        }
      });
    },

    queryGrade() {
      getGrade({}).then(res => {
        if (res.code == 0) {
          this.grade = res.data;
        }
      });
    },
    getList() {
      myClassList({}).then(res => {
        if (res.code == 0) {
          this.data = res.data.list;
        }
      });
    },
    queryLarning() {
      queryLarning({}).then(res => {
        if (res.code == 0) {
          this.learning = res.data;
        }
      });
    },
    getListTeachingCount() {
      listTeachingCount({
        createTime: this.headTime
      }).then(res => {
        if (res.code == 0) {
          this.count = res.data.count;
          this.monthRoyalty = res.data.monthRoyalty;
        }
      });
    },
    checkDetail(obj) {
      this.$router.push(`/teaching/myclassDetail?classId=${obj.classId}`);
    },
    downLoad() {
      DownLoade("/teacher/myClass/excelList").then(res => {
        var filename = "我的班级";
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
    }
  }
};
</script>

<style scoped lang="scss">
.headInfo {
  margin-left: 14px;
}

.search-container {
  margin-bottom: 18px;

  .item {
    .item-title {
      display: inline-block;
      width: 72px;
      text-align: right;
    }
  }
}
</style>
