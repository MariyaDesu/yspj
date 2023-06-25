<!-- eslint-disable vue/custom-event-name-casing -->
<!-- eslint-disable vue/no-mutating-props -->
<script>
import { NInput, NSelect } from 'naive-ui'
import { defineComponent, onMounted, reactive, toRefs } from 'vue'
import { Icon, Toast } from 'approval-flow/approval-flow.umd.min.js'
import { baseApi } from '@/api/baseApi.ts'
import 'approval-flow/approval-flow.css'
export default defineComponent({
  components: { Icon },
  props: ['conditionsData', 'nodeData'],
  emits: ['on-enter', 'on-cancel'],
  setup(props, { emit }) {
    const userList = reactive({
      user: [],
      duty: [],
    })
    let mainData = reactive({
      processCode: '',
      processName: '',
      billTypeId: '',
      enable: 0,
      // nodes: [
      //   { audits: [] },
      // ],
    })
    const state = reactive({
      ClipboardName: '',
      nodeName: '',
      showedit: false,
    })

    const options = reactive({
      approverOptions: [],
      dutyOptions: [],
      billTypeOptions: [],
    })

    // 初始化赋值
    state.ClipboardName = props.nodeData.name || ''
    state.nodeName = props.nodeData.nodeName || ''
    mainData = props.nodeData.mainData
    userList.user = props.nodeData.properties.user
    userList.duty = props.nodeData.properties.duty

    const onEnter = () => {
      if (!state.nodeName) {
        window.$notification?.warning({ title: '节点名称为空', duration: 2500 })
        // Toast({ message: '节点名称为空' })
        return
      }

      state.popupshow = false
      props.nodeData.name = state.ClipboardName

      props.nodeData.nodeName = state.nodeName

      props.nodeData.mainData = mainData

      // props.nodeData.properties = mainData

      props.nodeData.properties.user = userList.user || []
      props.nodeData.properties.duty = userList.duty || []

      // 覆盖nodeName,
      // if (props.nodeData.properties.user)
      //   props.nodeData.nodeName = `节点名称：${props.nodeData.nodeName}`

      emit('on-enter')
    }
    const onCancel = () => {
      emit('on-cancel')
    }

    // const chooseApproval = (item, type) => {
    //   if (type === 1)
    //     state.applist.forEach(item => (item.checked = false))
    //   if (type === 2)
    //     state.members.forEach(item => (item.checked = false))
    //   item.checked = !item.checked
    // }

    async function fetchUserList() {
      const res = await baseApi.fetchProcessUserList({})
      options.approverOptions = res.data
    }

    async function fetchDuty() {
      const res = await baseApi.fetchDutyList({})
      options.dutyOptions = res.data
    }

    async function getBillTypeList() {
      const res = await baseApi.getBillTypeList({})
      options.billTypeOptions = res.data.list
    }

    onMounted(() => {
      fetchUserList()
      fetchDuty()
      getBillTypeList()
    })

    return {
      ...toRefs(state),
      userList,
      mainData,
      onEnter,
      onCancel,
      // chooseApproval,
      options,
      fetchUserList,
      fetchDuty,
      getBillTypeList,

    }
  },
})
</script>

<template>
  <div class="popup-page">
    <template v-if="nodeData.type !== 'start'">
      <div class="group">
        <span v-if="!showedit" class="copybtn" data-clipboard-target="#foo" @click="showedit = true">
          {{ ClipboardName }}
          <Icon name="Edit" color="#999" />
        </span>
        <input v-if="showedit" id="foo" v-model="ClipboardName" type="text" @blur="showedit = false">
      </div>
    </template>
    <!-- :title="`${JSON.stringify(Data.editData) === '{}' ? '新增' : '编辑'}流程`" -->
    <n-form ref="formRef" label-placement="left" :model="mainData" label-width="auto" :rules="rules">
      <n-form-item v-if="nodeData.type === 'start'" label="流程编码" path="processCode">
        <NInput v-model:value="mainData.processCode" clearable placeholder="请输入" />
      </n-form-item>
      <n-form-item v-if="nodeData.type === 'start'" label="流程名称" path="processName">
        <NInput v-model:value="mainData.processName" clearable placeholder="请输入" />
      </n-form-item>
      <n-form-item v-if="nodeData.type === 'start'" label="单据类型" path="billTypeId">
        <NSelect
          v-model:value="mainData.billTypeId" label-field="billTypeName" value-field="billTypeId" filterable
          :options="options.billTypeOptions" placeholder="请选择"
        />
      </n-form-item>
      <n-form-item v-if="nodeData.type === 'start'" label="是否启用" path="enable">
        否
        <n-switch v-model:value="mainData.enable" ml-5 mr-5 :checked-value="1" :unchecked-value="0" />
        是
      </n-form-item>
      <n-form-item label="节点名称" path="nodeName">
        <NInput v-model:value="nodeName" />
      </n-form-item>

      <n-form-item label="选择人员" path="user">
        <NSelect
          v-model:value="userList.user" filterable :options="options.approverOptions"
          label-field="linkmanName" value-field="userId" placeholder="请选择" clearable multiple
        />
      </n-form-item>

      <n-form-item label="选择审批角色" path="user">
        <NSelect
          v-model:value="userList.duty" filterable :options="options.dutyOptions" label-field="dutyName"
          value-field="dutyId" placeholder="请选择" multiple
        />
      </n-form-item>
    </n-form>

    <!-- <div class="value">
        <span v-for="item of members" :key="item.mid" class="app-list" @click="chooseApproval(item, 2)">
          <Icon v-show="item.checked" class="ver-mid" name="circle-check" color="#999" />
          <Icon v-show="!item.checked" class="ver-mid" name="circle" color="#999" />
          <span class="ver-mid">{{ item.value }}</span>
        </span>
      </div> -->
  </div>
  <div class="bottom">
    <span class="btn" @click="onCancel">取消</span>
    <span class="btn enter" @click="onEnter">确定</span>
  </div>
</template>

<style lang="less" scoped>
.ver-mid {
  vertical-align: middle;
  display: inline-block;
}

.app-list {
  margin-right: 20px;
  cursor: pointer;
  display: inline-block;
}

.group {
  display: flex;
  margin-bottom: 10px;
  line-height: 32px;

  .key {
    width: 100px;
    text-align: right;
  }

  .value {
    flex: 1;
    margin-left: 10px;
  }
}

.popup-page {
  min-height: 100%;
  padding-bottom: 70px;
  box-sizing: border-box;
  padding: 20px;

  input,
  select {
    height: 30px;
    width: 200px;
    line-height: 30px;
    border: 1px solid #d8d8d8;
    border-radius: 7px;
    outline: none;
    margin-left: 10px;
  }
}

.bottom {
  position: static;
  bottom: 0;
  width: 100%;
  box-shadow: 0 0 5px #333;
  line-height: 70px;
  margin-top: -70px;
  text-align: center;

  .btn {
    display: inline-block;
    width: 100px;
    height: 40px;
    line-height: 40px;
    text-align: center;
    color: #333;
    border: 1px solid #d8d8d8;
    cursor: pointer;
    margin: 0 10px;

    &.enter {
      background: #00a0ed;
      color: #fff;
      border-color: #00a0ed;
    }
  }
}
</style>
