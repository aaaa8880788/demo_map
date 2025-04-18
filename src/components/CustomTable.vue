<template>
  <div class="custom-table">
    <el-table
      ref="tableRef"
      :data="data"
      v-loading="loading"
      v-bind="$attrs"
      @selection-change="handleSelectionChange"
      @row-click="handleRowClick"
    >
      <!-- 多选列 -->
      <el-table-column v-if="showSelection" type="selection" width="55" />
      <!-- 动态列渲染 -->
      <template v-for="column in columns" :key="column?.prop">
        <el-table-column
          :prop="column.prop"
          :label="column.label"
          v-bind="column.columnProps || {}"
          v-on="column.columnEvents || {}"
        >
          <template v-if="column.slotName" #default="scope">
            <slot :name="column.slotName" :scope="scope"></slot>
          </template>
        </el-table-column>
      </template>
    </el-table>
    <div class="pagination-box" v-if="showPagination">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :total="total"
        :layout="layout"
        :background="true"
        :page-sizes="pageSizes"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
export interface TableColumn {
  prop: string // 列字段
  label?: string // 列标签
  slotName?: string // 列插槽
  columnProps?: Record<string, any> // 列组件其他属性
  columnEvents?: Record<string, () => void> // 列组件事件
}

const props = withDefaults(
  defineProps<{
    columns?: TableColumn[] // 表格列配置
    tableData?: Record<string, any>[] // 表格数据
    loading?: boolean // 加载状态
    showSelection?: boolean // 是否可选
    showPagination?: boolean // 是否显示分页
    page?: number // 当前页码
    size?: number // 每页显示条目个数
    total?: number // 数据总条数
    layout?: string // 分页布局
    pageSizes?: number[] // 每页显示个数选项
  }>(),
  {
    columns: () => [],
    tableData: () => [],
    loading: false,
    showSelection: false,
    showPagination: true,
    page: 1,
    size: 10,
    total: 0,
    layout: 'total, sizes, prev, pager, next, jumper',
    pageSizes: () => [10, 20, 50, 100],
  },
)
const emit = defineEmits<{
  (e: 'update:page', val: number): void
  (e: 'update:size', val: number): void
  (e: 'row-click', row: any, column: any, event: Event): void
  (e: 'selection-change', selection: any): void
  (e: 'page-change', data: { page: number; size: number }): void
}>()

const tableRef = ref<any>()
const pageSize = ref<number>(props.size)
const currentPage = ref<number>(props.page)
const data = computed(() => props.tableData)

watch(
  () => props.size,
  (val) => (pageSize.value = val),
)

watch(
  () => props.page,
  (val) => (currentPage.value = val),
)

const handleRowClick = (row: any, column: any, event: Event) => {
  emit('row-click', row, column, event)
}

const handleSelectionChange = (selection: any) => {
  emit('selection-change', selection)
}

const handleSizeChange = (val: number) => {
  pageSize.value = val
  emit('update:size', val)
  emit('page-change', { page: currentPage.value, size: val })
}

const handleCurrentChange = (val: number) => {
  currentPage.value = val
  emit('update:page', val)
  emit('page-change', { page: val, size: pageSize.value })
}

defineExpose({
  getTableRef: () => tableRef.value,
})
</script>

<style scoped lang="less">
.custom-table {
  flex: 1;
  display: flex;
  flex-direction: column;
  :deep(.el-table) {
    flex: 1;
  }
  .pagination-box {
    margin-top: 10px;
    display: flex;
    justify-content: flex-end;
    :deep(.el-pagination) {
      max-width: 100%;
      overflow: auto;
    }
  }
}
</style>
