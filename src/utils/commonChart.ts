import dayjs from "dayjs"
import { fitSize } from "./common";

const defaultColor = ['#ffc02e', '#08A536', '#006cff', '#ff7c17', '#9c4fe6', '#ff49ae', '#fe0000', '#3e4ea6', '#0199be', '#67c900', '#ffff01'];

// ****** 常规饼图一 ****** start
interface DataItemType_getCommonPieOptionOne {
  title: string
  total: number
  count: number
}
interface ParamsType_getCommonPieOptionOne {
  data: (DataItemType_getCommonPieOptionOne & Record<string, any>)[];
  subtext: string;
  color?: string[];
}

export function getCommonPieOptionOne(params: ParamsType_getCommonPieOptionOne) {
  const { data, subtext, color = defaultColor } = params
  const countTotal = data.reduce((pre, cur) => Number(cur.count) + Number(pre), 0)
  const series: Record<string, any>[] = data.map((item, index) => ({
    name: item.title,
    type: 'pie',
    radius: [`${index * 7 + 30}%`, `${index * 7 + 33}%`],
    center: ['25%', '50%'], // 环的位置
    itemStyle: {
      borderRadius: ['50%', '50%'],
    },
    label: {
      show: false,
    },
    labelLine: {
      show: false,
    },
    emphasis: {
      label: {
        show: false,
      },
    },
    data: [
      {
        value: item.count, //需要显示的数据
        name: item.title,
        sum: item.total,
      },
      {
        value: item.total - item.count,
        name: item.title,
        //不需要显示的数据，颜色设置成和背景一样
        itemStyle: {
          color: '#ccc',
        },
      },
    ],
  }))
  const option: Record<string, any> = {
    title: {
      text: countTotal,
      subtext: subtext,
      left: "24%",
      top: "43%",
      textAlign: 'center',
      itemGap: fitSize(5),
      textStyle: {
        fontSize: fitSize(20),
        fontweight: 'bold',
        color: '#333',
      },
      subtextStyle: {
        fontSize: fitSize(12),
        color: '#333',
        opacity: 0.8,
      },
    },
    tooltip: {
      show: true,
      trigger: 'item',
      confine: true,
      textStyle: {
        fontSize: fitSize(14),
      },
      formatter: '{a} : {c} ({d}%)',
    },
    color: color,
    legend: {
      orient: 'vertical',
      type: 'scroll',
      align: 'auto',
      selectedMode: false,
      y: 'center',
      itemWidth: fitSize(10), // 图例标记的图形宽度。
      itemHeight: fitSize(10), // 图例标记的图形高度。
      itemGap: fitSize(10), //图例每项之间的间隔
      right: '0',
      icon: 'rect',
      formatter: (name: string) => {
        const data = option.series as any[]
        let tarValue = 0
        let tarTotal = 0
        let persent = ''
        for (let i = 0; i < data.length; i++) {
          if (data[i].data[0].name == name) {
            tarValue = data[i].data[0].value
            tarTotal = data[i].data[0].sum
            persent =
              tarTotal == 0 || tarValue == 0
                ? '0'
                : ((Number(tarValue) * 100) / Number(tarTotal)).toFixed(2)
          }
        }
        const showName = name.length > 6 ? name.slice(0, 6) + '...' : name
        return `{name|${showName}}{tarValue|${tarValue}}{space|/}{tarTotal|${tarTotal}}{persent|${persent}%}`
      },
      textStyle: {
        color: 'inherit',
        rich: {
          name: {
            fontSize: fitSize(12),
            width: fitSize(90),
            align: 'left',
          },
          tarValue: {
            fontSize: fitSize(12),
            width: fitSize(25),
            align: 'center',
          },
          space: {
            fontSize: fitSize(12),
            width: fitSize(5),
            align: 'center',
            padding: [0, 5, 0, 5],
          },
          tarTotal: {
            fontSize: fitSize(12),
            width: fitSize(25),
            align: 'center',
          },
          persent: {
            fontSize: fitSize(12),
            width: fitSize(45),
            padding: [0, 0, 0, 5],
          }
        }
      },
      tooltip: {
        show: false,
        confine: true,
      },
    },
    series: series,
  }
  return option
}
// ****** 常规饼图一 ****** end

