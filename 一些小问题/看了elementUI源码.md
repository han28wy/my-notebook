### prop里可以加校验的
      effect: {
        type: String,
        default: 'light',
        validator: function(value) {
          return ['light', 'dark'].indexOf(value) !== -1;
        }
      }

### 单个组件 Alert.install方法
```
import Alert from './src/main';

/* istanbul ignore next */ // 注释用于将下一行代码排除在 Istanbul 代码覆盖工具生成的代码覆盖率报告之外
Alert.install = function(Vue) { // 这使得 Alert 组件可以在任何 Vue.js 实例或组件中使用，而无需每次都导入它。
  Vue.component(Alert.name, Alert); // 安装为全局组件
};

export default Alert;
```
### <transition name="el-alert-fade">
vue transition
过渡的动画效果

### vue有class和style绑定
#### 对象语法：
<div
  class="static"
  v-bind:class="{ active: isActive, 'text-danger': hasError }"
></div>
data: {
  isActive: true,
  hasError: true
}
相当于 <div class="static active text-danger"></div>

#### 数组语法：
<div v-bind:class="[activeClass, errorClass]"></div>
data: {
  activeClass: 'active',
  errorClass: 'text-danger'
}
相当于 <div class="active text-danger"></div>

#### 通常绑定计算属性
<div v-bind:class="classObject"></div>
computed: {
  classObject: function () {
    return {
      active: this.isActive && !this.error,
      'text-danger': this.error && this.error.type === 'fatal'
    }
  }
}

### this.$on
要在created/mounted时候！
vm.$on(event, callback) event 表示要监听的自定义事件的名称，可以是一个字符串或一个数组；callback 表示当该自定义事件被触发时所要执行的回调函数。
使用 $off 方法将事件监听移除

### this.$slots
this.$slots 对象包含了当前组件的所有插槽内容，其中每个插槽都是一个数组。如果某个插槽没有内容，则对应的数组为空数组。可以通过插槽名或缺省插槽名称来访问对应的插槽内容;
this.$slots.header 访问的是名为 header 的具名插槽的内容，
this.$slots.default 访问的是缺省插槽的内容。

### vue @click.native和@click.stop和@click.self
@click.native 修饰符用于绑定原生 DOM 事件，而不是组件内部的事件。如果一个组件包含了一个原生的 button 元素，并希望在该元素被点击时触发某个事件，那么就可以使用 @click.native 修饰符来绑定该事件。
@click.stop 修饰符用于阻止事件冒泡。当一个元素被点击时，该事件会向上冒泡到父元素，并触发父元素上相应的事件处理函数。使用 @click.stop 修饰符可以阻止该事件继续向上冒泡，从而避免触发父元素上的事件处理函数。
@click.self 修饰符用于限制事件只在当前元素本身被点击时才触发。如果一个元素包含了子元素，并希望只在该元素本身被点击时触发某个事件，而不是在子元素被点击时触发该事件，那么就可以使用 @click.self 修饰符来限制事件只在当前元素本身被点击时触发。