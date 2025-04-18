<template>
  <div class="diy-tabs">
    <div class="diy-tabs-title">
        <div 
            :class="{
                'diy-tabs-title-item': true,
                'diy-tabs-title-item-active': tab.key == activeTab.key
            }"
            v-for="(tab) in tabs" 
            :key="tab.key"
            @click="handleTabClick(tab)">
            <span>{{ tab.title }}</span>
        </div>
    </div>
    <div class="diy-tabs-content">
        <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { toRefs } from "vue"
export interface DiyTabsTabType {
    title: string;
    key: string | number;
    component?: any;
}

const props = withDefaults(
    defineProps<{
        tabs: DiyTabsTabType[] | [];
        activeTab: Partial<DiyTabsTabType>;
    }>(),
    {
        tabs: () => [
            {
                title: '测试',
                key: '测试',
            },
            {
                title: '测试一',
                key: '测试一',
            },
        ],
        activeTab: () => ({})
    }
)

const { tabs, activeTab } = toRefs(props);
const emit = defineEmits(['update:activeTab', 'update:modelValue'])

const handleTabClick = (tab: DiyTabsTabType) => {
    emit('update:activeTab', tab)
}

</script>

<style scoped lang="less">
.diy-tabs {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    border-radius: 5px;
    overflow: hidden;
    &-title {
        height: 38px;
        line-height: 38px;
        text-align: center;
        display: flex;
        background-color: #f8f8fc;
        &-item {
            position: relative;
            padding: 0 20px;
            color: #687D99;
            cursor: pointer;
            transition: background 0.3s;
            background: url("@/assets/images/components/DiyTabsOne/tab_bc.png") no-repeat center/0 0;
            span {
                position: relative;
                z-index: 1;
            }
        }
        &-item:hover {  
            color: #006CFF;
        }
        &-item-active {
            color: #006CFF;
            font-weight: 700;
            background: url("@/assets/images/components/DiyTabsOne/tab_bc.png") no-repeat center/100% 100%;
            &:first-child {
                background: url("@/assets/images/components/DiyTabsOne/tab_bc_first.png") no-repeat center/100% 100%;
            }
        }
    }
    &-content {
        height: calc(100% - 38px);
        background-color: #fff;
        overflow: auto;
    }
}
</style>