// ****** 常规饼图二 ****** start
interface DataItemType_getCommonPieOptionTwo {
  title: string
  total: number
}

interface ParamsType_getCommonPieOptionTwo {
  data: (Required<DataItemType_getCommonPieOptionTwo> & Record<string, any>)[]
  subtext: string;
  color?: string[];
}

export function getCommonPieOptionTwo(params: ParamsType_getCommonPieOptionTwo) {
  const { data, subtext, color = defaultColor } = params
  const sumTotal = data.reduce((pre, cur) => Number(cur.total) + Number(pre), 0)
  const seriesData: Record<string, any>[] = data.map(item => ({
    name: item.title,
    value: item.total,
  }))
  const option: Record<string, any> = {
    color: color,
    title: {
      text: sumTotal,
      top: "41%",
      left: "49%",
      textAlign: "center",
      itemGap: 2,
      subtext: subtext,
      textStyle: {
        fontSize: fitSize(20),
        fontweight: 'bold',
        color: '#333',
      },
      subtextStyle: {
        fontSize: fitSize(12),
        color: '#333',
        opacity: 0.8,
      },
    },
    tooltip: { 
      trigger: "item", 
      confine: true,
      textStyle: {
        fontSize: fitSize(14),
      },
      formatter: "{b}\n{c}\n{d}%" 
    },
    series: [
      {
        type: "pie",
        radius: ["55%", "65%"],
        center: ["50%", "50%"],
        labelLine: {
          length: 20,
          length2: 20,
        },
        label: {
          formatter: "{b|{b}}\n{d|{d}}%",
          borderWidth: 0,
          borderRadius: 4,
          position: "outer",
          edgeDistance: 10,
          alignTo: "none",
          distanceToLabelLine: 5,
          bleedMargin: 5,
          rich: {
            a: {
              color: "#333",
              fontSize: fitSize(14),
              lineHeight: fitSize(20),
            },
            b: {
              color: "#333",
              fontSize: fitSize(14),
              lineHeight: fitSize(20),
            },
            c: {
              color: "#333",
              fontSize: fitSize(14),
              lineHeight: fitSize(20),
            },
            d: {
              color: "#333",
              fontSize: fitSize(14),
              lineHeight: fitSize(20),
            },
          },
          color: "#333",
        },
        data: seriesData,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)",
          },
        },
      },
    ],
  }
  return option
}
// ****** 常规饼图二 ****** end

// ****** 常规柱状图一 ****** start
interface DateItemType_getCommonBarOptionOne {
  title: string
  count: number
}
interface ParamsType_getCommonBarOptionOne {
  data: (DateItemType_getCommonBarOptionOne & Record<string, any>)[]
  title?: string;
  color?: string[];
}

