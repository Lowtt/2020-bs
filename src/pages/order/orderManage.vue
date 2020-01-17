<template>
  <div style="width: 96%;margin: 0 auto">
    <a-row class="content">
      <a-col :span="10" class="left-content" :style="{'min-height':contentHeight+'px !important' }">
        <a-tabs>
          <a-tab-pane tab="结账" key="1">
            <div style="padding-right:10px">
              <a-table :columns="columns" :dataSource="tableData" :pagination="pagination" bordered>
                <span slot="action" slot-scope="text, record">
                  <a @click="detail(record)">查看</a>
                </span>
              </a-table>
            </div>
          </a-tab-pane>
          <a-tab-pane tab="挂单" key="2">这是挂单的数据</a-tab-pane>
          <a-tab-pane tab="外卖" key="3">这是外卖的数据</a-tab-pane>
        </a-tabs>
      </a-col>
      <a-col :span="14" class="right-content" :style="{'min-height':contentHeight+'px !important' }">
        <a-row class="popular-content">
          <h2 :style="{'color':popularColor,'padding-top':'10px','margin':0}">
            <b>火 热 菜 品</b>
          </h2>
          <a-divider style="margin:3px 0" />
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

export default {
  data() {
    return {
      pagination: {
        size: "small",
        pageSize: 10,
        showQuickJumper: true,
        showSizeChanger: true,
        showTotal: () => `共1000条`
      },
      popularColor: "#000",
      columns,
      tableData: [],

      contentHeight: this.$store.getters.getHeight - 76
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

    detail(obj) {
      addScrollDetail({ id: obj.id }).then(res => {
        if (res.code == 0) {
          this.applyResult = res.data;
          this.applyFiles = res.data.paths.map((item, index) => {
            return {
              uid: `-${index}`,
              name: item,
              url: item
            };
          });
          this.visible = true;
          this.isApply = false;
        } else {
          this.$message.error(res.msg);
        }
      });
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
</style>
