<template>
	<div class="chart layout-version-one">
		<div class="layout-version-one-search">
			<custom-form 
        :model="searchForm" 
        :fields="fields" 
        :inline="true" 
        @submit="handleFormSubmit"
        @reset="handleFormReset"/>
		</div>
		<div class="layout-version-one-main">
			<div class="layout-version-one-main-left">
				<div class="layout-version-one-main-left-item">
					<div class="layout-version-one-main-left-item-title">
						<span>智能终端运行情况</span>
					</div>
					<div class="layout-version-one-main-left-item-content">
						<div class="device-list" v-loading="stationDataLoading">
							<TerminalConditionList :terminalData="currentActiveStation.terminalData || []" />
						</div>
					</div>
				</div>
				<div class="layout-version-one-main-left-item">
					<div class="layout-version-one-main-left-item-title">
						<span>终端设备汇总情况</span>
					</div>
					<div class="layout-version-one-main-left-item-content">
						<div class="device-chart">
							<CustomChart :loading="stationDataLoading" :options="currentActiveStation.terminalDataOnlineSituationChartOption || {}" />
						</div>
					</div>
				</div>
			</div>
			<div class="layout-version-one-main-right">
				<div class="layout-version-one-main-right-item">
					<div class="layout-version-one-main-right-item-title">
						<span>终端设备在线情况</span>
					</div>
					<div class="layout-version-one-main-right-item-content">
						<div class="device-chart">
							<CustomChart :loading="stationDataLoading" :options="currentActiveStation.terminalDataOnlineSituationOneChartOption || {}" />
						</div>
					</div>
				</div>
				<div class="layout-version-one-main-right-item">
					<el-empty v-if="!stationData.length" v-loading="stationDataLoading" description="暂无数据" />
					<div v-else class="station" v-for="item in stationData" :key="item.key" :class="{ 'highlight-station': item.id == currentActiveStationId }" @click="handleStationClick(item)">
						<el-collapse v-model="activeNames">
							<el-collapse-item :name="item.key">
								<template #title>
									<div class="layout-version-one-main-right-item-title">
										<span>{{ item.title }}</span>
									</div>
								</template>
								<div class="layout-version-one-main-right-item-content">
									<div class="station-device-chart">
										<div class="station-device-chart-left">
											<CustomChart :loading="stationDataLoading" :options="item.terminalDataOnlineCountChartOption || {}" />
										</div>
										<div class="station-device-chart-right">
											<CustomChart :loading="stationDataLoading" :options="item.terminalDataHistoryOnlineSituationChartOption || {}" />
										</div>
									</div>
								</div>
							</el-collapse-item>
						</el-collapse>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import dayjs from "dayjs";
import { getDayTime } from "@/utils/common.ts";
import { getCommonPieOptionTwo, getCommonBarOptionOne, getCommonLineOptionOne, getCommonPieOptionOne } from "@/utils/commonChart.ts";
import TerminalConditionList from "@/components/TerminalConditionList/index.vue";
import { useStationStore } from '@/stores/station'
import type { FormField } from '@/components/CustomForm.vue'
import icon_19 from "@/assets/images/baseView/icon_19.png"; // SCADA
import icon_20 from "@/assets/images/baseView/icon_20.png"; // 图像类
import icon_21 from "@/assets/images/baseView/icon_21.png"; // 辅控类
import icon_22 from "@/assets/images/baseView/icon_22.png"; // 在线监测类

const { stationArr, stationInfo } = useStationStore()

const initData = {
	activeNames: [],
	searchForm: {
    interval: '',
    time: [
      dayjs().startOf('day').format('YYYY-MM-DD HH:mm:ss'),
      dayjs().format('YYYY-MM-DD HH:mm:ss'),
    ],
    treeNodeId: stationInfo?.id || '',
  },
	stationData: [],
	stationDataLoading: false,
};

