<template>
  <div class="map-chart">
    <div class="map-container" id="homeMap"></div>
    <div class="map-search">
      <el-form :inline="true" :model="searchForm">
        <el-form-item label="刻度">
          <!-- 添加刻度选择按钮 -->
          <el-select style="width: 150px" v-model="searchForm.selectedScale" @change="changeScale">
            <el-option v-for="item in scaleOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="井线图层" >
          <el-checkbox v-model="searchForm.siteLineLayerVisible"  @change="siteLineLayerChange"></el-checkbox>
        </el-form-item>
        <el-form-item label="定位" >
          <el-button @click="() => moveCenter()">初始化视图</el-button>
        </el-form-item>
        <el-form-item v-if="historyFenceLayerVisible" label="历史围栏">
          <el-select :loading="fenceDataLoading" style="width: 150px" v-model="searchForm.historyFence" @change="handleChangeHistoryFence">
            <el-option v-for="item in historyFenceOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="电子围栏" >
          <el-button :disabled="searchForm.fenceOperationPanelVisible" @click="handleFenceClick('add')">新增</el-button>
          <el-button :disabled="searchForm.fenceOperationPanelVisible" @click="handleFenceClick('edit')">编辑</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="info-wrapper" v-show="showInfo">
      <div class="info-item" v-for="(item, index) in infoData" :key="index">
        <div class="station-wrapper">
          <div class="station">{{ item.station }}</div>
        </div>
        <div class="device-name">{{ item.device }}</div>
        <div class="device-info">
          <div class="info" v-for="(info, index) in item.info" :key="index">
            <div class="value">{{ info.value }}℃</div>
            <div class="label">{{ info.label }}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="site-popover" ref="sitePopover" v-show="showSitePopover">
      <div class="site-popover-header">
        <div class="title" :title="currentSitePopoverFeature?.values_?.name || '-'">{{ currentSitePopoverFeature?.values_?.name || '-' }}</div>
        <el-icon class="close-icon" @click="() => showSitePopover = false"><Close /></el-icon>
      </div>
      <div class="site-popover-main">
        <el-button @click="emit('switchChart')">查看接线图</el-button>
      </div>
    </div>
    <template v-if="map">
      <FenceOperationPanel 
        v-model:visible="searchForm.fenceOperationPanelVisible" 
        :status="searchForm.fenceOperationPanelStatus"
        :mapInstance="map"
        :fenceData="currentSelectFence"
        @save="handleFenceUpdate" />
    </template>
  </div>
</template>

<script setup lang="ts">
import { getEnvironmentVariables } from '@/utils/common.js'
import { Close } from '@element-plus/icons-vue'
import proj4 from 'proj4'

import Map from 'ol/Map'
import View from 'ol/View'
import Feature from 'ol/Feature'
import TileLayer from 'ol/layer/Tile'
import ScaleLine, { type Units } from 'ol/control/ScaleLine'
import GeoJSON from 'ol/format/GeoJSON'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import XYZ from 'ol/source/XYZ'
import { register } from 'ol/proj/proj4'
// import { fromLonLat, transform } from 'ol/proj'
import { Point, LineString, Polygon, Circle } from 'ol/geom'
import { defaults as defaultControls } from 'ol/control'
import { Style, Fill, Stroke, Icon, Text, RegularShape } from 'ol/style'
import { Overlay } from 'ol'
import { siteData, powerLineData } from '@/views/Map/utils/mockData'
import { ElMessage, type CheckboxValueType } from 'element-plus'
import FenceOperationPanel from './FenceOperationPanel.vue'
import { useFenceStore } from '@/stores/fence'

const fence = useFenceStore()
const emit = defineEmits(['switchChart'])

const { VITE_MAP_ROAD_TILE_LAYER_URL } = getEnvironmentVariables()

