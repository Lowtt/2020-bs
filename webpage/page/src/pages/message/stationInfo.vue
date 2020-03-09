<template>
  <div style="width: 96%;margin: 0 auto">
    <div style="display: flex;flex-direction: row;justify-content: space-between">
      <h2>站内消息</h2>
    </div>
    <div class="sendInfo" style="text-align:right;margin:10px 0">
      <a-button :style="{ marginLeft: '8px' }" @click="sendFile">发文件</a-button>
      <a-button :style="{ marginLeft: '8px' }" @click="giveAdvice">提建议</a-button>
    </div>
    <div class="searchBar">
      <a-Form style="width:100%" :form="form" @submit="formSearch">
        <a-row>
          <a-col :span="6">
            <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="收件时间">
              <a-date-picker
                format="YYYY-MM-DD"
                v-decorator="['createTime']"
                placeholder="请选择查询时间"
                style="width: 100%"
              />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="标题">
              <a-input v-decorator="[
                'title'
              ]" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="发件人">
              <a-input v-decorator="['userName']" />
            </a-form-item>
          </a-col>
          <a-col :span="6" :style="{ textAlign: 'right' }">
            <a-button type="primary" html-type="submit">查询</a-button>
            <a-button :style="{ marginLeft: '8px' }" @click="formReset">清空</a-button>
          </a-col>
        </a-row>
      </a-Form>
    </div>
    <a-row style="margin-top: 20px">
      <a-table :columns="columns" :dataSource="data" bordered>
        <span slot="action" slot-scope="text,obj">
          <a @click="checkInfoDetail(obj)">查看</a>
          <!-- <router-link to='/首页/首页'>详情</router-link> -->
        </span>
      </a-table>
    </a-row>
  </div>
</template>

<script>
import { messagelistPage, teacherList } from "../../axios/api";
import moment from "moment";
const columns = [
  {
    dataIndex: "title",
    align: "center",
    title: "标题"
  },
  {
    title: "发件人",
    dataIndex: "user.name",
    align: "center"
  },
  {
    title: "收件时间",
    dataIndex: "createTime",
    align: "center"
  },
  {
    key: "action",
    title: "操作",
    dataIndex: "action",
    scopedSlots: { customRender: "action" },
    align: "center"
  }
];

export default {
  data() {
    return {
      data: [],
      columns,
      labelCol: {
        span: 8
      },
      wrapperCol: {
        span: 16
      },
      teacherList: [],
      form: this.$form.createForm(this),
      queryParams: { index: 1, indexSize: 10 }
    };
  },
  created() {
    this.getMessagelistPage();
    this.getTeacherList();
  },
  methods: {
    getMessagelistPage() {
      messagelistPage({ ...this.queryParams, systemState: 1 }).then(res => {
        if (res.code == 0) {
          this.data = res.data.list;
        }
      });
    },
    getTeacherList() {
      teacherList({}).then(res => {
        if (res.code == 0) {
          this.teacherList = res.data.list;
        }
      });
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
    },
    checkInfoDetail(obj) {
      this.$router.push("/station/infoDetail?infoId=" + obj.user.id);
    },
    sendFile() {
      this.$router.push("/station/sendFile");
    },
    giveAdvice() {
      this.$router.push("/station/giveAdvice");
    }
  }
};
</script>

<style scoped>
</style>
