#### 从以下几个方面对地图加载卡顿做出优化：
1.地图初始化，挂载到window，不赋值给响应式对象
2.定位逻辑优化，定位成功后，删除老定位点，新增定位标点
3.根据可视区域，处理数据，监听地图缩放和重新定位，重新绘制

p.s:收集资料过程有一些值得关注的优化方向：
1.根据缩放大小，只有放大地图到一定比例，才去加载标点

#### 地图优化-可视区域 加载标点





#### 一些新get的amap操作
###### 1.获取可视窗口
```
  const screenRange = window.map.getBounds()
  const northEast = [screenRange.northEast.lng, screenRange.northEast.lat]
  const southEast = [screenRange.southWest.lng, screenRange.northEast.lat]
  const northWest = [screenRange.northEast.lng, screenRange.southWest.lat]
  const southWest = [screenRange.southWest.lng, screenRange.southWest.lat]
  const path = [northEast, southEast, southWest, northWest]
```
###### 2.画多边形
```
   const rectangle = new AMap.Polygon({
    map: window.map,
    path: path,
    strokeStyle: 'dashed',
    fillColor: 'lightblue',
    fillOpacity: 0.5,
    cursor: 'pointer',
    zIndex: 50,
  })
  window.map.add(rectangle)
```
###### 3.判断标点是否在区域内
```
AMap.GeometryUtil.isPointInRing(point, path)
```
###### 4.地图添加事件
```
  window.map.on('moveend', () => {
    console.log('地图中心点变化')
    reRender()
  })
```
###### 删除图层
```
window.layer.clear()
```

###### 删除老定位点
```
window.layer.remove(state.currLocMarker)
```
###### 重新定位后，增加新标点
```
    const marker = {
      name: '当前位置',
      longitude: currentIpLocation.value[0],
      latitude: currentIpLocation.value[1],
      image: iconGreen,
      backgroundColor: '#04DEA7',
    }
    addCurrentLocMarkers(marker, handleClickMarker).then((res: any) => {
      state.currLocMarker = res
    })

// map.ts 增加单个标点
export const addCurrentLocMarkers = (marker: any, callback: any) => {
  return new Promise((resolve, reject) => {
    const curData = {
      position: [parseFloat(marker.longitude), parseFloat(marker.latitude)],
      icon: {
        type: 'image', // 图标类型，现阶段只支持image
        image: marker.image, //  图标地址
        size: [15, 16], // 图片尺寸
        anchor: 'bottom-center', // 图片相对 position 的锚点，默认为 bottom-center
        angel: 0,
        retina: true,
      },
      text: {
        content: marker.name, // 要展示的文字内容
        offset: [0, 0], // 文字方向，有 icon 时为围绕文字的方向，没有 icon 时，则为相对 position 的位置
        style: {
          fontSize: 12, // 字体大小
          fillColor: 'white', // 字体颜色
          backgroundColor: marker.backgroundColor,
          padding: '5 10',
        },
      },
      extData: marker.extData,
    }
    const currMarker = new AMap.LabelMarker(curData)
    if (callback) {
      currMarker.on('click', callback, marker)
    }
    window.layer.add(currMarker)
    resolve(currMarker)
  })
}
```
