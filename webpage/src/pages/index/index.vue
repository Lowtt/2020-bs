<template>
  <div style="width: 96%;margin: 0 auto;margin-bottom: 60px">
    <h2>xx餐厅数据可视化</h2>
    <a-row
      style="display: flex;flex-direction: row;justify-content: space-between;margin:50px auto"
    >
      <a-col :span="11">
        <a-row type="flex" justify="center" align="middle" class="chart-display">
          <div id="bestPopular" style=" height: 300px;width: 500px;"></div>
        </a-row>
      </a-col>
      <a-col :span="11">
        <a-row type="flex" justify="center" align="middle" class="chart-display">
          <div id="foodCalssify" style=" height: 300px;width: 500px"></div>
        </a-row>
      </a-col>
    </a-row>
    <a-row
      style="display: flex;flex-direction: row;justify-content: space-between;margin:50px auto"
    >
      <a-col :span="11">
        <a-row type="flex" justify="center" align="middle" class="chart-display">
          <div id="orderNumber" style=" height: 300px;width: 500px;"></div>
        </a-row>
      </a-col>
      <a-col :span="11">
        <a-row type="flex" justify="center" align="middle" class="chart-display">
          <div id="incomeMoney" style=" height: 300px;width: 500px"></div>
        </a-row>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import { queryClass } from "../../axios/api";
