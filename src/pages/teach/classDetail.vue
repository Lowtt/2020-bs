<template>
  <div style="padding:20px">
    <h2 style="text-align:left;color:rgba(105,105,105,.8)">班级详情</h2>
    <div class="totalInfo">
      <a-row class="infoList" style="margin-top:5px">
        <a-col :span="3">年级:</a-col>
        <a-col :span="5">{{headDatas.gradeName}}</a-col>
        <a-col :span="3">班级名称:</a-col>
        <a-col :span="5">{{headDatas.className}}</a-col>
        <a-col :span="3">班型:</a-col>
        <a-col :span="5">{{headDatas.classTypeName}}</a-col>
      </a-row>
      <a-row class="infoList" style="margin-top:20px">
        <a-col :span="3">学生总人数:</a-col>
        <a-col :span="5">{{headDatas.studentCount}}</a-col>
        <a-col :span="3">本月总扣课时:</a-col>
        <a-col :span="5">{{headDatas.teachingCount}}</a-col>
        <a-col :span="3">本月总提成金额:</a-col>
        <a-col :span="5">{{headDatas.totalRoyalty}}</a-col>
      </a-row>
    </div>
    <div class="searchBar">
      <a-Form style="width:100%" :form="form" @submit="formSearch">
        <a-row>
          <a-col :span="8">
            <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="查询时间">
              <a-date-picker @change="onChangeTime" placeholder="请选择查询时间" style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :span="8" v-if="isClass">
            <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="班级选择">
              <a-select placeholder="请选择班级">
                <a-select-option :value="null">全部</a-select-option>
                <a-select-option
                  v-for="item in queryClass"
                  :value="item.id"
                  :key="item.id"
                >{{item.name}}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="8" v:else></a-col>
          <a-col :span="8" :style="{ textAlign: 'right' }">
            <a-button type="primary" html-type="submit" @click="getInitData">查询</a-button>
            <a-button :style="{ marginLeft: '8px' }" @click="formReset">清空</a-button>
            <a-button :style="{ marginLeft: '8px' }" @click="exportExcel">导出Excel</a-button>
          </a-col>
        </a-row>
      </a-Form>
    </div>
    <div class="content">
      <a-tabs defaultActiveKey="1" @change="tabChange" style="text-align:left">
        <a-tab-pane tab="课时提成" key="classUp">
          <a-table
            :columns="columns"
            :dataSource="classUpData"
            bordered
            :scroll="{ x: columns.length*150 }"
          >
            <span slot="action" slot-scope="text,obj">
              <a @click="checkDetail(obj)">查看</a>
            </span>
          </a-table>
        </a-tab-pane>
        <a-tab-pane tab="提成明细" key="upDetail">
          <a-table
            :columns="columnsUpDetail"
            :dataSource="upDetailData"
            :pagination="upDetailPage"
            @change="tableChange"
          >
            <span slot="action" slot-scope="text,obj">
              <a @click="checkUpDetail(obj)">查看</a>
            </span>
          </a-table>
        </a-tab-pane>
      </a-tabs>
    </div>
    <a-modal :title="doubleTitle" v-model="visible">
      <span slot="footer">
        <a-button type="primary" @click="modelCancel">关闭</a-button>
      </span>
      <div style="margin-bottom:10px;text-align:right">
        <a-button @click="exportFn">导出Excel</a-button>
      </div>
      <a-table :columns="detailHeader" :dataSource="doubleDeatilData" bordered></a-table>
    </a-modal>
  </div>
</template>

