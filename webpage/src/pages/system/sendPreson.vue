<template>
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
          <a-button type="primary" @click="updatePreson(obj)">修改</a-button>
          <a-button type="primary" @click="deletePreson(obj)">删除</a-button>
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
import { queryFoodsByPage, createFood } from "../../axios/api";
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
    dataIndex: "updateAt",
    align: "center",
    scopedSlots: { customRender: "opera" }
  }
];

export default {
  data() {
    return {
      tableData: [],
      operaTime: new Date().toLocaleString(),
      visible: false,
      loading: false,
      modalTitle: "",
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
      personInfo: {},
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
    queryInitData() {
      this.loading = true;
      queryFoodsByPage(this.queryParams).then(res => {
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
        this.loading = false;
      });
    },
    formSearch(e) {
      e.preventDefault();
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
    updatePreson(obj) {
      this.personInfo = obj;
      this.visible = true;
      this.modalTitle = "修改人员";
    },
    modalOk(e) {
      e.preventDefault();
      this.form2.validateFields((err, values) => {
        if (!err) {
          if (this.personInfo.id) {
            //修改
          } else {
            createFood(values).then(res => {
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
