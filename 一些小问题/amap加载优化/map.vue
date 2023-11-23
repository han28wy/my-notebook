<script lang="ts" setup>
import { showLoadingToast, closeToast, showToast } from 'vant'
import { useStoreUser } from '@/store'
import {
  addLabelMarkers,
  getCurrentLocation,
  initMap,
  addCurrentLocMarkers,
} from './map.ts'

import {
  TwoBarTouchChange,
  CustomeGrayButton,
  BottomButtonGroup,
} from '@/components'

const props = defineProps({
  list: {
    type: Array,
    default: () => [],
    required: false,
  },
})

const showMap = ref(true)

onMounted(() => {
  console.log('初始化map   ', props.list)
  init()
})

const markerList = ref([
  { id: 4, title: '当前位置', pic: iconGreen },
  { id: 1, title: '高推荐', pic: iconRed },
  { id: 2, title: '中推荐', pic: iconYellow },
  { id: 3, title: '低推荐', pic: iconBlue },
])

const emits = defineEmits(['clickMarker', 'clickReturn'])

const state = reactive({
  center: [116.397428, 39.90923],
  originCenter: [116.397428, 39.90923],
  markers: null,
  zoom: 15,
  zoomOut: 18,
  currLocMarker: null,
})

const init = async () => {
  if (window.layer) {
    window.layer.clear()
  }
  initMap('map', { zoom: state.zoom, center: state.center })
    .then((AMap) => {
      window.map = AMap
      setMapListener()
      getCenterSpot().then((res) => {
        // 获取地图中心点
        console.log('res   center   ', res)
        // 重新定位
        resetZoomAndCenter([parseFloat(res[0]), parseFloat(res[1])])
        setTimeout(() => {
          // 过滤数据 获取可视区域标点列表
          const list = getScreenMarkerList()
          if (list.length > 0) {
            // 添加标点
            addLabelMarkers(window.map, list, handleClickMarker).then(
              (Layer) => {
                window.layer = Layer
              },
            )
          }
        }, 0)
      })
    })
    .catch((err) => {
      console.log(err)
    })
}

const getScreenMarkerList = () => {
  const screenRange = window.map.getBounds()
  const northEast = [screenRange.northEast.lng, screenRange.northEast.lat]
  const southEast = [screenRange.southWest.lng, screenRange.northEast.lat]
  const northWest = [screenRange.northEast.lng, screenRange.southWest.lat]
  const southWest = [screenRange.southWest.lng, screenRange.southWest.lat]
  const path = [northEast, southEast, southWest, northWest]
  // const rectangle = new AMap.Polygon({
  //   map: window.map,
  //   path: path,
  //   strokeStyle: 'dashed',
  //   fillColor: 'lightblue',
  //   fillOpacity: 0.5,
  //   cursor: 'pointer',
  //   zIndex: 50,
  // })
  // window.map.add(rectangle)
  const resultList = []
  props.list.forEach((item: any) => {
    if (item.longitude && item.latitude) {
      const point = [parseFloat(item.longitude), parseFloat(item.latitude)]
      const inCircle = AMap.GeometryUtil.isPointInRing(point, path)
      if (inCircle) {
        resultList.push({
          name: item.name,
          longitude: item.longitude,
          latitude: item.latitude,
          image: getMarkerIcon(item.recommendType),
          backgroundColor: getFillColor(item.recommendType),
          extData: {
            communityUuid: item.communityUuid,
          },
        })
      }
    }
  })
  console.log('result   ', resultList)
  return resultList
}

const getScreenMarkerList_v2 = () => {
  const screenRange = window.map.getBounds()
  const northEast = [screenRange.northEast.lng, screenRange.northEast.lat]
  const southEast = [screenRange.southWest.lng, screenRange.northEast.lat]
  const northWest = [screenRange.northEast.lng, screenRange.southWest.lat]
  const southWest = [screenRange.southWest.lng, screenRange.southWest.lat]
  const path = [northEast, southEast, southWest, northWest]

  const resultList = props.list
    .filter(
      (item) =>
        item.latitude &&
        item.longitude &&
        AMap.GeometryUtil.isPointInRing(
          [parseFloat(item.longitude), parseFloat(item.latitude)],
          path,
        ),
    )
    .map((item) => ({
      ...item,
      image: getMarkerIcon(item.recommendType),
      backgroundColor: getFillColor(item.recommendType),
      extData: {
        communityUuid: item.communityUuid,
      },
    }))
  console.log(resultList)
  return resultList
}