// 刻度 ------ start
const scaleOptions = [
  { label: '度', value: 'degrees' },
  { label: '英制英尺', value: 'imperial' },
  { label: '美制英尺', value: 'us' },
  { label: '海里', value: 'nautical' },
  { label: '公制', value: 'metric' },
]
const scaleUnitMap: { [key: string]: Units } = {
  degrees: 'degrees',
  imperial: 'imperial',
  us: 'us',
  nautical: 'nautical',
  metric: 'metric'
} // 创建映射对象
const historyFenceOptions = computed(() => {
  const initOption = [
    {
      label: '全部围栏',
      value: '全部围栏',
    },
    {
      label: '不显示围栏',
      value: '不显示围栏',
    }
  ]
  return [
    ...initOption,
    ...fenceData.value.map((item: any) => ({
      label: item.name,
      value: item.name,
    }))
  ]
})
// 刻度 ------ end

// 站点弹出框 ------ start
const sitePopover = ref<any>(null)
const sitePopoverOverlay = ref<any>(null)
const showSitePopover = ref<boolean>(false);
const currentSitePopoverFeature = ref<any>(null);
// 站点弹出框 ------ end

const searchForm = ref({
  selectedScale: 'metric', // 刻度
  siteLineLayerVisible: true, // 井线图层
  historyFence: '全部围栏', // 历史围栏
  fenceOperationPanelVisible: false, // 电子围栏显隐
  fenceOperationPanelStatus: 'add', // 电子围栏工具状态
})

// 厂站标记和输电线路 ------ start
const siteFeatures = siteData.map((site) => {
  const feature = new Feature({
    geometry: new Point(site.coord),
    type: site.type,
    name: site.name,
    iconUrl: site.iconUrl,
  })
  return feature
})
const powerLineFeatures = powerLineData.map((line) => {
  const feature = new Feature({
    geometry: new LineString(line.coord),
    type: line.type,
    name: line.name,
    style: line.style,
  })
  return feature
})
const siteLineSource = new VectorSource({
  features: [...siteFeatures, ...powerLineFeatures],
})
const timer = ref<any>()
const currentFeature = ref<any>(null)
const showInfo = ref<boolean>(false)
const infoData = ref<any[]>([
  {
    station: '福成站',
    device: '#1主变压器',
    info: [
      { label: '油温1', value: '27.8' },
      { label: '油温2', value: '27.8' },
      { label: '绕温', value: '27.8' },
    ],
  },
  {
    station: '福成站',
    device: '#2主变压器',
    info: [
      { label: '油温1', value: '27.8' },
      { label: '油温2', value: '27.8' },
      { label: '绕温', value: '27.8' },
    ],
  },
  {
    station: '福成站',
    device: '#3主变压器',
    info: [
      { label: '油温1', value: '27.8' },
      { label: '油温2', value: '27.8' },
      { label: '绕温', value: '27.8' },
    ],
  },
])
// 厂站标记和输电线路 ------ end

