<template>
  <div class="container">
    <div class="conBox">
      <div class="formBox">
        <el-form :inline="true" :model="params" class="demo-form-inline ">
          <el-form-item label="VIN码">
            <el-input v-model="params.vinNum" placeholder="请输入" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="getList()">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
      <!--表格数据-->
      <div class="mainBox">
        <el-table
          ref="multipleTable"
          v-loading="listLoading"
          :data="UntreatedData"
          border
          fit
          highlight-current-row
        >
          <el-table-column type="index" :index="indexFn" label="序号" width="50" />
          <el-table-column prop="caseNo" label="案件号" width="160" />
          <el-table-column prop="vehicleModel" label="车型" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.vehicleModel }}
            </template>
          </el-table-column>
          <el-table-column prop="vin" label="VIN码" width="180" />
          <el-table-column prop="lossSumPrice" label="定损合计" width="120" />
          <el-table-column label="状态" width="100">
            <template slot-scope="scope">
              {{ orderStatusMap[scope.row.state] }}
            </template>
          </el-table-column>
          <el-table-column prop="createDate" label="定损时间" width="150" />
          <el-table-column prop="username" label="定损人" width="100" />
          <el-table-column prop="lastDate" label="处理时间" width="150" />
          <el-table-column label="操作" width="60">
            <template slot-scope="{row}">
              <el-link :underline="false" type="primary" @click="checkResults(row.caseId)">查看</el-link>
            </template>
          </el-table-column>
        </el-table>
        <div class="block" style="margin-top: 20px" />
        <Pagination
          v-show="totalnum>0"
          :total="totalnum"
          :page.sync="params.page"
          :limit.sync="params.limit"
          @pagination="getList"
        />
      </div>
    </div>
    <el-dialog :title.sync="dialogTitle" :visible.sync="dialogFormVisible" :width.sync="dialogWidth" top="10vh" center append-to-body>
      <modifyResults ref="modifyResults" :data-id="dataId" :type="caseType" />
    </el-dialog>
  </div>
</template>

<script>
import modifyResults from './modifyResults'
import { getQueryInjuredCase } from '@/api/listData'
import { orderStatusMap } from '@/utils/stutaOption'
import Pagination from '@/components/Pagination'
export default {
  name: 'Home',
  components: {
    modifyResults,
    Pagination
  },
  provide() {
    return {
      fatherClose: this.fatherMethod
    }
  },
  data() {
    return {
      title: '已处理',
      listLoading: true,
      hasCheck: false,
      caseType: 3,
      dialogFormVisible: false,
      dialogTitle: '识别结果',
      dialogWidth: '1100px',
      dataId: '',
      params: {
        page: 1,
        limit: 20,
        vinNum: '',
        plateNum: '',
        lossNo: '',
        isAi: '',
        state: 3
      },
      totalnum: 0,
      orderStatusMap,
      UntreatedData: []

    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      getQueryInjuredCase(this.params).then(res => {
        this.UntreatedData = res.data
        this.totalnum = res.total
        this.listLoading = false
      })
    },
    indexFn(index) {
      index = (index + 1) + (this.params.page - 1) * this.params.limit
      return index
    },
    checkResults(id) {
      this.dialogFormVisible = true
      this.dialogTitle = '定损单AI识别对比结果'
      this.dataId = id
      setTimeout(() => {
        this.$refs['modifyResults'].getList(id)
      })
    },
    fatherMethod() {
      this.dialogFormVisible = false
      this.getList()
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped lang="scss">

</style>
