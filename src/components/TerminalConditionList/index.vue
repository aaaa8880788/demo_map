<template>
  <div class="terminal-condition-list">
    <div class="" v-if="!terminalData.length">
      <el-empty description="暂无数据" />
    </div>
    <template v-else>
      <div class="device-list-item" v-for="item in terminalData" :key="item.title">
        <div class="device-list-item-left" :title="item.title">
          <img class="left-image" :src="item.image" />
          <div class="left-title">{{ item.title }}</div>
        </div>
        <div class="device-list-item-right">
          <div v-if="item.total || item.total == 0" class="right-item">
            总数: <span> {{ item.total }} </span>
          </div>
          <div v-if="item.online || item.online == 0" class="right-item">
            在线数：<span>{{ item.online }}</span>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
interface Terminal {
  title: string
  image: string
  total?: number | string
  online?: number | string
}
const props = withDefaults(
  defineProps<{
    terminalData?: (Terminal & Record<string, any>)[]
  }>(),
  {
    terminalData: () => [],
  },
)

const { terminalData } = toRefs(props)
</script>

<style scoped lang="less">
.terminal-condition-list {
  .device-list-item {
    display: flex;
    justify-content: space-between;
    padding: 10px 16px;
    height: 56px;
    background: linear-gradient(90deg, rgba(213, 225, 247, 0.7) 0%, rgba(213, 225, 247, 0.24) 100%);
    margin-bottom: 10px;
    &-left {
      width: 50%;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      font-size: 16px;
      .left-image {
        margin-right: 5px;
        width: 46px;
        height: 38px;
      }
      .left-title {
        overflow: hidden;
        text-overflow: ellipsis;  /* 超出部分省略号 */
        word-break: break-all;  /* break-all(允许在单词内换行。) */  
        display: -webkit-box; /* 对象作为伸缩盒子模型显示 */
        -webkit-box-orient: vertical; /* 设置或检索伸缩盒对象的子元素的排列方式 */
        -webkit-line-clamp: 2; /* 显示的行数 */
        max-height: 80rpx; /* 设置最大高度，根据行高，要几行乘以几倍 */
      }
    }
    &-right {
      width: 50%;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      font-size: 14px;
      .right-item {
        width: 50%;
        span {
          font-weight: 700;
        }
      }
    }
  }
}
</style>
