<template>
  <div class="custom-echarts" v-loading="loading" :element-loading-text="loadingText">
    <div class="chart-container" ref="chartRef"></div>
    <el-empty v-if="showEmpty" :image-size="emptyImageSize" :description="emptyText" />
  </div>
</template>

<script setup lang="ts">
import * as echarts from 'echarts/core'
import {
  GridComponent,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  VisualMapComponent,
  MarkLineComponent,
} from 'echarts/components'
import type {
  GridComponentOption,
  TitleComponentOption,
  TooltipComponentOption,
  LegendComponentOption,
  VisualMapComponentOption,
  MarkAreaComponentOption,
} from 'echarts/components'
import { LineChart, BarChart, PieChart } from 'echarts/charts'
import type { LineSeriesOption, BarSeriesOption, PieSeriesOption } from 'echarts/charts'
import { LabelLayout, UniversalTransition } from 'echarts/features'
import { CanvasRenderer } from 'echarts/renderers'
import { Grid3DComponent } from 'echarts-gl/components'
import { SurfaceChart } from 'echarts-gl/charts'
import { useResizeObserver, useDebounceFn } from '@vueuse/core'

echarts.use([
  GridComponent,
  VisualMapComponent,
  MarkLineComponent,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  LineChart,
  BarChart,
  PieChart,
  LabelLayout,
  UniversalTransition,
  Grid3DComponent,
  SurfaceChart,
  CanvasRenderer,
])

export type EChartsOption = echarts.ComposeOption<
  | GridComponentOption
  | TitleComponentOption
  | TooltipComponentOption
  | LegendComponentOption
  | VisualMapComponentOption
  | MarkAreaComponentOption
  | LineSeriesOption
  | BarSeriesOption
  | PieSeriesOption
>

interface Props {
  options: EChartsOption
  loading?: boolean
  loadingText?: string
  emptyText?: string
  emptyImageSize?: number
}
const props = withDefaults(defineProps<Props>(), {
  loading: false,
  loadingText: '数据加载中...',
  emptyText: '暂无数据',
  emptyImageSize: 60,
})

const chartRef = ref<HTMLElement>()
const chart = shallowRef<echarts.ECharts>()
const showEmpty = computed(() => {
  return !Array.isArray(props.options?.series)
    ? true
    : props.options?.series?.every(
        (s: any) => s.data?.length === 0 || s.dataset?.source?.length === 0,
      )
})

const initEcharts = () => {
  if (chart.value && !chart.value.isDisposed()) chart.value.dispose()
  chart.value = echarts.init(chartRef.value, 'default')
  updateEcharts()
  resizeEcharts()
}

const updateEcharts = () => {
  if (!chart.value?.isDisposed()) chart.value?.setOption(props.options, true)
}

const resizeEcharts = () => {
  const debounceResize = useDebounceFn(() => {
    if (!chart.value?.isDisposed())
      chart.value?.resize({
        animation: {
          duration: 300,
          easing: 'cubicInOut',
        },
      })
  }, 200)

  useResizeObserver(chartRef.value, debounceResize)
}

onMounted(() => {
  nextTick(() => initEcharts())
  window.addEventListener('resize', updateEcharts)
})

onUnmounted(() => {
  chart.value?.dispose()
  window.removeEventListener('resize', updateEcharts)
})

watch(() => props.options, updateEcharts, { deep: true })
</script>

<style scoped lang="less">
.custom-echarts {
  width: 100%;
  height: 100%;
  position: relative;
  .chart-container {
    width: 100%;
    height: 100%;
  }
  :deep(.el-empty) {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
  }
}
</style>
