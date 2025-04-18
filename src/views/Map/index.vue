<template>
  <div class="map">
    <MapChart v-show="!showChart" @switch-chart="switchChart"></MapChart>
    <WiringChart v-show="showChart" @clickBack="switchChart"></WiringChart>
  </div>
</template>

<script setup lang="ts">
import MapChart from "@/views/Map/components/MapChart.vue"
import WiringChart from "@/views/Map/components/WiringChart.vue"

const showChart = ref(false);
const switchChart = () => {
  showChart.value = !showChart.value
}
</script>

<style lang="less" scoped>
/* 可以根据需要添加样式 */
.map {
  width: 100%;
  height: 100%;
  position: relative;
}
</style>