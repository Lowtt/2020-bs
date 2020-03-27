<template>
  <div style="width: 96%;margin: 0 auto">
    <a-row>
      <a-Form class="form-content" :form="form" @submit="formSearch">
        <a-col :span="6">
          <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="月份">
            <a-month-picker
              :disabledDate="disabledDate"
              :format="format"
              v-decorator="[
                'time',
                {
                  initialValue:initDate, 
                }
              ]"
            />
          </a-form-item>
        </a-col>

        <a-col :span="6">
          <a-form-item>
            <div>
              <a-button type="primary" html-type="submit">查询</a-button>
              <a-button @click="handleRest">重置</a-button>
            </div>
          </a-form-item>
        </a-col>
      </a-Form>
    </a-row>

    <a-divider />

    <a-row style="margin-top: 20px">
      <a-table :columns="columns" :dataSource="data" bordered></a-table>
    </a-row>
  </div>
</template>

<script>
import { messagelistPage, messageDetail } from "../../axios/api";
import moment from "moment";
const columns = [
  {
    dataIndex: "createTime",
    title: "序号",
    align: "center"
  },
  {
    title: "日期",
    dataIndex: "time",
    align: "center"
  },
  {
    title: "外卖",
    dataIndex: "takeout",
    align: "center"
  },
  {
    title: "现场",
    dataIndex: "tags",
    align: "center"
  },
  {
    title: "营业额",
    dataIndex: "total",
    align: "center"
  }
];

export default {
  data() {
    return {
      data: [],
      columns,
      initDate: moment(
        moment()
          .subtract(1, "M")
          .format("YYYY-MM"),
        "YYYY-MM"
      ),
      format: "YYYY-MM",
      form: this.$form.createForm(this),
      labelCol: {
        span: 6
      },
      wrapperCol: {
        span: 18
      }
    };
  },
  mounted() {},
  methods: {
    disabledDate(current) {
      return current && current > moment().endOf("M");
    },
    formSearch(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          //查询
        }
      });
    },
    //重置
    handleRest() {
      this.form.resetFields();
      this.queryParams = {
        time: moment()
          .subtract(1, "M")
          .format("YYYY-MM")
      };
    }
  }
};
</script>

<style scoped>
.form-content{
  margin-top: 10px;
}
</style>
