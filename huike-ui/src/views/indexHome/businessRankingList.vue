<template>
  <div class="sale-rank-list-right">
    <div class="sale-title">
      <h2>商机转化龙虎榜</h2>
      <div class="date">
        <!-- <el-form ref="listForm" :model="listForm" class="search-form">
          <el-form-item style="padding-left: 0px;">
            <el-select v-model="listForm.dateType" style="width: 100px;margin-right:10px;">
              <el-option v-for="(type) in dateTypeOptions" :key="type.dictValue" :label="type.dictLabel" :value="type.dictValue" />
            </el-select>
            <el-date-picker
              v-if="listForm.dateType === '0'"
              v-model="listForm.dateYear"
              type="year"
              placeholder="请选择"
            />
            <el-date-picker
              v-if="listForm.dateType === '1'"
              v-model="listForm.dateMonth"
              type="month"
              placeholder="请选择"
            />
            <el-date-picker v-if="listForm.dateType === '2'" v-model="listForm.dateDay" clearable unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" />
          </el-form-item>
        </el-form> -->
      </div>
    </div>
    <div class="list" style="height: 500px;">
      <el-scrollbar style="height:100%;width: 98%;">
        <el-table :data="chennlData" style="width: 96%;margin: 0 auto;" :default-sort="{ prop: 'saleNum', order: 'descending' }">
          <el-table-column prop="id" label="排名" align="center" width="80">
            <template slot-scope="{ row }">
              <div class="nomal">
                <span class="base-span" :class="{ 'active-one': row.chennlId === 1, 'active-two': row.chennlId === 2, 'active-three': row.chennlId === 3 }">{{ row.chennlId }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="create_by" label="用户姓名" align="left" show-overflow-tooltip />
          <el-table-column prop="deptName" label="部门" align="left" show-overflow-tooltip />
          <el-table-column prop="num" sortable label="商机转化数(个)" align="center" min-width="120" />
          <el-table-column prop="radio" sortable label="商机转化率(%)" align="center" min-width="120" />
        </el-table>
      </el-scrollbar>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    chennlData: {
      type: Array,
      require: true,
      default: () => []
    }
  },
  data () {
    return {
      listForm: {
        dateType: '2',
        dateYear: '',
        dateMonth: '',
        dateDay: ''
      },
      dateTypeOptions: [
        {
          dictLabel: '年',
          dictValue: '0'
        },
        {
          dictLabel: '月',
          dictValue: '1'
        },
        {
          dictLabel: '日',
          dictValue: '2'
        }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
  .sale-rank-list-right {
    width: 100%;
    height: 100%;
    padding-left: 20px;
  }
  /deep/ .el-table th{
    padding: 10px 0 !important;
  }
</style>
