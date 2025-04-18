<template>
  <div class="custom-menu">
    <el-menu :default-active="activeMenu?.compKey || ''" mode="horizontal" @select="onSelectMenu">
      <el-menu-item
        v-for="item in menuData"
        :key="item.compKey"
        :index="item.compKey"
        :disabled="item.disabled"
      >
        {{ item.name }}
      </el-menu-item>
    </el-menu>
    <div class="content">
      <slot>
        <component v-if="compMap[activeMenu.compKey]" :is="compMap[activeMenu.compKey]"></component>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
// compMap 对象的键值和 menuData 的 value 值对应
interface Props {
  compMap?: Record<string, Component>
  menuData?: { compKey: string; name: string; disabled: boolean }[]
}
const props = withDefaults(defineProps<Props>(), {
  compMap: () => ({}),
  menuData: () => [],
})
const emit = defineEmits<{
  (e: 'select', item: any): void
}>()

const activeMenu = ref<any>(props.menuData[0])

const onSelectMenu = (key: string) => {
  activeMenu.value = props.menuData.find((item: any) => item.compKey === key)
  emit('select', activeMenu.value)
}
</script>

<style scoped lang="less">
.custom-menu {
  width: 100%;
  height: 100%;
  :deep(.el-menu) {
    height: 38px;
    border-bottom: none;
    background-color: #f8f8fc;
    .el-menu-item {
      font-size: 16px;
      border-bottom: none;
      color: var(--c-gray);
      transition: background 0.3s;
      background: url('@/assets/images/common/menu_item.png') no-repeat center/0 0;
      &:first-child {
        background: url('@/assets/images/common/menu_left.png') no-repeat center/0 0;
      }
      &.is-active {
        font-weight: bold;
        color: var(--c-blue) !important;
        background: url('@/assets/images/common/menu_item.png') no-repeat center/100% 100%;
        &:first-child {
          background: url('@/assets/images/common/menu_left.png') no-repeat center/100% 100%;
        }
      }
    }
  }
  .content {
    padding: 14px 20px 20px;
    height: calc(100% - 38px);
  }
}
</style>
