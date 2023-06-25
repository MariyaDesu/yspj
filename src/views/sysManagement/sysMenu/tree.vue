<script setup lang="ts">
import { NButton } from 'naive-ui'
import type { TreeOption } from 'naive-ui'
import { sysMenuApi } from '@/api/sysManaApi'
import { renderIcon, showBtn } from '@/utils/common'

const props = defineProps<{
  buttons: string[]
}>()
// 树形数据
/**
 * data 树形数据
 * pattern 搜索keyValue
 * nodeProps 节点事件
 */

const data = ref<TreeOption[]>([])

const pattern = ref()
const keyVal = ref()
const nodeProps = ({ option }: { option: TreeOption }) => {
  return {
    onClick() {
      keyVal.value = option
    },
    // watchProps() {
    //   data
    // },
  }
}
// 新增菜单
const instance = getCurrentInstance()
function addSubject() {
  instance?.proxy?.$Bus.emit('changeSysMenuEdit', { type: true, keyVal: {} })
}
// 编辑菜单
function editSubject() {
  if (keyVal.value)
    instance?.proxy?.$Bus.emit('changeSysMenuEdit', { type: false, keyVal: keyVal.value })

  else
    window.$notification?.error({ title: '请先选择菜单', duration: 2500 })
}
// 删除菜单
async function deleteSubject() {
  try {
    if (keyVal.value) {
      window.$dialog?.warning({
        title: '确认删除？',
        negativeText: '取消',
        positiveText: '确认',
        onPositiveClick: async () => {
          const res = await sysMenuApi.removeMenu([keyVal.value.menuId])
          if (res.code === 200) {
            if (res.code === 200)
              window.$notification?.success({ title: '删除成功！', duration: 2500 })
            initTableData()
          }

          else {
            window.$notification?.error({ title: `${res.message}`, duration: 2500 })
          }
        },
        onNegativeClick: () => {
          window.$message?.success('已取消')
        },
      })
    }
    else {
      window.$notification?.error({ title: '请先选择菜单', duration: 2500 })
    }
  }
  catch (error) {
    console.error(error)
  }
}
instance?.proxy?.$Bus.on('treeList', () => {
  initTableData()
  keyVal.value = ''
  // nodeProps().onClick()
})
onMounted(() => {
  initTableData()
})

async function initTableData() {
  try {
    const res = await sysMenuApi.getSysMenuAllList({})
    data.value = res.data
  }
  catch (error) {
    console.error(error)
    data.value = []
  }
}

function handleEdit(row) {
  instance?.proxy?.$Bus.emit('btnEdit', row)
}
function handleDelete(row) {
  window.$dialog?.warning({
    title: '确认删除？',
    negativeText: '取消',
    positiveText: '确认',
    onPositiveClick: async () => {
      const res = await sysMenuApi.removeBtn([row.buttonId])
      if (res.code === 200) {
        if (res.code === 200)
          window.$notification?.success({ title: '删除成功！', duration: 2500 })
        initTableData()
      }

      else {
        window.$notification?.error({ title: `${res.message}`, duration: 2500 })
      }
    },
    onNegativeClick: () => {
      window.$message?.success('已取消')
    },
  })
}

function renderSuffix({ option }: { option: TreeOption }) {
  const arr: any = []
  const buttons = (option as any).meta.buttons
  if (buttons.length === 0) {
    if (option.parentId === 0)
      return

    return h(
      NButton,
      {
        type: 'info',
        style: {
          marginLeft: '5px',
          height: '30px',
        },
        onClick: () => handleEdit({ row: {}, type: true, menuId: option.menuId }),
      },
      { default: () => '添加', icon: renderIcon('material-symbols:add', { size: 14 }) },

    )
  }
  else {
    buttons.forEach((item) => {
      arr.push(
        h(
          NButton,
          {
            type: item.iconClass,
            secondary: true,
            size: 'small',
            style: {
              marginLeft: '5px',
              marginRight: '0px',
              height: '30px',
              paddingLeft: '10px',
              paddingRight: '5px',
              borderRadius: '3px 0px 0px 3px',
            // borderRadius: 0,
            },
            onHover: {
              height: '39px',
            },
            onClick: () => handleEdit({ row: item, type: false }),

          },
          {
            default: () => item.buttonText,
          },
        ),
        h(
          NButton,
          {
            type: item.iconClass,
            secondary: true,
            size: 'small',
            style: {
              marginLeft: '0px',
              paddingLeft: '2px',
              paddingRight: '2px',
              height: '30px',
              borderRadius: '0px 3px 3px 0px',
            },
            onClick: () => handleDelete(item),
          },
          {
            icon: renderIcon('icon-park-outline:delete-three', { size: 18 }),
          },
        ),
      )
    })
    arr.push(h(
      NButton,
      {
        type: 'info',
        style: {
          marginLeft: '20px',
          height: '30px',
        },
        onClick: () => handleEdit({ row: {}, type: true, menuId: option.menuId }),
      },
      { default: () => '添加', icon: renderIcon('material-symbols:add', { size: 14 }) },

    ))

    return arr
  }
}
</script>

<template>
  <n-space vertical :size="12" pr-10>
    <div flex>
      <n-input v-model:value="pattern" placeholder="搜索" />
      <NButton v-if="showBtn('新增', props.buttons)" type="primary" ml-5 @click="addSubject">
        <template #icon>
          <icon-material-symbols-add />
        </template>
        新增
      </NButton>
      <NButton v-if="showBtn('编辑菜单', props.buttons)" type="info" mr-5 ml-5 @click="editSubject">
        <template #icon>
          <icon-ic:outline-edit-note />
        </template>
        编辑菜单
      </NButton>
      <NButton v-if="showBtn('删除菜单', props.buttons)" type="error" @click="deleteSubject">
        <template #icon>
          <icon-icon-park-outline:delete-three />
        </template>
        删除菜单
      </NButton>
    </div>

    <n-tree
      key-field="menuName" label-field="title" children-field="children" block-line :data="data"
      :node-props="nodeProps" :pattern="pattern" :show-irrelevant-nodes="false" :render-suffix="renderSuffix"
      :block-node="true"
    />
  </n-space>
</template>

<style scoped>
:deep(.n-tree .n-tree-node-switcher) {
  height: 35px;
}
</style>
