### Vue.js 3.0 响应式 API 比 2.x 好在哪儿
概念：数据变化，自动更新DOM
原理：数据解释，依赖更新
实现方法不同：
Proxy 劫持的是整个对象，那么对于对象属性的新增、删除、修改自然都可以劫持到；而Object.defineProperty API 劫持的对象某一个属性的访问和修改，因此它不能监听对象属性新增和删除。

### vue2h和vue3的v-model
Vue3 ：使用 modelValue 作为默认的属性名，并使用 update:modelValue 作为默认的事件名。这样做是为了与 Composition API 中的 ref 对象和 reactive 对象保持一致性。必须将子组件的属性名和更新事件名分别设置为 modelValue 和 update:modelValue。
在子组件使用：emits('update:modelValue', newValue)
Vue2: 是一个语法糖，是将 value 属性和 input 事件绑定到组件上，以实现双向数据绑定。默认情况下，v-model 指令会将父组件传递给子组件的值绑定到子组件的 value 属性上，并监听子组件的 input 事件来同步更新父组件的值。如果需要使用其他属性名和事件名，可以使用 model 选项来进行配置。
子组件使用：this.$emit('input', newValue)