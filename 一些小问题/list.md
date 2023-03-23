遗忘曲线：5min-30min-12h-1d-2d-4d-7d-15d

 forEach没有return; 改用for循环，或者用break结束

 ### <el-table>+tab 组合，
 tab使用一个table组件 出现表格列错 加key<el-table :key= >

 ### 网页变成默哀模式：
 filter:grayscale(0.9)

 ### node-sass sass-loader node之间适配问题：

 ### package.json里的版本号 
 ~表示适配最近的小版本 ~1.0.2可以适配1.0.X;  ^表示适配最近的大版本^1.0.2 可以适配1.X.X

### background-attachment:fixed
对于要固定背景的，使用background-attachment:fixed 在ios上不生效，会出现背景抖动；

### el-tree动态化的展示勾选框：
设置某些节点的禁用状态+设置对应节点checkbox样式为display:none
{
    name: item.name,
    id: item.uuid,
    leaf: item.leaf,
    disabled: true
}
 /deep/.el-checkbox__input.is-disabled .el-checkbox__inner{
    display: none
}


### 封装element表格，分页部分
<template>
  <div class="table" element-loading-text="加载中">
    <slot />
    <div class="pagination" style="margin-top: 10px">
      <el-pagination
        background
        @size-change="changePageSize"
        @current-change="changePageNum"
        :current-page="pageNum"
        :page-size="pageSize"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, prev, pager, next, sizes, jumper"
        :total="total"
      />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    pageNum: {
      type: Number,
      default: 1
    },
    pageSize: {
      type: Number,
      default: 1
    },
    total: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {}
  },
  methods: {
    changePageSize(val) {
      this.pageSize = val
      this.$emit('refresh', this.pageNum, this.pageSize)
    },
    changePageNum(val) {
      this.pageNum = val
      this.$emit('refresh', this.pageNum, this.pageSize)
    }
  }
}
</script>

// 引用
  <emsTable :page-num.sync="pageNum" :page-size.sync="pageSize" :total.sync="total" @refresh="fetchData">
  </emsTable>

 fetchData(pageNum = 1, pageSize = 10){
     this.pageNum = pageNum
      this.pageSize = pageSize
 }
### 写一个公共less文件，用class=引入，不在<style>再写一遍
@import './style.less';