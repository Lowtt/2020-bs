<template>
  <div style="width: 96%;margin: 0 auto">
    <a-row>
      <a-Form class="form-content" :form="form" @submit="formSearch">
        <a-col :span="6">
          <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="时间">
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
            <a-select v-decorator="['type']" placeholder='请选择' allowClear>
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
      <a-table :columns="columns" :dataSource="data" bordered>
        <span
          slot="order"
          slot-scope="text, record,index"
        >{{queryParams.pageNum*queryParams.pageSize+index-1}}</span>
        <span slot="total" slot-scope="text,record">{{record.price*record.num}}</span>
      </a-table>
    </a-row>
  </div>
</template>

<script>
import { messagelistPage, messageDetail } from "../../axios/api";
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
    title: "单价",
    dataIndex: "price",
    align: "center"
  },
  {
    title: "卖出份数",
    dataIndex: "num",
    align: "center"
  },
  {
    title: "总价",
    dataIndex: "total",
    align: "center",
    scopedSlots: { customRender: "total" }
  }
];

export default {
  data() {
    return {
      data: [],
      columns,
      foodType: [
        //食品种类
        { name: "主食", key: 0 },
        { name: "小食", key: 1 },
        { name: "饮料", key: 2 },
        { name: "套餐", key: 3 }
      ],
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
        pageSize: 10
      },
      form: this.$form.createForm(this)
    };
  },
  mounted() {},
  methods: {
    formSearch(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log(values);
        }
      });
    },
    disabledDate(current) {
      return current && current > moment().endOf("M");
    },
    handleRest() {
      this.form.resetFields();
    }
  }
};
</script>

<style scoped>
.form-content {
  display: flex;
  margin-top: 10px;
  /* justify-content: space-around; */
}
</style>
