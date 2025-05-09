<template>
  <div v-show="visible" class="fence-operation-panel">
    <div class="header">
      <span>电子围栏操作面板</span>
      <div class="close" @click="handleClick('close')">
        <el-icon>
          <Close />
        </el-icon>
      </div>
    </div>
    <div class="main">
      <el-form :model="formData">
        <el-form-item label="围栏名称">
          <el-input v-model="formData.fenceName" placeholder="请输入围栏名称"></el-input>
        </el-form-item>
        <el-form-item label="围栏样式">
          <el-radio-group v-model="formData.fenceType" @change="handleChange('fenceType', $event)">
            <el-radio-button label="圆形" value="Circle"></el-radio-button>
            <el-radio-button label="多边形" value="Polygon"></el-radio-button>
          </el-radio-group>
        </el-form-item>
      </el-form>
    </div>
    <div class="footer">
      <el-button type="primary" @click="handleClick('save')">保存</el-button>
      <el-button type="danger" @click="handleClick('remove')">清除</el-button>
      <el-button type="default" @click="handleClick('cancle')">取消</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Close } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus';
import Draw from 'ol/interaction/Draw'
import Modify from 'ol/interaction/Modify'
import Select from 'ol/interaction/Select'
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { Style, Fill, Stroke } from 'ol/style';
import * as olProj from "ol/proj";
import { v4 as uuidv4 } from 'uuid';
import { useFenceStore } from '@/stores/fence'
import type { Type } from 'ol/geom/Geometry';
import Feature from 'ol/Feature';
import { Polygon, Circle } from 'ol/geom';

const fence = useFenceStore()

const emit = defineEmits(['update:visible', 'save'])
const props = withDefaults(
  defineProps<{ 
    visible: boolean;
    mapInstance: any;
    status: string;
    fenceData: Record<string, any>;
  }>(),
  {
    visible: false,
    mapInstance: null,
    status: 'add',
    fenceData: () => ({})
  },
)
const { visible, mapInstance, status, fenceData } = toRefs(props)

const formData = ref({
  id: null,
  fenceName: '', // 围栏名称
  fenceType: 'Circle', // 围栏样式
})

const drawLayer = ref<any>(null);
const fenceSource = ref<any>(new VectorSource({ wrapX: false }))
const fenceDraw = ref<any>(null)
const selectInteraction = ref<any>(null) // 选中交互
const modifyInteraction = ref<any>(null) // 修改交互

const circleInfo = ref<any>(null)
const polygonInfo = ref<any>(null)

const addFenceDrawInteraction = () => {
  removeAddFenceDrawInteraction()
  fenceDraw.value = new Draw({
    source: fenceSource.value,
    type: formData.value.fenceType as Type,
  });
  mapInstance.value.addInteraction(fenceDraw.value);
  fenceDraw.value.on("drawend", (event: any) => {
    // 绘制完成的回调
    removeAddFenceDrawInteraction()
    drawEnd(event.feature);
    // 给绘制的图形一个唯一的标识符
    const feature = event.feature;
    feature.set('fenceDraw', true);
  });
}

const removeAddFenceDrawInteraction = () => {
  if(fenceDraw.value) {
    mapInstance.value.removeInteraction(fenceDraw.value)
  }
}

// 绘制完成解析
const drawEnd = (feature: any) => {
  let geo = feature.getGeometry();
  const type: string = geo.getType(); //获取类型
  const handle = {
    Circle: () => {
      const center = geo.getCenter();
      const radius = geo.getRadius();
      circleInfo.value = {
        type: type,
        center: center, // 中心点
        radius: radius, // 获取和半径
      };
    },

    Polygon: () => {
      //获取坐标点
      let points = geo.getCoordinates();
      polygonInfo.value = {
        type: type,
        path: points[0],
      }
    },
  }[type];
  if (handle) handle();
}

const clearForm = () => {
  formData.value = {
    id: null,
    fenceName: '', // 围栏名称
    fenceType: 'Circle', // 围栏样式
  }
}

const clearDraw = () => {
  if(fenceSource.value) {
    circleInfo.value = null;
    polygonInfo.value = null;
    fenceSource.value.clear();
  }
}

const handleChange = (field: string, value: any) => {
  if(field == 'fenceType') {
    clearDraw();
    addFenceDrawInteraction()
  }
}

const handleClick = (type: string) => {
  switch (type) {
    case 'save':
      {
        if(!formData.value.fenceName) {
          return ElMessage({
            type: 'warning',
            message: '请输入围栏名称'
          })
        }
        const area = formatFenceData();
        // console.log('area', area);        
        if (area) {
          let data = {
            id: status.value == 'add' ? uuidv4() : formData.value.id,
            name: formData.value.fenceName,
            area: area,
          };
          // 可调用后端api进行保存，这里直接pinia
          const index = fence.fenceInfo.findIndex((item: any) => item.id == data.id);
          if(index != -1) {
            const newFence = [...fence.fenceInfo]
            newFence[index] = data   
            fence.setFenceInfo(newFence)
          }else {
            const newFence = [...fence.fenceInfo, data]
            fence.setFenceInfo(newFence)
          }
          emit('save');
          handleClose();
        }
      }
      break;
    case 'close':
    case 'cancle':
      {
        handleClose()
      }
      break;
    case 'remove':
      {
        clearDraw()
        addFenceDrawInteraction()
      }
      break;
    default:
      break;
  }
  
}

