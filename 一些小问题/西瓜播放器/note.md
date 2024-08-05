#### v2官方文档：
https://v2.h5player.bytedance.com/

#### 自定义样式：
1 npx xgplayer eject [targetDir] [skinName]命令 引入样式到指定文件夹下
2 业务代码里引入
import Player from 'xgplayer';
import './.xgplayer/skin/index.js';
3 直接在本地样式文件中修改
4 前提需要安装sass-loader和raw-loader
```
node-sass sass-loader与npm版本适配
node-sass:4.14.1  sass-loader:7.3.1  node:14+

webpack.base.conf.js配置
  {
        test: /\.svg/,
        loader: 'raw-loader'
  },
  {
        test: /\.scss$/,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader'
        ]
  },
```
#### 试看功能 非会员试看30s内容
playing状态时倒计时，pause和waiting状态暂停计时；
play状态不要加倒计时，会重复；

```
  this.player.on('pause', () => {
          clearInterval(this.timer)
        })
        this.player.on('waiting', () => {
          clearInterval(this.timer)
        })
        this.player.on('playing', () => {
          this.countDown()
        })
```