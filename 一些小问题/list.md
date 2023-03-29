遗忘曲线：5min-30min-12h-1d-2d-4d-7d-15d

 ### forEach没有return; 
 改用for循环，或者用break结束

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

### 纯数字和字母在div里无法换行
word-break:break-all; （允许在单词内换行。）

### 背景图片要显示在div上面的修改
原：
<div1>设置了background-img  <div2> margin-top:-20px 遮挡了div1
改：
<div par>设置position:relative; width: ;height: ''
<img> position:absolute; z-index:999
<div2> position:absolute; left: ; top:

### display属性
block: 独占一行可设置宽高、margin、padding
inlne: 不独占一行，不可设置宽高，可设置水平margin、padding但不能设置垂直方向margin、padding

### 隐藏元素
display: none
visibility:hidden 不可见，有占位
opacity: 0 透明，占位
position: absolute 移除可见范围了
z-index: -999 设置在最底部

### 加载样式 link和@import
link可以加载css、rss; 页面载入时同时加载; 无兼容问题; 可被js操作dom去除
@import只能加载css; 页面载入后再加载; 低版本浏览器不兼容

### 伪元素 伪类
伪元素：只会显示其内容，但是并不会在dom树中找到他
p::before {content:"111";}
p::after {content:"111";}
p::first-line {background:red;}
p::first-letter {font-size:30px;}

伪类：将一些效果加到节点上，例如鼠标点击，悬浮等
a:hover {color: #FF00FF}
p:first-child {color: red}

### 提升css性能
css代码压缩
link代替@import
避免多层选择器
动画CPU加速

### 单行，多行溢出添加省略号
overflow: hidden; 
text-overflow: ellipsis;
white-space: nowrap;
下面时多行：
overflow: hidden;
text-overflow: ellipsis;
display: -webkit-box;
-webkit-box-orient: vertical;
-webkit-line-clamp: 3;

### 自适应布局
1 用媒体查询 @media only screen and (width: 960px)+less+rem
2 flexible.js+less+rem

### em和rem 
em根据父元素font-size rem根据根元素font-size

### 配置scss和sass文件
1 不能同时安装node-sass 和 sass 因为会优先使用sass;
2 element使用sass-loader+node-sass; Plus使用sass;

### flex:1
等于flex: 1 1 auto 等于 flex-grow:1;flex-shrink:1; flex-basis:auto
flex-grow:在当前（父）元素中占多少份；
flex-basis:在flex容器占有的比例；
flex-shrink:如果超过容器，就会按比例收缩；
用在：两栏布局（左边固定，右边自适应）三栏布局（左右固定，中间自适应）

### 水平和垂直居中
1 外层相对定位+内层绝对定位 left:50%;top:50%;transform:translate(-50%,-50%)
2 flex

### 对话框下面小尾巴
.con_question::before{
content: '';
width: 0;
height: 0;
border: 8px solid;
position: absolute;
bottom: 5px;
right: 34px;
border-color:  transparent transparent transparent red ;
}

### 字体小于12px
transform: scale(0.8);

### 修改node_modules里的代码
工具：patch-package
需要把pathch提交到git，需要在package.json添加"postinstall": "patch-package"
当其他人执行npm i时候，会自动执行npm run postinstall命令，把补丁放到对应包里