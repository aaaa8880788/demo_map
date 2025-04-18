import vChartResize from './v-chart-resize.js'
// 自定义指令
const directives = {
  vChartResize,
}
 
export default {
  install(app) {
    Object.keys(directives).forEach((key) => {
      app.directive(key, directives[key])
    })
  },
}