// 地图 ------ start
const map = ref<any>(null) // 地图初始化
const roadTileLayer = new TileLayer({
  source: new XYZ({
    // url: `http://172.20.10.8:8080/mapabc/roadmap/{z}/{x}/{y}.png`,
    // url: VITE_MAP_ROAD_TILE_LAYER_URL
    url: '/server/public/mapabc/roadmap/{z}/{x}/{y}.png'
  })
}) // 加载地图瓦片
const districtLayer = new VectorLayer({
  source: new VectorSource({
    url: '/北海市.json',
    format: new GeoJSON(),
  }),
  style: new Style({
    stroke: new Stroke({ width: 0.5, color: 'rgba(6, 180, 244, 0.6)' }),
    fill: new Fill({ color: '#ffffff' }),
  }),
}) // 加载地图矢量图底图
const siteLineLayer = new VectorLayer({
  source: siteLineSource,
  style: (feature: any) => {
    const { geometry } = feature.values_ // 可以从values_里面获取源数据各个属性
    const type = feature.get('type'); // 也可以从通过get方法获取源数据各个属性
    // 站点样式
    if (type === 'site') {
      return new Style({
        image: new Icon({
          src: feature.get('iconUrl'),
          scale: 0.6,
          anchor: [0.5, 0.9],
        }),
        text: new Text({
          text: feature.get('name'),
          offsetX: 6,
          overflow: true,
          placement: 'point',
          textAlign: 'left',
          backgroundFill: new Fill({ color: 'rgba(255,255,255,0.9)' }),
          fill: new Fill({ color: '#333' }),
          stroke: new Stroke({ color: 'rgba(0, 0, 0, 0.2)', width: 1 }),
        }),
      })
    }
    // 输电线样式
    if (type === 'powerLine') {
      const tempArr = feature.get('style').split('-')
      const styles = [
        new Style({
          stroke: new Stroke({
            width: 1.5,
            color: tempArr[0],
            lineDash: tempArr[1] === 'dash' ? [10, 5] : [],
          }),
        }),
      ]
      if (tempArr[2]) {
        const coords = geometry.getCoordinates()
        const endPoint = coords[coords.length - 1]
        const prePoint = coords[coords.length - 2]
        const rotation = Math.atan2(endPoint[0] - prePoint[0], endPoint[1] - prePoint[1])
        styles.push(
          new Style({
            geometry: new Point(endPoint),
            image: new RegularShape({
              points: 3,
              radius: 7,
              rotation: rotation,
              fill: new Fill({ color: tempArr[0] }),
              stroke: new Stroke({ color: '#fff', width: 1 }),
            }),
          }),
        )
        if (tempArr[1] !== 'dash') {
          styles.push(
            new Style({
              geometry: new Point(endPoint),
              text: new Text({
                text: feature.get('name'),
                font: '14px',
                fill: new Fill({ color: '#000' }),
                stroke: new Stroke({ color: '#fff', width: 3 }),
                offsetX: rotation > 0 ? -50 : 50,
                offsetY: -8,
                placement: 'point',
                textAlign: 'center',
                rotation: rotation > 0 ? rotation - 1.56 : 1.56 + rotation,
                overflow: true,
              }),
            }),
          )
        }
      }
      return styles
    }
  },
  renderBuffer: 4000,
}) // 井线图层
const historyFenceLayer = ref<any>(null) // 历史围栏图层
const historyFenceLayerVisible = ref<any>(true) // 历史围栏图层

const fenceData = ref<any>([]); // 历史围栏数据
const fenceDataLoading = ref<boolean>(false); 
const currentSelectFence = ref<any>({})
const currentSelectFenceLayer = ref<any>(null)
// 地图 ------ end
const currentSelectFenceTimer = ref<any>(null)

const changeScale = (value: string) => {
  const scaleLine = map.value.getControls().getArray().find((control: object) => control instanceof ScaleLine) as ScaleLine
  const validUnit = scaleUnitMap[value]
  scaleLine.setUnits(validUnit)
}

const siteLineLayerChange = (value: CheckboxValueType) => {
  siteLineLayer.setVisible(!!value)
}

const handleChangeHistoryFence = (value: string) => {
  // 切换时清除之前的围栏
  if (historyFenceLayer.value) {
    map.value.removeLayer(historyFenceLayer.value);
  }
  // 数据转换
  let fenceFilterData: any[] = []
  if(['全部围栏'].includes(value)) {
    fenceFilterData = [...fenceData.value]
  }else if(['不显示围栏'].includes(value)) {
    fenceFilterData = []
  }else {
    const selectFenceData = fenceData.value.find((item: any) => item.name == value)
    fenceFilterData = [selectFenceData]
  }
  // 围栏绘制
  drawHistoryFence(fenceFilterData);
}


