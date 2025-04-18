<template>
  <div class="home-container">
    <el-container>
      <el-header class="header">
        <div class="logo">
          地图导航系统
        </div>
        <el-menu
          mode="horizontal"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
          @select="handleSelect"
          :default-active="activeMenu.key || ''"
        >
          <el-menu-item v-for="item in menuData" :key="item.key" :index="item.key">{{ item.label }}</el-menu-item>
        </el-menu>
      </el-header>
      <el-main class="main-content">
        <router-view />
      </el-main>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
const router = useRouter();

const menuData = [
  { label: '主地图', key: 'map' },
  { label: '视图总览', key: 'baseView' },
]
const activeMenu = ref(menuData[0]);
const route = useRoute();

const handleSelect = (key: string) => {
  const menuItem = menuData.find(item => item.key === key) || menuData[0];
  if(menuItem.key != activeMenu.value.key){
    activeMenu.value = menuItem;
    router.push({
      name: menuItem.key
    })
  }
};
onMounted(() => {
  activeMenu.value = menuData.find(item => item.key === route.name) || menuData[0];
})
</script>

<style lang="less" scoped>
.home-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
    background-color: #545c64;
    color: white;
    height: 60px;
    .logo {
      width: 300px;
      display: flex;
      align-items: center;
      font-size: 30px;
      font-weight: 700;
    }
    .el-menu {
      flex: 1;
      overflow: hidden;
      white-space: nowrap;
      display: flex;
      justify-content: flex-end;
      align-items: center;;
      &:not(.el-menu--collapse) {
        .el-menu-item {
          display: inline-block;
        }
      }
      
      &.el-menu--collapse {
        max-width: 70%;
        
        .el-menu-item {
          display: none;
          
          &:nth-child(-n+3) {
            display: inline-block;
          }
        }
      }
    }
  }
  
  .main-content {
    height: calc(100% - 60px);
    width: 100%;
    padding: 0;
    background-color: var(--c-blue-mute);
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>