const fields = ref<FormField[]>([
  {
    prop: 'interval',
    label: '',
    compName: 'ElRadioGroup',
    compEvents: { 
      change: (value: string) => {
        const index = {
          day: 3,
          week: 7,
          month: dayjs().daysInMonth() ?? 30,
        }[value] ?? 0
        searchForm.value.time = getDayTime(index)
        handleFormSubmit()
      }
    },
    compOptions: [
      { label: '3天', value: 'day', compName: 'ElRadioButton' },
      { label: '周', value: 'week', compName: 'ElRadioButton' },
      { label: '月', value: 'month', compName: 'ElRadioButton' },
    ],
  },
  {
    prop: 'time',
    label: '操作时间',
    compName: 'ElDatePicker',
    compProps: { 
      type: 'datetimerange', 
      valueFormat: 'YYYY-MM-DD HH:mm:ss', 
      startPlaceholder: "开始时间",
      endPlaceholder: "结束时间",
      clearable: false,
    },
  },
  {
    prop: 'treeNodeId',
    label: '站点',
    width: '16%',
    compName: 'ElSelect',
    compProps: {
      clearable: false,
    },
    compOptions: [...stationArr.map((item: any) => ({ label: item.name, value: item.id }))],
  },
])
const searchForm = ref({ ...initData.searchForm });
const activeNames = ref<string[]>([...initData.activeNames]);

const currentActiveStationId = ref<string>(""); // 当前活跃站id
const currentActiveStation = ref<Record<string, any>>({}); // 当前活跃站数据
const setCurrentActiveStationId = (id: string) => {
	currentActiveStationId.value = id;
};
const originalStationData = ref<Record<string, any>>([]); // 源数据
const stationDataLoading = ref<boolean>(initData.stationDataLoading);
const stationData = ref<Record<string, any>>([...initData.stationData]);
const resizeChartData = ref<Record<string, any>>({}); // 用于响应式更新图标

const handleFormSubmit = () => {
  getStationData()
}

const handleFormReset = () => {
  getStationData()
}

const handleStationClick = (item: Record<string, any>) => {
	setCurrentActiveStationId(item.id);
};

const getStationDataApi = async (params: Record<string, any>) => {
	return {
		success: true,
		data: [
			{
				title: "500kV变电站1",
				id: "1",
				key: "1",
				terminalData: [
					{
						title: "SCADA",
						count: 5,
						total: 10,
						image: icon_19,
						dataList: [
							{ happenTime: "2023-01-01", value: 10 },
							{ happenTime: "2023-01-02", value: 20 },
							{ happenTime: "2023-01-03", value: 30 },
							{ happenTime: "2023-01-04", value: 40 },
							{ happenTime: "2023-01-05", value: 50 },
							{ happenTime: "2023-01-06", value: 60 },
							{ happenTime: "2023-01-07", value: 70 },
							{ happenTime: "2023-01-08", value: 80 },
							{ happenTime: "2023-01-09", value: 90 },
						],
					},
					{
						title: "图像类",
						count: 15,
						total: 20,
						image: icon_20,
						dataList: [
							{ happenTime: "2023-02-01", value: 50 },
							{ happenTime: "2023-02-02", value: 45 },
							{ happenTime: "2023-02-03", value: 80 },
							{ happenTime: "2023-02-04", value: 95 },
							{ happenTime: "2023-02-05", value: 20 },
							{ happenTime: "2023-02-06", value: 80 },
							{ happenTime: "2023-02-07", value: 50 },
							{ happenTime: "2023-02-08", value: 30 },
							{ happenTime: "2023-02-09", value: 10 },
						],
					},
					{
						title: "辅控类",
						count: 15,
						total: 30,
						image: icon_21,
					},
					{
						title: "在线监测类",
						count: 10,
						total: 40,
						image: icon_22,
					},
				],
			},
		],
	};
};