// 监听地图事件
const setMapListener = () => {
  window.map.on('moveend', () => {
    console.log('地图中心点变化')
    reRender()
  })
}

const reRender = () => {
  const list = getScreenMarkerList()
  addLabelMarkers(window.map, list, handleClickMarker).then((Layer) => {
    window.layer = Layer
  })
}

const handleClickMarker = (item) => {
  const pos = item.data.data.position
  window.map.setZoomAndCenter(state.zoomOut, [pos[0], pos[1]])
  emits('clickMarker', item.target.getExtData(), state)
}

// 处理后端返回经纬度列表
const formatMarkerList = () => {
  const list: any = []
  if (props.list.length > 0) {
    props.list.forEach((item: any) => {
      if (item.longitude && item.latitude) {
        list.push({
          name: item.name,
          longitude: item.longitude,
          latitude: item.latitude,
          image: getMarkerIcon(item.recommendType),
          backgroundColor: getFillColor(item.recommendType),
          extData: {
            communityUuid: item.communityUuid,
          },
        })
      }
    })
  }
  return list
}

const handleReturn = () => {
  resetZoomAndCenter(state.originCenter)
  emits('clickReturn')
}

const store = useStoreUser()
const reLocate = () => {
  getCurrentLocation().then((res: any) => {
    if (!res) {
      showToast('定位失败')
    } else {
      console.log('定位成功', res)
      const position = [
        parseFloat(res.position.lng),
        parseFloat(res.position.lat),
      ]
      store.setIpLocation(position)
      resetZoomAndCenter(position) // 重置地图中心点
      replaceCurrLocMarker(position) // 添加当前定位点
    }
  })
}

// 重新定位成功 替换当前位置的标注
const replaceCurrLocMarker = (position: any) => {
  // 移除上一次成功定位的标点
  if (state.currLocMarker) {
    window.layer.remove(state.currLocMarker)
  }
  // 添加当前位置
  if (currentIpLocation.value) {
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
  }
}

const currentIpLocation = storeToRefs(useStoreUser()).ipLocation
const getFirstLocationInList = () => {
  let position = []
  for (let i = 0; i < props.list.length; i++) {
    if (props.list[i]?.longitude && props.list[i]?.latitude) {
      position = [props.list[i].longitude, props.list[i].latitude]
      break
    }
  }
  return position
}

const getCenterSpot = () => {
  return new Promise((resolve, reject) => {
    const pos = getFirstLocationInList()
    if (pos && pos.length > 0) {
      state.center = pos
      state.originCenter = pos
    }
    resolve(state.center)
  })
}

const resetZoomAndCenter = (newValue: any) => {
  if (newValue) {
    state.center = newValue
    window.map?.setZoomAndCenter(state.zoom, state.center)
  } else {
    window.map?.setZoomAndCenter(state.zoom, state.originCenter)
  }
}
defineExpose({ resetZoomAndCenter })
</script>

<template>
    <!-- 地图 -->
    <div class="mt-8 border border-white border-solid rounded-lg bg-white">
      <div v-show="showMap" style="position: relative">
        <div
          style="z-index: 2000; position: absolute; top: 0.5rem; left: 0.5rem"
        >
          <van-button size="small" @click="handleReturn">返回</van-button>
        </div>
        <div
          style="z-index: 2000; position: absolute; top: 0.5rem; right: 0.5rem"
          @click="reLocate"
        >
          <iconpark-icon size="1.5rem" name="target-two"></iconpark-icon>
        </div>
        <div id="map" ref="map" style="height: 300px" />
        <!-- 图例 -->
        <div class="flex mt-3 pl-4">
          <div v-for="item in markerList" :key="item.id" class="flex w-1/4">
            <img :src="item.pic" style="width: 1rem; height: 1rem" />
            <div class="text-xs">{{ item.title }}</div>
          </div>
        </div>
    </div>
  </div>
</template>

<style lang="less" scoped>

</style>
