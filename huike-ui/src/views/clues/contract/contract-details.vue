<template>
  <div class="customer-detail-box">
    <el-row>
      <el-col :span="24">
        <div class="l-box">
          <div class="l-top-box">
            <div class="title-box">
              <span class="title-label">合同详情</span>
              <div class="btn-box">
                <el-button
                  icon="el-icon-view"
                  class="cus-reset-btn"
                  @click="previewHandle(dataForm.fileName)"
                >预览</el-button>
              </div>
            </div>
            <div class="con-box">
              <div class="info-box">
                <div class="info-list mt0">
                  <span class="label">客户姓名</span>
                  <span class="des">{{ dataForm.name }}</span>
                </div>
                <div class="info-list mt0">
                  <span class="label">购买学科</span>
                  <span class="des">{{ subjectFormat(dataForm.subject) }}</span>
                </div>
                <div class="info-list mt0">
                  <span class="label">购买课程</span>
                  <span class="des">{{ dataForm.courseName }}</span>
                </div>
                <div class="info-list mt0">
                  <span class="label">购买金额</span>
                  <span class="des">{{ dataForm.order }}</span>
                </div>
                <div class="info-list">
                  <span class="label">是否折扣</span>
                  <span class="des">{{ (dataForm.discountType&&dataForm.discountType!=='无')?'是':'否' }}</span>
                </div>
                <div class="info-list">
                  <span class="label">创建时间</span>
                  <span class="des">{{ dataForm.createTime }}</span>
                </div>
                <div class="info-list">
                  <span class="label">折扣类型</span>
                  <span class="des">{{ dataForm.discountType }}</span>
                </div>
              </div>
            </div>
            <div class="search-btn">
              <el-button class="cus-reset-btn" @click="goPage()">返回</el-button>
            </div>
          </div>
          <div v-if="false" class="l-top-box">
            <div class="title-box">
              <span class="title-label">审核流程</span>
            </div>
            <div class="con-box flow-box">
              <div class="steps-box">
                <div v-for="(item,index) in stepsList" v-show="item.showFlag" :key="item.id" class="steps-list" :class="{'actived':item.id<=activated,'reject-current':(item.id==activated && currentFlow.status==3), 'finish-step':(activated==5&&item.id==5)}">
                  <div class="step-item">
                    <div class="step">
                      {{ (item.id===5&&!stepsList[2].showFlag)?4:((item.id===4&&!stepsList[2].showFlag)?3:index+1) }}
                      <span v-show="item.id!=1 && (item.id<activated || (item.id==activated && currentFlow.status==2) || item.id < flows.length)" class="pass-box"><i class="el-icon-check" /></span>
                      <span v-show="item.id!=1 && (item.id==activated && currentFlow.status==3)" class="reject-box"><i class="el-icon-close" /></span>
                    </div>
                    <div v-if="item.id<5" class="line-box">
                      <span class="line">
                        <i class="el-icon-arrow-right" />
                      </span>
                    </div>
                  </div>
                  <div class="step-con">
                    <div v-show="item.id<5" class="des">{{ item.des }}</div>
                    <div class="name">{{ item.name }}</div>
                    <div v-show="item.id==1" class="date-box">
                      <div class="date-label">提交时间</div>
                      <div class="date">{{ dataForm.createTime }}</div>
                    </div>
                    <div v-show="item.id==5&&activated==5" class="date-box">
                      <div class="date-label">完成时间</div>
                      <div class="date">{{ dataForm.finishTime }}</div>
                    </div>
                    <div v-show="item.id==activated && currentFlow.status==3" class="date-box">
                      <div class="date-label">驳回原因：</div>
                      <div class="date">{{ currentFlow.rejectionReasons }}</div>
                      <!-- <div class="date-label">备注：</div>
                        <div class="date">{{ currentFlow.remark }}</div> -->
                      <div class="date-label">驳回时间：</div>
                      <div class="date">{{ currentFlow.rejectionTime }}</div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
            <div class="search-btn">
              <el-button v-if="showBtnFlag" v-hasPermi="['contract:contract:pass']" class="primary-btn" @click="rejectHandle()">驳回</el-button>
              <el-button v-if="showBtnFlag" v-hasPermi="['contract:contract:reject']" class="cus-search-btn" @click="submitForm()">通过</el-button>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="goPage" />
    <preview-pdf v-if="pdfVisible" ref="pdf" title="预览合同" :pdf-url="pdfUrl" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getContract, passContract } from '@/api/contract/contract'
