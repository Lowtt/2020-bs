<template>
  <div style="width: 96%;margin: 0 auto">
    <a-row style="display: flex;flex-direction: row">
      <h2>部门绩分排名</h2>
    </a-row>
    <a-divider />
    <a-row>
      <div class="searchBar">
        <div>
          <span>部门选择:</span>
        <a-select style="width: 200px" @change="departmentChange">
          <a-select-option :value="null">全部</a-select-option>
            <a-select-option
              v-for="item in department"
              :key="item.id"
              :value="item.id"
            >{{item.name}}</a-select-option>
          </a-select>
        </div>
        <div style='margin-left:30px'>
          <span>绩分版块筛选:</span>
        <a-select style="width: 200px" @change="templateChange">
          <a-select-option :value="null">全部</a-select-option>
            <a-select-option
              v-for="item in template"
              :key="item.staticTemplate.id"
              :value="item.staticTemplate.id"
            >{{item.staticTemplate.name}}</a-select-option>
          </a-select>
        </div>
        <div style='position:absolute;right:0'>
          <a-button @click='exportFile'>导出Excel</a-button>
        </div>
      </div>
     
      <div class="content" style="text-align: left;margin-top: 40px">
        <a-table :columns="columns" :dataSource="tableData" :pagination="pagination" bordered>
          <span slot="action" slot-scope="text, record,index">
            {{index+1}}
          </span>
        </a-table>
      </div>
    </a-row>
  </div>
</template>

<script>
  import {
  staticTemplateList,
  departmentRanke,
  queryDepartment,
  exportRanke
} from "../../axios/api";
  const columns = [{
    dataIndex: 'rank',
    title:'排名',
    align: "center",
    scopedSlots: { customRender: 'action' },
  }, {
    title: '姓名',
    dataIndex: 'name',
    align: "center"
  },{
    title: '绩分',
    dataIndex: 'num',
    align: "center"
  },{
    title: '校区',
    dataIndex: 'schoolName',
    align: "center"
  },{
    title: '角色',
    dataIndex: 'roleName',
    align: "center"
  },{
    title: '入职时间',
    dataIndex: 'createTime',
    align: "center"
  }
  ];
  export default {
      name:'personalRanke',
      data(){
          return{
              columns,
              tableData:[],
              template: [],
              department:[],
              pagination: {
        size: "small",
        pageSize: 10,
        showQuickJumper: true,
        showSizeChanger: true,
        showTotal: () => `共1000条`
      },
      queryParams: { size: 10, indexPage: 1 }
          }
      },
      created(){
      this.staticTemplateList()
      this.queryDepartment()
      this.getInitData()
    },
      methods:{
        staticTemplateList() {
      staticTemplateList({
        indexPage: 1,
        size: 20
      }).then(res => {
        if (res.code == 0) {
          this.template = res.data.list;
        }
      });
    },
    exportFile(){
      let queryparam = {
        ...this.queryParams,
        obj: { ...this.queryParams.obj,type: 1 }
      };
      exportRanke(queryparam).then(res=>{
        if(res.code == 0){
          console.log(res)
        }
      })
    },
    queryDepartment(){
      queryDepartment({}).then(res=>{
        if(res.code == 0){
          this.department = res.data
        }
      })
    },
    departmentChange(val){
      this.queryParams = {
        ...this.queryParams,
        obj: { ...this.queryParams.obj,departmentId: val }
      };
      this.getInitData();
    },
      templateChange(val) {
      this.queryParams = {
        ...this.queryParams,
        obj: { ...this.queryParams.obj,staticTemplateId: val }
      };
      this.getInitData();
    },
    getInitData() {
      departmentRanke(this.queryParams).then(res => {
        if (res.code == 0) {
          this.tableData = res.data.list;
          this.pagination.showTotal= () => `共${res.data.total}`
        }
      });
    },
      }
  }
</script>

<style scoped>
  .searchBar{
    /* text-align: left; */
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
  }
</style>
