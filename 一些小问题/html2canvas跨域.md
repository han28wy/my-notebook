### 题目:html2canvas加载oss图片的跨域问题
现象：实现一个网页转图片的功能。使用html2canvas把网页转图片，显示空白。
原因分析：html2canvas 在渲染过程中会创建 Image 对象来加载页面中的图片资源。
#### 踩坑1：
按照网上的教程做了以下修改：
<img>标签增加crossorigin="anonymous"属性，
html2canvas增加useCORS：true属性，修改后的代码如下

        html2canvas(this.$refs.shareContent, { useCORS: true }).then(
          function (canvas) {
            const imgData = canvas.toDataURL('image/png')
            downloadLink.href = imgData
          },
        )

并且oss服务器的配置也做了修改：
Access-Control-Allow-Origin 设置为* 或者指定ip
结果：安卓手机功能正常，ios手机无法展示图片，因为ios的webview对同源校验更加严格；

#### 最终解决：
后端提供一个oss链接转为base64的接口，<img>标签里展示这个base64链接，html2canvas就可以正常渲染了。
修改后的代码如下：
template部分:
  <img :src="imageBase64" class="bg">

  js部分：
        const coverUrl = await this.imgUrlToBase64(res.data.img) //  base64数据
          this.$set(
          this.imageBase64,
          'imageBase64',
          'data:image/png;base64,' + coverUrl,
          )

oss链接转base64
    async fetchAndConvertToBase64(url) {
      try {
    // 1. 使用fetch获取图片资源
    const response = await fetch(url);
    // 2. 转换为blob
    const blob = await response.blob();
    // 3. 使用FileReader读取blob为base64
    const reader = new FileReader();
    const base64String = await new Promise((resolve, reject) => {
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
    return base64String;
  } catch (error) {
    console.error('Error converting image to base64', error);
  }
    },