const drawHistoryFence = (data: any[]) => {
  if(!Array.isArray(data) || !data.length) {
    // moveCenter()
    return;
  }
  const features: any[] = [];
  data.forEach((fence: any) => {
    switch (fence.area.type) {
      case "Circle": {
        const feature = new Feature({
          geometry: new Circle(fence.area.center, fence.area.radius),
          type: 'historyFence',
          name: fence.name,
          originData: fence,
        });
        features.push(feature);
        break;
      }
      case "Polygon": {
        const feature = new Feature({
          geometry: new Polygon([fence.area.path]),
          type: 'historyFence',
          name: fence.name,
          originData: fence,
        });
        features.push(feature);
        break;
      }
      default:
        break;
    }
  })
  historyFenceLayer.value = new VectorLayer({
    source: new VectorSource({
      features: features
    }),
    style: (feature: any) => {
      const { geometry } = feature.values_ // 可以从values_里面获取源数据各个属性
      const type = feature.get('type'); // 也可以从通过get方法获取源数据各个属性
      return new Style({
        fill: new Fill({
          color: "rgba(255, 73, 174, 0.2)",
        }),
        stroke: new Stroke({
          color: "rgb(255, 73, 174)",
          width: 2,
          lineDash: [15, 5],
          lineDashOffset: 0,
        }),
        text: new Text({
          text: feature.get('name'),
          offsetX: 0,
          offsetY: 0,
          overflow: true,
          placement: 'point',
          textAlign: 'center',
          backgroundFill: new Fill({ color: 'rgba(255,255,255,0.9)' }),
          fill: new Fill({ color: '#333' }),
          stroke: new Stroke({ color: 'rgba(0, 0, 0, 0.2)', width: 1 }),
        }),
      })
    }
  })
  map.value.addLayer(historyFenceLayer.value);
  if(['全部围栏', '不显示围栏'].includes(searchForm.value.historyFence)) {
    // moveCenter()
  }else {
    if (features.length === 1) {
      const feature = features[0];
      const extent = feature.getGeometry().getExtent();
      map.value.getView().fit(extent, { duration: 500, padding: [100, 100, 100, 100] });
    }else {
      moveCenter()
    }
  }
}

const moveCenter = () => {
  map.value.getView().animate({ center: [109.37988, 21.47607], zoom: 10 });
}

const getFenceData = async() => {
  return new Promise((resolve) => {
    fenceDataLoading.value = true;
    setTimeout(() => {
      const data = [...fence.fenceInfo];
      fenceData.value = data;
      fenceDataLoading.value = false;
      resolve(data);
    }, 1000)
  })
}

const handleFenceClick = (type: string) => {
  if(type == 'add') {
    searchForm.value.fenceOperationPanelStatus = 'add'
    searchForm.value.fenceOperationPanelVisible = true
  }else if(type == 'edit') {
    if(!Object.keys(currentSelectFence.value).length) {
      return ElMessage({
        type: 'warning',
        message: '请先选中围栏'
      })
    }else {
      clearCurrentSelectFenceLayer();
      historyFenceLayerVisible.value = false;
      searchForm.value.fenceOperationPanelStatus = 'edit'
      searchForm.value.fenceOperationPanelVisible = true
      // historyFenceLayer.value.setVisible(false);
    }
  }
}

const handleFenceUpdate = () => {
  // console.log('fenceInfo------', fence.fenceInfo);
  fenceLoad();
}

const mapInit = async () => {
  const layersMap = {
    roadTileLayer, 
    districtLayer,
    siteLineLayer,
  } // 地图图层
  map.value = new Map({
    target: 'homeMap', // 绑定地图容器
    controls: defaultControls({ 
      zoom: false, 
      rotate: false,
    }).extend([
      new ScaleLine({
        className: 'custom-scale-line', // 添加自定义类名
      }),
    ]),
    layers: Object.values(layersMap),
    view: new View({
      projection: 'EPSG:4326', // 配置投影坐标系，有EPSG:4326和EPSG:3857
      center: [109.37988, 21.47607],
      zoom: 10,
      minZoom: 10,
      maxZoom: 15,
      extent: [108.061520625, 20.855042778320312, 110.698239375, 22.107097221679687], // 地图挪动限制范围 minX minY maxX maxY
    }), // 设置视图
  })
  mapLayerInit(layersMap);
  mapPopoverInit();
  mapEventInit();
}