const getStationData = async () => {
	try {
		stationDataLoading.value = true;
		const res: any = await getStationDataApi({
			...searchForm.value,
			time: undefined,
			startTime: (searchForm.value.time ?? [])[0] || "",
			endTime: (searchForm.value.time ?? [])[1] || "",
		});
		// console.log('res------', res);
		if (res.success && Array.isArray(res.data)) {
			originalStationData.value = [...res.data];
			stationData.value = res.data.map((stationItem: Record<string, any>) => {
				const returnData: Record<string, any> = {
					...stationItem,
				};
				const terminalData = stationItem.terminalData;
				if (Array.isArray(terminalData) && terminalData.length) {
					if (!resizeChartData.value[stationItem.id]) {
						resizeChartData.value[stationItem.id] = {};
					}
					const getCommonPieOptionTwoParams = {
						subtext: "在线数",
						data: terminalData,
					};
					resizeChartData.value[stationItem.id].getCommonPieOptionTwoParams = getCommonPieOptionTwoParams;
					returnData.terminalDataOnlineSituationChartOption = getCommonPieOptionTwo(getCommonPieOptionTwoParams);

					const getCommonPieOptionOneParams = {
						subtext: "在线数",
						data: terminalData,
					};
					resizeChartData.value[stationItem.id].getCommonPieOptionOneParams = getCommonPieOptionOneParams;
					returnData.terminalDataOnlineSituationOneChartOption = getCommonPieOptionOne(getCommonPieOptionOneParams);

					const getCommonBarOptionOneParams = {
						title: "告警数量",
						data: terminalData,
					};
					resizeChartData.value[stationItem.id].getCommonBarOptionOneParams = getCommonBarOptionOneParams;
					returnData.terminalDataOnlineCountChartOption = getCommonBarOptionOne(getCommonBarOptionOneParams);

					const terminalDataHistoryOnlineRate = terminalData.map(item => {
						const newObj: any = {};
						newObj.title = item.title;
						newObj.values = item.dataList;
						return newObj;
					});
					const getCommonLineOptionOneParams = {
						title: "终端历史在线率",
						data: terminalDataHistoryOnlineRate,
					};
					resizeChartData.value[stationItem.id].getCommonLineOptionOneParams = getCommonLineOptionOneParams;
					returnData.terminalDataHistoryOnlineSituationChartOption = getCommonLineOptionOne(getCommonLineOptionOneParams);
				}
				return returnData;
			});
			if (!activeNames.value.length) {
				activeNames.value = stationData.value.map((item: Record<string, any>) => item.id);
			}
			if (!currentActiveStationId.value) {
				currentActiveStationId.value = stationData.value[0].id;
			}
			console.log("stationData.value------", stationData.value);
		}

		stationDataLoading.value = false;
	} catch (error) {
		console.error("error------", error);
		stationDataLoading.value = false;
	}
};

const init = async () => {
	await getStationData();
};

// echarts响应式处理
const updateChartOption = () => {
	if (!Object.keys(resizeChartData.value).length) return;
	stationData.value.forEach((stationItem: Record<string, any>) => {
		const getCommonPieOptionTwoParams = resizeChartData.value[stationItem.id]?.getCommonPieOptionTwoParams;
		if (getCommonPieOptionTwoParams) {
			stationItem.terminalDataOnlineSituationChartOption = getCommonPieOptionTwo(getCommonPieOptionTwoParams);
		}
		const getCommonPieOptionOneParams = resizeChartData.value[stationItem.id]?.getCommonPieOptionOneParams;
		if (getCommonPieOptionOneParams) {
			stationItem.terminalDataOnlineSituationOneChartOption = getCommonPieOptionOne(getCommonPieOptionOneParams);
		}
		const getCommonBarOptionOneParams = resizeChartData.value[stationItem.id]?.getCommonBarOptionOneParams;
		if (getCommonBarOptionOneParams) {
			stationItem.terminalDataOnlineCountChartOption = getCommonBarOptionOne(getCommonBarOptionOneParams);
		}
		const getCommonLineOptionOneParams = resizeChartData.value[stationItem.id]?.getCommonLineOptionOneParams;
		if (getCommonLineOptionOneParams) {
			stationItem.terminalDataHistoryOnlineSituationChartOption = getCommonLineOptionOne(getCommonLineOptionOneParams);
		}
	});
};

const initEvent = () => {
	window.addEventListener("resize", () => {
		updateChartOption();
	});
};

watch([currentActiveStationId, stationData], ([newId, newData]) => {
	if (newId && newData.length) {
		currentActiveStation.value = newData?.find((item: Record<string, any>) => item.id == newId) || {};
		console.log("currentActiveStation-", currentActiveStation.value);
	} else {
		currentActiveStation.value = {};
	}
});

onMounted(() => {
	init();
	initEvent();
});
</script>

<style lang="less" scoped>
</style>
