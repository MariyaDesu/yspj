<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { OfficeFlow, Popup } from 'approval-flow/approval-flow.umd.min.js'
import 'approval-flow/approval-flow.css'
import ClipboardJS from 'clipboard'
import chooseApproval from './components/choose-approval.vue'
import chooseCondition from './components/choose-condition.vue'
import { processApi } from '@/api/basisSetApi'

// eslint-disable-next-line no-new
new ClipboardJS('.copybtn')

@Options({
  components: {
    OfficeFlow,
    Popup,
    chooseApproval,
    chooseCondition,
  },
  props: ['editData'],
})
export default class ScorePage extends Vue {
  // editData: any = {}
  editDataList: any = this.$props
  // 原始数据
  cnodeList: any = {
    processCode: '',
    processName: '',
    billTypeId: '',
    enable: '',
    nodes: [
      { nodeName: '', nodeType: '', audits: [], memo: '', processId: '' },
    ],

  }

  // editData = {}

  instance = getCurrentInstance()

  cnode: any = {
    name: '提交人',
    type: 'start',
    nodeName: '',

    mainData: {},
    // childNode: {},
    properties: {
      // 数据可以存放到properties对象里面
      // user: [],
      // duty: [],
    },
  }

  cnodeData = {

  }

  // 添加节点的时候有哪些项目
  adddata = [
    { key: 'approver', value: '审批人', icon: 'Stamp', color: '#3d91eb' },
    {
      key: 'notifier',
      value: '抄送人',
      icon: 'Promotion',
      color: 'orange',
    },
    { key: 'condition', value: '条件分支', icon: 'Branch', color: '#333' },
  ]

  // 交互相关
  popupshow = false
  nodeData: any = {}
  conditionsData: any[] = []

  nodeList(cnode: any, index: number) {
    if (cnode.mainData) {
      this.cnodeList.processCode = cnode.mainData.processCode
      this.cnodeList.processName = cnode.mainData.processName
      this.cnodeList.billTypeId = cnode.mainData.billTypeId
      this.cnodeList.enable = cnode.mainData.enable
      this.cnodeList.processId = cnode.mainData.processId
    }
    if (cnode.properties) {
      if (cnode.properties.duty) {
        cnode.properties.duty.forEach((item: any, childNodeIndex: number) => {
          this.cnodeList.nodes[index].audits.push({
            opId: item,
            auditType: 2,
            // nodeType: cnode.type === 'start' ? 2 : cnode.type === 'approver' ? 3 : cnode.type === 'notifier' ? 4 : 1,
          })
        })
      }
      if (cnode.properties.user) {
        cnode.properties.user.forEach((item: any, childNodeIndex: number) => {
          this.cnodeList.nodes[index].audits.push({
            opId: item,
            auditType: 1,
            // nodeType: cnode.type === 'start' ? 2 : cnode.type === 'approver' ? 3 : cnode.type === 'notifier' ? 4 : 1,
          })
        })
      }
    }

    this.cnodeList.nodes[index].nodeName = cnode.nodeName
    this.cnodeList.nodes[index].totalQty = 1
    this.cnodeList.nodes[index].priority = 1
    this.cnodeList.nodes[index].memo = cnode.memo
    this.cnodeList.nodes[index].processId = cnode.processId
    this.cnodeList.nodes[index].nodeType = 3
    // this.cnodeList.nodes[index].nodeType = (cnode.type === 'start' ? 2 : cnode.type === 'approver' ? 3 : cnode.type === 'notifier' ? 4 : 2)
    if (cnode.childNode) {
      index = index + 1
      this.cnodeList.nodes[index] = ({ nodeName: '', processId: '', nodeType: '', audits: [], memo: '' })
      this.nodeList(cnode.childNode, index)
    }
    else {
      return this.cnodeList
    }
  }

  handleBack() {
    this.instance?.proxy?.$Bus.emit('edit')
  }

  // 提交校验
  async onSubmit() {
    await this.nodeList(this.cnode, 0)
    this.cnodeList.nodes.forEach((item: any, index: number) => {
      item.level = index + 1
      if (index === 0) {
        item.prevNodeId = 0
        item.nextNodeId = 2
      }
      else if (index === (this.cnodeList.nodes.length - 1)) {
        item.prevNodeId = index
        item.nextNodeId = 0
      }
      else {
        item.prevNodeId = index
        item.nextNodeId = index + 2
      }
    })
    this.cnodeList.nodes[this.cnodeList.nodes.length - 1].nextNodeId = 0
    const res = JSON.stringify(this.editDataList.editData) === '{}'
      ? await processApi.saveProcess(
        this.cnodeList,
      )
      : await processApi.saveEditProcess(
        this.cnodeList,
      )

    if (res.code === 200) {
      window.$notification?.success({ title: '保存成功！', duration: 2500 })
      nextTick(() => {
        this.handleBack()
      })
    }
    else {
      window.$notification?.warning({ title: `${res.message}`, duration: 2500 })
      this.cnodeList = {
        processCode: '',
        processName: '',
        billTypeId: '',
        enable: '',
        nodes: [
          { nodeName: '', nodeType: '', audits: [], memo: '', processId: '' },
        ],
      }
    }
  }

