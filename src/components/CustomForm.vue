<template>
  <el-form ref="formRef" :model="form" :rules="rules" v-bind="$attrs">
    <template v-for="field in fields" :key="field.prop">
      <el-form-item :label="field.label" :prop="field.prop" :style="{ width: `${field.width}` }">
        <component
          :is="mapComponent[field.compName || 'ElInput']"
          v-model="form[field.prop]"
          v-on="field.compEvents || {}"
          v-bind="field.compProps || {}"
        >
          <template v-if="field.compOptions">
            <component
              v-for="option in field.compOptions"
              :key="option.value"
              :label="option.label"
              :value="option.value"
              :is="mapComponent[option.compName || 'ElOption']"
              v-bind="option.compProps || {}"
            />
          </template>
        </component>
      </el-form-item>
    </template>
    <el-form-item v-if="showActions" style="margin-right: 0">
      <slot name="actions" :model="form">
        <el-button type="primary" @click="onSearch">查询</el-button>
        <el-button @click="onReset">重置</el-button>
      </slot>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import type { FormInstance, FormRules } from 'element-plus'
import {
  ElInput,
  ElInputNumber,
  ElSelect,
  ElOption,
  ElRadioGroup,
  ElRadio,
  ElRadioButton,
  ElCheckboxGroup,
  ElCheckbox,
  ElDatePicker,
  ElTreeSelect,
} from 'element-plus'
import type { PropType } from 'vue'

const mapComponent: Record<string, any> = {
  ElInput,
  ElInputNumber,
  ElSelect,
  ElOption,
  ElRadioGroup,
  ElRadio,
  ElRadioButton,
  ElCheckboxGroup,
  ElCheckbox,
  ElDatePicker,
  ElTreeSelect,
}

export interface FormField {
  prop: string // 表单字段名
  label?: string // 表单标签
  width?: string // 表单宽度 '200px' 或者 '100%' 使用百分比方便大屏适配
  compName?: string // 表单组件名 'ElInput'、'ElSelect'
  compProps?: Record<string, any> // 表单组件其他属性
  compEvents?: Record<string, (...args: any[]) => void> // 表单组件事件
  compOptions?: Array<{
    label: string // 表单组件选项标签
    value: any // 表单组件选项值
    compName?: string // 表单组件选项组件名
    compProps?: Record<string, any> // 表单组件选项组件其他属性
  }>
}

const props = defineProps({
  model: { type: Object, required: true },
  fields: { type: Array as PropType<FormField[]>, required: true },
  rules: { type: Object as PropType<FormRules>, default: () => ({}) },
  showActions: { type: Boolean, default: true },
})
const emit = defineEmits<{
  (e: 'reset'): void
  (e: 'submit', form: Record<string, any>): void
}>()

const formRef = ref<FormInstance>()
const form = computed<Record<string, any>>(() => props.model)

const onSearch = async () => {
  try {
    formRef.value?.validate()
    emit('submit', form.value)
  } catch (error) {
    console.error('表单验证失败：', error)
  }
}

const onReset = async () => {
  formRef.value?.resetFields()
  emit('reset')
}

defineExpose({
  validate: () => formRef.value?.validate(),
  resetFields: () => formRef.value?.resetFields(),
  scrollToField: (prop: string) => formRef.value?.scrollToField(prop),
})
</script>

<style scoped lang="scss"></style>
