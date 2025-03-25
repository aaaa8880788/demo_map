<template>
  <div class="home">
    <MapChart v-show="!showChart" @switch-chart="switchChart"></MapChart>
    <WiringChart v-show="showChart" @clickBack="switchChart"></WiringChart>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import MapChart from "@/components/MapChart.vue"
import WiringChart from "@/components/WiringChart.vue"

const showChart = ref(false);
const switchChart = () => {
  showChart.value = !showChart.value
}

</script>

<style lang="less" scoped>
.home {
  width: 100vw;
  height: 100vh;
}
</style>