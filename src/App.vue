<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script setup lang="ts">
// 无需额外导入，因为路由配置已经在 main.ts 中处理
</script>

<style lang="less" scoped>
/* 可以根据需要添加样式 */
#app {
  width: 100vw;
  height: 100vh;
  display: flex;
  background: #f5f7fa;
  overflow: hidden;
}
</style>
