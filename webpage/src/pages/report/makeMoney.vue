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
      <a-table
        :columns="columns"
        :dataSource="tableData"
        :loading="loading"
        bordered
        :pagination="false"
        :rowKey="record=>record.id"
        size="small"
      >
        <span slot="total" slot-scope="text, obj">{{obj.inMoney+obj.outMoney}}</span>
      </a-table>
    </a-row>
  </div>
</template>

<script>
import { queryMakeMoney } from "../../axios/api";
import moment from "moment";
const columns = [
  {
    title: "日期",
    dataIndex: "createAt",
    align: "center"
  },
  {
    title: "外卖结账",
    dataIndex: "outMoney",
    align: "center"
  },
  {
    title: "现场结账",
    dataIndex: "inMoney",
    align: "center"
  },
  {
    title: "营业额",
    dataIndex: "total",
    align: "center",
    scopedSlots: { customRender: "total" }
  }
];

export default {
  data() {
    return {
      tableData: [],
      loading: false,
      columns,
      initDate: moment(
        moment()
          .subtract(1, "M")
          .format("YYYY-MM"),
        "YYYY-MM"
      ),
      // initDate: moment(moment().format("YYYY-MM"), "YYYY-MM"),
      format: "YYYY-MM",
      form: this.$form.createForm(this),
      labelCol: {
        span: 6
      },
      wrapperCol: {
        span: 18
      },
      queryParams: {
        startTime: moment(moment().startOf("month"))
          .subtract(1, "M")
          .format("YYYY-MM"),
        endTime: moment(moment().endOf("month"))
          .subtract(1, "M")
          .format("YYYY-MM")
      }
    };
  },
  mounted() {
    this.queryInitData();
  },
  methods: {
    disabledDate(current) {
      return current && current > moment().endOf("M");
    },
    formSearch(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          if (values.time) {
            values.startTime = moment(values.time)
              .startOf("month")
              .format("YYYY-MM-DD");
            values.endTime = moment(values.time)
              .endOf("month")
              .format("YYYY-MM-DD");
            delete values.time;
          } else {
            values.startTime = moment(moment().startOf("month"))
              .subtract(1, "M")
              .format("YYYY-MM-DD");
            values.endTime = moment(moment().endOf("month"))
              .subtract(1, "M")
              .format("YYYY-MM-DD");
          }
          this.queryParams = values;
          this.queryInitData();
        }
      });
    },
    //重置
    handleRest() {
      this.form.resetFields();
      this.queryParams = {
        startTime: moment(moment().startOf("month"))
          .subtract(1, "M")
          .format("YYYY-MM-DD"),
        endTime: moment(moment().endOf("month"))
          .subtract(1, "M")
          .format("YYYY-MM-DD")
      };
      this.queryInitData();
    },
    queryInitData() {
      this.loading = true;
      queryMakeMoney(this.queryParams).then(res => {
        if (res.code == 200) {
          res.data.map(item => {
            item.createAt = moment(item.createAt).format("YYYY-MM-DD");
          });
          this.tableData = res.data;
        } else {
          this.$message.error(res.message);
        }
        this.loading = false;
      });
    }
  }
};
</script>

<style scoped>
.form-content {
  margin-top: 10px;
}
</style>
