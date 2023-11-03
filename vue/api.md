### 实例事件 $on,$once,$off
$on(event, callback) 监听自定义事件，事件可以由$emit触发，回调函数会接收所有传入事件触发函数的参数；
$once(event, callback) 监听一个自定义事件，但是只触发一次，在第一次触发之后移除监听器。
$off(event, callback) 移除自定义事件监听器。