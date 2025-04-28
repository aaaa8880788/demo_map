<template>
  <div class="substation-monitoring">
    <div class="form" >
      <el-form :inline="true">
        <el-form-item label="svg源切换">
          <el-select v-model="currentSvg" style="width: 200px;">
            <el-option v-for="item in currentSvgOptions" :label="item.label" :key="item.value" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="枚举切换">
          <el-select v-model="enumType" style="width: 200px;">
            <el-option v-for="item in enumTypeOptions" :label="item.label" :key="item.value" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="数据填充切换">
          <el-select v-model="fillData" style="width: 200px;">
            <el-option v-for="item in fillDataOptions" :label="item.label" :key="item.value" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </div>
    <div class="main">
      <SvgComponent :svgData="currentSvg" :enumType="enumType" :fillData="currentFillData" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { svg1, svg2 } from './mockData'
import SvgComponent from './SvgComponent.vue'
enum StartingPoint {
  XMinYMin = 1,
  XMinYMax = 2,
  XMaxYMin = 3,
  XMaxYMax = 4
}
const currentSvg = ref(svg1);
const enumType = ref(StartingPoint.XMinYMin);
const fillData = ref('索引填充');

const currentSvgOptions = [
  { label: 'svg1', value: svg1 },
  { label: 'svg2', value: svg2 },
]

const enumTypeOptions = [
  { label: 'XMinYMin', value: StartingPoint.XMinYMin },
  { label: 'XMinYMax', value: StartingPoint.XMinYMax },
  { label: 'XMaxYMin', value: StartingPoint.XMaxYMin },
  { label: 'XMaxYMax', value: StartingPoint.XMaxYMax },
]

const fillDataOptions = [
  { label: '索引填充', value: '索引填充' },
  { label: '模拟数据', value: '模拟数据' }
]

const currentFillData = computed(() => {
  if(fillData.value == '模拟数据') {
    return [
      {
        index: 1,
        data: '1P'
      },
      {
        index: 55,
        data: '55P'
      },
      {
        index: 56,
        data: '56P'
      },
      {
        index: 57,
        data: '57P'
      },
      {
        index: 90,
        data: '90T'
      },
    ] 
  }else {
    return [];
  }
})

onMounted(() => {
})
</script>

<style scoped lang="less">
.substation-monitoring {
  position: relative;
  width: 100%;
  height: 100%;
  .main {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 1600px;
    height: 600px;
    padding: 30px;
    border: 1px solid #0286f7;
    border-radius: 5px;
    overflow: hidden;
  }
}
</style>
