<template>
  <div class="svg-component">
    <V3DragZoomContainer
      ref="zoomRef"
      :min-zoom="0.1"
      :max-zoom="100"
      :zoom-factor="0.1"
      align="contain"
      :autoResize="true"
      :followPointer="true"
    >
      <div class="svg" ref="svgRef"></div>
    </V3DragZoomContainer>
  </div>
</template>

<script setup lang="ts">
import { V3DragZoomContainer } from 'v3-drag-zoom'

interface fillDataItem {
  index: string | number;
  data: string;
}
enum StartingPoint {
  XMinYMin = 1,
  XMinYMax = 2,
  XMaxYMin = 3,
  XMaxYMax = 4
}
const props = withDefaults(
  defineProps<{ 
    svgData: string; 
    enumType?: StartingPoint
    fillData?: (fillDataItem & Record<string, any>)[];
  }>(),
  { 
    svgData: '',
    enumType: StartingPoint.XMaxYMax,
    fillData: () => [],
  },
)
const { svgData, enumType, fillData } = toRefs(props)


const zoomRef = ref();
const svgRef = ref();
interface fillIndexesParams {
  data: { element: SVGTSpanElement; x: number; y: number }[][];
  enumType: StartingPoint;
  fillData?: (fillDataItem & Record<string, any>)[];
}

const fillIndexes = (params: fillIndexesParams) => {
  const {
    data,
    enumType,
  } = params
  let index = 1;
  if(Array.isArray(fillData.value) && fillData.value.length) {
    if (enumType === StartingPoint.XMinYMin) {
      for (let i = 0; i < data.length; i++) {
        if (i % 2 === 0) {
          for (let j = 0; j < data[i].length; j++) {
            const fillItem = fillData.value.find(item => item.index == index)
            if(fillItem) {
              data[i][j].element.innerHTML = `${fillItem.data}`;
            }else {
              data[i][j].element.innerHTML = ``;
            }
            index++
          }
        } else {
          for (let j = data[i].length - 1; j >= 0; j--) {
            const fillItem = fillData.value.find(item => item.index == index)
            if(fillItem) {
              data[i][j].element.innerHTML = `${fillItem.data}`;
            }else {
              data[i][j].element.innerHTML = ``;
            }
            index++
          }
        }
      }
    } else if (enumType === StartingPoint.XMinYMax) {
      for (let i = 0; i < data.length; i++) {
        if(i % 2 === 0) {
          for (let j = data[i].length - 1; j >= 0; j--) {
            const fillItem = fillData.value.find(item => item.index == index)
            if(fillItem) {
              data[i][j].element.innerHTML = `${fillItem.data}`;
            }else {
              data[i][j].element.innerHTML = ``;
            }
            index++
          }
        }else {
          for (let j = 0; j < data[i].length; j++) {
            const fillItem = fillData.value.find(item => item.index == index)
            if(fillItem) {
              data[i][j].element.innerHTML = `${fillItem.data}`;
            }else {
              data[i][j].element.innerHTML = ``;
            }
            index++
          }
        }
      }
    } else if (enumType === StartingPoint.XMaxYMin) {
      for (let i = data.length - 1; i >= 0; i--) {
        if (i % 2 === 0) {
          for (let j = 0; j < data[i].length; j++) {
            const fillItem = fillData.value.find(item => item.index == index)
            if(fillItem) {
              data[i][j].element.innerHTML = `${fillItem.data}`;
            }else {
              data[i][j].element.innerHTML = ``;
            }
            index++
          }
        } else {
          for (let j = data[i].length - 1; j >= 0; j--) {
            const fillItem = fillData.value.find(item => item.index == index)
            if(fillItem) {
              data[i][j].element.innerHTML = `${fillItem.data}`;
            }else {
              data[i][j].element.innerHTML = ``;
            }
            index++
          }
        }
      }
    } else if (enumType === StartingPoint.XMaxYMax) {
      for (let i = data.length - 1; i >= 0; i--) {
        if (i % 2 === 0) {
          for (let j = data[i].length - 1; j >= 0; j--) {
            const fillItem = fillData.value.find(item => item.index == index)
            if(fillItem) {
              data[i][j].element.innerHTML = `${fillItem.data}`;
            }else {
              data[i][j].element.innerHTML = ``;
            }
            index++
          }
        } else {
          for (let j = 0; j < data[i].length; j++) {
            const fillItem = fillData.value.find(item => item.index == index)
            if(fillItem) {
              data[i][j].element.innerHTML = `${fillItem.data}`;
            }else {
              data[i][j].element.innerHTML = ``;
            }
            index++
          }
        }
        
      }
    } 
  }else {
    if (enumType === StartingPoint.XMinYMin) {
      for (let i = 0; i < data.length; i++) {
        if (i % 2 === 0) {
          for (let j = 0; j < data[i].length; j++) {
            data[i][j].element.innerHTML = `${index++}`;
          }
        } else {
          for (let j = data[i].length - 1; j >= 0; j--) {
            data[i][j].element.innerHTML = `${index++}`;
          }
        }
      }
    } else if (enumType === StartingPoint.XMinYMax) {
      for (let i = 0; i < data.length; i++) {
        if(i % 2 === 0) {
          for (let j = data[i].length - 1; j >= 0; j--) {
            data[i][j].element.innerHTML = `${index++}`;
          }
        }else {
          for (let j = 0; j < data[i].length; j++) {
            data[i][j].element.innerHTML = `${index++}`;
          }
        }
      }
    } else if (enumType === StartingPoint.XMaxYMin) {
      for (let i = data.length - 1; i >= 0; i--) {
        if (i % 2 === 0) {
          for (let j = 0; j < data[i].length; j++) {
            data[i][j].element.innerHTML = `${index++}`;
          }
        } else {
          for (let j = data[i].length - 1; j >= 0; j--) {
            data[i][j].element.innerHTML = `${index++}`;
          }
        }
      }
    } else if (enumType === StartingPoint.XMaxYMax) {
      for (let i = data.length - 1; i >= 0; i--) {
        if (i % 2 === 0) {
          for (let j = data[i].length - 1; j >= 0; j--) {
            data[i][j].element.innerHTML = `${index++}`;
          }
        } else {
          for (let j = 0; j < data[i].length; j++) {
            data[i][j].element.innerHTML = `${index++}`;
          }
        }
        
      }
    } 
  }
};

