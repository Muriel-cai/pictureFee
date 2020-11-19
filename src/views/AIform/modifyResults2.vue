<template>
  <div class="container dioHei">
    <!-- <h1>{{ msg }}</h1> -->
    <el-row v-loading="loading" :gutter="10" class="">
      <el-col :span="12">
        <!--基本信息-->
        <div v-if="basicInfo" class="basicInfoBox">
          <h1 class="secTitle colorB"> <span class="line" />基本信息 <b class="dateText"> 出险时间：
            {{ basicInfo.createDate }}
          </b></h1>
          <div class="infoBox">
            <el-row :gutter="24">
              <el-col :span="12">
                <div class="info-content bg-purple">VIN码：{{ basicInfo.vin }}</div>
              </el-col>
              <el-col :span="12">
                <div class="info-content bg-purple">车牌号码：{{ basicInfo.plateNum }}</div>
              </el-col>
            </el-row>
            <el-row :gutter="24">
              <el-col :span="24">
                <div class="info-content bg-purple">车型：{{ basicInfo.vehicleModel }}</div>
              </el-col>
            </el-row>
          </div>
        </div>
        <div class="grid-content " height="450px">
          <el-carousel ref="carousel" :autoplay="false" indicator-position="none" @change="onCarouselChange">
            <el-carousel-item v-for="(item, index) in imgItem" :key="index">
              <el-image
                :src="item"
                @click="getImgList(index)"
              />
            </el-carousel-item>
          </el-carousel>
          <div class="upload-warp" height="100px">
            <div class="upload-warp-left" @click="handlePrev">
              <i class="el-icon-arrow-left" />
            </div>
            <div class="upload-warp-center">
              <div v-for="(item, index) in imgItem" :key="item" class="upload-warp-center-img">
                <img :src="item" alt :class="imgActiveIndex == index ? 'img-br' : ''" @click="handleImgClick(index)">
              </div>
            </div>
            <div class="upload-warp-left" @click="handleNext">
              <i class="el-icon-arrow-right" />
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="grid-content setHei" style="max-height: 600px;">
          <h1 class="secTitle colorB"><span /> 定损清单</h1>
          <el-table ref="feeListTable" :data="resData" tooltip-effect="dark" border style="width: 100%" size="mini">
            <el-table-column prop="partName" label="损失部位">
              <template slot-scope="scope">
                <el-select
                  v-model="scope.row.partName"
                  placeholder="请选择"
                  :min="0"
                  size="mini"
                  remote
                  filterable
                  allow-create
                  :remote-method="remoteMethod"
                  @change="getpartName(scope.$index,scope.row)"
                  @focus="setPartName"
                >
                  <el-option-group
                    v-for="group in partNames"
                    :key="group.id"
                    :label="group.label"
                  >
                    <el-option
                      v-for="(item,index) in group.options"
                      :key="index"
                      :label="item"
                      :value="item"
                    />
                    <!-- -->
                  </el-option-group>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="维修方式" width="130">
              <template slot-scope="scope">
                <el-select
                  v-model="scope.row.repairType"
                  placeholder="请选择"
                  size="mini"
                  width="100"
                  @change="getrepairType(scope.$index,scope.row)"
                >
                  <el-option
                    v-for="item in injuredTypeOption"
                    :key="item.id"
                    :label="item.label"
                    :value="item.label"
                  />
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="定损价格（元）" width="130">
              <template slot-scope="scope">
                <el-input v-model="scope.row.partPriceLoss" placeholder="请输入内容" width="110" size="mini" />
              </template>
            </el-table-column>
            <!-- <el-table-column prop="lossType" label="定损方式" width="70">
              <template slot-scope="scope">
                <span v-if="scope.row.lossType === 1">AI</span>
                <span v-if="scope.row.lossType === 2">人工</span>
              </template>
            </el-table-column> -->
            <el-table-column label="操作" width="44" label-class-name="bgimg">
              <template slot="header" slot-scope="scope">
                <i class="iconfont icon-tianjia1 colorB iconP" @click="addList(scope.row)" />
              </template>
              <template slot-scope="scope">
                <i class="iconfont icon-jianshao colorR iconP" @click="delectEdit(scope.row,scope.$index)" />
              </template>
            </el-table-column>
            <div slot="append" class="getxjBox rightP">
              <h1 class="colorR"> <span class="smallT">合计：</span> {{ PartPrice }}</h1>
            </div>
          </el-table>
        </div>
      </el-col>
    </el-row>
    <div class="footerBox">
      <el-button @click="back">返回</el-button>
      <el-button v-if="type !== 3" @click="tempSave">暂存</el-button>
      <!-- <el-button type="primary" plain @click="saveDataNext">完成并查看下一条</el-button> -->
      <el-button v-if="type !== 3" type="primary" @click="saveData">修改完成</el-button>
    </div>
    <el-image-viewer
      v-if="showImg"
      :on-close="closeViewer"
      :url-list="viewerImgList"
    />
  </div>
