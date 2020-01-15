<template>
  <div style="width: 96%;margin: 0 auto">
    <a-row style="display: flex;flex-direction: row">
      <h2>教学安排</h2>
    </a-row>
    <div class="searchBar">
      <a-Form style="width:100%" :form="form" @submit="formSearch">
        <a-row>
          <a-col :span="6">
            <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="选择日期">
              <a-date-picker
                placeholder="请选择查询时间"
                style="width: 100%"
                v-decorator="[
                'time',
              ]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="班级">
              <a-select
                placeholder="请选择班级"
                v-decorator="[
                'class',
              ]"
              >
                <a-select-option
                  v-for="item in queryClass"
                  :value="item.id"
                  :key="item.id"
                >{{item.name}}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="校区">
              <a-select
                placeholder="请选择校区"
                v-decorator="[
                'schoolName',
              ]"
              >
                <a-select-option
                  v-for="item in schooolList"
                  :value="item.id"
                  :key="item.id"
                >{{item.schoolName}}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="6" :style="{ textAlign: 'right' }">
            <a-button type="primary" html-type="submit">查询</a-button>
            <a-button :style="{ marginLeft: '8px' }" @click="formReset">清空</a-button>
            <a-button :style="{ marginLeft: '8px' }" @click="exportExcel">导出Excel</a-button>
          </a-col>
        </a-row>
      </a-Form>
    </div>
    <div class="content">
      <a-row v-for="(obj,index) in lastLen" :key="index" style="text-align:left">
        <a-col :span="3" class="header_time">上课时间</a-col>
        <a-col :span="4" class="header_detail" v-for="(item,idx) in obj.content" :key="idx+22">
          年级名称:{{item.gradeName}}
        </a-col>
      </a-row>
      <a-row v-for="(obj,index) in tableData" :key="index" style="text-align:left">
        <a-col :span="3" class="time">{{obj.startEndTime}}</a-col>
        <a-col :span="4" class="detail" v-for="(item,idx) in lastLen[0].content" :key="idx">
          <template>
            <div>班级:{{item.content[0].subjectName+item.content[0].classtypeName+item.content[0].classesName}}</div>
            <div>科目:{{item.content[0].subjectName}}</div>
            <div>教师:{{item.content[0].userName}}</div>
            <div>班型:{{item.content[0].classtypeName}}</div>
            <div>
              <a @click="checkDetail(obj)">查看学生名单</a>
            </div>
          </template>
        </a-col>
      </a-row>

      <a-modal title="学生名单" v-model="visible" width="700px">
        <span slot="footer">
          <a-button type="primary" @click="modalOk">关闭</a-button>
        </span>
        <a-table
          :columns="studentColumns"
          :dataSource="studentData"
          bordered
          :scroll="{ x: studentColumns.length*100 }"
        ></a-table>
      </a-modal>
    </div>
  </div>
</template>

<script>
import { myTeachingArrange, queryClass, schooolList,DownLoade,studentList } from "../../axios/api";
const studentColumns = [
  {
    key: "order",
    dataIndex: "order",
    title: "序号",
    scopedSlots: {
      customRender: "action1"
    },
    align: "center"
  },
  {
    key: "studentName",
    title: "学生姓名",
    dataIndex: "studentName",
    align: "center"
  },
  {
    key: "sex",
    title: "性别",
    dataIndex: "sex",
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
    key: "connect",
    title: "联系方式",
    dataIndex: "connect",
    align: "center"
  }
];
export default {
  name: "teachPlan",
  data() {
    return {
      studentColumns,
      visible: false,
      tableData: [],
      queryClass: [],
      lastLen: [],
	  schooolList: [],
	  studentData:[],
      form: this.$form.createForm(this),
      labelCol: {
        span: 8
      },
      wrapperCol: {
        span: 16
      }
    };
  },
  created() {
    this.getInitData();
    this.getClass();
    this.getSchooolList();
  },
  methods: {
    getInitData() {
      myTeachingArrange({}).then(res => {
        if (res.code == 0) {
          this.tableData = res.data;
          let max2 = res.data.sort(function(a,b){
            return b.content.length-a.content.length;
          })[0];
          this.lastLen = [max2]
        }
      });
    },
    exportExcel() {
        DownLoade("/teacher/myClass/excelMyTeachingArrange").then(res => {
          var filename = '教学安排';
          var binaryData = [];
          binaryData.push(res);
          let url = window.URL.createObjectURL(new Blob(binaryData, {type: "application/zip"}))
          let link = document.createElement('a')
          link.style.display = 'none'
          link.href = url
          link.setAttribute('download', filename + '.xls')
          document.body.appendChild(link)
          link.click()
        })

    },
    checkDetail(obj) {
      this.visible = true;
      this.getstudentList(obj)
    },
    getstudentList(){
      studentList({}).then(res=>{
        if(res.code == 0){
          this.studentData = res.data
        }
      })
    },
    getClass() {
      queryClass({}).then(res => {
        if (res.code == 0) {
          this.queryClass = res.data;
        }
      });
    },
    getSchooolList() {
      schooolList({}).then(res => {
        if (res.code == 0) {
          this.schooolList = res.data;
        }
      });
    },
    modalOk() {
      this.visible = false;
    },
    formSearch(e) {
      e.preventDefault();
      this.form.validateFields((err, val) => {
        if (!err) {
          if (val.createTime) {
            val.createTime = moment(val.createTime._d).format(
              "YYYY-MM-DD HH:mm:ss"
            );
          }
          val.user = { name: val.userName };
          delete val.userName;
          this.queryParams = { ...this.queryParams, ...val };
          this.getMessagelistPage();
        }
      });
    },
    formReset() {
      this.form.resetFields();
    }
  }
};
</script>

<style scoped lang="scss">
.content {
  width: 100%;
  overflow: hidden;
  overflow-x: auto;
  border: 1px solid #666;

  .ant-row {
    border-bottom: 1px solid #666;
  }

  .time {
    line-height: 164px;
    text-align: center;
    border-right: 1px solid #666;
  }

  .header_time{
    text-align: center;
    line-height: 28px;
    padding: 12px;
    border-right: 1px solid #666;
  }

  .header_detail{
    padding: 12px;
    border-right: 1px solid #666;
    line-height: 28px;
  }

  .detail {
    padding: 12px;
    border-right: 1px solid #666;

    div {
      line-height: 28px;
    }
  }
}
</style>