<script>
import {
  classDetail,
  classUp,
  headData,
  queryClass,
  getUpDetail,
  DownLoade
} from "../../axios/api";
import moment from "moment";
const detailHeader = [
  {
    key: "createTime",
    dataIndex: "createTime",
    title: "时间",
    align: "center"
  },
  {
    key: "consumeTeachingcount",
    dataIndex: "consumeTeachingcount",
    title: "扣减课时",
    align: "center"
  },
  {
    key: "consumeTeachingmoney",
    dataIndex: "consumeTeachingmoney",
    title: "课时费",
    align: "center"
  },
  {
    key: "surplusTeaching",
    dataIndex: "surplusTeaching",
    title: "剩余课量",
    align: "center"
  }
];
const columns = [
  {
    key: "studentName",
    dataIndex: "studentName",
    title: "学生姓名",
    align: "center",
    fixed: "left",
    width: 120
  },
  {
    key: "sex",
    title: "性别",
    dataIndex: "sex",
    align: "center"
  },
  {
    key: "admissionTime",
    title: "入学时间",
    dataIndex: "admissionTime",
    align: "center"
  },
  {
    key: "learningtimeName",
    title: "学段",
    dataIndex: "learningtimeName",
    align: "center"
  },
  {
    key: "gradeName",
    title: "年级",
    dataIndex: "gradeName",
    align: "center"
  },
  {
    key: "className",
    title: "班级",
    dataIndex: "className",
    align: "center"
  },
  {
    key: "onceClassCost",
    title: "单次课时费",
    dataIndex: "onceClassCost",
    align: "center"
  },
  {
    key: "onceClassRoyalty",
    title: "单次课时提成",
    dataIndex: "onceClassRoyalty",
    align: "center"
  },
  {
    key: "deductionHour",
    title: "已消耗课时",
    dataIndex: "deductionHour",
    align: "center"
  },
  {
    key: "classRoyalty",
    title: "课时提成",
    dataIndex: "classRoyalty",
    align: "center"
  },
  {
    key: "surplusHour",
    title: "剩余课时",
    dataIndex: "surplusHour",
    align: "center"
  },
  {
    key: "classHour",
    title: "总课时",
    dataIndex: "classHour",
    align: "center"
  },
  {
    key: "action",
    title: "操作",
    dataIndex: "action",
    scopedSlots: { customRender: "action" },
    align: "center",
    fixed: "right",
    width: 100
  }
];
// 提成明细
const columnsUpDetail = [
  {
    key: "className",
    dataIndex: "className",
    title: "时间",
    align: "center",
    fixed: "left",
    width: 120
  },
  {
    key: "gradeName",
    title: "班级",
    dataIndex: "gradeName",
    align: "center"
  },
  {
    key: "learningtimeName",
    title: "扣取课时费",
    dataIndex: "learningtimeName",
    align: "center"
  },
  {
    key: "classTypeName",
    title: "课时费提成",
    dataIndex: "classTypeName",
    align: "center"
  },
  {
    key: "teachingTime",
    title: "提成比例",
    dataIndex: "teachingTime",
    align: "center"
  },
  {
    key: "action",
    title: "查看",
    dataIndex: "action",
    scopedSlots: { customRender: "action" },
    align: "center",
    fixed: "right",
    width: 100
  }
];
export default {
  data() {
    return {
      isClass: false, //显示选择班级框
      form: this.$form.createForm(this),
      columns,
      detailHeader,
      doubleDeatilData: [],
      visible: false,
      columnsUpDetail,
      admissionTime: null,
      keyword: "classUp",
      upDetailData: [],
      doubleTitle: "",
      exportParam: {},
      upDetailPage: {
        size: "small",
        current: 1,
        pageSize: 10,
        total: 0,
        showQuickJumper: true,
        showSizeChanger: true
      },
      queryClass: [],
      classUpData: [],
      headDatas: {},
      labelCol: {
        span: 8
      },
      wrapperCol: {
        span: 16
      },
      upDetailParam: {
        indexSize: 10,
        index: 1
      }
    };
  },
  created() {
    this.getTotalInfo();
    this.getInitData();
    this.getHeadData();
    this.getClass();
  },
  methods: {
    modelCancel() {
      this.visible = false;
    },
    exportFn() {
      DownLoade("/consumeTeaching/excelList2", this.exportParam).then(res => {
        let filename = "课时提成明细";
        let binaryData = [];
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
    moment,
    checkDetail(obj) {
      let param = {
        classesId: obj.classId,
        studentId: obj.studentId
      };
      this.exportParam = { ...param };
      this.doubleTitle = `${obj.studentName}课时扣减明细`;
      classDetail(param).then(res => {
        if (res.code == 0) {
          this.doubleDeatilData = res.data;
          this.visible = true;
        }
      });
    },
    tableChange(pageParam) {
      this.upDetailPage = {
        ...this.upDetailPage,
        pageSize: pageParam.pageSize,
        current: pageParam.current
      };
      this.upDetailParam = {
        index: pageParam.current,
        indexSize: pageParam.pageSize
      };
      this.getUpDetail();
    },
    getTotalInfo() {
      let id = this.$route.query.classId;
    },
    onChangeTime(date, dateString) {
      this.admissionTime = dateString;
    },
    getClass() {
      queryClass({}).then(res => {
        if (res.code == 0) {
          this.queryClass = res.data;
        }
      });
    },
    getHeadData() {
      headData({ classId: this.$route.query.classId }).then(res => {
        if (res.code == 0) {
          this.headDatas = res.data;
        }
      });
    },
    exportExcel() {
      if ((this.keyword = "classUp")) {
        this.exportApi(
          "/teacher/myClass/excelListStudentByClassesId",
          "课时提成"
        );
      } else {
        this.exportApi("/consumeTeaching/excelList", "提成明细");
      }
    },
    getInitData() {
      classUp({
        classId: this.$route.query.classId,
        admissionTime: this.admissionTime
      }).then(res => {
        if (res.code == 0) {
          this.classUpData = res.data.list;
          this.headDatas.className = res.data.list[0].className;
          this.headDatas.classTypeName = res.data.list[0].classTypeName;
          this.headDatas.gradeName = res.data.list[0].gradeName;
          this.headDatas.studentCount = res.data.list[0].studentCount;
        }
      });
    },
    formSearch(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          //可能不用表单
        }
      });
    },
    formReset() {
      this.form.resetFields();
    },
    tabChange(key) {
      this.keyword = key;
      if (key == "upDetail") {
        this.isClass = true;
        this.getUpDetail();
      } else {
        this.isClass = false;
      }
    },
    checkUpDetail(obj) {
      //明细详情
    },
    getUpDetail() {
      getUpDetail({
        ...this.upDetailParam,
        classId: this.$route.query.classId
      }).then(res => {
        if (res.code == 0) {
          this.upDetailData = res.data.list;
          this.upDetailPage.showTotal = () => `共${res.data.total}条`;
        }
      });
    },
    exportApi(url, name) {
      DownLoade(url, {
        classId: this.$route.query.classId,
        admissionTime: this.admissionTime
      }).then(res => {
        var filename = name;
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

<style scoped>
.searchBar {
  display: flex;
  flex-direction: row;
  margin-top: 50px;
}
.totalInfo {
  border: 1px solid rgba(208, 208, 208, 0.5);
  padding-bottom: 30px;
  border-radius: 10px;
}
.infoList {
  text-align: left;
  padding-left: 30px;
}
.infoList .ant-col-5,
.infoList .ant-col-3 {
  font-size: 16px;
}
</style>>