import { listCourseSelect } from '@/api/clues/course'
import AddOrUpdate from './reject-contract'
import PreviewPdf from '@/components/PreviewPdf'
export default {
  components: {
    AddOrUpdate,
    PreviewPdf
  },
  filters: {},
  data () {
    return {
      addOrUpdateVisible: false,
      saveLoading: false,
      showBtnFlag: false,
      // 详情数据
      dataForm: {
        id: '',
        pageType: 'info'
      },
      pdfUrl: '',
      pdfVisible: false,
      courseName: '',
      // order: '',
      // 意向学科字典
      subjectOptions: [],
      dataList: [],
      activated: 1,
      stepsList: [
        {
          id: 1,
          des: '发起人',
          name: '',
          showFlag: true
        },
        {
          id: 2,
          des: '销售主管',
          name: '',
          showFlag: true
        },
        {
          id: 3,
          des: '总经理',
          name: '',
          showFlag: true
        },
        {
          id: 4,
          des: '财务主管',
          name: '',
          showFlag: true
        },
        {
          id: 5,
          des: '',
          name: '结束',
          showFlag: true
        }
      ],
      currentFlow: {
        // 1待审核 2 通过 3 不通过
        status: 3,
        rejectionReasons: '',
        // remark: '',
        rejectionTime: ''
      },
      flows: [],
      allUsers: {}
    }
  },
  computed: {
    ...mapGetters(['name']),
    rules () {
      return {

      }
    }
  },
  watch: {},
  created () {
    const queryParams = this.$route.query
    this.dataForm = {
      ...this.dataForm,
      ...queryParams
    }
    this.getDicList()
    this.getInfo()
  },
  mounted () {},
  methods: {
    async getInfo () {
      const res = await getContract(this.dataForm.id)
      if (res.code !== 200) {
        return this.$message.error(res.msg)
      }
      this.dataForm = {
        ...this.dataForm,
        ...res.data
      }
      // this.allUsers = res.data.allUsers
      // this.flows = res.data.flows
      // // 加载流程信息
      // this.getFlowInfo()
      // this.showAudit()
      if (this.dataForm.courseId !== null && this.dataForm.courseId !== '') {
        this.getCourseList()
      }
    },
    // 加载流程信息
    getFlowInfo () {
      // this.dataForm.order = 20000
      // 是否显示总经理
      this.stepsList[2].showFlag = this.dataForm.order >= 10000
      this.stepsList[0].name = this.allUsers.assignee0
      this.stepsList[1].name = this.allUsers.assignee1
      this.stepsList[2].name = this.allUsers.assignee2
      this.stepsList[3].name = this.allUsers.assignee3

      // 判断是否流程结束
      if (((this.dataForm.order >= 10000 && this.flows.length === 4) || (this.dataForm.order < 10000 && this.flows.length === 3)) && this.flows[this.flows.length - 1].status === '2') {
        this.activated = 5
      } else {
        if (this.flows[this.flows.length - 1].status === '3') {
          if (this.dataForm.order < 10000 && this.flows.length === 3) {
            this.activated = 4
          } else {
            this.activated = this.flows.length
          }
        } else {
          this.activated = this.flows.length - 1
        }
      }

      console.log('this.activated', this.activated)

      this.currentFlow = JSON.parse(JSON.stringify(this.flows[this.flows.length - 1]))
    },

    // 判断显示审核按钮
    showAudit () {
      // 详情和流程结束/当前流程为拒绝状态 都无法审核
      if (this.dataForm.pageType !== 'audit' || this.activated === 5 || (this.activated < 5 && this.flows[this.flows.length - 1].status === '3')) {
        this.showBtnFlag = false
      } else {
        let name = this.allUsers['assignee' + (this.flows.length - 1)]

        if (this.flows.length === 3 && this.dataForm.order < 10000) {
          name = this.allUsers.assignee3
        }
        // 当前用户未该流程审核人
        this.showBtnFlag = name === this.name
      }
    },
    // 所有课程列表
    async getCourseList () {
      const res = await listCourseSelect()
      if (res.code !== 200) {
        return this.$message.error(res.msg)
      }
      this.courseOptions = res.data
      const course = this.courseOptions.find(item => item.id === this.dataForm.courseId)
      if (course) {
        this.courseName = course.name
        // this.order = course.price
      }
    },
    // 意向学科字典翻译
    subjectFormat (val) {
      return this.selectDictLabel(this.subjectOptions, val)
    },
    getDicList () {
      this.getDicts('course_subject').then(response => {
        this.subjectOptions = response.data
      })
    },
    rejectHandle () {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.form.id = this.dataForm.id
        this.$refs.addOrUpdate.init()
      })
    },
    // 审核通过
    submitForm () {
      this.$confirm('确认审核通过?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const res = await passContract(this.dataForm.id)
          if (res.code !== 200) {
            return this.$message.error(res.msg)
          }
          this.msgSuccess('操作成功')
          this.goPage()
        }).catch(() => {

        })
    },
    // 预览
    previewHandle (url) {
      console.log('previewHandle')
      this.pdfUrl = process.env.VUE_APP_BASE_API_URL + url
      this.pdfVisible = true
      this.$nextTick(() => {
        this.$refs.pdf.visible = true
        this.$refs.pdf.init()
      //   this.$refs.allot.init()
      })
    },
    goPage () {
      this.$router.push({ path: '/contract' })
    }
  }
}
</script>
<style lang="scss" scoped>
@import "~@/assets/styles/modules/clue-details.scss";
.customer-detail-box{
  .flow-box{
    padding: 58px 120px 0 97px !important;
  }
  .info-list{
    width: 25% !important;
  }
  .steps-box{
    display: flex;
    .steps-list{
      flex-basis: 50%;
      .step-item{
        display: flex;
        height: 45px;
        align-items: center;
        .step{
          width: 45px;
          height: 45px;
          line-height: 39px;
          border: 3px solid #e9e9eb;
          border-radius: 50%;
          font-size: 24px;
          font-weight: 500;
          color: #666666;
          text-align: center;
          position: relative;
        }
      }
      &:nth-child(5){
        max-width: 50px;
        text-align: center;
      }
    }
    .step-con{
      margin-top: 8px;
      .des{
        height: 17px;
        line-height: 17px;
        font-size: 12px;
        font-weight: 500;
        color: #666666;
      }
      .name{
        height: 20px;
        line-height: 20px;
        margin-top: 6px;
        font-size: 14px;
        font-weight: 500;
        color: #333333;
      }
      .date-box{
        padding-top: 10px;
        .date-label{
          height: 18px;
          line-height: 18px;
          font-size: 13px;
          font-weight: 500;
          color: #666666;
          margin-top: 8px;
        }
        .date{
          margin-top: 8px;
          height: 18px;
          line-height: 18px;
          font-size: 13px;
          font-weight: 400;
          color: #333333;
        }
      }
    }
  }

  .line-box{
    position: relative;
    height: 30px;
    flex: 1;
    margin: 0 20px 0 20px;
    .line{
      width: 100%;
      height: 1px;
      border-bottom: 1px dashed #e9e9eb;
      display: inline-block;
      font-size: 14px;
      color: #e9e9eb;
      position: relative;
      i{
        position: absolute;
        right: -7px;
        top: -6px;
      }
    }
  }
  .actived{
    .step{
      border: 3px solid #05cc95 !important;
      color: #05cc95 !important;
    }
    .line{
      border-bottom: 1px dashed #05CC95;
      color: #05CC95;
    }
  }
  .reject-current{
    .line{
      border-bottom: 1px dashed #e9e9eb;
      color: #e9e9eb;
    }
  }
  .pass-box{
    width: 24px;
    height: 24px;
    line-height: 24px;
    text-align: center;
    background: #05cc95;
    border-radius: 50%;
    box-shadow: 0px 2px 4px 0px rgba(39,155,123,0.21);
    font-size: 16px;
    color: #ffffff;
    position: absolute;
    right: -12px;
    bottom: 0;
  }
  .reject-box{
    width: 24px;
    height: 24px;
    line-height: 24px;
    text-align: center;
    background: #fd7065;
    border-radius: 50%;
    box-shadow: 0px 2px 4px 0px rgba(52,56,55,0.21);
    font-size: 16px;
    color: #ffffff;
    position: absolute;
    right: -12px;
    bottom: 0;
  }
  .search-btn{
    // padding: 100px 0;
    padding: 20px 0;
    text-align: right;
  }
  .finish-step{
    max-width: 130px !important;
    text-align: left !important;
  }
}

</style>
