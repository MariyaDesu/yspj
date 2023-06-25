<script setup lang="ts">
import type { DataTableColumns, UploadFileInfo } from 'naive-ui'
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
const upload = ref(null)
const fileEditIndex = ref(null)
// 之前的数据
const uploadTable: any = ref([])
// 新增的数据
const uploadTableList: any = ref([])
function handleUpload(options: { fileList: UploadFileInfo[]; file }) {
  const name = options.file.name.split('.')
  if (
    name[name.length - 1] !== 'jpeg'
    && name[name.length - 1] !== 'jpg'
    && name[name.length - 1] !== 'png'
    && name[name.length - 1] !== 'pdf'
    && name[name.length - 1] !== 'xls'
    && name[name.length - 1] !== 'xlsx'
  ) {
    window.$message?.error('请上传 jpeg/jpg/png/pdf/xls/xlsx 格式的文件!')
    return
  }
  if (options.file.size / 1024 / 1024 > 10)
    window.$message?.error('上传文件大小不能超过 10MB!')
  uploadTable.value.push({ fileFormat: name[name.length - 1], oldName: options.file.name, fileUrl: options.file.fullPath })
  uploadTableList.value.push(options.file)
}

async function handleSaveUpload() {
  if (!uploadTableList.value) {
    Data.showAdjust = false
    return
  }
  const formdata = new FormData()
  uploadTableList.value.forEach((files) => {
    formdata.append('fileList', files.file)
  })
  // 判断是否有id,有id提交的时候带上id,确认用户是第一次上传附件还是保存完重新继续上传附件
  if (fileEditIndex.value)
    formdata.append('id', fileEditIndex.value)
  const res = await baseApi.budAttachmentUpload(formdata)
  if (res.code === 200) {
    const l1 = uploadTable.value.length
    const l2 = uploadTableList.value.length
    // 判断是否有新增,有就把新增数据放进将要提交的uploadTable
    res.data.forEach((item, index) => {
      uploadTable.value[l1 - l2 + index] = item
    })
  }
  // 把附件列表返回
  emits('updataUploadTable', uploadTable.value)
  // 重置参数
  uploadTableList.value = []
  fileEditIndex.value = null
  Data.showAdjust = false
}
// 上传
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

const handleUploadDelete = (row, index) => {
  uploadTable.value.splice(index, 1)
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
          h(
            NButton,
            {
              size: 'small',
              type: 'error',
              style: {
                marginLeft: '10px',
              },
              onClick: () => handleUploadDelete(row, index),
            },
            { default: () => '删除', icon: renderIcon('material-symbols:delete-outline', { size: 14 }) },
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
    :style="{ width: '60%' }"
    :mask-closable="false"
  >
    <n-card mt-10>
      <n-layout-header flex>
        <n-space>
          <n-upload ref="upload" :default-upload="false" multiple :show-file-list="false" @change="handleUpload">
            <NButton type="primary">
              <template #icon>
                <!-- <icon-icon-park-outline:return /> -->
              </template>
              上传附件
            </NButton>
          </n-upload>

          <NButton type="info" @click="handleSaveUpload">
            <template #icon>
              <!-- <icon-icon-park-outline:return /> -->
            </template>
            保存
          </NButton>
        </n-space>
      </n-layout-header>
      <NDataTable
        mt-10 default-expand-all single-column striped :columns="columnList.uploadColunm" :data="uploadTable"
        :loading="loading" flex-height :style="{ minHeight: `${tHeight}px` }"
      />
    </n-card>
  </n-modal>
</template>

<style scoped>

</style>
