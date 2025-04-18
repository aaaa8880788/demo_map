import dayjs from "dayjs";
export function getEnvironmentVariables(type = 'development') {
  const env = import.meta.env;
  return env
}
// 天，周，月时间获取
export const getDayTime = (index: number): string[] => {
  return [dayjs().add(-index, "d").format("YYYY-MM-DD HH:mm:ss"), dayjs().format("YYYY-MM-DD HH:mm:ss")];
};