const mapLayerInit = (layersMap: Record<string, any>) => {
  Object.keys(layersMap).forEach(key => {
    if(['siteLineLayer'].includes(key)) {
      layersMap[key].setVisible(searchForm.value.siteLineLayerVisible);
    }else {
      layersMap[key].setVisible(true);
    }
  })
}

const mapEventInit = () => {
  map.value.on('click', handleMapClick)
  map.value.on('moveend', mapTileVisible)
  map.value.on('pointermove', siteLineCusor) 
}

const mapPopoverInit = () => {
  if(sitePopover.value && map.value) {
    sitePopoverOverlay.value = new Overlay({
      element: sitePopover.value,
      positioning: "bottom-center",
      stopEvent: false,
      offset: [0, -40],
    });
    map.value.addOverlay(sitePopoverOverlay.value)
  }
}

const mapTileVisible = async () => {
  const zoom = map.value.getView().getZoom()
  if (zoom > 11) {
    roadTileLayer.setVisible(true)
    districtLayer.setVisible(false)
  } else {
    roadTileLayer.setVisible(false)
    districtLayer.setVisible(true)
  }
}

const handleMapClick = (event: any) => {
  showSitePopover.value = false
  currentSitePopoverFeature.value = null
  currentSelectFence.value = {};
  clearCurrentSelectFenceLayer() // 切换时清除之前的围栏
  const feature = map.value.forEachFeatureAtPixel(event.pixel, (feature: any) => feature)
  // console.log('feature------', feature);
  if(!feature) return;
  const type = feature.get('type')
  if (type === 'site') {
    siteLineClick(feature)
  }else if (type === 'historyFence') {
    historyFenceClick(feature)
  }
}

const historyFenceClick = (feature: any) => {
  const data = feature.get('originData');
  currentSelectFence.value = data
  drawCurrentSelectFence(data)
}

const clearCurrentSelectFenceLayer = () => {
  if(currentSelectFenceTimer.value) {
    clearInterval(currentSelectFenceTimer.value)
    currentSelectFenceTimer.value = null;
  }
  if (currentSelectFenceLayer.value) {
    map.value.removeLayer(currentSelectFenceLayer.value);
    currentSelectFenceLayer.value = null;
  }
}

const drawCurrentSelectFence = (fence: any) => {
  let feature: any;
  switch (fence.area.type) {
    case "Circle": {
      feature = new Feature({
        geometry: new Circle(fence.area.center, fence.area.radius),
        type: 'historyFence',
        name: fence.name,
        originData: fence,
      });
      break;
    }
    case "Polygon": {
      feature = new Feature({
        geometry: new Polygon([fence.area.path]),
        type: 'historyFence',
        name: fence.name,
        originData: fence,
      });
      break;
    }
    default:
      break;
  }
  const extent = feature.getGeometry().getExtent();
  map.value.getView().fit(extent, { duration: 500, padding: [100, 100, 100, 100] });
  currentSelectFenceLayer.value = new VectorLayer({
    source: new VectorSource({
      features: [feature]
    }),
    style: (feature: any) => {
      const { geometry } = feature.values_ // 可以从values_里面获取源数据各个属性
      const type = feature.get('type'); // 也可以从通过get方法获取源数据各个属性
      return new Style({
        fill: new Fill({
          color: "rgba(255, 73, 174, 0.2)",
        }),
        stroke: new Stroke({
          color: "rgb(255, 73, 174)",
          width: 4,
        }),
        text: new Text({
          text: feature.get('name'),
          offsetX: 0,
          offsetY: 0,
          overflow: true,
          placement: 'point',
          textAlign: 'center',
          backgroundFill: new Fill({ color: 'rgba(255,255,255,0.9)' }),
          fill: new Fill({ color: '#333' }),
          stroke: new Stroke({ color: 'rgba(0, 0, 0, 0.2)', width: 1 }),
        }),
      })
    }
  })
  // console.log('currentSelectFenceLayer.value', currentSelectFenceLayer.value);
  currentSelectFenceTimer.value = setInterval(() => {
    currentSelectFenceLayer.value.setVisible(!currentSelectFenceLayer.value.getVisible())
  }, 1000)
  map.value.addLayer(currentSelectFenceLayer.value);
}

