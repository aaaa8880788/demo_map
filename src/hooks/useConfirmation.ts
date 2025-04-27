import { ElMessage, ElMessageBox } from 'element-plus'

export const useConfirmation = (
  api: (params: any) => Promise<any>,
  params: any = {}, //删除的id之类
  deleteContent: string,
  message: string, //删除或解绑
  prompt?: string, // 提示
) => {
  return new Promise((resolve, reject) => {
    ElMessageBox.confirm(`${deleteContent}`, `${message}${prompt ?? ''}`, {
      confirmButtonText: `确定${message}`,
      cancelButtonText: '取消',
      customClass: 'confirm-message',
      confirmButtonClass: 'determine-btn',
      type: 'warning',
    }).then(async () => {
      try {
        const res = await api(params)
        if (res?.success) {
          ElMessage.success(`${message}成功`)
          resolve(true)
        }
      } catch (error) {
        reject(error)
      }
    })
  })
}
