<template>
  <div style="width: 96%;margin: 0 auto">
    <a-row>
      <a-Form style="margin-top: 10px;" :form="form1" @submit="formSearch">
        <a-col :span="8">
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
        <a-col :span="8">
          <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="菜品名称">
            <a-input placeholder="请输入" v-decorator="[
                'name' 
              ]"></a-input>
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item>
            <div>
              <a-button type="primary" html-type="submit">查询</a-button>
              <a-button @click="handleRest">重置</a-button>
              <a-button style="margin-left:20px" type="primary" @click="addFood">新增菜品</a-button>
            </div>
          </a-form-item>
        </a-col>
      </a-Form>
    </a-row>

    <a-divider />
    <a-row style="margin-top: 20px">
      <a-table
        :columns="columns"
        :dataSource="data"
        bordered
        :pagination="pagination"
        @change="tableChange"
      >
        <span
          slot="order"
          slot-scope="text, obj,index"
        >{{queryParams.pageNum*queryParams.pageSize+index-1}}</span>
        <span slot="typeName" slot-scope="text">{{foodType[text]}}</span>
        <span slot="url" slot-scope="text">
          <img :src="text" width="32" height="32" />
        </span>
      </a-table>
    </a-row>
    <a-modal v-model="visible" :destroyOnClose="true">
      <p slot="title" class="modalTitle">
        <span>新增菜品</span>
        <span style="font-size:14px;margin-right:20px">操作时间:{{applyTime}}</span>
      </p>
      <span slot="footer">
        <a-button type="primary" @click="modalClose">关闭</a-button>
        <a-button type="primary" @click="modalOk">提交</a-button>
      </span>
      <div>
        <a-row>
          <a-col span="20">
            <a-Form style="width:100%" :form="form2">
              <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="菜品名称">
                <a-input
                  placeholder="请输入菜品名称..."
                  v-decorator="[
                'num',
                {
                  //initialValue:[applyResult.createTime,applyResult.updateTime],
                  rules: [{
                    required: true,
                    message: '请输入菜品名称!'
                  }],
                }
              ]"
                />
              </a-form-item>
              <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="菜品单价">
                <a-input-number
                  placeholder="请输入菜品单价..."
                  :min="1"
                  style="width:100%"
                  v-decorator="[
                'price',
                {
                  //initialValue:applyResult.content,
                  rules: [{
                    required: true,
                    message: '请输入菜品单价!',
                  }],
                }
              ]"
                />
              </a-form-item>
              <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="菜品类型">
                <a-select
                  v-decorator="['type',{rules: [{
                    required: true,
                    message: '请选择菜品类型!',
                  }]}]"
                  placeholder="请选择菜品类型..."
                  allowClear
                >
                  <a-select-option
                    v-for="item in foodType"
                    :key="item.key"
                    :value="item.key"
                  >{{item.name}}</a-select-option>
                </a-select>
              </a-form-item>
              <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="图片地址">
                <a-textarea
                  placeholder="请输入菜品图片地址..."
                  autosize
                  v-decorator="[
                'url',
               
              ]"
                />
              </a-form-item>
            </a-Form>
          </a-col>
        </a-row>
      </div>
    </a-modal>
  </div>
</template>

<script>
import { leaveList, leaveApply, exportExcel, DownLoade } from "../../axios/api";
import moment from "moment";
const columns = [
  {
    dataIndex: "order",
    title: "序号",
    align: "center",
    scopedSlots: { customRender: "order" }
  },
  {
    title: "菜品名称",
    dataIndex: "leaveTime",
    align: "center"
  },
  {
    title: "单价",
    dataIndex: "content",
    align: "center"
  },
  {
    title: "菜品类型",
    dataIndex: "type",
    align: "center",
    scopedSlots: { customRender: "typeName" }
  },
  {
    title: "菜品图片",
    dataIndex: "url",
    align: "center",
    scopedSlots: { customRender: "url" }
  }
];

export default {
  data() {
    return {
      data: [],
      applyTime: new Date().toLocaleString(),
      foodType: [
        //食品种类
        { name: "主食", key: 0 },
        { name: "小食", key: 1 },
        { name: "饮料", key: 2 },
        { name: "套餐", key: 3 }
      ],
      visible: false,
      pagination: {
        size: "small",
        current: 1,
        pageSize: 10,
        total: 0,
        showQuickJumper: true,
        showSizeChanger: true
      },
      form1: this.$form.createForm(this),
      form2: this.$form.createForm(this),
      columns,
      queryParams: {
        pageNum: 1,
        pageSize: 10
      },

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
    formSearch(e) {
      e.preventDefault();
      this.form1.validateFields((err, values) => {
        if (!err) {
          //查询
        }
      });
    },
    tableChange(pag) {
      const pager = { ...this.pagination };
      pager.current = pagination.current;
      this.pagination = {
        ...this.pagination,
        pageSize: pag.pageSize,
        pageNum: pag.pageNum
      };
      this.queryParams = {
        ...this.queryParams,
        pageNum: pag.pageNum,
        pageSize: pag.pageSize
      };
    },
    modalOk(e) {
      e.preventDefault();
      this.form2.validateFields((err, values) => {
        if (!err) {
          //新增
        }
      });
    },
    //重置
    handleRest() {
      this.form1.resetFields();
      this.queryParams = {
        pageNum: 1,
        pageSize: 10
      };
    },
    addFood() {
      this.visible = true;
    },
    modalClose() {
      this.visible = false;
    }
  }
};
</script>

<style scoped>
.modalTitle {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
</style>
