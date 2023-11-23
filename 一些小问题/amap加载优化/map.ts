import AMapLoader from '@amap/amap-jsapi-loader'
import { showLoadingToast, closeToast } from 'vant'

// 创建地图
export const initMap = (name: string, config: any) => {
  return new Promise((resolve, reject) => {
    AMapLoader.load({
      key: '*************', // 申请好的Web端开发者Key，首次调用 load 时必填
      version: '2.0', // 指定要加载的 JSAPI 的版本
      // 需要使用的的插件列表
      plugins: [
        'AMap.Geolocation', // 逆向地理解码插件
        // 'AMap.LabelMaker', // 点标记插件
      ],
    })
      .then((AMap) => {
        const map = new AMap.Map(name, {
          zoom: config.zoom,
          center: config.center,
        })
        resolve(map)
      })
      .catch((e) => {
        reject(e)
      })
  })
}

// 添加地图标记
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
    // 为了方便删除
    resolve(currMarker)
  })
}

// 添加 文本标记列表
export const addLabelMarkers = (map: any, list: any, callback: any) => {
  return new Promise((resolve, reject) => {
    const markerList: any = []
    list.forEach((item: any) => {
      if (item.longitude && item.latitude) {
        const curData = {
          position: [parseFloat(item.longitude), parseFloat(item.latitude)],
          icon: {
            type: 'image', // 图标类型，现阶段只支持image
            image: item.image, //  图标地址
            size: [15, 16], // 图片尺寸
            anchor: 'bottom-center', // 图片相对 position 的锚点，默认为 bottom-center
            angel: 0,
            retina: true,
          },
          text: {
            content: item.name, // 要展示的文字内容
            offset: [0, 0], // 文字方向，有 icon 时为围绕文字的方向，没有 icon 时，则为相对 position 的位置
            style: {
              fontSize: 12, // 字体大小
              fillColor: 'white', // 字体颜色
              backgroundColor: item.backgroundColor,
              padding: '5 10',
            },
          },
          extData: item.extData,
        }
        const circleMarker = new AMap.LabelMarker(curData)
        if (callback) {
          circleMarker.on('click', callback, item)
        }
        markerList.push(circleMarker)
      }
    })
    const layer = new AMap.LabelsLayer({
      zIndex: 1000,
      opacity: 1,
      collision: true,
      animation: true,
    })
    map.add(layer)
    layer.add(markerList)
    resolve(layer)
  })
}

export const resetZoomAndCenter = (map: any, zoom: any, center: any) => {
  map?.setZoomAndCenter(zoom, center)
}

// 定位
export const getCurrentLocation = () => {
  return new Promise((resolve, reject) => {
    AMap.plugin('AMap.Geolocation', function () {
      const geolocation = new AMap.Geolocation({
        enableHighAccuracy: true, // 是否使用高精度定位，默认：true
        timeout: 10000, // 设置定位超时时间，默认：无穷大
        offset: [10, 20], // 定位按钮的停靠位置的偏移量
        zoomToAccuracy: true, //  定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
        position: 'RB', //  定位按钮的排放位置,  RB表示右下
      })
      showLoadingToast({
        duration: 0,
        message: '定位中...',
      })
      geolocation.getCurrentPosition(function (status, result) {
        if (status === 'complete') {
          closeToast()
          resolve(result)
        } else {
          closeToast()
          resolve('')
        }
      })
    })
  })
}