import moment from "moment";
export default {
  name: "index",
  data() {
    return {};
  },
  created() {},
  mounted() {
    this.drawBestPopular();
    this.setOrderNumber();
    this.setFoodClassify();
    this.setIncomeMoney();
  },
  methods: {
    // 最受欢迎菜品
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
          top: 25,
          data: ["汉堡", "米饭", "可乐", "鸡腿"]
        },
        // grid: {
        //   top: 'middle'
        // },
        series: [
          //系列列表
          {
            name: "最受欢迎菜品", //系列名称
            type: "pie", //类型 pie表示饼图
            center: ["50%", "50%"], //设置饼的原心坐标 不设置就会默认在中心的位置
            radius: [0, "68%"], //饼图的半径,第一项是内半径,第二项是外半径,内半径为0就是真的饼,不是环形
            itemStyle: {
              emphasis: {
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
      myChart.setOption(option);
    },
    // 生成每个时间段订单数
    setOrderNumber: function() {
      let arr = [];
      for (let i = 0; i < 24; i++) {
        if (i < 10) {
          i = "0" + i;
        }
        arr.push(`${i}:00`);
      }
      let obj = {
        title: "当天每小时订单数",
        tooltipName: "(单)",
        legendData: [],
        xData: {
          name: "时间",
          data: arr
        },
        yData: {
          name: "订单数(单)"
        },
        seriesData: [
          {
            name: "订单",
            type: "line",
            markLine: {
              data: [
                {
                  name: "平均线",
                  type: "average",
                  lineStyle: {
                    color:
                      "#" +
                      Math.floor(Math.random() * 0xffffff)
                        .toString(16)
                        .padEnd(6, "0")
                  }
                }
              ]
            },
            itemStyle: {
              color:
                "#" +
                Math.floor(Math.random() * 0xffffff)
                  .toString(16)
                  .padEnd(6, "0")
            },
            lineStyle: {
              color:
                "#" +
                Math.floor(Math.random() * 0xffffff)
                  .toString(16)
                  .padEnd(6, "0")
            },
            data: [
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              5,
              10,
              15,
              30,
              23,
              19,
              10,
              7,
              10,
              19,
              20,
              35,
              10,
              5,
              0,
              0
            ]
          }
        ]
      };
      this.drawChart("orderNumber", obj);
    },
    // 近一周食品种类成交量
    setFoodClassify: function() {
      let obj = {
        title: "过去一周食品大类成交量",
        tooltipName: "(单)",
        legendData: ["主食", "小食", "饮料", "成交总量"],
        xData: {
          name: "日期",
          data: [...Array(7).keys()]
            .map(days =>
              moment(new Date(Date.now() - 86400000 * days)).format(
                "YYYY-MM-DD"
              )
            )
            .reverse()
        },
        yData: {
          name: "成交量(单)",
          minInterval: 1
        },
        seriesData: [
          {
            name: "主食",
            type: "line",
            itemStyle: {
              color:
                "#" +
                Math.floor(Math.random() * 0xffffff)
                  .toString(16)
                  .padEnd(6, "0")
            },
            lineStyle: {
              color:
                "#" +
                Math.floor(Math.random() * 0xffffff)
                  .toString(16)
                  .padEnd(6, "0")
            },
            data: [100, 140, 20, 10, 57, 200, 123]
          },
          {
            name: "小食",
            type: "line",
            itemStyle: {
              color:
                "#" +
                Math.floor(Math.random() * 0xffffff)
                  .toString(16)
                  .padEnd(6, "0")
            },
            lineStyle: {
              color:
                "#" +
                Math.floor(Math.random() * 0xffffff)
                  .toString(16)
                  .padEnd(6, "0")
            },
            data: [80, 20, 220, 100, 30, 45, 99]
          },
          {
            name: "饮料",
            type: "line",
            itemStyle: {
              color:
                "#" +
                Math.floor(Math.random() * 0xffffff)
                  .toString(16)
                  .padEnd(6, "0")
            },
            lineStyle: {
              color:
                "#" +
                Math.floor(Math.random() * 0xffffff)
                  .toString(16)
                  .padEnd(6, "0")
            },
            data: [163, 150, 80, 56, 213, 23, 16]
          },
          {
            name: "成交总量",
            type: "line",
            itemStyle: {
              color:
                "#" +
                Math.floor(Math.random() * 0xffffff)
                  .toString(16)
                  .padEnd(6, "0")
            },
            lineStyle: {
              color:
                "#" +
                Math.floor(Math.random() * 0xffffff)
                  .toString(16)
                  .padEnd(6, "0")
            },
            data: [343, 310, 320, 166, 300, 268, 238]
          }
        ]
      };
      this.drawChart("foodCalssify", obj);
    },
    //营业额
    setIncomeMoney() {
      let obj = {
        title: "过去7天营业额",
        tooltipName: "(元)",
        legendData: [],
        xData: {
          name: "日期",
          data: [...Array(7).keys()]
            .map(days =>
              moment(new Date(Date.now() - 86400000 * days)).format(
                "YYYY-MM-DD"
              )
            )
            .reverse()
        },
        yData: {
          name: "收入(元)"
        },
        seriesData: [
          {
            name: "收人",
            type: "line",
            markLine: {
              data: [
                {
                  name: "平均收入",
                  type: "average",
                  lineStyle: {
                    color:
                      "#" +
                      Math.floor(Math.random() * 0xffffff)
                        .toString(16)
                        .padEnd(6, "0")
                  }
                }
              ]
            },
            itemStyle: {
              color:
                "#" +
                Math.floor(Math.random() * 0xffffff)
                  .toString(16)
                  .padEnd(6, "0")
            },
            lineStyle: {
              color:
                "#" +
                Math.floor(Math.random() * 0xffffff)
                  .toString(16)
                  .padEnd(6, "0")
            },
            data: [863, 639, 356, 530, 993, 1004,758]
          }
        ]
      };
      this.drawChart("incomeMoney", obj);
    },
    // 生成图表
    drawChart: function(idName, chartData) {
      let myChart = this.$echarts.init(document.getElementById(idName));
      let option = {
        // tooltip: {
        //   trigger: "item",
        //   formatter: "{a} <br/>{b}: {c} ({d}%)"
        //   /*formatter:function(val){   //让series 中的文字进行换行
        //          console.log(val);//查看val属性，可根据里边属性自定义内容
        //          var content = var['name'];
        //          return content;//返回可以含有html中标签
        //      },*/ //自定义鼠标悬浮交互信息提示，鼠标放在饼状图上时触发事件
        // }, //提示框，鼠标悬浮交互时的信息提示
        title: {
          text: chartData.title,
          left: "center"
        },
        toolbox: {
          right: 15,
          top: 25,
          feature: {
            magicType: {
              type: ["bar", "line"],
              option: {
                bar: {
                  tooltip: {
                    axisPointer: {
                      type: "shadow"
                    }
                  }
                }
              }
            }
          }
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // type: "cross",
            label: {
              precision: 0,
              formatter: params => params.value + chartData.tooltipName
            }
          }
        },
        legend: {
          data: chartData.legendData,
          top: 30
        },
        grid: {
          bottom: 25
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          axisTick: {
            show: true,
            inside: true
          },
          name: chartData.xData.name,
          data: chartData.xData.data
        },
        
        yAxis: {
          type: "value",
          // boundaryGap: [0, "100%"],
          axisTick: {
            show: true,
            inside: true
          },
          min: 0,
          name: chartData.yData.name
        },
        series: chartData.seriesData
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
    queryClass() {
      queryClass({}).then(res => {
        if (res.code == 0) {
          this.chooseClass = res.data;
        }
      });
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

.chart-display {
  position: relative;
  overflow: hidden;
  height: 300px;
  border: 1px solid rgb(235, 235, 235);
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