  // 选择节点,打开弹出层
  onChoose({ type, node, conditions }: any) {
    this.popupshow = true
    this.nodeData = node
    this.conditionsData = conditions
  }

  // 添加节点
  onAdd({ type, node }: any) {
    //
  }

  forMatList(cnode: any, nodesList: any, index: number) {
    if (index === nodesList.length) {
      return cnode
    }
    else {
      if (nodesList[index]) {
        cnode.properties = {
          user: [],
          duty: [],
        }
        nodesList[index].audits.forEach((itemList: any, itemIndex: number) => {
          if (itemList.auditType === 1)
            cnode.properties.user.push(itemList.opId)

          else if (itemList.auditType === 2)
            cnode.properties.duty.push(itemList.opId)
        })
      }
      if (nodesList[index].nodeType === 1)
        cnode.name = '条件节点'

      else if (nodesList[index].nodeType === 2)
        cnode.name = '申请人节点'

      else if (nodesList[index].nodeType === 3)
        cnode.name = '审批节点 '

      else if (nodesList[index].nodeType === 4)
        cnode.name = '抄送节点 '
      cnode.childNode = nodesList[index + 1]

      // if (nodesList[index + 1])
      //   cnode.childNode = nodesList[index + 1]

      // else
      //   cnode.childNode = nodesList[index]

      index = index + 1

      this.forMatList(cnode.childNode, nodesList, index)
    }
  }

  async mounted() {
    if (JSON.stringify(this.editDataList.editData) !== '{}') {
      Object.assign(this.cnodeList, this.editDataList.editData)
      await this.forMatList(this.cnode, this.editDataList.editData.nodes, 0)
      this.cnode.mainData = {
        processCode: this.editDataList.editData.processCode,
        processName: this.editDataList.editData.processName,
        billTypeId: this.editDataList.editData.billTypeId,
        enable: this.editDataList.editData.enable,
        processId: this.editDataList.editData.processId,
      }
      this.cnode.nodeName = this.editDataList.editData.nodes[0].nodeName
    }
  }

  // onUnmounted() {
  //   this.instance?.proxy?.$Bus.all.clear()
  // }
}
</script>

<template>
  <div class="pagebox">
    <n-layout-header flex :style="{ backgroundColor: ' rgba(245,246,251,1)' }">
      <n-space flex-1 m-auto text-16 font-600>
        {{ JSON.stringify(editDataList.editData) === "{}" ? '新增' : '修改' }}流程
      </n-space>
      <n-space m-auto mr-20>
        <NButton type="info" @click="onSubmit">
          <template #icon>
            <icon-icon-park-outline:save-one />
          </template>
          保存
        </NButton>
        <NButton type="primary" @click="handleBack">
          <template #icon>
            <icon-icon-park-outline:return />
          </template>
          返回
        </NButton>
      </n-space>
    </n-layout-header>
    <OfficeFlow :add-nodes="adddata" :node="cnode" @on-add="onAdd" @on-choose="onChoose" />

    <Popup v-model:show="popupshow" position="right" style="height:100%;width:40%">
      <template v-if="nodeData.type !== 'condition'">
        <choose-approval
          v-if="popupshow" :conditions-data="conditionsData" :node-data="nodeData"
          @on-cancel="popupshow = false" @on-enter="popupshow = false"
        />
      </template>

      <template v-else>
        <choose-condition
          v-if="popupshow" :conditions-data="conditionsData" :node-data="nodeData"
          @on-cancel="popupshow = false" @on-enter="popupshow = false"
        />
      </template>
    </Popup>
  </div>
</template>

<style lang="less" scoped>
// :deep(.approvalFlow) {
//   .node-hehe {
//     &:hover {
//       box-shadow: 0 1px 8px 0 rgb(116, 116, 255);
//     }

//     .title {
//       background-color: rgb(212, 212, 252);
//       color: blue;
//     }

//     .title::after {
//       background: blue;
//     }
//   }

//   .node-lala {
//     &:hover {
//       box-shadow: 0 1px 8px 0 green;
//     }

//     .title {
//       background-color: rgb(194, 255, 194);
//       color: green;
//     }

//     .title::after {
//       background: green;
//     }
//   }
// }
.pagebox {
  height: 100%;
}

// :deep(.n-layout-header){
//   background-color: '';
// }
.approvalFlow {
  margin-top: 10px;
}

.topnav {
  line-height: 90px;

  .enter {
    display: inline-block;
    width: 100px;
    height: 40px;
    line-height: 40px;
    text-align: center;
    color: #333;
    border: 1px solid #d8d8d8;
    cursor: pointer;
    margin: 0 10px;
    background: #00a0ed;
    color: #fff;
    border-color: #00a0ed;
  }
}
</style>