const siteLineClick = (feature: any) => {
  if(feature !== currentSitePopoverFeature.value) {
    currentSitePopoverFeature.value = feature
    showSitePopover.value = true
    // 设置弹窗位置
    let coordinates = feature.getGeometry().getCoordinates();
    sitePopoverOverlay.value.setPosition(coordinates);
  }
}

const siteLineCusor = (event: any) => {
  const feature = map.value.forEachFeatureAtPixel(event.pixel, (feature: any) => feature)
  // console.log('feature------', feature);
  if (feature && feature?.get('type') === 'site') {
    map.value.getViewport().style.cursor = "pointer";
    if(feature !== currentFeature.value && feature.get('name') !== '涠洲') {
      currentFeature.value = feature
      timer.value = setTimeout(() => {
        showInfo.value = true
      }, 3000)
    }
  }else {
    map.value.getViewport().style.cursor = "inherit";
    showInfo.value = false
    clearTimeout(timer.value)
    currentFeature.value = null
  }
}

const fenceLoad = async() => {
  await getFenceData()
  handleChangeHistoryFence(searchForm.value.historyFence);
}

onMounted(async () => {
  await mapInit();
  await fenceLoad();
})

onBeforeUnmount(() => {
  map.value?.dispose()
  showInfo.value = false
  clearTimeout(timer.value)
})

watch(historyFenceLayerVisible, (newValue) => {
  if(newValue) {
    historyFenceLayer.value.setVisible(true);
  }else {
    historyFenceLayer.value.setVisible(false);
  }
})

watch(searchForm.value, (newValue) => {
  if(!newValue.fenceOperationPanelVisible) {
    historyFenceLayerVisible.value = true
  }
})

</script>

<style scoped lang="less">
.map-chart {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color: #f0f1f8;
  .map-container {
    width: 100%;
    height: 100%;
  }
  .map-search {
    position: absolute;
    top: 10px;
    left: 10px;
    z-index: 1;
  }
  .info-wrapper {
    pointer-events: none;
    position: absolute;
    bottom: 30px;
    width: 100%;
    background-color: transparent;
    display: flex;
    justify-content: center;
    .info-item {
      width: 260px;
      height: 104px;
      font-size: 14px;
      margin-right: 20px;
      border-radius: 4px;
      background-color: #fff;
      box-shadow: 0px 2px 6px 0px #91a1ca;
      .station-wrapper {
        display: flex;
        justify-content: flex-end;
        .station {
          width: 48px;
          height: 17px;
          font-size: 12px;
          color: rgba(255, 124, 23, 1);
          background-color: rgba(255, 124, 23, 0.1);
          text-align: center;
        }
      }
      .device-name {
        height: 26px;
        line-height: 20px;
        text-align: center;
      }
      .device-info {
        height: 44px;
        display: flex;
        justify-content: space-around;
        .info {
          line-height: 20px;
          text-align: center;
          .value {
            font-size: 16px;
            font-weight: bold;
            background: linear-gradient(90deg, rgba(255, 177, 0, 1) 0%, rgba(255, 55, 0, 1) 100%);
            background-clip: text;
            color: transparent;
          }
          .label {
            color: #333;
            font-weight: 600;

            margin-top: 3px;
          }
        }
      }
    }
  }
  .site-popover {
    background-color: white;
    padding: 5px 10px;
    border-radius: 5px;
    box-shadow: 0 0 15px rgb(177, 177, 177);
    &-header {
      display: flex;
      align-items: center;
      position: relative;
      margin-bottom: 10px;
      .title {
        width: 80%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .close-icon {
        position: absolute;
        right: 0;
        cursor: pointer;
      }
    }
  }
}
</style>
<style lang="less">
// 添加自定义刻度线样式
.custom-scale-line {
  position: absolute;
  bottom: 10px ;
  left: 10px;
  z-index: 1;
}
</style>