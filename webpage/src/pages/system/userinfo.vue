<template>
<!-- 用户信息界面 -->
  <div style="width: 96%;margin: 0 auto">
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
      :loading='loading'
        :columns="columns"
        :dataSource="tableData"
        :pagination="pagination"
        @change="tableChange"
        :rowKey="record=>record.id"
        size="small"
        bordered
      >
        <span
          slot="order"
          slot-scope="text,obj,index"
        >{{(queryParams.pageNum-1)*queryParams.pageSize+index+1}}</span>

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
                  initialValue:userInfo.username,
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
                  initialValue:userInfo.password,
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
import { queryUser, deleteUser, createUser, updateUser } from "../../axios/api";
import moment from "moment";
const columns = [
  {
    key: "order",
    dataIndex: "order",
    title: "序号",
    align: "center",
    scopedSlots: { customRender: "order" }
  },
  {
    key: "username",
    title: "用户名",
    dataIndex: "username",
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
      loading:false,//加载数据时表格Loading
      visible: false,//弹出框是否可见
      modalTitle: "",//弹出框标题
      tableData: [],//表格信息
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
  created() {
    this.queryInitData();
  },
  methods: {
    // 获取页面数据
    queryInitData() {
      this.loading = true
      queryUser(this.queryParams).then(res => {
        if (res.code == 200) {
          res.data.data.map(item => {
            item.createAt = moment(item.createAt).format("YYYY-MM-DD HH:mm:ss");
            item.updateAt = moment(item.updateAt).format("YYYY-MM-DD HH:mm:ss");
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
        this.loading = false
      });
    },
    /**
     * 创建用户
     * @key value:创建的用户信息
     */
    createUser(value) {
      createUser(value).then(res => {
        if (res.code == 200) {
          this.$message.success("新增成功!");
          this.visible = false;
          this.userInfo = {};
          this.queryInitData();
        } else {
          this.$message.error(res.message);
        }
      });
    },
    modalCancel() {
      this.visible = false;
      this.userInfo = {};
    },
    /**
     * 表格改变
     * @key pag:改变的信息
     */
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
    //重置
    handleRest() {
      this.form.resetFields();
      this.queryParams = {
        pageSize: 10,
        pageNum: 1
      };
      this.queryInitData();
    },
    // 弹出框确定
    modalOk() {
      this.form1.validateFields((err, values) => {
        if (!err) {
          if (this.userInfo.username) {
            //如果用户信息存在,则代表是修改
            this.updateUser(values);
          } else {
            //用户信息不存在,新增
            this.createUser(values);
          }
        }
      });
    },
    /**
     * 修改用户
     * @key obj:用户修改的基本信息
     */
    updateUser(values) {
      updateUser({ id: this.userInfo.id, ...values }).then(res => {
        if (res.code == 200) {
          this.$message.success("修改成功!");
          this.userInfo = {};
          this.visible = false;
          this.queryInitData();
        } else {
          this.$message.error(res.message);
        }
      });
    },
    addUser() {
      this.visible = true;
      this.modalTitle = "新增";
    },
// 表单搜索
    formSearch(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          this.queryParams = {
            ...this.queryParams,
            ...values
          };
          this.queryInitData();
        }
      });
    },
    /**
     * 删除用户
     * @key obj:被删除人的信息
     */
    deleteUser(obj) {
      let _this = this;
      this.$confirm({
        title: `确定删除 ${obj.username} 吗?`,
        centered: true,
        okText: "确定",
        cancelText: "取消",
        onOk() {
          deleteUser({ id: obj.id }).then(res => {
            if (res.code == 200) {
              _this.$message.success("删除成功!");
              _this.queryInitData();
            } else {
              _this.$message.error(res.message);
            }
          });
        }
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
