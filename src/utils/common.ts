import dayjs from "dayjs";
export function getEnvironmentVariables(type = 'development') {
  const env = import.meta.env;
  return env
}
// 天，周，月时间获取
export const getDayTime = (index: number): string[] => {
  return [dayjs().add(-index, "d").format("YYYY-MM-DD HH:mm:ss"), dayjs().format("YYYY-MM-DD HH:mm:ss")];
};

// Echarts图表字体、样式自适应
export const fitSize = (size: number, defalteWidth: number = 1920) => {
  const clientWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
  if (!clientWidth) return size
  const scale = clientWidth / defalteWidth
  return Number((size * scale).toFixed(3))
}