export function getCommonBarOptionOne(params: ParamsType_getCommonBarOptionOne) {
  // 自定义换行函数
  function wrapText(text: string, maxLength: number) {
    if (text.length <= maxLength) {
      return text;
    }
    const firstLine = text.slice(0, maxLength);
    let secondLine = text.slice(maxLength, maxLength * 2);
    if (secondLine.length === 0) {
      return firstLine;
    }
    if (text.length > maxLength * 2) {
      secondLine = secondLine.slice(0, -1) + '...';
    }
    return firstLine + '\n' + secondLine;
  }
  const { data, title, color = defaultColor } = params
  const options: Record<string, any> = {
    title: {
      text: title,
      textStyle: {
        fontSize: fitSize(14),
        color: "#333",
      },
    },
    color: color,
    grid: {
      top: fitSize(40),
      left: fitSize(30),
      bottom: fitSize(10),
      containLabel: true,
    },
    tooltip: {
      textStyle: {
        fontSize: fitSize(14),
      },
      trigger: 'axis',
    },
    xAxis: {
      type: 'category',
      axisTick: {
        show: false,
      },
      axisLine: {
        show: false,
      },
      axisLabel: {
        interval: 0,
        color: '#333',
        fontSize: fitSize(12),
        formatter: function (value: string) {
          // console.log('value', value);
          return wrapText(value, 4);
        },
      },
      data: data.map(item => item.title),
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        color: '#999',
        fontSize: fitSize(12),
        hideOverlap: true,
        overflow: "truncate", //超出的部分截断
      },
      splitNumber: 4,
    },
    series: [
      {
        type: 'bar',
        barWidth: fitSize(10),
        colorBy: 'data',
        label: {
          show: true,
          fontSize: fitSize(12),
          position: 'top'
        },
        data: data.map(item => item.count),
      },
    ],
  }
  return options
}
// ****** 常规柱状图一 ****** end

// ****** 常规折线图一 ****** start
interface ValuesType_getCommonLineOptionOne {
  value: string;
  happenTime: string;
}
interface DataItemType_getCommonLineOptionOne {
  title: string
  values?: (ValuesType_getCommonLineOptionOne & Record<string, any>)[];
}
interface ParamsType_getCommonLineOptionOne {
  data: (DataItemType_getCommonLineOptionOne & Record<string, any>)[];
  title?: string;
  color?: string[];
}
export function getCommonLineOptionOne(params: ParamsType_getCommonLineOptionOne) {
  const { data, title, color = defaultColor } = params;
  const series = data.map(item => ({
    type: "line",
    symbol: "none",
    lineStyle: {
      width: fitSize(2)
    },
    smooth: true,
    name: item.title,
    data: item.values?.map(item => item.value),
  }))
  const xAxisData = data[0].values?.map(item => item.happenTime) || [];
  const option = {
    title: {
      text: title,
      textStyle: {
        fontSize: fitSize(14),
        color: "#333",
      },
    },
    grid: {
      top: fitSize(40),
      left: 0,
      right: 0,
      bottom: fitSize(5),
      containLabel: true,
    },
    tooltip: {
      trigger: "axis",
      confine: true,
      backgroundColor: "rgba(0,0,0,0.5)",
      borderWidth: 0,
      textStyle: {
        color: "#fff",
        fontSize: fitSize(14)
      },
      valueFormatter: (value: string) => value + "%",
    },
    legend: {
      data: data.map(item => item.title),
      icon: "rect",
      right: 0,
      width: fitSize(600),
      itemHeight: fitSize(12),
      itemWidth: fitSize(12),
      type: "scroll",
      textStyle: {
        fontSize: fitSize(12)
      }
    },
    color: color,
    xAxis: {
      type: "category",
      data: xAxisData,
      axisLine: {
        lineStyle: {
          // color: "rgba(255,255,255,0.2)",
        },
      },
      axisLabel: {
        showMinLabel: true,
        showMaxLabel: true,
        color: "#999",
        fontSize: fitSize(12),
        boundaryGap: false,
        interval: xAxisData.length > 6 ? Math.floor(xAxisData.length / 4) : 0,
        formatter: function (value: string) {
          // console.log('value', value);
          return dayjs(value).format("YYYY-MM-DD") + "\n" + dayjs(value).format("HH:mm");
        },
      },
      axisTick: {
        show: false,
        alignWithLabel: true,
      },
    },
    yAxis: {
      type: "value",
      axisLabel: {
        show: true,
        interval: "auto",
        fontSize: fitSize(12),
        formatter: "{value}",
      },
      axisLine: {
        lineStyle: {
          color: "#999",
        },
      },
      splitLine: {
        lineStyle: {
          type: "solid",
          color: "#999",
        },
      },
      show: true,
      min: 0,
      max: 100
    },
    series: series,
  };
  return option
}
// ****** 常规折线图一 ****** end