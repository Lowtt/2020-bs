<template>
  <!-- 新增食品页面 -->
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
        <span slot="typeName" slot-scope="text">{{foodType[text].name}}</span>
        <span slot="url" slot-scope="text">
          <img :src="text" width="24" height="24" style="cursor:pointer" @click="checkImg(text)" />
        </span>
        <span slot="action" slot-scope="text,obj">
          <a @click="update(obj)">修改</a>
          <a-divider type="vertical" />
          <a @click="deleteFood(obj)">删除</a>
        </span>
      </a-table>
    </a-row>
    <a-modal v-model="visible" :destroyOnClose="true" @cancel="modalClose">
      <p slot="title" class="modalTitle">
        <span>{{modalTitle}}</span>
        <span style="font-size:14px;margin-right:20px">操作时间:{{applyTime}}</span>
      </p>
      <span slot="footer">
        <a-button type="primary" @click="modalClose">关闭</a-button>
        <a-button v-if="!viewImg" type="primary" @click="modalOk">提交</a-button>
      </span>
      <div>
        <a-row v-if="viewImg">
          <img :src="src" alt="地址错误,加载失败!" width="100%" height="100%" />
        </a-row>
        <a-row v-else>
          <a-col span="20">
            <a-Form style="width:100%" :form="form2">
              <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="菜品名称">
                <a-input
                  placeholder="请输入菜品名称..."
                  v-decorator="['name',
                {
                  initialValue:foodInfo.name,
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
                  v-decorator="['price',
                {
                  initialValue:foodInfo.price,
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
                  v-decorator="['type',{initialValue:foodInfo.type,rules: [{
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
                  v-decorator="['url',{initialValue:foodInfo.url}]"
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
  queryFoodsByPage,
  createFood,
  deleteFood,
  updateFood
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
      tableData: [],
      applyTime: new Date().toLocaleString(),
      src: "", //查看图片的地址
      viewImg: false, //判断是查看图片还是修改/添加菜品
      foodType: [
        //食品种类
        { name: "主食", key: 0 },
        { name: "小食", key: 1 },
        { name: "饮料", key: 2 },
        { name: "套餐", key: 3 }
      ],
      modalTitle: "", //弹出框标题
      visible: false,
      loading: false,
      foodInfo: {}, //菜品单个信息,用于修改菜品回显
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
  mounted() {
    this.queryInitData();
  },
  methods: {
    checkImg(src) {
      this.viewImg = true;
      this.visible = true;
      this.src = src;
      this.modalTitle = "查看图片";
    },
    update(obj) {
      this.visible = true;
      this.modalTitle = "编辑菜品";
      this.foodInfo = obj;
    },
    // 获取页面数据
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
    },
    // 表格搜索框调用
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
    deleteFood(obj) {
      let _this = this;
      this.$confirm({
        title: `确定删除菜品 ${obj.name} 吗?`,
        centered: true,
        okText: "确定",
        cancelText: "取消",
        onOk() {
          deleteFood({ id: obj.id }).then(res => {
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
    // 表格页码,条数改动时触发
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
    // 新增/修改菜品确定时调用
    modalOk(e) {
      e.preventDefault();
      this.form2.validateFields((err, values) => {
        if (!err) {
          if (this.foodInfo.id) {
            updateFood({ ...values, id: this.foodInfo.id }).then(res => {
              if (res.code == 200) {
                this.$message.success("修改成功!");
                this.visible = false;
                this.foodInfo = {};
                this.queryInitData();
              } else {
                this.$message.error(res.message);
              }
            });
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
    addFood() {
      this.visible = true;
      this.modalTitle = "新增菜品";
    },
    modalClose() {
      this.visible = false;
      this.viewImg = false;
      this.foodInfo = {};
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
