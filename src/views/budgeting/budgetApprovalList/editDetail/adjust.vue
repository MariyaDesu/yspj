<script setup lang="ts">
import type { DataTableColumns } from 'naive-ui'
import { NButton } from 'naive-ui'
import { baseApi } from '@/api/baseApi'
import { renderIcon } from '@/utils/common'
import { useAppStore } from '@/store'
const props = defineProps<{
  showAdjust: boolean
  fileEditIndex: any
  uploadTable: any[]
}>()

const emits = defineEmits(['update:showAdjust', 'updataUploadTable'])

const appStore = useAppStore()
const tHeight = ref(appStore.tHeight - 320)
const loading = ref<boolean>(false)
interface UploadRowData {
  fileUrl: string
  oldName: string
  id: number
}
interface ColumnList {
  uploadColunm: DataTableColumns<UploadRowData>
}

interface IData {
  showAdjust: boolean
  fileEditIndex?: string | null
}

const Data: IData = reactive({
  showAdjust: false,
})

const fileEditIndex = ref(null)
// const { uploadTable, fileEditIndex } = toRefs(props)
// 之前的数据
const uploadTable: any = ref([])

async function handleView(row) {
  let type = ''
  if (row.fileFormat === 'pdf')
    type = 'application/pdf'

  else if (row.fileFormat === 'xls' || row.fileFormat === 'xlsx')
    type = 'application/vnd.ms-excel'

  else if (row.fileFormat === 'jpeg' || row.fileFormat === 'jpg' || row.fileFormat === 'png' || row.fileFormat === 'jfif')
    type = 'image/jpeg'

  const res: any = await baseApi.budAttachmentSelect({ oldName: row.oldName, fileUrl: row.fileUrl })
  const url = window.URL.createObjectURL(new Blob([res], { type }))
  const a = document.createElement('a')
  a.style.display = 'none'
  a.href = url
  a.download = row.oldName
  document.body.appendChild(a)
  a.click() // 执行下载
  window.URL.revokeObjectURL(a.href)
  document.body.removeChild(a)
}

const columnList: ColumnList = reactive({
  uploadColunm: [
    { type: 'selection' },
    {
      title: '序号',
      align: 'center',
      width: 80,
      key: 'index',
      render: (_, index) => {
        return `${index + 1}`
      },
    },
    {
      title: '文件名称',
      key: 'oldName',
      align: 'center',
      width: 200,
      ellipsis: { tooltip: true },
    },
    {
      title: '操作',
      key: 'actions',
      width: 200,
      align: 'center',
      fixed: 'right',
      render(row, index) {
        return [
          h(
            NButton,
            {
              size: 'small',
              type: 'info',
              hidden: !row.id,
              onClick: () => handleView(row),
            },
            { default: () => '下载', icon: renderIcon('material-symbols:download-sharp', { size: 14 }) },
          ),

        ]
      },
    },
  ],
})
watch(() => props.showAdjust, (newVal: boolean, oldVal) => {
  Data.showAdjust = newVal
})

watch(() => Data.showAdjust, (val, old) => {
  emits('update:showAdjust', val) // 此处的update亦要写
})

watch(() => props.uploadTable, (newVal, oldVal) => {
  uploadTable.value = JSON.parse(JSON.stringify(newVal))
})
watch(() => props.fileEditIndex, (newVal, oldVal) => {
  fileEditIndex.value = newVal
}, { deep: true })
</script>

<template>
  <n-modal
    v-model:show="Data.showAdjust" class="custom-card" preset="card" title="附件" size="huge"
    :style="{ width: '60%' }" :mask-closable="false"
  >
    <n-card mt-10>
      <NDataTable
        mt-10 default-expand-all single-column striped :columns="columnList.uploadColunm" :data="uploadTable"
        :loading="loading" flex-height :style="{ minHeight: `${tHeight}px` }"
      />
    </n-card>
  </n-modal>
</template>

<style scoped></style>
