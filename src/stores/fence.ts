import { ref } from 'vue'
import { defineStore } from 'pinia'

// 站点数据
export const useFenceStore = defineStore('fence', () => {
  const fenceInfo = ref<any>([])

  const setFenceInfo = (val: any[]) => {
    fenceInfo.value = val
  }

  return { fenceInfo, setFenceInfo }
})
