<template>
  <div style="padding:20px">
    <a-row>
      <a-Form style="margin-top: 10px;" :form="form" @submit="formSearch">
        <a-col :span="8">
          <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="用户名">
            <a-input placeholder="请输入" v-decorator="[
                'userName' 
              ]"></a-input>
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item>
            <div>
              <a-button type="primary" html-type="submit">查询</a-button>
              <a-button @click="handleRest">重置</a-button>
              <a-button style="margin-left:20px" type="primary" @click="addUser">新增用户</a-button>
            </div>
          </a-form-item>
        </a-col>
      </a-Form>
    </a-row>

    <a-divider />
    <div class="content">
      <a-table
        :columns="columns"
        :dataSource="tableData"
        :pagination="pagination"
        @change="tableChange"
        bordered
      >
        <span slot="action" slot-scope="text,obj">
          <a @click="update(obj)">修改</a>
          <a-divider type="vertical" />
          <a @click="deleteUser(obj)">删除</a>
        </span>
      </a-table>
    </div>
    <a-modal :title="modalTitle" v-model="visible" :destroyOnClose="true">
      <span slot="footer">
        <a-button type="primary" @click="modalCancel">关闭</a-button>
        <a-button type="primary" @click="modalOk">确定</a-button>
      </span>
      <a-Form style="width:100%" :form="form1">
        <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="用户名称">
          <a-input
            placeholder="请输入用户名称..."
            v-decorator="[
                'userName',
                {
                  initialValue:userInfo.userName,
                  rules: [{
                    required: true,
                    message: '请输入用户名称!'
                  }],
                }
              ]"
          />
        </a-form-item>
        <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="用户密码">
          <a-input-password
            placeholder="请输入用户密码..."
            v-decorator="[
                'passWord',
                {
                  initialValue:userInfo.passWord,
                  rules: [{
                    required: true,
                    message: '请输入用户密码!',
                  }],
                }
              ]"
          />
        </a-form-item>
      </a-Form>
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

// 提成明细
const columns = [
  {
    key: "order",
    dataIndex: "order",
    title: "序号",
    align: "center",
    scopedSlots: { customRender: "order" }
  },
  {
    key: "userName",
    title: "用户名",
    dataIndex: "userName",
    align: "center"
  },
  {
    key: "createAt",
    title: "创建时间",
    dataIndex: "createAt",
    align: "center"
  },
  {
    key: "updateAt",
    title: "修改时间",
    dataIndex: "updateAt",
    align: "center"
  },
  {
    key: "action",
    title: "操作",
    dataIndex: "action",
    scopedSlots: { customRender: "action" },
    align: "center",
    fixed: "right",
    width: 150
  }
];
export default {
  data() {
    return {
      form: this.$form.createForm(this),
      form1: this.$form.createForm(this),
      columns,
      pagination: {
        size: "small",
        current: 1,
        pageSize: 10,
        total: 0,
        showQuickJumper: true,
        showSizeChanger: true
      },
      modalTitle: "",
      tableData: [],
      userInfo: {}, //用户信息
      labelCol: {
        span: 8
      },
      wrapperCol: {
        span: 16
      },
      queryParams: {
        pageSize: 10,
        pageNum: 1
      }
    };
  },
  created() {},
  methods: {
    modalCancel() {
      this.visible = false;
      this.userInfo = {};
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
    handleRest(){
      this.form.resetFields()
      this.queryParams = {
        pageSize:10,
        pageNum:1
      }
    },
    modalOk() {
      this.form1.validateFields((err, values) => {
        if (!err) {
          if (this.userInfo.userName) {
            // 编辑
          } else {
            //新增
          }
        }
      });
    },
    addUser() {
      this.visible = true;
      this.modalTitle = "新增";
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

    deleteUser(obj) {
      let _this = this;
      this.$confirm({
        title: `确定删除 ${obj.userName} 吗?`,
        centered: true,
        okText: "确定",
        cancelText: "取消",
        onOk() {}
      });
    },

    update(obj) {
      this.visible = true;
      this.modalTitle = "编辑";
      this.userInfo = { ...obj };
    }
  }
};
</script>

<style scoped>
</style>>
