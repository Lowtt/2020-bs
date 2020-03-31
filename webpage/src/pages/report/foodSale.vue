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
          <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="菜品类型">
            <a-select v-decorator="['type']" placeholder="请选择" allowClear>
              <a-select-option
                v-for="item in foodType"
                :key="item.key"
                :value="item.key"
              >{{item.name}}</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="6">
          <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="菜品名称">
            <a-input placeholder="请输入" v-decorator="[
                'name' 
              ]"></a-input>
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
        bordered
        @change="tableChange"
        size="small"
        :loading="loading"
        :pagination="pagination"
      >
        <span
          slot="order"
          slot-scope="text, record,index"
        >{{(queryParams.pageNum-1)*queryParams.pageSize+index+1}}</span>
        <span slot="total" slot-scope="text,record">{{record.price*record.num}}</span>
      </a-table>
    </a-row>
  </div>
</template>

<script>
import { queryFoodsByPage } from "../../axios/api";
import moment from "moment";
const columns = [
  {
    dataIndex: "order",
    title: "序号",
    scopedSlots: { customRender: "order" },
    align: "center"
  },
  {
    title: "菜品名称",
    dataIndex: "name",
    align: "center"
  },
  {
    title: "单价(元)",
    dataIndex: "price",
    align: "center"
  },
  {
    title: "卖出份数",
    dataIndex: "num",
    align: "center"
  },
  {
    title: "营业额(元)",
    dataIndex: "total",
    align: "center",
    scopedSlots: { customRender: "total" }
  }
];

export default {
  data() {
    return {
      tableData: [],
      columns,
      foodType: [
        //食品种类
        { name: "主食", key: 0 },
        { name: "小食", key: 1 },
        { name: "饮料", key: 2 },
        { name: "套餐", key: 3 }
      ],
      pagination: {
        size: "small",
        current: 1,
        pageSize: 10,
        total: 0,
        showQuickJumper: true,
        showSizeChanger: true
      },
      initDate: moment(moment().format("YYYY-MM"), "YYYY-MM"),
      format: "YYYY-MM",
      labelCol: {
        span: 6
      },
      wrapperCol: {
        span: 17
      },
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        startTime: moment(moment().startOf("month")).format(
          "YYYY-MM-DD HH:mm:ss"
        ),
        endTime: moment(moment().endOf("month")).format("YYYY-MM-DD HH:mm:ss")
      },
      form: this.$form.createForm(this)
    };
  },
  mounted() {
    this.queryInitData();
  },
  methods: {
    formSearch(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          if (values.time) {
            values.startTime = moment(values.time)
              .startOf("month")
              .format("YYYY-MM-DD 00:00:00");
            values.endTime = moment(values.time)
              .endOf("month")
              .format("YYYY-MM-DD 23:59:59");
            delete values.time;
          } else {
            values.startTime = moment(moment().startOf("month")).format(
              "YYYY-MM-DD HH:mm:ss"
            );
            values.endTime = moment(moment().endOf("month")).format(
              "YYYY-MM-DD HH:mm:ss"
            );
          }
          this.queryParams = {
            ...this.queryParams,
            ...values
          };
          this.queryInitData();
        }
      });
    },
    disabledDate(current) {
      return current && current > moment().endOf("M");
    },
    handleRest() {
      this.form.resetFields();
      this.queryParams = {
        pageSize: 10,
        pageNum: 1,
        startTime: moment(moment().startOf("month")).format(
          "YYYY-MM-DD HH:mm:ss"
        ),
        endTime: moment(moment().endOf("month")).format("YYYY-MM-DD HH:mm:ss")
      };
      this.queryInitData();
    },
    tableChange(pag) {
      this.pagination = {
        ...this.pagination,
        pageSize: pag.pageSize,
        current: pag.current
      };
      this.queryParams = {
        ...this.queryParams,
        pageNum: pag.current,
        pageSize: pag.pageSize
      };
      this.queryInitData();
    },
    queryInitData() {
      this.loading = true;
      queryFoodsByPage(this.queryParams).then(res => {
        if (res.code == 200) {
          res.data.data.map(item => {
            item.createAt = moment(item.createAt).format("YYYY-MM-DD HH:mm:ss");
          });
          this.tableData = res.data.data;
          this.pagination = {
            ...this.pagination,
            total: res.data.total,
            pageSize: res.data.pageSize,
            pageNum: res.data.pageNum,
            showTotal: () => `共${res.data.total}条`
          };
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
  /* display: flex; */
  margin-top: 10px;
  /* justify-content: space-around; */
}
</style>
