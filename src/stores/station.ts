import { ref } from 'vue'
import { defineStore } from 'pinia'

// 站点数据
export const useStationStore = defineStore('station', () => {
  const stationArr = ref<any>([
    { id: '1760506117348532224', name: '北海局主站' },
    { id: '1760507203438387200', name: '海上升压站' },
    { id: '1787685162355204096', name: '海上换流站' },
    { id: '1760507279506284544', name: '陆上换流站' },
    { id: '1787684811568783360', name: '风场五期' },
    { id: '1760516835946930176', name: '风场六期' },
    { id: '1787684905928040448', name: '风场七期' },
  ])
  const stationInfo = ref<any>({ id: '1760506117348532224', name: '北海局主站' })

  const setStationArr = (val: any[]) => {
    stationArr.value = val
  }

  const setStationInfo = (val: any) => {
    stationInfo.value = val
  }

  return { stationArr, stationInfo, setStationArr, setStationInfo }
})
