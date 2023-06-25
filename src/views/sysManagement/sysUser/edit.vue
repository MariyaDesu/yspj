<script setup lang="ts">
import type { CascaderOption, DataTableColumns, FormInst, SelectOption } from 'naive-ui'
import { NButton, NCascader, NInput, NSelect } from 'naive-ui'
import { rules } from './common'
import { deepCopy, formatSelectDrop, renderIcon } from '@/utils/common'
import { sysUserApi } from '@/api/sysManaApi'
import { baseApi } from '@/api/baseApi'
import { useBaseApiListStore } from '@/store'

const baseApiListStore = useBaseApiListStore()
interface opt {
  deptStateOptions: CascaderOption[]
  deptNameOptions: [
    CascaderOption[],
  ]
  assetOptions: SelectOption[]
  dutyOptions: SelectOption[]
  baseOptions: CascaderOption[]
  provinceOptions: SelectOption[]
  cityOptions: SelectOption[]
  areaOptions: SelectOption[]
}
const options: opt = reactive({
  deptStateOptions: [],
  deptNameOptions: [
    [],
  ],
  assetOptions: [],
  dutyOptions: [],
  baseOptions: [],
  provinceOptions: [],
  cityOptions: [],
  areaOptions: [],
})

interface list {
  userId?: string
  userName?: string
  password?: string
  userType?: number
  sex?: number
  sexName?: string
  status?: number
  statusName?: string
  linkmanName?: string
  linkmanMobile?: string
  linkmanQq?: string
  linkmanEmail?: string
  icon?: string
  age?: number
  province?: string
  city?: string
  area?: string
  address?: string
  branchId?: string
  deptId?: number | null
  deptName?: string
  entryJobTime?: string
  dutyId?: number | null
  assets?: Array<any>
  removeAsset?: Array<any>
  removeAssets?: Array<any>
}
interface dataList {
  modalVisible: boolean
  editData: object
  mainData: list
  removeAsset: any
  removeAssets: any
}
const Data = reactive<dataList>({
  modalVisible: false,
  editData: {},
  removeAsset: [],
  removeAssets: [],
  mainData: {
    userType: 2,
    assets: [],
    status: 0,

  },
})
interface RowData {
  index: number
  id: number
  branchId: string
  deptId: string
  dutyId: number
  assetId: number
}
const columns: DataTableColumns<RowData> = [
  {
    title: '序号',
    align: 'center',
    width: 80,
    key: 'key',
    render: (_, index) => {
      return `${index + 1}`
    },
  },
  {
    title: '产权结构',
    align: 'center',
    width: 250,
    maxWidth: 250,
    key: 'assetOptions',
    render(row, index) {
      return [
        h(
          NSelect,
          {
            showPath: false,
            labelField: 'assetName',
            valueField: 'assetId',
            value: row.assetId,
            clearable: true,
            options: options.assetOptions,
            onUpdateValue(v) {
              (Data.mainData.assets as any)[index].assetId = v
            },
          },
        ),
      ]
    },
  },
  {
    title: '管理结构',
    align: 'center',
    width: 180,
    maxWidth: 180,
    key: 'budSubOptions',
    render(row, index) {
      return [
        h(
          NSelect,
          {
            showPath: false,
            labelField: 'branchName',
            valueField: 'branchId',
            value: row.branchId,
            clearable: true,
            options: options.deptStateOptions,
            onUpdateValue(v) {
              (Data.mainData.assets as any)[index].branchId = v
            },
          },
        ),
      ]
    },
  },

  {
    title: '部门',
    align: 'center',
    width: 180,
    maxWidth: 180,
    key: 'deptNameOptions',
    render(row, index) {
      return [
        h(
          NCascader,
          {
            showPath: false,
            labelField: 'deptName',
            valueField: 'deptId',
            value: row.deptId,
            clearable: true,
            disabled: !row.assetId,
            options: options.deptNameOptions[row.assetId],
            onUpdateShow() {
              fetchDept(row.assetId)
            },
            onUpdateValue(v) {
              (Data.mainData.assets as any)[index].deptId = v
            },
          },
        ),
      ]
    },
  },
  {
    title: '审批角色',
    align: 'center',
    width: 120,
    maxWidth: 120,
    key: 'dutyOptions',
    render(row, index) {
      return [
        h(
          NSelect,
          {
            labelField: 'dutyName',
            valueField: 'dutyId',
            value: row.dutyId,
            clearable: true,
            options: options.dutyOptions,
            onUpdateValue(v) {
              (Data.mainData.assets as any)[index].dutyId = v
            },
          },
        ),
      ]
    },
  },
  {
    title: '操作',
    key: 'actions',
    width: 100,
    align: 'center',
    fixed: 'right',
    render(row, index) {
      return [
        h(
          NButton,
          {
            size: 'small',
            type: 'error',
            style: {
              marginLeft: '10px',
            },
            onClick: () => handleDelete(row, index),
          },
          { default: () => '删除', icon: renderIcon('material-symbols:delete-outline', { size: 14 }) },
        ),
      ]
    },
  },

]
const userTypeOptions: SelectOption[] = reactive([
  {
    userId: 1,
    userName: '系统管理员',
  },
  {
    userId: 2,
    userName: '普通用户',
  },
])

