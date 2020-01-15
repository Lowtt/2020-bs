<template>
  <div style="width: 96%;margin: 0 auto;margin-bottom: 60px">
    <h2>xx餐厅数据可视化</h2>
    <a-row
      style="display: flex;flex-direction: row;justify-content: space-between;text-align: left"
    >
      <a-col :span="7">
        <a-row
          type="flex"
          justify="center"
          align="middle"
          style="position: relative;oveflow:hidden;height: 300px;border: 1px solid rgb(235,235,235)"
        >
          <div id="bestPopular" style=" height: 300px;width: 500px;"></div>
        </a-row>
      </a-col>
      <a-col :span="7">
        <a-row
          type="flex"
          justify="center"
          align="middle"
          style="position: relative;height: 300px;border: 1px solid rgb(235,235,235)"
        >
          <div id="bGradeChart" style=" height: 300px;width: 100%"></div>
        </a-row>
      </a-col>
      <a-col :span="7">
        <a-row
          type="flex"
          justify="center"
          align="middle"
          style="position: relative;height: 300px;border: 1px solid rgb(235,235,235)"
        >
          <div id="aa" style=" height: 300px;width: 100%"></div>
        </a-row>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import { userInfo, userClass, userScroll, queryClass } from "../../axios/api";

export default {
  name: "home",
  data() {
    return {
      tableData: [],
      pagination: {
        size: "small",
        // current: 2,
        pageSize: 10,
        // total: 0,
        showQuickJumper: true,
        showSizeChanger: true
        // showTotal: () => `共1000条`
      },
      chooseClass: [],
      userInfo: {},
      userScrollData: {},
      userClassParams: {},
      teacherLevelRuleList: "",
      stateColor: ""
    };
  },
  created() {
    // this.getUserInfo();
    // this.getUserClass();
    // this.getUserScroll();
    // this.queryClass();
    // this.drawBestPopular();
  },
  mounted() {
    this.drawBestPopular();
  },
  methods: {
    drawBestPopular: function() {
      let myChart = this.$echarts.init(document.getElementById("bestPopular"));
      // 指定图表的配置项和数据
      let option = {
        title: {
          text: "一月内最受欢迎菜品",
          left: "center"
        },
        tooltip: {
          //提示框组件
          trigger: "item", //触发类型(饼状图片就是用这个)
          formatter: "{a} <br/>{b} : {c} ({d}%)" //提示框浮层内容格式器
        },
        legend: {
          orient: "vertical",
          left: "left",
          data: ["汉堡", "米饭", "可乐", "鸡腿"]
        },
        series: [
          //系列列表
          {
            name: "最受欢迎菜品", //系列名称
            type: "pie", //类型 pie表示饼图
            center: ["50%", "50%"], //设置饼的原心坐标 不设置就会默认在中心的位置
            radius: [0, "68%"], //饼图的半径,第一项是内半径,第二项是外半径,内半径为0就是真的饼,不是环形
            itemStyle: {
              //图形样式
              // normal: {
              //   //normal 是图形在默认状态下的样式；emphasis 是图形在高亮状态下的样式，比如在鼠标悬浮或者图例联动高亮时。
              //   label: {
              //     //饼图图形上的文本标签
              //     show: false //平常不显示
              //   },
              //   labelLine: {
              //     //标签的视觉引导线样式
              //     show: false //平常不显示
              //   }
              // },
              emphasis: {
                //normal 是图形在默认状态下的样式；emphasis 是图形在高亮状态下的样式，比如在鼠标悬浮或者图例联动高亮时。
                label: {
                  //饼图图形上的文本标签
                  // show: false,
                  position: "center",
                  textStyle: {
                    fontSize: "10",
                    fontWeight: "bold"
                  }
                }
              }
            },
            data: [
              { name: "汉堡", value: 20 },
              { name: "米饭", value: 30 },
              { name: "可乐", value: 10 },
              { name: "鸡腿", value: 40 }
            ]
          }
        ]
      };
      // option.color[0] = colorArr[1];
      // option.color[1] = colorArr[3];
      myChart.setOption(option);
    },
    drawB: function(pointsDeducted) {
      let myChart = this.$echarts.init(document.getElementById("bGradeChart"));
      let option = {
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b}: {c} ({d}%)"
          /*formatter:function(val){   //让series 中的文字进行换行
                 console.log(val);//查看val属性，可根据里边属性自定义内容
                 var content = var['name'];
                 return content;//返回可以含有html中标签
             },*/ //自定义鼠标悬浮交互信息提示，鼠标放在饼状图上时触发事件
        }, //提示框，鼠标悬浮交互时的信息提示
        legend: {
          show: true,
          orient: "vertical",
          right: "0",
          bottom: "0"
          // data: ["50%-学生", "25%-老师", "25%-家长"]
        }, //图例属性，以饼状图为例，用来说明饼状图每个扇区，data与下边series中data相匹配
        series: [
          {
            name: "用户统计", //tooltip提示框中显示内容
            type: "pie", //图形类型，如饼状图，柱状图等
            // center: ["50%", "50%"], //设置饼的原心坐标 不设置就会默认在中心的位置
            radius: ["0", "50%"], //饼图的半径，数组的第一项是内半径，第二项是外半径。支持百分比，本例设置成环形图。具体可以看文档或改变其值试一试
            //roseType:'area',是否显示成南丁格尔图，默认false
            center: ["40%", "50%"],
            itemStyle: {
              normal: {
                label: {
                  show: true,
                  textStyle: { color: "#3c4858", fontSize: "14" },
                  formatter: function(val) {
                    //让series 中的文字进行换行
                    return val.name.split("-").join("\n");
                  }
                }, //饼图图形上的文本标签，可用于说明图形的一些数据信息，比如值，名称等。可以与itemStyle属性同级，具体看文档
                labelLine: {
                  show: true,
                  lineStyle: { color: "#3c4858" }
                } //线条颜色
              }, //基本样式
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)", //鼠标放在区域边框颜色
                textColor: "#000"
              } //鼠标放在各个区域的样式
            },
            data: pointsDeducted //数据，数据中其他属性，查阅文档
            // color: ["#51CEC6", "#FFB703", "#5FA0FA"] //各个区域颜色
          } //数组中一个{}元素，一个图，以此可以做出环形图
        ] //系列列表
      };

      myChart.setOption(option);
    },
    toRecord(val) {
      if (val === "add") {
        this.$router.push("/grade/incRecord");
      } else if (val === "change") {
        this.$router.push("/grade/incRecord?type=change");
      } else {
        this.$router.push("/grade/decRecord");
      }
    },
    getUserInfo() {
      userInfo({}).then(res => {
        if (res.code == 0) {
          this.userInfo = res.data;
          // teacherLevelRuleList
          res.data.teacherLevelRuleList.map(res => {
            this.teacherLevelRuleList +=
              res.classTypeName + ":" + res.royalty + "%" + "    ";
          });
          // console.log(this.teacherLevelRuleList)
        }
      });
    },
    getUserClass() {
      userClass(this.userClassParams).then(res => {
        if (res.code == 0) {
          this.tableData = res.data.list;
        }
      });
    },
    classChange(val) {
      this.userClassParams = {
        ...this.userClassParams,
        obj: { ...this.userClassParams.obj, classId: val }
      };
      this.getUserClass();
    },
    queryClass() {
      queryClass({}).then(res => {
        if (res.code == 0) {
          this.chooseClass = res.data;
        }
      });
    },
    getUserScroll() {
      userScroll({}).then(res => {
        if (res.code == 0) {
          this.userScrollData = res.data;
          let data = res.data;
          let percentage = data.percentage;
          let endIndex =
            data.integralCordonList[data.integralCordonList.length - 1]
              .endIndex;
          let arr = [
            {
              value: data.pointsDeducted,
              name: data.integralCordon.name,
              itemStyle: { color: data.integralCordon.color }
            },
            {
              value: endIndex - data.pointsDeducted,
              name: "剩余可扣绩分",
              itemStyle: { color: "#42b983" }
            }
          ];
          data.arr = arr;
          let tageArr = [];
          let colorList = [
            "#2DB7F5",
            "#808BC6",
            "#7EC856",
            "#5D6977",
            "#F9BF00",
            "#3ABBB3",
            "#39ADD1",
            "#348FD6"
          ];
          percentage.map((item, index) => {
            let obj = {
              value: item.total,
              name: item.staticTemplateName + "  " + item.percentage,
              itemStyle: { color: colorList[index] }
            };
            tageArr.push(obj);
          });
          this.drawBestPopular(data);
          this.drawB(tageArr);
        }
      });
    },
    studentEnrollment(val) {
      this.userClassParams.isMaxCount = val;
      this.getUserClass();
    },
    dailyDetail() {
      this.$router.push("/index/dailyDetail");
    },
    personalRanke() {
      this.$router.push("/index/personalRanke");
    },
    departmentRanke() {
      this.$router.push("/index/departmentRanke");
    },
    classDetail() {
      this.$router.push("/teaching/myclass");
    }
  }
};
</script>

<style scoped lang="scss">
.msgIcon:hover {
  cursor: pointer;
}
.studentNum {
  display: flex;
  justify-content: center;
}

.icon {
  border: 1px solid #ccc;
  margin: 0 auto;
  overflow: hidden;
  border-radius: 10px;
  height: 20px;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  width: 130px;
}

.tips {
  color: #00cc00;
}
</style>
