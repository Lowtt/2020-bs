<template>
  <div style="width: 96%;margin: 0 auto">
    <a-row style="display: flex;flex-direction: row">
      <h2>请假</h2>
    </a-row>
    <a-row style="text-align: left">
      <a-col :span="4">
        <span>本月请假次数:{{lastLeaveCount}}</span>
      </a-col>
      <a-col :span="4">
        <span>剩余可请假次数:{{lastSurplusCount}}</span>
      </a-col>
    </a-row>
    <a-divider />

    <a-row style="display: flex;flex-direction: row-reverse">
      <a-button style="margin-left: 20px" @click="exportFun">导出Excel</a-button>
      <a-button @click="applyLeave">请假申请</a-button>
    </a-row>
    <a-row style="margin-top: 20px">
      <a-table :columns="columns" :dataSource="data" bordered>
        <span slot="action" slot-scope="text, obj">
          <a @click="detail(obj)">查看</a>
        </span>
      </a-table>
    </a-row>
    <a-modal v-model="visible">
      <p slot="title" class="modalTitle">
        <span>请假条</span>
        <span style="font-size:14px;margin-right:20px">请假时间:{{applyTime}}</span>
      </p>
      <span slot="footer">
        <a-button type="primary" @click="modelOk">关闭</a-button>
        <a-button v-if="isApply" type="primary" @click="submit">提交</a-button>
      </span>
      <div>
        <a-row v-if="!isApply">
          <a-col span="22">
            <p>{{applyResult.status}}</p>
          </a-col>
        </a-row>
        <a-row>
          <a-col span="20">
            <a-Form style="width:100%" :form="form" @submit="formSearch">
              <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="请假时长">
                <div>
                  <a-range-picker
                    v-decorator="[
                'num',
                {
                  initialValue:[applyResult.createTime,applyResult.updateTime],
                  rules: [{
                    required: true,
                    message: '请选择请假时间!'
                  }],
                }
              ]"
                    style="width: 100%"
                    :disabled="!isApply"
                    showTime="{ format: 'HH:mm' }"
                    format="YYYY-MM-DD HH:mm"
                    :placeholder="['请选择开始时间', '请选择结束时间']"
                  />
                  <p style="width:100%;text-align:center;margin:0">{{applyResult.leaveTime}}</p>
                </div>
              </a-form-item>
              <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="申请原因">
                <a-textarea
                  :disabled="!isApply"
                  autosize
                  v-decorator="[
                'applyReason',
                {initialValue:applyResult.content,
                  rules: [{
                    required: true,
                    message: '请输入请假原因!',
                  }],
                }
              ]"
                />
              </a-form-item>
              <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="证明资料">
                <a-upload
                  v-decorator="[
                'paths',
                {initialValue:applyResult.status,
                  rules: [{
                    required: true,
                    message: '请上传证明资料!',
                  }],
                }
              ]"
                >
                  <a-button v-if="isApply">
                    <a-icon type="upload" />上传资料
                  </a-button>
                </a-upload>
              </a-form-item>
              <a-form-item
                v-if="!isApply&&applyResult.flag==3"
                :label-col="labelCol"
                :wrapper-col="wrapperCol"
                label="驳回原因"
              >
                <a-textarea
                  autosize
                  v-decorator="[
                'refusedReason',
               {initialValue:applyResult.status,}
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
import { leaveList, leaveApply, exportExcel,DownLoade } from "../../axios/api";
import moment from "moment";
const columns = [
  {
    dataIndex: "createTime",
    title: "申请时间",
    align: "center"
  },
  {
    title: "请假时长",
    dataIndex: "leaveTime",
    align: "center"
  },
  {
    title: "请假原因",
    dataIndex: "content",
    align: "center"
  },
  {
    title: "审批结果",
    dataIndex: "tags",
    align: "center"
  },
  {
    title: "审批操作人",
    dataIndex: "auditor.name",
    align: "center"
  },
  {
    title: "操作",
    dataIndex: "tags",
    align: "center",
    scopedSlots: { customRender: "action" }
  }
];

export default {
  data() {
    return {
      data: [],
      applyTime: new Date().toLocaleString(),
      visible: false,
      applyResult: {},
      form: this.$form.createForm(this),
      columns,
      leaveList: [],
      lastSurplusCount: "",
      lastLeaveCount: "",
      isApply: false,
      labelCol: {
        span: 6
      },
      wrapperCol: {
        span: 18
      }
    };
  },
  mounted() {
    this.getLeaveList();
  },
  methods: {
    formSearch() {},
    getLeaveList() {
      leaveList({ systemState: 1 }).then(res => {
        if (res.code == 0) {
          this.data = res.data.list; //
          this.lastLeaveCount = res.data.list[0].lastLeaveCount;
          this.lastSurplusCount = res.data.list[0].lastSurplusCount;
        }
      });
    },
    detail(obj) {
      this.applyResult = obj;
      this.applyResult.createTime = moment(
        new Date(this.applyResult.createTime)
      ).format("YYYY-MM-DD HH:mm");
      this.applyResult.updateTime = moment(
        new Date(this.applyResult.updateTime)
      ).format("YYYY-MM-DD HH:mm");
      this.isApply = false;
      this.visible = true;
    },
    applyLeave() {
      this.visible = true;
      this.isApply = true;
    },
    exportFun() {
        DownLoade("/teacher/leaveApply/excel",{systemState: 2}).then(res => {
          var filename = '请假名单导出';
          var binaryData = [];
          binaryData.push(res);
          let url = window.URL.createObjectURL(new Blob(binaryData, {type: "application/zip"}))
          let link = document.createElement('a')
          link.style.display = 'none'
          link.href = url
          link.setAttribute('download', filename + '.xls')
          document.body.appendChild(link)
          link.click()
          link.remove()
      });
    },
    modelOk() {
      this.visible = false;
      this.applyResult = {}
      this.form.resetFields()
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
