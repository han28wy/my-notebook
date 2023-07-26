### vue.extend用法 实现MessageBox弹窗
#### 1 正常写一个子组件
```
<template>
  <div id="confirm" v-if='flag'>
    <div class="contents" >
      <div class="content-top">{{text.title}}</div>
      <div class="content-center">{{text.msg}}</div>
      <div class="content-bottom">
        <button type='primary' @click='ok' class="left">{{text.btn.ok}}</button>
        <button type='info' @click='no' class="right">{{text.btn.no}}</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      flag:true,
      text:{
          title:'标题',
          msg:'这是一个弹出框组件',
          btn:{
              ok:'确定',
              no:'取消'
          }
      }
    }
  },
  methods: {
    ok(){
      this.flag=false;
    },
    no(){
      this.flag=false;
    }
  }
}
</script>

<style scoped>
 #confirm{
     position:fixed;
     left:0;
     top:0;
     right:0;
     bottom:0;
     background:rgba(0,0,0,0.3);   
 }
 .contents{
    width:250px;
    height:180px;
    border:1px solid #ccc;
    border-radius:10px;
    background-color:#fff;
    position:fixed;
    top:50%;
    left:50%;
    margin-top:-90px;
    margin-left:-125px;
}
.content-top{
    width:100%;
    height:40px;
    border-bottom:1px solid #ccc;
    text-align: center;
    font-size:20px;
    font-weight: 700;
    line-height:40px;
}
.content-center{
    width:90%;
    height:80px;
    margin:5px auto;
}
.content-bottom{
    width:85%;
    height:40px;
    margin:0 auto;
    /* border:1px solid red; */
    position:relative;
}
.left{
    position:absolute;
    left:0;
    width:40%;
}
.right{
    position:absolute;
    right:0;
    width:40%;
}
</style>


```
#### 2 messageBox.js文件
```
import Vue from 'vue'
import Confirm from './MessageBox.vue'

let confirmStructor=Vue.extend(Confirm)   //返回一个实例创建的构造器，但实例构造器需要进行挂载到页面中

let theConfirm=function(text){
    return new Promise((res,rej)=>{       //返回一个promise，进行异步操作，成功时返回，失败时返回
        let confirmDom=new confirmStructor({
            el:document.createElement('div')
        })
        //在body中动态创建一个div元素，之后此div将会替换成整个vue文件的内容
        //此时的confirmDom通俗讲就是相当于是整个组件对象，通过对象调用属性的方法来进行组件中数据的使用
        //可以通过$el属性来访问创建的组件实例
        document.body.appendChild(confirmDom.$el)

        //此时进行创建组件的逻辑处理
        confirmDom.text=text       //将需要传入的文本内容传给组件实例
        confirmDom.ok=()=>{     //箭头函数，在（）和{}之间增加=>,且去掉function
            res()   //正确时返回的操作
            confirmDom.flag=false;
        }
        confirmDom.no=()=>{
            rej()   //失败时返回的操作
            confirmDom.flag=false;
        }    
    })
}

//将逻辑函数进行导出和暴露
export default theConfirm


```
#### 3 在main.js挂载到全局
```
import theConfirm from './components/messageBox.js'
Vue.prototype.$Myconfirm=theConfirm
```
#### 4 在页面里使用
```
    this.$Myconfirm({
      title:'标题',
      msg:'内容',
      btn:{ ok:'确定', no:'取消'}
    }).then(()=>{
      console.log('ok')
    }).catch(()=>{
      console.log('no')
    })

```