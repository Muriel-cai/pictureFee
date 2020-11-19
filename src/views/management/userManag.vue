<template>
  <div class="userManag-container">
    <div>
      <el-form
        ref="form"
        :inline="true"
        :model="params"
        label-width="85px"
      >
        <el-form-item label="用户名">
          <el-input
            v-model="params.username"
            placeholder="请输入用户名"
            style="width: 180px;"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            type="success"
            @click="getList"
          >查询</el-button>

          <el-button
            type="primary"
            @click="addMember"
          >新增</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="userManag-mainBox">
      <el-table
        v-loading="listLoading"
        :data="userInfoList"
        element-loading-text="Loading"
        border
        fit
        highlight-current-row
      >

        <el-table-column
          label="用户账号"
          align="center"
          prop="userAccount"
        />
        <el-table-column
          label="用户名称 "
          align="center"
          prop="username"
        />
        <el-table-column
          label="用户id"
          align="center"
          prop="userId"
        />
        <el-table-column
          label="用户添加时间"
          align="center"
          prop="insertTime"
        />
        <!-- <el-table-column
          width="200"
          label="操作"
          align="center"
        >
          <template slot-scope="{row,$index}">
            <el-button
              size="mini"
              type="text"
              @click="modifyRole(row,$index)"
            >修改</el-button>
            <el-button
              size="mini"
              type="text"
              @click="selectRole(row.userId)"
            >选择角色</el-button>
            <el-button
              size="mini"
              type="text"
              style="color: #f55555"
              @click="deleteRole(row,$index)"
            >删除</el-button>
          </template>
        </el-table-column> -->
      </el-table>
    </div>
    <!--弹框 -->
    <el-dialog
      width="410px"
      :visible.sync="dialogTableVisible"
      title="新增用户"
      :close-on-click-modal="false"
      @dragDialog="dialogTableVisible = fasle "
    >
      <el-form
        ref="userManagItem"
        :rules="userRules"
        :model="userManagItem"
        label-width="120px"
      >
        <el-form-item
          label="用户账号"
          prop="userAccount"
        >
          <el-input v-model="userManagItem.userAccount" />
        </el-form-item>
        <el-form-item
          label="用户名称："
          prop="username"
        >
          <el-input v-model="userManagItem.username" />
        </el-form-item>
        <el-form-item
          label="用户密码："
          prop="password"
        >
          <el-input v-model="userManagItem.password" />
        </el-form-item>

      </el-form>
      <div class="app-btn-box ">
        <el-button
          type="primary"
          @click="addData('userManagItem')"
        >保存</el-button>
      </div>

    </el-dialog>
  </div>
</template>

<script>
import { sysUserList, sysUserAdd } from '@/api/userData'

export default {
  name: 'UserManag',
  data() {
    return {
      title: '用户管理',
      listLoading: 'true',
      userInfoList: [],
      dialogTableVisible: false,
      dialogTitle: '新增用户',
      userId: '',
      params: {
        'page': 1, // 页数 必传
        'limit': 20, // 每页查询记录数 必传
        'username': '' // 非必传
      },
      userManagItem: [],
      userRules: {
        userAccount: [{ message: '请输入用户账户', required: true, trigger: 'blur' }],
        username: [{ message: '请输入用户名称', required: true, trigger: 'blur' }],
        password: [{ message: '请输入密码', required: true, trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      sysUserList(this.params).then(response => {
        this.userInfoList = response.data
        this.listLoading = false
      })
    },
    // 新增
    addMember() {
      // this.$nextTick(() => {
      //   this.$refs['userManagItem'].clearValidate()
      // })
      this.dialogTableVisible = true
      this.userManagItem = {}
    },

    handleSelectionChange(val) {
      // console.log(val, 'handleSelectionChangeval')
      this.hasCroleId = val
    },
    // // 保存用户信息
    addData(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          sysUserAdd(this.userManagItem).then(res => {
            this.dialogTableVisible = false
            this.getList()
          })
        }
      })
    }

  }
}
</script>
<style lang="scss" scoped>
.userManag {
  &-container {
    margin: 5px;
    background: #fff;
    padding: 10px;
  }
  .color_red {
    color: #f55555;
  }
  &-mainBox {
    margin-top: 10px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
