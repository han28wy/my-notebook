### git clone --depth=1 <repository_url>
限制克隆操作只获取最近的一次提交记录，而不会拉取完整的提交历史。这可以有效减少克隆操作的时间和占用的存储空间，特别是对于大型仓库或者只需要最新代码的情况下。

只包含最新的提交记录。这意味着你将无法查询和访问以前的提交记录，也无法切换到其他分支。如果你需要完整的提交历史记录和完整的仓库功能，可以省略 --depth=1 选项或指定一个较大的深度值。

### git remote add
git remote add origin https://github.com/user/repo.git 远程仓库的 URL https://github.com/user/repo.git 添加到本地 Git 仓库，并将其别名设置为 origin。

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

### this.$attrs
可以在子组件里拿到父组件传过来但是没有在props里接收的值。
v-bind="$attrs" 使用

### vue @click.native和@click.stop和@click.self
@click.native 修饰符用于绑定原生 DOM 事件，而不是组件内部的事件。如果一个组件包含了一个原生的 button 元素，并希望在该元素被点击时触发某个事件，那么就可以使用 @click.native 修饰符来绑定该事件。
@click.stop 修饰符用于阻止事件冒泡。当一个元素被点击时，该事件会向上冒泡到父元素，并触发父元素上相应的事件处理函数。使用 @click.stop 修饰符可以阻止该事件继续向上冒泡，从而避免触发父元素上的事件处理函数。
@click.self 修饰符用于限制事件只在当前元素本身被点击时才触发。如果一个元素包含了子元素，并希望只在该元素本身被点击时触发某个事件，而不是在子元素被点击时触发该事件，那么就可以使用 @click.self 修饰符来限制事件只在当前元素本身被点击时触发。

### this.dispatch是怎么实现的
总结：在 Element UI 组件层次结构中查找具有特定 componentName 的父组件，并在找到该组件后触发该组件上的事件
```
    dispatch(componentName, eventName, params) {
      var parent = this.$parent || this.$root; //它被初始化为当前组件的父组件 ($parent) 或根组件 ($root)
      var name = parent.$options.componentName; //父组件的选项中的 componentName 值赋给变量 name

      while (parent && (!name || name !== componentName)) {
        parent = parent.$parent;

        if (parent) {
          name = parent.$options.componentName;
        }
      }
      if (parent) {
        parent.$emit.apply(parent, [eventName].concat(params));
      }
    },
```
举例在实现el-form-item里的使用
```
    mounted() {
      if (this.prop) {
        this.dispatch('ElForm', 'el.form.addField', [this]);

        let initialValue = this.fieldValue;
        if (Array.isArray(initialValue)) {
          initialValue = [].concat(initialValue);
        }
        Object.defineProperty(this, 'initialValue', {
          value: initialValue
        });

        this.addValidateEvents();
      }
    },
    beforeDestroy() {
      this.dispatch('ElForm', 'el.form.removeField', [this]);
    }
```