</template>

<script>
import { getCheckPartInfo, modifyCheckPartInfo, tempSave, finishedNext, PartPriceByType, getPartNames } from '@/api/listData'
import { injuredTypeOption } from '@/utils/stutaOption'
import ElImageViewer from 'element-ui/packages/image/src/image-viewer'
export default {
  name: 'ModifyResults',
  components: { ElImageViewer },
  props: {
    dataId: {
      type: Number,
      default: -1
    },
    type: {
      type: Number,
      default: -1
    }
  },
  inject: ['fatherClose'],
  data() {
    return {
      loading: false,
      msg: '修改识别结果',
      resData: [],
      basicInfo: {},
      injuredTypeOption,
      partNames: [
        {
          label: '左',
          id: 1,
          options: []
        },
        {
          label: '右',
          id: 2,
          options: []
        },
        {
          label: '其他',
          id: 3,
          options: []
        }
      ],
      imgItem: [],
      imgActiveIndex: 0,
      showImg: false,
      viewerImgList: []
    }
  },
  computed: {
    // 计算总价
    PartPrice() {
      let count = 0
      this.resData.map((item) => {
        count += (parseFloat(item.partPriceLoss) || 0)
      })
      return count.toFixed(2)
    }
  },
  methods: {
    getList(id) {
      this.loading = true
      const data = {
        caseId: id || this.dataId
      }
      getCheckPartInfo(data).then(res => {
        this.resData = res.data.checkPartList
        this.imgItem = res.data.imageUrls
        this.basicInfo = res.data.caseIfo
        this.partNames[0].options = res.data.partNames['left']
        this.partNames[1].options = res.data.partNames['right']
        this.partNames[2].options = res.data.partNames['other']
        this.loading = false
      })
    },
    // 添加一行
    addList(option) {
      const target = {
        partName: '',
        repairType: '',
        partPriceLoss: '0.00'
      }
      this.resData.unshift(target)
    },
    getpartName(index, row, e) {
      this.getPrice(index, row)
    },
    //
    getrepairType(index, row, e) {
      this.getPrice(index, row)
    },

    getPrice(index, data) {
      data.caseId = this.dataId
      if (data.partName !== '' && data.repairType !== '') {
        PartPriceByType(data).then(res => {
          if (res.status === 200) {
            this.resData[index].partPriceLoss = res.partPrice
          } else {
            this.resData[index].partPriceLoss = 0.00
          }
        })
      }
    },
    getImgList(index) {
      this.showImg = true
      const tempImgList = [...this.imgItem]
      const temp = []
      for (let i = 0; i < index; i++) {
        temp.push(tempImgList.shift())
      }
      this.viewerImgList = tempImgList.concat(temp)
    },
    // 关闭查看器
    closeViewer() {
      this.showImg = false
    },
    // 保存
    saveData() {
      const data = {
        'caseId': this.dataId, // 案件id
        'checkPartList': this.resData
      }
      modifyCheckPartInfo(data).then(res => {
        this.$message({
          type: 'success',
          message: '修改成功，请到已处理列表查看！'
        })
        this.fatherClose()
      })
    },
    // 暂存
    tempSave() {
      const data = {
        'caseId': this.dataId, // 案件id
        'checkPartList': this.resData
      }
      tempSave(data).then(res => {
        this.$message({
          type: 'success',
          message: '修改成功，请到暂存列表查看！'
        })
        this.fatherClose()
      })
    },
    // 保存并查看下一条
    saveDataNext() {
      const data = {
        caseId: this.dataId,
        checkPartList: this.resData
      }
      finishedNext(data).then(res => {
        this.$notify({
          type: 'success',
          message: '已保存成功，请查看下一条！'
        })
        this.getList(res.caseId)
      })
    },
    setPartName() {
      // console.log('000000')
      getPartNames({ partName: '' }).then((res) => {
        this.partNames[0].options = res.data['left']
        this.partNames[1].options = res.data['right']
        this.partNames[2].options = res.data['other']
      })
    },
    remoteMethod(query) {
      getPartNames({ partName: query }).then((res) => {
        this.partNames[0].options = res.data['left']
        this.partNames[1].options = res.data['right']
        this.partNames[2].options = res.data['other']
      })
      // this.partNames.map((list, index) => {
      //   this.partNames[index].options = list.options.filter(item => {
      //     return item.indexOf(query) > -1
      //   })
      // })
    },
    // 返回
    back() {
      this.fatherClose()
    },
    // 删除
    delectEdit(option, index) {
      this.$confirm('确定要删除么, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.resData.splice(index, 1)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    onCarouselChange(index) {
      this.imgActiveIndex = index
    },
    // 底部图片导航列表
    handleImgClick(index) {
      this.imgActiveIndex = index
      this.$refs.carousel.setActiveItem(index)
    },
    // 底部图片导航列表上一张
    handlePrev() {
      if (this.imgActiveIndex === 0) {
        this.imgActiveIndex = this.imgItem.length
      }
      this.imgActiveIndex--
      this.$refs.carousel.setActiveItem(this.imgActiveIndex)
    },
    // 底部图片导航列表下一张
    handleNext() {
      if (this.imgActiveIndex >= this.imgItem.length - 1) {
        this.imgActiveIndex = 0
      } else {
        this.imgActiveIndex++
      }
      this.$refs.carousel.setActiveItem(this.imgActiveIndex)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped lang="scss">
.container {
  padding: 10px;
  position: relative;
}
.grid-content {
  min-height: 200px;

}
.getxjBox {
  position: relative;
  height: 60px;
  padding: 10px 20px;
  p {
    font-size: 14px;
    line-height: 18px;
    color: #333;
  }
  h1 {
    font-size: 20px;
    line-height: 22px;
  }
}
.smallT {
  font-size: 14px;
  color: #333;
  font-weight: normal;
}
.rightP {
  text-align: right;
}
.leftP {
  text-align: left;
}
.bgimg {
  text-align: center;
}
.iconfont {
  font-size: 20px;
  // color: #ef5656;
}
.basicInfoBox {
  position: relative;
  margin-bottom: 15px;
}
.dateText{
  font-size: 14px;
  color: #666;
  float: right;
  font-weight: normal;
  padding-right: 42px;
}
.infoBox {
  position: relative;
  border: 1px solid #ddd;
  padding: 10px;
}
.info-content {
  line-height: 30px;
  font-size: 14px;
  color: #666;
}
.dioHei {
    position: relative;
    max-height: 730px;
    overflow-y: auto;
    overflow-x: hidden;
    padding-bottom: 60px;
    .footerBox {
      position: absolute;
      z-index: 10;
      height: 60px;
      bottom: 0;
      left: 0;
      right: 0;
      text-align: center;
      line-height: 60px;
      box-shadow: 5px 0px 5px 2px rgba(221, 221, 221, 0.2);
    }
  }
.setHei{
  max-height: 650px;
    overflow-y: auto;
    overflow-x: hidden;
}
  .upload-warp {
    display: flex;
    height: 60px;
    //  background: rgba(0,0,0,0.5);
    &-left {
      flex-basis: 36px;
      line-height: 60px;
      text-align: center;
      font-size: 28px;
      color: #cccccc;
      cursor: pointer;
      transition: all 0.3s ease;
      &:hover {
        color: gray;
        transition: all 0.3s ease;
      }
    }
    &-center {
      flex-basis: calc(100% - 72px);
      display: flex;
      &-img {
        width: 20%;
        position: relative;
        border-radius: 2px;
        margin: 0 0px 0;
        img {
          width: 100%;
          height: 60px;
          box-sizing: border-box;
          border-radius: 2px;
          border: 1px solid transparent;
          opacity: 0.6;
        }
        .img-br {
          border: 1px solid #09f;
           opacity: 1;
        }
        i {
          position: absolute;
          right: -5px;
          top: -10px;
          width: 20px;
          height: 20px;
          line-height: 20px;
          text-align: center;
          background: #09f;
          color: white;
          border-radius: 100%;
          cursor: pointer;
          transition: all 0.3s ease;
          opacity: 0;
        }
        &:hover i {
          opacity: 1;
          transition: all 0.3s ease;
        }
      }
    }
  }

</style>