const getTransform = (node: any) => {
  if(node.tagName == 'g' && node.getAttribute('transform')) {
    return node.getAttribute('transform')
  }else {
    return getTransform(node.parentNode)
  }
}

const loadSvg = (enumType: StartingPoint) => {
  if(svgRef.value) {
    if (svgRef.value.firstChild) {
      svgRef.value.removeChild(svgRef.value.firstChild);
    }
    const parser = new DOMParser();
    const doc = parser.parseFromString(svgData.value, "text/html");
    const svgTag = doc.getElementsByTagName("svg")[0];
    svgRef.value.appendChild(svgTag);
    const tspanElements = Array.from(svgRef.value.querySelectorAll('tspan')).filter((item: any) => /\d/.test(item.textContent))
    const tspanData: { element: SVGTSpanElement; x: number; y: number }[] = [];
    tspanElements.forEach((element: any) => {
      const transform = getTransform(element.parentNode);
      if (transform) {
        const match = transform.match(/translate\(\s*([+-]?\d*\.?\d+)\s*,\s*([+-]?\d*\.?\d+)\s*\)/);
        if (match) {
          const x = parseInt(match[1], 10);
          const y = parseInt(match[2], 10);
          tspanData.push({ element, x, y });
        }
      }
    });
    tspanData.sort((a, b) => {
      if (a.x === b.x) {
        return a.y - b.y;
      }
      return a.x - b.x;
    });

    const tspanData2D: { element: SVGTSpanElement; x: number; y: number }[][] = [];
    let currentX = tspanData[0].x;
    let currentGroup: { element: SVGTSpanElement; x: number; y: number }[] = [];
    tspanData.forEach((item) => {
      if (item.x !== currentX) {
        tspanData2D.push(currentGroup);
        currentGroup = [];
        currentX = item.x;
      }
      currentGroup.push(item);
    });
    tspanData2D.push(currentGroup);
    // console.log('tspanData------', tspanData);
    // console.log('tspanData2D------', tspanData2D);
    fillIndexes({
      data: tspanData2D,
      enumType: enumType,
    });
  }
}

watch([svgData, enumType, fillData], ([newSvgData, newEnumType]) => {
  console.log('newSvgData', newSvgData);
  console.log('newEnumType', newEnumType);
  if(newSvgData && newEnumType) {
    nextTick(() => {
      loadSvg(newEnumType);
    })
  }
}, {
  immediate: true
})
</script>

<style scoped lang="less">
.svg-component {
  position: relative;
  width: 100%;
  height: 100%;
  .svg {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
