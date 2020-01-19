<template>
  <div style="width: 96%;margin: 0 auto">
    <a-row class="content">
      <a-col :span="10" class="left-content" :style="{'min-height':contentHeight+'px !important' }">
        <a-tabs>
          <a-tab-pane tab="结账" key="1">
            <div style="padding-right:10px">
              <a-table
                :columns="columns"
                :rowKey="record => record.name"
                :dataSource="tableData"
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
            </div>
          </a-tab-pane>
          <a-tab-pane tab="外卖" key="2">
            <div style="padding-right:10px">
              <a-table
                :columns="takeOutColumns"
                :rowKey="record => record.name"
                :dataSource="takeOutData"
                :pagination="false"
                bordered
              >
                <span slot="action" slot-scope="text, record,index">
                  <a @click="sendFood(record,index)">配送</a>
                  <a-divider type="vertical" />
                  <a @click="takeOutDetail(record)">详情</a>
                  <a-divider type="vertical" />
                  <a @click="deleteTakeOut(index)">删除</a>
                </span>
              </a-table>
              <a-modal
                v-model="visible"
                title="外卖详情"
                oncancel="handleCancel"
                centered
                destroyOnClose
              >
                <template slot="footer">
                  <a-button key="back" type="primary" @click="handleCancel">返回</a-button>
                </template>
                <a-table
                  :columns="takeOutDetailColumns"
                  :rowKey="record => record.name"
                  :dataSource="takeOutData"
                  :pagination="false"
                  bordered
                ></a-table>
              </a-modal>
            </div>
          </a-tab-pane>
        </a-tabs>
      </a-col>
      <a-col
        :span="14"
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
              v-for="item in hotFood"
              :key="item.name"
              @click="orderFood(item)"
            >
              <a-row>
                <a-col :span="10" style="height:68px">
                  <img :src="item.url" width="100%" height="100%" />
                </a-col>
                <a-col :span="14" style="height:68px">
                  <p class="footInfo">{{item.name}}</p>
                  <p class="footInfo">￥{{item.price}}</p>
                </a-col>
              </a-row>
            </div>
          </div>
        </a-row>
        <a-divider style="margin:3px 0" />
        <a-row>
          <a-tabs>
            <a-tab-pane tab="主食" key="mainFood">这是主食的数据</a-tab-pane>
            <a-tab-pane tab="小食" key="sideFood">这是小食的数据</a-tab-pane>
            <a-tab-pane tab="饮料" key="drink">这是饮料的数据</a-tab-pane>
            <a-tab-pane tab="套餐" key="combo">这是套餐的数据</a-tab-pane>
          </a-tabs>
        </a-row>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import { addScrollDetail } from "../../axios/api";
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
    dataIndex: "name",
    title: "商品名称",
    align: "center"
  },
  {
    title: "总价(元)",
    dataIndex: "price",
    align: "center"
  },
  {
    title: "创建时间",
    dataIndex: "createAt",
    align: "center"
  },

  {
    title: "操作",
    scopedSlots: { customRender: "action" },
    align: "center"
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
  },

  
];

export default {
  data() {
    return {
      popularColor: "#000",
      columns,
      takeOutColumns,
      takeOutDetailColumns,
      visible: false,
      tableData: [],
      takeOutData: [],
      contentHeight: this.$store.getters.getHeight - 76,
      hotFood: [
        {
          url: "http://img.91jm.com/2017/07/CB6i1L55920Q.png",
          name: "汉堡",
          price: 12
        },
        {
          url:
            "http://jilin.sinaimg.cn/2013/0622/U8830P1387DT20130622195010.png",
          name: "可乐",
          price: 8
        },
        {
          url: "http://img4.jiameng.com/2017/09/N0K85VaZ93q6.jpg",
          name: "鸡腿",
          price: 10
        },
        {
          url:
            "http://pic83.nipic.com/file/20151124/22029572_112739511000_2.jpg",
          name: "牛肉盖浇",
          price: 22
        }
      ]
    };
  },
  created() {
    this.setPopularColor();
  },
  mounted() {
    let type = this.$route.query.type;
    if (type === "change") {
      this.isApply = true;
      this.visible = true;
    }
  },
  methods: {
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
    //外卖详情
    takeOutDetail(obj) {
      this.visible = true;
    },
    handleCancel() {
      this.visible = false;
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
      this.$message.success(`结账成功,收入${total}元!`);
      this.tableData.length = 0;
    },
    // 外卖触发
    takeOut() {
      this.takeOutData = this.tableData.concat();
      this.tableData.length = 0;
      this.$message.success("操作成功,请在外卖栏进行配送!");
    },
    // 删除触发
    deleteAllFood() {
      this.tableData.length = 0;
      this.$message.success("删除成功!");
    },
    // 点餐触发
    orderFood(footInfo) {
      let isNew = true;
      let order = 0;
      footInfo.num = 1;
      this.tableData.map((item, index) => {
        if (footInfo.name == item.name) {
          isNew = false;
          order = index;
        }
      });
      if (isNew) {
        this.tableData.push(footInfo);
      } else {
        this.tableData[order] = {
          ...this.tableData[order],
          num: this.tableData[order].num + 1
        };
      }
    },
    addFood(index) {
      this.tableData[index] = {
        ...this.tableData[index],
        num: this.tableData[index].num + 1
      };
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
.hot-food-area {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  margin-top: 20px;
}
.hot-food-single {
  width: 140px;
  height: 70px;
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
