<template>
  <div style="width: 96%;margin: 0 auto">
    <a-row class="content">
      <a-col :span="12" class="left-content" :style="{'min-height':contentHeight+'px !important' }">
        <a-tabs @change="leftTableChange">
          <a-tab-pane tab="结账" key="1">
            <div style="padding-right:10px">
              <a-table
                :columns="columns"
                :rowKey="record => record.name"
                :dataSource="tableData"
                size="small"
                :pagination="false"
                bordered
              >
                <span slot="action" slot-scope="text, record,index">
                  <a @click="addFood(index)">增加</a>
                  <a-divider type="vertical" />
                  <a @click="deleteFood(index)">删除</a>
                </span>
              </a-table>
              <div class="operaInfo" v-if="tableData.length">
                <a-button type="primary" @click="opera('结账')">结账</a-button>
                <a-button type="dashed" @click="opera('外卖')">外卖</a-button>
                <a-button type="danger" @click="opera('删除')">删除</a-button>
              </div>
              <a-modal
                v-model="sendVisible"
                title="配送人员"
                @cancel="sendCancel"
                @ok="sendOk"
                centered
                destroyOnClose
                style="text-align:center"
              >
                <a-select
                  v-model="sendId"
                  showSearch
                  optionFilterProp="children"
                  :filterOption="filterSendOption"
                  style="width:80%"
                >
                  <a-select-option
                    v-for="item in sendPerson"
                    :key="item.id"
                    :value="item.id"
                  >{{item.name}}</a-select-option>
                </a-select>
              </a-modal>
            </div>
          </a-tab-pane>
          <a-tab-pane tab="外卖" key="2">
            <div style="padding-right:10px">
              <a-table
                :columns="takeOutColumns"
                :rowKey="record => record.name"
                :dataSource="takeOutData"
                size="small"
                :loading="takeOutLoading"
                :pagination="false"
                bordered
              >
                <span slot="action" slot-scope="text, record">
                  <a @click="sendFood(record.id)">配送</a>
                  <a-divider type="vertical" />
                  <a @click="takeOutDetail(record.id)">详情</a>
                  <a-divider type="vertical" />
                  <a @click="deleteTakeOut(record.id)">删除</a>
                </span>
              </a-table>
              <a-modal
                v-model="visible"
                title="外卖详情"
                @cancel="handleCancel"
                centered
                destroyOnClose
              >
                <template slot="footer">
                  <a-button key="back" type="primary" @click="handleCancel">返回</a-button>
                </template>
                <a-table
                  :columns="takeOutDetailColumns"
                  :rowKey="record => record.name"
                  :dataSource="detailOutData"
                  :pagination="false"
                  :loading="detailLoading"
                  size="small"
                  bordered
                ></a-table>
              </a-modal>
            </div>
          </a-tab-pane>
        </a-tabs>
      </a-col>
      <a-col
        :span="12"
        class="right-content"
        :style="{'min-height':contentHeight+'px !important' }"
      >
        <a-row class="popular-content">
          <h2 :style="{'color':popularColor,'padding-top':'10px','margin':0}">
            <b>火 热 菜 品</b>
          </h2>
          <a-divider style="margin:3px 0" />
          <div class="hot-food-area">
            <div
              class="hot-food-single"
              v-for="item in hotFoods"
              :key="item.name"
              @click="orderFood(item)"
            >
              <a-row>
                <a-col :span="10" style="height:73px">
                  <img :src="item.url" width="100%" height="100%" />
                </a-col>
                <a-col :span="14" style="height:73px;padding:15px">
                  <p class="footInfo">{{item.name}}</p>
                  <p class="footInfo" style="color:red">￥{{item.price}}</p>
                </a-col>
              </a-row>
            </div>
          </div>
        </a-row>
        <a-divider style="margin:3px 0" />
        <a-row>
          <a-tabs @change="rightTabChange" defaultActiveKey="0">
            <a-tab-pane v-for="item in foodType" :tab="item.name" :key="item.key+''">
              <div class="type-food-area">
                <div
                  class="type-food-single"
                  v-for="item in tabFoods"
                  :key="item.name"
                  @click="orderFood(item)"
                >
                  <a-row>
                    <a-col :span="10" style="height:73px">
                      <img :src="item.url" width="100%" height="100%" />
                    </a-col>
                    <a-col :span="14" style="height:73px;padding:15px">
                      <p class="footInfo">{{item.name}}</p>
                      <p class="footInfo" style="color:red">￥{{item.price}}</p>
                    </a-col>
                  </a-row>
                </div>
              </div>
            </a-tab-pane>
          </a-tabs>
        </a-row>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import {
  queryHotFoods,
  queryFoodType,
  querySendPerson,
  createTakeWay,
  queryTakeWay,
  deleteTakeWay,
  takeWayDetail,
  takeWaySend,
  createOrder
} from "../../axios/api";
import moment from "moment";
const columns = [
  {
    dataIndex: "name",
    title: "商品名称",
    align: "center"
  },
  {
    title: "单价",
    dataIndex: "price",
    align: "center"
  },
  {
    title: "数量",
    dataIndex: "num",
    align: "center"
  },

  {
    title: "操作",
    scopedSlots: { customRender: "action" },
    align: "center"
  }
];
const takeOutColumns = [
  {
    title: "创建时间",
    dataIndex: "createAt",
    align: "center"
  },
  {
    title: "总价(元)",
    dataIndex: "price",
    align: "center"
  },
  {
    dataIndex: "sendName",
    title: "配送人员",
    align: "center"
  },
  {
    dataIndex: "tel",
    title: "联系电话",
    align: "center"
  },
  {
    title: "操作",
    scopedSlots: { customRender: "action" },
    align: "center",
    width: 160
  }
];
const takeOutDetailColumns = [
  {
    dataIndex: "name",
    title: "商品名称",
    align: "center"
  },
  {
    title: "单价",
    dataIndex: "price",
    align: "center"
  },
  {
    title: "数量",
    dataIndex: "num",
    align: "center"
  }
];
export default {
  data() {
    return {
      popularColor: "#000",
      columns,
      takeOutColumns,
      takeOutDetailColumns,
      detailLoading: false,
      visible: false,
      sendVisible: false,
      takeOutLoading: false, //外卖表格loading
      sendId: null, //配送人员id
      foodType: [
        //食品种类
        { name: "主食", key: 0 },
        { name: "小食", key: 1 },
        { name: "饮料", key: 2 },
        { name: "套餐", key: 3 }
      ],
      tableData: [], //点击的菜品数据
      takeOutData: [], //外卖订单
      detailOutData: [], //外卖详情数据
      contentHeight: this.$store.getters.getHeight - 76,
      hotFoods: [], //火热菜品
      tabFoods: [], //分类菜品
      sendPerson: [] //配送人员
    };
  },
  created() {
    this.setPopularColor();
    this.queryHotFoods();
    this.queryFoods(0); //初始化查找主食数据
    this.querySendPerson();
  },
  mounted() {},
  methods: {
    filterSendOption(input, option) {
      return (
        option.componentOptions.children[0].text
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
      );
    },
    sendCancel: function() {
      this.sendVisible = false;
      this.sendId = this.sendPerson[0].id;
    },
    // 生成外卖订单
    sendOk: function() {
      let price = 0;
      this.tableData.map(item => {
        price += item.num * item.price;
      });
      let obj = {
        sendId: this.sendId,
        price: price,
        takewayInfo: this.tableData.concat()
      };
      createTakeWay(obj).then(res => {
        if (res.code == 200) {
          this.sendVisible = false;
          this.tableData = [];
          this.sendId = this.sendPerson[0].id;
          this.$message.success("外卖订单生成成功,请前往外卖栏配送!");
        } else {
          this.$message.error("外卖订单生成失败" + res.message);
        }
      });
    },
    // 查询所有外卖订单
    queryAllTakeOut: function() {
      this.takeOutLoading = true;
      queryTakeWay({}).then(res => {
        if (res.code == 200) {
          res.data.map(item => {
            item.createAt = moment(item.createAt).format("YYYY-MM-DD HH:mm:ss");
          });
          this.takeOutData = res.data;
          this.takeOutLoading = false;
        } else {
          this.$message.error("外卖订单查询失败" + res.message);
        }
      });
    },
    //查询配送人员
    querySendPerson: function() {
      querySendPerson({}).then(res => {
        if (res.code == 200) {
          this.sendPerson = res.data;
          this.sendId = res.data.length && res.data[0].id;
        }
      });
    },
    // 设置火热菜品颜色
    setPopularColor: function() {
      setInterval(() => {
        this.popularColor =
          "#" +
          Math.floor(Math.random() * 0xffffff)
            .toString(16)
            .padEnd(6, "0");
      }, 1000);
    },
    //查询火热菜品
    queryHotFoods: function() {
      queryHotFoods({}).then(res => {
        if (res.code == 200) {
          this.hotFoods = res.data;
        } else {
          this.$message.error(res.message);
        }
      });
    },
    //分类查询菜品
    queryFoods: function(type) {
      queryFoodType({ type: type }).then(res => {
        if (res.code == 200) {
          this.tabFoods = res.data;
        } else {
          this.$message.error(res.message);
        }
      });
    },
    sendFood(id) {
      //外卖配送
      let _this = this;
      this.$confirm({
        title: `确定要配送该订单吗?`,
        centered: true,
        okText: "确定",
        cancelText: "取消",
        onOk() {
          takeWaySend({ id: id }).then(res => {
            if (res.code == 200) {
              _this.$message.success("配送成功!");
              _this.queryAllTakeOut();
            } else {
              _this.$message.error(res.message);
            }
          });
        }
      });
    },
    deleteTakeOut(id) {
      //外卖删除
      let _this = this;
      this.$confirm({
        title: `确定要删除该订单吗?`,
        centered: true,
        okText: "确定",
        cancelText: "取消",
        onOk() {
          deleteTakeWay({ id: id }).then(res => {
            if (res.code == 200) {
              _this.$message.success("删除成功!");
              _this.queryAllTakeOut();
            } else {
              _this.$message.error(res.message);
            }
          });
        }
      });
    },
    //菜品分类切换
    rightTabChange(type) {
      this.queryFoods(type);
    },
    leftTableChange(key) {
      // key==2及跳至外卖页面
      if (key == 2) {
        this.queryAllTakeOut();
      }
    },
    //外卖详情
    takeOutDetail(id) {
      this.visible = true;
      this.queryOutDetail(id);
    },
    handleCancel() {
      this.visible = false;
    },
    queryOutDetail(id) {
      this.detailLoading = true;
      takeWayDetail({ id: id }).then(res => {
        if (res.code == 200) {
          this.detailOutData = res.data;
          this.detailLoading = false;
        } else {
          this.$message.error(res.message);
        }
      });
    },
    // 结账,外卖,删除操作
    opera(operaContent) {
      let _this = this;
      this.$confirm({
        title: `确定进行${operaContent}操作吗?`,
        centered: true,
        okText: "确定",
        cancelText: "取消",
        onOk() {
          if (operaContent == "结账") {
            _this.checkOut();
          } else if (operaContent == "外卖") {
            _this.takeOut();
          } else {
            _this.deleteAllFood();
          }
        }
      });
    },
    // 结账触发
    checkOut() {
      let total = 0;
      this.tableData.map(item => {
        total += item.num * item.price;
      });
      let obj = {
        price: total,
        orderInfo: this.tableData
      };
      createOrder(obj).then(res => {
        if (res.code == 200) {
          this.$message.success(`结账成功,收入${total}元!`);
          this.tableData.length = 0;
        } else {
          this.$message.error(res.message);
        }
      });
    },
    // 外卖触发
    takeOut() {
      this.sendVisible = true;
    },
    // 删除触发
    deleteAllFood() {
      this.tableData.length = 0;
      this.$message.success("删除成功!");
    },
    // 点餐触发
    orderFood(footInfo) {
      let length = this.tableData.length;
      for (let i = 0; i < length; i++) {
        if (footInfo.id == this.tableData[i].id) {
          this.tableData[i].num += 1;
          return;
        }
      }
      footInfo.num = 1;
      this.tableData.push(footInfo);
    },
    addFood(index) {
      this.tableData[index].num += 1;
    },
    deleteFood(index) {
      if (this.tableData[index].num > 1) {
        this.tableData[index] = {
          ...this.tableData[index],
          num: this.tableData[index].num - 1
        };
      } else {
        this.tableData.splice(index, 1);
      }
    }
  }
};
</script>

<style scoped>
.left-content,
.right-content {
  border-right: 1px solid #ccc;
  box-sizing: border-box;
}
.popular-content {
  height: 400px;
}
.hot-food-area,
.type-food-area {
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  margin-top: 20px;
}
.type-food-area {
  margin: 0;
}
.hot-food-single,
.type-food-single {
  width: 150px;
  height: 75px;
  margin: 0 0 20px 20px;
  cursor: pointer;
  border: 1px dashed lightblue;
  box-sizing: border-box;
}
.footInfo {
  margin: 0;
}
.operaInfo {
  display: flex;
  justify-content: space-around;
  margin-top: 20px;
}
</style>
