记录打包工具从webpack2.9.0升级到vite的历程：
项目：vue2.3+elementUI,vux,iview+webpack2.9.0
实施过程：
1 熟悉vite; 用vite3+vue2.7搭建框架,引入element,iview等本项目内容，先熟悉一波操作；
2 根据第一个原始框架，把核心东西放到老项目里，能npm run dev运行
3 解决报错，我记得有一些
深度选择器使用：deep();
requeire无法识别，修改图片和工具引入和export方式；
iview用<i- >这种形式无法识别；
使用jsx语法的有部分需要修改为直给的方式才能显示，出现于<Table ：colum;
4 去掉所有vux,替换成别的
4 element-ui自定义主题引入
打包部署之后的问题：
5 修复iview字体不显示问题
6 富文本编辑器