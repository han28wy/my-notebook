### 响应式数据
reactive(只能传入对象类型的参数) 
ref（基本数据类型，获取时候要加上.value） 
toRefs(将响应式reactive对象转换为普通对象，多用于响应式对象转为普通对象后解构可以将reactive返回的对象中的属性都转成ref)
toRef (只希望转换一个reactive对象中的属性为ref，获取数据值需要加.value)
定义变量：
let total = ref(100)
let tableData = reactive<Resident>([])

### 监听
watch watchEffect watchPostEffect
withDefaults

setup: 用来写组合式 api，从生命周期钩子函数角度分析，在 creted 之前执行。不存在this

### main.js定义全局
定义全局用到的：app.config.globalProperties.$request = request
使用：
import { ref, onMounted, getCurrentInstance } from 'vue'
const {proxy} = getCurrentInstance()
proxy.$request

### watch的用法
首先分析参数（源[包含和组合：ref,reactive,函数返回值，上面组成的数组]，回调的函数(new, old, 处理副作用的回调函数)，可选参数对象[immediate, deep, flush, onTrack/onTrigger]）

### elementPlus里面关于数据类型判断的方法
const isNumber = (val: any): val is number => typeof val === 'number';
这个函数接受一个参数 val，类型为 any，并返回一个布尔值。通过类型谓词 val is number，函数指示当返回值为 true 时，参数 val 的类型是 number，反之则不是。