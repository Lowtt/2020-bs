<template>
  <!-- 配送人页面 -->
  <div style="width: 96%;margin: 0 auto">
    <a-row>
      <a-Form style="margin-top: 10px;" :form="form1" @submit="formSearch">
        <a-col :span="8">
          <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="配送人姓名">
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
              <a-button style="margin-left:20px" type="primary" @click="addPreson">新增人员</a-button>
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
        :rowKey="record=>record.id"
        size="small"
        :pagination="pagination"
        @change="tableChange"
      >
        <span
          slot="order"
          slot-scope="text, obj,index"
        >{{(queryParams.pageNum-1)*queryParams.pageSize+index+1}}</span>
        <span slot="opera" slot-scope="text,obj">
          <a @click="updateSendPerson(obj)">修改</a>
          <a-divider type="vertical" />
          <a @click="deleteSendPerson(obj)">删除</a>
        </span>
      </a-table>
    </a-row>
    <a-modal v-model="visible" :destroyOnClose="true">
      <p slot="title" class="modalTitle">
        <span>{{modalTitle}}</span>
        <span style="font-size:14px;margin-right:20px">操作时间:{{operaTime}}</span>
      </p>
      <span slot="footer">
        <a-button type="primary" @click="modalClose">关闭</a-button>
        <a-button type="primary" @click="modalOk">提交</a-button>
      </span>
      <div>
        <a-row>
          <a-col span="20">
            <a-Form style="width:100%" :form="form2">
              <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="配送人姓名">
                <a-input
                  placeholder="请输入配送人姓名..."
                  v-decorator="['name',
                {
                  initialValue:personInfo.name,
                  rules: [{
                    required: true,
                    message: '请输入配送人员姓名!'
                  }],
                }
              ]"
                />
              </a-form-item>
              <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="联系方式">
                <a-input-number
                  placeholder="请输入配送人手机号..."
                  style="width:100%"
                  v-decorator="[
                'tel',
                {
                  initialValue:personInfo.tel,
                  rules: [{
                    required: true,
                    message: '请输入配送人手机号!',
                  }],
                }
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
import {
  queryPersonByPage,
  createPerson,
  updatePerson,
  deletePerson
} from "../../axios/api";
import moment from "moment";
const columns = [
  {
    dataIndex: "order",
    title: "序号",
    align: "center",
    scopedSlots: { customRender: "order" }
  },
  {
    title: "配送人姓名",
    dataIndex: "name",
    align: "center"
  },
  {
    title: "联系方式",
    dataIndex: "tel",
    align: "center"
  },
  {
    title: "创建时间",
    dataIndex: "createAt",
    align: "center"
  },
  {
    title: "修改时间",
    dataIndex: "updateAt",
    align: "center"
  },
  {
    title: "操作",
    dataIndex: "opera",
    align: "center",
    scopedSlots: { customRender: "opera" }
  }
];

export default {
  data() {
    return {
      tableData: [], //表格数据
      operaTime: new Date().toLocaleString(), //弹出框右上角时间
      visible: false, //弹出框可见
      loading: false, //表格请求数据时loading状态
      modalTitle: "", //弹出框标题
      pagination: {
        //表格页码等配置
        size: "small", //尺寸
        current: 1, //当前页
        pageSize: 10, //每页数据条数
        total: 0, //总条数
        showQuickJumper: true, //允许快速跳至某一页
        showSizeChanger: true //允许修改当前页数
      },
      form1: this.$form.createForm(this), //创建表单1
      form2: this.$form.createForm(this), //创建表单2
      columns, //表格表头
      personInfo: {}, //被修改配送人的信息
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
  mounted() {
    this.queryInitData();
  },
  methods: {
    // 获取页面数据
    queryInitData() {
      this.loading = true;
      queryPersonByPage(this.queryParams).then(res => {
        if (res.code == 200) {
          res.data.data.map(item => {
            item.createAt = moment(item.createAt).format("YYYY-MM-DD HH:mm:ss");
            item.updateAt = moment(item.updateAt).format("YYYY-MM-DD HH:mm:ss");
          });
          this.tableData = res.data.data;
          this.pagination = {
            //配置翻页工具
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
    },

    /**
     * 删除配送人
     * @key obj:被删除人的信息
     */
    deleteSendPerson(obj) {
      let _this = this;
      this.$confirm({
        title: `确定删除 ${obj.name} 吗?`,
        centered: true,
        okText: "确定",
        cancelText: "取消",
        onOk() {
          //点击确定触发
          deletePerson({ id: obj.id }).then(res => {
            if (res.code == 200) {
              _this.$message.success("删除成功!");
              this.queryParams = { ...this.queryParams, pageNum: 1 };
              _this.queryInitData();
            } else {
              _this.$message.error(res.message);
            }
          });
        }
      });
    },
    // 表格搜索
    formSearch(e) {
      e.preventDefault(); //阻止默认事件,防止表单被清空
      this.form1.validateFields((err, values) => {
        if (!err) {
          this.queryParams = {
            ...this.queryParams,
            ...values
          };
          this.queryInitData();
        }
      });
    },
    // 页数改变时调用
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
    // 修改配送人员
    updateSendPerson(obj) {
      this.personInfo = obj;
      this.visible = true;
      this.modalTitle = "修改人员";
    },
    //弹出框确定
    modalOk(e) {
      e.preventDefault();
      this.form2.validateFields((err, values) => {
        if (!err) {
          if (this.personInfo.id) {
            //修改
            updatePerson({ ...values, id: this.personInfo.id }).then(res => {
              if (res.code == 200) {
                this.$message.success("修改成功!");
                this.visible = false;
                this.personInfo = {};
                this.queryInitData();
              } else {
                this.$message.error(res.message);
              }
            });
          } else {
            createPerson(values).then(res => {
              if (res.code == 200) {
                this.$message.success("新增成功!");
                this.visible = false;
                this.queryInitData();
              } else {
                this.$message.error(res.message);
              }
            });
          }
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
      this.queryInitData();
    },
    addPreson() {
      this.visible = true;
      this.modalTitle = "新增人员";
    },
    // 弹出框取消
    modalClose() {
      this.visible = false;
      this.personInfo = {};
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