const handleClose  = () => {
  clearDraw();
  clearForm();
  removeAddFenceDrawInteraction();
  emit('update:visible', false)
}

// 数据处理
const formatFenceData = () => {
  const handle = {
    Circle: () => {
      const info = circleInfo.value
      if(!info) {
        ElMessage({
          type: 'error',
          message: '请先进行圆形围栏绘制'
        })
        return null;
      }
      // const center = info.center; // 投影坐标
      // const radius = info.radius;
      // const p = olProj.toLonLat(center); // 转为经纬度坐标
      // return `Circle (${p[0]} ${p[1]}, ${radius})`;
      return { ...info }
    },
    Polygon: () => {
      const info = polygonInfo.value
      if(!info) {
        ElMessage({
          type: 'error',
          message: '请先进行多边形围栏绘制'
        })
        return null;
      }
      // const pathArr: any[] = [];
      // path.forEach((item: any) => {
      //   const p = olProj.toLonLat(item);
      //   pathArr.push(`${p[0]} ${p[1]}`);
      // });
      // return `Polygon (${pathArr.join(", ")})`;
      return { ...info }
    },
  }[formData.value.fenceType];
  if(handle) {
    return handle()
  }else {
    return null;
  } 
}


const initMapTool = () => {
  drawLayer.value = new VectorLayer({
    source: fenceSource.value,
    style: new Style({
      fill: new Fill({ color: "rgba(255, 0, 0, 0)" }),
      stroke: new Stroke({
        color: "rgba(255, 0, 0, 0.5)",
        width: 2,
        lineDash: [15, 5],
        lineDashOffset: 0,
      }),
    }),
  })
  mapInstance.value.addLayer(drawLayer.value);
  mapInstance.value.on('click', (event: any) => {
    handleMapClick(event);
  })

  selectInteraction.value = new Select()
  // 监听选择事件
  selectInteraction.value.on('select', (event: any) => {
    const features = selectInteraction.value.getFeatures()
    if(features) {
      // 进入编辑模式
      if(modifyInteraction.value) {
        mapInstance.value.removeInteraction(modifyInteraction.value);
      }
      modifyInteraction.value = new Modify({
        features: features,
      })
      modifyInteraction.value.on("modifyend", (event: any) => {
        drawEnd(event.features.getArray()[0]);
      })
      mapInstance.value.addInteraction(modifyInteraction.value);
    }
  });
}

const handleMapClick = (event: any) => {
  const feature = mapInstance.value.forEachFeatureAtPixel(event.pixel, (feature: any) => feature)
  // console.log('feature', feature);
  if(!feature) return 
  if(feature.get('fenceDraw')) {
    mapInstance.value.addInteraction(selectInteraction.value)
  }else {
    // 如果点击的地方不是选择的特征，则退出编辑模式
    if(selectInteraction.value) {
      mapInstance.value.removeInteraction(selectInteraction.value);
    }
    if(modifyInteraction.value) {
      mapInstance.value.removeInteraction(modifyInteraction.value);
    }
  }
}

const editFenceDrawInteraction = () => {
  // console.log('fenceData', fenceData.value);
  if(!Object.keys(fenceData.value).length) return
  let feature: any;
  const { id, name, area } = fenceData.value
  switch (area.type) {
    case "Circle": {
      feature = new Feature({
        geometry: new Circle(area.center, area.radius),
        fenceDraw: true,
      });
      circleInfo.value = {
        type: area.type,
        center: area.center, // 中心点
        radius: area.radius, // 获取和半径
      }
      break;
    }
    case "Polygon": {
      feature = new Feature({
        geometry: new Polygon([area.path]),
        fenceDraw: true,
      });
      polygonInfo.value = {
        type: area.type,
        path: area.path,
      }
      break;
    }
    default:
      break;
  }
  fenceSource.value = new VectorSource({ 
    features: [feature],
  })
  drawLayer.value.setSource(fenceSource.value);
  formData.value.id = id
  formData.value.fenceName = name
  formData.value.fenceType = area.type
}

watch(visible, (newValue) => {
  if(newValue) {
    if(status.value == 'add') {
      addFenceDrawInteraction();
    }else if(status.value == 'edit') {
      editFenceDrawInteraction();
    }
  }
})

onMounted(() => {
  initMapTool();
})

onUnmounted(() => {
  mapInstance.value.removeLayer(drawLayer.value);
})

</script>

<style lang="less" scoped>
.fence-operation-panel {
  position: absolute;
  background-color: rgba(255, 255, 255, 0.8);
  right: 50px;
  top: 50px;
  width: 400px;
  border-radius: 5px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  .header {
    position: relative;
    height: 60px;
    line-height: 60px;
    text-align: center;
    font-weight: 700;
    font-size: 20px;
    .close {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      right:10px;
      cursor: pointer;
    }
  }
  .main {
    flex: 1;
    padding: 0 20px;
  }
  .footer {
    height: 60px;
    line-height: 60px;
    text-align: center;
  }
}
</style>