<template>
  <div
    class="diy-scroll-text"
    ref="diyScrollText"
    @mouseover="isPaused = true"
    @mouseout="isPaused = false"
  >
    <span class="txt-box" ref="txtBox" v-for="(item, index) in textArr" :key="item.key">
      <span class="txt-content">{{ item.text }}</span>
      <template v-if="Array.isArray(item.opeartion) && item.opeartion.length">
        <span
          class="txt-operation"
          :style="opea.style ?? {}"
          v-for="(opea, opeaIndex) in item.opeartion"
          :key="opeaIndex"
          @click="handleOpeartionClick(opea)"
          >{{ opea.title }}</span
        >
      </template>
      <div v-if="textArr[index + 1]" class="space"></div>
    </span>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'

interface Text {
  key: string
  text: string
  opeartion?: OpeartionType[]
}

interface OpeartionType {
  title: string
  onClick?: (operationItem: OpeartionType) => void
  style?: Record<string, any>
}

const props = defineProps({
  textArr: {
    type: Array<Text>,
    default: false,
  },
  speed: {
    type: Number,
    default: 1,
  },
})
const { textArr } = toRefs(props)
const animationFrameId = ref(0)
const txtBox: any = ref(null)
const diyScrollText: any = ref(null)
const container: any = ref(null)
const position = ref(0)
const isPaused = ref(false)

const handleOpeartionClick = (opea: any) => {
  if (opea.onClick) {
    opea.onClick(opea)
  }
}

const getTotalWidth = () => {
  if (txtBox.value) {
    return txtBox.value.reduce((pre: number, cur: HTMLSpanElement) => {
      return cur.offsetWidth + pre
    }, 0)
  }
  return 0
}

const scroll = () => {
  if (!isPaused.value && diyScrollText.value) {
    position.value -= props.speed
    diyScrollText.value.style.transform = `translateX(${position.value}px)`
    const totalWidth = getTotalWidth()
    if (position.value < -totalWidth) {
      position.value = container.value?.offsetWidth || 0
    }
  }
  animationFrameId.value = requestAnimationFrame(scroll)
}

onMounted(() => {
  container.value = diyScrollText.value
  nextTick(() => {
    position.value = container.value?.offsetWidth || 0
    scroll()
  })
})

onUnmounted(() => {
  if (animationFrameId.value) cancelAnimationFrame(animationFrameId.value)
})
</script>

<style scoped lang="less">
.diy-scroll-text {
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
  white-space: nowrap;
  .txt-box {
    font-size: 12px;
    display: flex;
    align-items: center;
    .txt-content {
      margin-right: 5px;
    }
    .txt-operation {
      color: #006cff;
      font-weight: 700;
      cursor: pointer;
      margin-right: 5px;
    }
    .space {
      width: 2px;
      background-color: #fff;
      height: 12px;
      margin: 0 12px;
    }
  }
}
.diy-scroll-text:hover {
  animation-play-state: paused;
}
</style>
