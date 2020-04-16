<template>
  <!-- 系统首页,即图表页 -->
  <div style="width: 96%;margin: 0 auto;margin-bottom: 60px">
    <h2>xx餐厅数据可视化</h2>
    <a-row
      style="display: flex;flex-direction: row;justify-content: space-between;margin:50px auto"
    >
      <a-col :span="11">
        <!-- 上月最受欢迎菜品 -->
        <a-row type="flex" justify="center" align="middle" class="chart-display">
          <div id="bestPopular" style=" height: 300px;width: 500px;"></div>
        </a-row>
      </a-col>
      <a-col :span="11">
        <!-- 过去7天食品大类销售量 -->
        <a-row type="flex" justify="center" align="middle" class="chart-display">
          <div id="foodCalssify" style=" height: 300px;width: 500px"></div>
        </a-row>
      </a-col>
    </a-row>
    <a-row
      style="display: flex;flex-direction: row;justify-content: space-between;margin:50px auto"
    >
      <a-col :span="11">
        <!-- 当天每小时订单数 -->
        <a-row type="flex" justify="center" align="middle" class="chart-display">
          <div id="orderNumber" style=" height: 300px;width: 500px;"></div>
        </a-row>
      </a-col>
      <a-col :span="11">
        <!-- 过去7天营业额 -->
        <a-row type="flex" justify="center" align="middle" class="chart-display">
          <div id="incomeMoney" style=" height: 300px;width: 500px"></div>
        </a-row>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import {
  queryLastHotFoods,
  queryLastWeek,
  queryTodayOrder
} from "../../axios/api";
import moment from "moment";
export default {
  name: "index",
  data() {
    return {
      bestPopular: {
        //上月最受欢迎菜品查询参数
        date: moment()
          .subtract(1, "M")
          .format("YYYY-MM")
      },
      lastWeekNum: {
        //过去7天食品大类查询参数(营业额参数)
        startTime: moment()
          .subtract(7, "d")
          .format("YYYY-MM-DD 00:00:00"),
        endTime: moment()
          .subtract(1, "d")
          .format("YYYY-MM-DD 23:59,59")
      },
      todayOrder: {
        //当天最受欢迎
        startTime: moment().format("YYYY-MM-DD 00:00:00"),
        endTime: moment().format("YYYY-MM-DD 23:59,59")
      }
    };
  },
  mounted() {
    //页面挂载时调用,获取页面初始数据
    this.queryLastHotFoods(); //上月最受欢饮菜品
    this.querySevenNum(false); //食品大类
    this.querySevenNum(true); //营业额
    this.queryTodayOrders(); //当天每小时订单数
  },
  methods: {
    queryLastHotFoods() {
      queryLastHotFoods(this.bestPopular).then(res => {
        if (res.code == 200) {
          //code==200代表成功
          this.drawBestPopular(res.data);
        } else {
          this.$message.error(res.message);
        }
      });
    },
    // 最受欢迎菜品
    drawBestPopular: function(resultData) {
      let myChart = this.$echarts.init(document.getElementById("bestPopular"));
      // 指定图表的配置项和数据
      let option = {
        title: {
          text: "上月菜品销售TOP5",
          left: "center"
        },
        tooltip: {
          //提示框组件
          trigger: "item", //触发类型(饼状图片就是用这个)
          formatter: "{a} <br/>{b} : {c} ({d}%)" //提示框浮层内容格式器
        },
        legend: {
          top: 25,
          data: resultData[0]
          // ["汉堡", "米饭", "可乐", "鸡腿"]
        },
        // grid: {
        //   top: 'middle'
        // },
        series: [
          //图表配置
          {
            name: "上月菜品销售TOP5", //图表名称
            type: "pie", //类型 pie表示饼图
            center: ["50%", "50%"], //设置饼的原心坐标 不设置就会默认在中心的位置
            radius: [0, "68%"], //饼图的半径,第一项是内半径,第二项是外半径,内半径为0就是真的饼,不是环形
            itemStyle: {
              emphasis: {
                label: {
                  //饼图图形上的文本标签
                  position: "center",
                  textStyle: {
                    fontSize: "10",
                    fontWeight: "bold"
                  }
                }
              }
            },
            data: resultData[2]
          }
        ]
      };
      myChart.setOption(option);
    },
    // 生成每个时间段订单数
    setOrderNumber: function(resultData) {
      let arr = [];
      for (let i = 0; i < 24; i++) {
        if (i < 10) {
          i = "0" + i;
        } //生成24小时数据
        arr.push(`${i}:00`);
      }
      let obj = {
        title: `当天每小时订单数(${moment().format("YYYY-MM-DD")})`,
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
                  type: "average"
                }
              ]
            },
            data: resultData
          }
        ]
      };
      this.drawChart("orderNumber", obj, () => this.queryTodayOrders());
    },
    // 查询当天订单
    queryTodayOrders() {
      queryTodayOrder(this.todayOrder).then(res => {
        if (res.code == 200) {
          this.setOrderNumber(res.data);
        } else {
          this.$message.error(res.message);
        }
      });
    },
    /**
     * 查询过去7天数据(成交量和收入共用)
     * @key isPrice:是否是查询收入,boolean
     */
    querySevenNum(isPrice) {
      queryLastWeek({ ...this.lastWeekNum, isPrice: isPrice }).then(res => {
        if (res.code == 200) {
          if (isPrice) {
            let arr = res.data.map(item => item.income);
            this.setIncomeMoney(arr);
          } else {
            this.setFoodClassify(res.data);
          }
        } else {
          this.$message.error(res.message);
        }
      });
    },
    
    /**
     * 过去7天食品种类成交量
     * @key resultData:过去7天成交量数据
     */
    setFoodClassify: function(resultData) {
      let obj = {
        title: "过去7天食品种类成交量",
        tooltipName: "(单)",
        legendData: ["主食", "小食", "饮料", "套餐", "成交总量"],
        xData: {
          name: "日期",
          data: [...Array(7).keys()]
            .map(days =>
              moment(new Date(Date.now() - 86400000 * (days + 1))).format(
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
            data: resultData[0]
          },
          {
            name: "小食",
            type: "line",
            data: resultData[1]
          },
          {
            name: "饮料",
            type: "line",
            data: resultData[2]
          },
          {
            name: "套餐",
            type: "line",
            data: resultData[3]
          },
          {
            name: "成交总量",
            type: "line",
            data: resultData[4]
          }
        ]
      };
      this.drawChart("foodCalssify", obj, () => this.querySevenNum(false));
    },
    //营业额
    setIncomeMoney(resultData) {
      let obj = {
        title: "过去7天营业额",
        tooltipName: "(元)",
        legendData: [],
        xData: {
          name: "日期",
          data: [...Array(7).keys()]
            .map(days =>
              moment(new Date(Date.now() - 86400000 * (days + 1))).format(
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
                  type: "average"
                }
              ]
            },

            data: resultData
          }
        ]
      };
      this.drawChart("incomeMoney", obj, () => this.querySevenNum(true));
    },

    /**
     * 生成图表
     * @key idName:生成的图表放置哪个元素下
     * @key chartData:图表的具体配置项
     * @key updateFunction:图表刷新调用的接口
     */
    drawChart: function(idName, chartData, updateFunction) {
      let myChart = this.$echarts.init(document.getElementById(idName));
      let option = {
        title: {
          text: chartData.title, //图表名称
          left: "center"
        },
        toolbox: {
          //配置工具箱,即右上角切换图表展示类型及刷新按钮
          right: 15,
          top: 25,
          feature: {
            magicType: {
              type: ["bar", "line"], //可切换成柱状和折线
              option: {
                bar: {
                  tooltip: {
                    axisPointer: {
                      type: "shadow"
                    }
                  }
                }
              }
            },
            myTool1: {
              show: true,
              title: "刷新",
              //刷新图标的svg地址
              icon:
                "path://M896.384 494.634667A21.461333 21.461333 0 0 1 917.333333 469.333333a21.333333 21.333333 0 0 1 21.290667 22.826667A427.093333 427.093333 0 0 1 725.333333 881.493333C521.258667 999.338667 260.309333 929.408 142.506667 725.333333a434.773333 434.773333 0 0 1-5.674667-10.154666L119.466667 786.645333a19.669333 19.669333 0 0 1-24.917334 14.378667 22.058667 22.058667 0 0 1-15.061333-26.112l29.482667-121.557333a19.669333 19.669333 0 0 1 24.917333-14.378667l120.021333 35.242667c11.050667 3.242667 17.792 14.933333 15.061334 26.112a19.669333 19.669333 0 0 1-24.917334 14.378666l-70.101333-20.565333 5.504 9.856A384 384 0 0 0 704 844.544a384.341333 384.341333 0 0 0 192.384-349.866667zM128 490.88a21.333333 21.333333 0 1 1-42.325333-4.053333C94.634667 349.312 170.368 216.576 298.666667 142.506667a425.941333 425.941333 0 0 1 373.333333-26.026667 424.618667 424.618667 0 0 1 196.266667 160.682667l17.493333-72.277334a19.669333 19.669333 0 0 1 24.96-14.378666c11.008 3.242667 17.792 14.933333 15.061333 26.112l-29.482666 121.557333a19.669333 19.669333 0 0 1-24.917334 14.378667l-120.021333-35.242667a22.058667 22.058667 0 0 1-15.104-26.112 19.669333 19.669333 0 0 1 24.917333-14.378667l69.077334 20.266667a381.738667 381.738667 0 0 0-174.208-141.056 383.189333 383.189333 0 0 0-336.042667 23.424C204.8 245.930667 136.32 367.445333 128 490.88z",
              onclick: updateFunction
            }
          }
        },
        tooltip: {
          //提示框配置
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
          //图表顶部的展示选项
          data: chartData.legendData,
          top: 30
        },
        grid: {
          bottom: 25
        },
        xAxis: {
          //配置x轴
          type: "category",
          boundaryGap: false,
          axisTick: {
            show: true,
            inside: true
          },
          name: chartData.xData.name, //x轴名称
          data: chartData.xData.data //x轴数据
        },

        yAxis: {
          //y轴
          type: "value",
          // boundaryGap: [0, "100%"],
          axisTick: {
            show: true,
            inside: true
          },
          min: 0,
          name: chartData.yData.name
        },
        series: chartData.seriesData //图表展示的数据
      };
      myChart.setOption(option);
    }
  }
};
</script>

<style scoped lang="scss">
.chart-display {
  position: relative;
  overflow: hidden;
  height: 300px;
  border: 1px solid rgb(235, 235, 235);
}
</style>
