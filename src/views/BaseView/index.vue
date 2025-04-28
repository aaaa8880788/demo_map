<!-- 基础视图 -->
<template>
  <div class="base-view">
    <custom-menu :comp-map="menuCompMap" :menu-data="menuData" />
  </div>
</template>

<script setup lang="ts">
import Charts from '@/views/BaseView/Charts/index.vue'
import Svg from '@/views/BaseView/Svg/index.vue'

const menuCompMap = {
  Charts,
  Svg,
}
const menuData = ref<any[]>([
  { name: '视图总览', compKey: 'Charts', disabled: false },
  { name: 'Svg', compKey: 'Svg', disabled: false },
])

onMounted(() => {
})
</script>

<style scoped lang="less">
.base-view {
  width: calc(100% - 60px);
  height: calc(100% - 60px);
  box-sizing: border-box;
  border-radius: 4px;
  background-color: var(--c-white);
}
</style>