const instance = getCurrentInstance()
function fetchassets() {
  instance?.proxy?.$Bus.emit('fetchData')
}
const loading = ref(false)
const formRef = ref<FormInst | null>(null)
async function editMsg() {
  formRef.value?.validate(async (errors) => {
    if (!errors) {
      loading.value = true
      const removeAssets = deepCopy(Data.removeAssets)
      for (let i = 0; i < Data.removeAsset.length; i++) {
        for (let j = 0; j < Data.mainData.assets!.length; j++) {
          if (Data.removeAsset[i].id === Data.mainData.assets![j].id) {
            if (Data.removeAsset[i].assetId !== Data.mainData.assets![j].assetId
            || Data.removeAsset[i].branchId !== Data.mainData.assets![j].branchId
            || Data.removeAsset[i].deptId !== Data.mainData.assets![j].deptId
            || Data.removeAsset[i].dutyId !== Data.mainData.assets![j].dutyId)
              Data.removeAssets.push(Data.removeAsset[i])
          }
        }
      }

      Data.mainData.removeAssets = Data.removeAssets

      const res = JSON.stringify(Data.editData) === '{}'
        ? await sysUserApi.saveAddUser(
          Data.mainData,
        )
        : await sysUserApi.saveEditUser(
          Data.mainData,
        )

      if (res.code === 200) {
        window.$notification?.success({ title: '保存成功！', duration: 2500 })
        baseApiListStore.getUserAssetSelect()
        baseApiListStore.getUserBranchSelect()
        Data.modalVisible = false
        loading.value = false
      }

      else {
        Data.mainData.removeAssets = []
        Data.removeAssets = removeAssets
        window.$notification?.warning({ title: `${res.message}`, duration: 2500 })
        loading.value = false
      }
      fetchassets()
    }
    else {
      window.$message?.error('请填写必填项')
    }
  })
}

async function fetchDeptState() {
  const res = await baseApi.getBranchAllList({})
  options.deptStateOptions = res.data
  formatSelectDrop(options.deptStateOptions)
}
async function fetchDept(val) {
  const res = await baseApi.fetchDept({ assetId: val })
  options.deptNameOptions[val] = res.data
}

async function fetchAssetOptionsList() {
  const res = await baseApi.getAssetAllList({})
  options.assetOptions = res.data
  formatSelectDrop(options.assetOptions)
  options.assetOptions.forEach((item) => {
    fetchDept(item.assetId)
  })
}

async function fetchDutyList() {
  const res = await baseApi.fetchDutyList({})
  options.dutyOptions = res.data
}

async function fetchAreaList() {
  const res = await baseApi.fetchAreaList({})
  options.baseOptions = res.data
  options.provinceOptions = formatSelectDrop(deepCopy(res.data) as any)
}

function fetchCity() {
  Data.mainData.city = ''
  Data.mainData.area = ''
  options.baseOptions.forEach((item: CascaderOption) => {
    if (item.catId === Data.mainData.province)
      options.cityOptions = formatSelectDrop(deepCopy(item.children) as any[])
  })
}

function fetchArea() {
  Data.mainData.area = ''
  options.baseOptions.forEach((item: CascaderOption) => {
    if (item.catId === Data.mainData.province) {
      (item.children as any[]).forEach((element) => {
        if (element.catId === Data.mainData.city)
          options.areaOptions = formatSelectDrop(deepCopy(element.children) as any[])
      })
    }
  })
}

function handleAdd() {
  (Data.mainData.assets as any).push({
    branchId: '',
    deptId: '',
    dutyId: '',
  })
}

function handleDelete(row, index) {
  if (row.id) {
    Data.removeAsset.forEach((item, newindex) => {
      if (item.id === row.id)
        Data.removeAssets!.push(Data.removeAsset[newindex])
    })
    Data.removeAsset.splice(index, 1)
    Data.mainData.assets!.splice(index, 1)
  }
  else { Data.mainData.assets!.splice(index, 1) }
}

function handleTip() {
  if (Data.mainData.userType === 1)
    window.$notification?.info({ title: '系统管理员默认有最高权限', duration: 2500 })
}
onBeforeMount(() => {
  fetchAreaList()
})
onMounted(() => {
  instance?.proxy?.$Bus.on('edit', (row: any) => {
    row ? Data.editData = JSON.parse(JSON.stringify(row)) : Data.editData = {}
    Data.modalVisible = !Data.modalVisible
    Data.mainData = {
      assets: [],
      sex: 1,
      status: 0,
    }

    Object.assign(Data.mainData, Data.editData)
    if (row) {
      options.cityOptions = [
        {
          catId: row.city,
          catName: row.cityName,
        },
      ]
      options.areaOptions = [
        {
          catId: row.area,
          catName: row.areaName,
        },
      ]

      Data.mainData.assets?.forEach((item, index) => {
        item.id = index + 1
      })

      Data.removeAsset = deepCopy(Data.mainData.assets)
    }

    options.baseOptions.forEach((item: any) => {
      if (item.catId === Data.mainData.province)
        options.cityOptions = formatSelectDrop(deepCopy(item.children) as any)
    })
    options.baseOptions.forEach((item: any) => {
      if (item.catId === Data.mainData.province) {
        item.children.forEach((element) => {
          if (element.catId === Data.mainData.city)
            options.areaOptions = formatSelectDrop(deepCopy(element.children) as any)
        })
      }
    })

    fetchAssetOptionsList()
    fetchDeptState()
    fetchDutyList()
  })
})
</script>

