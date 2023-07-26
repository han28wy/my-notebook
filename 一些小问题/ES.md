一些es10
#### ?.
链式的访问对象里的属性，遇到null或undefined后不会报错，会返回undefined

#### ??
提供默认值

#### 动态加载模块
```
import(modulePath)
  .then(module => {
    // Use module
  })
  .catch(error => {
    // Handle error
  });

```
示例：
```
button.addEventListener('click', event => {
  import('./test.js')
    .then(test => {
      test();
    })
    .catch(error => {
      // Handle error
    });
});
```

