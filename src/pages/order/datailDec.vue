<template>
  <div style="width: 96%;margin: 0 auto">
    <a-row style="display: flex;flex-direction: row">
      <h2>我的加分记录</h2>
    </a-row>
    <a-divider />
    <a-row style="display: flex;flex-direction: row;justify-content: space-between">
      <a-col :span="8" style="display: flex;flex-direction: row;justify-content: space-around">
        <div>
          <span>选择绩分版块</span>
          <a-select style="width: 200px">
            <a-select-option value="jack">Jack</a-select-option>
            <a-select-option value="lucy">Lucy</a-select-option>
            <a-select-option value="Yiminghe">yiminghe</a-select-option>
          </a-select>
        </div>
        <div style="margin-left: 20px">
          <span>查询时间</span>
          <a-date-picker placeholder="选择时间"/>
        </div>
      </a-col>
      <a-col :span="12"></a-col>
      <a-col :span="4" style="display: flex;flex-direction: row-reverse">
        <div>
          <a-button>导出Excel</a-button>
        </div>
      </a-col>
    </a-row>
    <a-row style="margin-top: 20px">
      <a-table :columns="columns" :dataSource="data" bordered>
      </a-table>
    </a-row>
  </div>
</template>

<script>
  const columns = [{
    dataIndex: 'name',
    title:'扣分时间'
  }, {
    title: '扣减分值',
    dataIndex: 'age',
  },{
    title: '扣分原因',
    dataIndex: 'tags',
  }];

  const data = [{
    key: '1',
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
    tags: ['nice', 'developer'],
  }, {
    key: '2',
    name: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park',
    tags: ['loser'],
  }, {
    key: '3',
    name: 'Joe Black',
    age: 32,
    address: 'Sidney No. 1 Lake Park',
    tags: ['cool', 'teacher'],
  }];

  export default {
    data() {
      return {
        data,
        columns,
      }
    }
  }
</script>

<style scoped>

</style>
