<template>
  <div id="app">
    <el-config-provider :locale="zhCn">
      <router-view />
    </el-config-provider>
  </div>
</template>

<script setup lang="ts">
import zhCn from 'element-plus/es/locale/lang/zh-cn';
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