<template>
  <n-modal
    v-model:show="Data.modalVisible" class="custom-card" preset="card"
    :title="`${JSON.stringify(Data.editData) === '{}' ? '新增' : '编辑'}用户资料`" size="huge"
  >
    <n-form
      ref="formRef" label-placement="top" :model="Data.mainData" label-width="120" :rules="rules"
      require-mark-placement="left"
    >
      <n-form-item label="账号" path="userName">
        <NInput v-model:value="Data.mainData.userName" clearable placeholder="请输入" />
      </n-form-item>
      <n-form-item label="密码" path="password">
        <NInput v-model:value="Data.mainData.password" clearable placeholder="请输入" type="password" />
      </n-form-item>
      <n-form-item label="用户类型" path="userType">
        <NSelect
          v-model:value="Data.mainData.userType" label-field="userName" value-field="userId" filterable
          :options="userTypeOptions" placeholder="请选择" @update:value="handleTip"
        />
      </n-form-item>
      <n-form-item label="性别" path="sex">
        女
        <n-switch v-model:value="Data.mainData.sex" ml-5 mr-5 :checked-value="1" :unchecked-value="0" />
        男
      </n-form-item>

      <n-form-item label="是否启用" path="string">
        否
        <n-switch v-model:value="Data.mainData.status" ml-5 mr-5 :checked-value="1" :unchecked-value="0" />
        是
      </n-form-item>
      <n-form-item label="联系人" path="linkmanName">
        <NInput v-model:value="Data.mainData.linkmanName" clearable placeholder="请输入" />
      </n-form-item>
      <n-form-item label="联系人电话" path="linkmanMobile">
        <NInput v-model:value="Data.mainData.linkmanMobile" clearable placeholder="请输入" />
      </n-form-item>

      <n-form-item label="用户QQ" path="linkmanQq">
        <NInput v-model:value="Data.mainData.linkmanQq" clearable placeholder="请输入" />
      </n-form-item>

      <n-form-item label="用户邮箱" path="linkmanEmail">
        <NInput v-model:value="Data.mainData.linkmanEmail" clearable placeholder="请输入" />
      </n-form-item>

      <n-form-item label="图像" path="icon">
        <NInput v-model:value="Data.mainData.icon" clearable placeholder="请输入" />
      </n-form-item>

      <n-form-item label="年龄" path="age">
        <n-input-number v-model:value="Data.mainData.age" clearable placeholder="请输入" wh-full :show-button="false" />
      </n-form-item>
      <n-form-item label="地区" path="">
        <NInputGroup>
          <NSelect
            v-model:value="Data.mainData.province" label-field="catName" value-field="catId" filterable
            :options="options.provinceOptions" placeholder="请选择省" clearable @update:value="fetchCity()"
          />
          <NSelect
            v-model:value="Data.mainData.city" label-field="catName" value-field="catId" filterable
            :options="options.cityOptions" placeholder="请选择市" clearable @update:value="fetchArea()"
          />
          <NSelect
            v-model:value="Data.mainData.area" label-field="catName" value-field="catId" filterable
            :options="options.areaOptions" placeholder="请选择区" clearable
          />
        </NInputGroup>
      </n-form-item>

      <n-form-item label="入职时间" path="entryJobTime">
        <n-date-picker
          v-model:formatted-value="Data.mainData.entryJobTime" value-format="yyyy-MM-dd" type="date"
          clearable placeholder="请输入" :style="{ width: '100%' }"
        />
      </n-form-item>

      <n-form-item label="详细地址" path="address">
        <NInput v-model:value="Data.mainData.address" clearable placeholder="请输入" />
      </n-form-item>

      <n-card>
        <n-layout-header flex mb-10>
          <n-space flex-1 m-auto text-16 font-600>
            数据
          </n-space>
          <n-space m-auto>
            <NButton type="primary" @click="handleAdd">
              <template #icon>
                <!-- <icon-icon-park-outline:return /> -->
              </template>
              添加一行
            </NButton>
          </n-space>
        </n-layout-header>
        <n-data-table
          default-expand-all single-column striped :columns="columns" :data="Data.mainData.assets"
          :scroll-x="1200"
        />
      </n-card>
    </n-form>
    <template #footer>
      <NLayout text-center>
        <NButton type="info" mr-10 :disabled="loading" @click="editMsg">
          保存
        </NButton>
        <NButton type="info" ml-10 @click="Data.modalVisible = false">
          取消
        </NButton>
      </NLayout>
    </template>
  </n-modal>
</template>

<style scoped></style>
