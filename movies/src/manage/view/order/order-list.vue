<template>
  <div>
    <div class="search-con search-con-top">
      <span class="mg-6l pd-6r">支付日期:</span>
      <DatePicker type="date" v-model="payDatePick" style="width: 200px" @on-change="dateFormat"></DatePicker>
      <span class="mg-6l pd-6r">用户名:</span>
      <Input v-model="userName" type="text"style="width:180px" ></Input>
      <span class="mg-6l pd-6r">订单状态:</span>
      <Select v-model="orderStatus" style="width:180px" filterable clearable placeholder="全部">
        <Option :value="1">未支付</Option>
        <Option :value="2">已支付</Option>
      </Select>
      <Button @click="handleSearch" class="search-btn" type="primary">
        搜索
      </Button>
    </div>
    <div class="body-box-shadow">
      <TablePage
        ref="tables"
        :loading="loading"
        :tableData="tableData"
        :columns="columns"
        pageable
        @on-page-change="changePage"
      >
        <div slot="top" class="headbar-primary">
          <span>订单列表</span>
          <Button shape="circle" class="float-right" size="small" type="primary" ghost @click="openModal">设置月卡金额</Button>
        </div>
      </TablePage>
      <Modal
        v-model="setModel"
        title="设置金额"
        :mask-closable="false"
        :footer-hide="true"
        >
        <Form :model="formItem" :label-width="100" ref="setForm" :rules="ruleValidate">
          <FormItem label="1个月金额" prop="oneMonth">
            <Input v-model="formItem.oneMonth"></Input>
          </FormItem>
          <FormItem label="3个月金额" prop="threeMonth">
            <Input v-model="formItem.threeMonth"></Input>
          </FormItem>
          <FormItem label="12个月金额" prop="twelveMonth">
            <Input v-model="formItem.twelveMonth" ></Input>
          </FormItem>
        </Form>
        <div class="text-right">
          <Button @click="setModel = false" class="mg-10r" type="default">
            取消
          </Button>
          <Button @click="set"  type="primary">
            确定
          </Button>
        </div>
      </Modal>
    </div>
  </div>
</template>

<script>
  import { TablePage } from '_c/tables'
  import { getOrderPage,setPaymentAmount,getPaymentAmount } from '@/api/data'

  const reg = '^[0-9]+([.]{1}[0-9]+){0,1}$'
  const numberCheck = (rule, value, callback) => {
    if (value === '') {
      callback(new Error('请输入金额'));
    } else if (!new RegExp(reg).test(value)) {
      callback(new Error('请输入正确的金额数字'));
    } else {
      callback();
    }
  };

  export default {
    name: 'movie_type_page',
    components: {
      TablePage
    },
    data () {
      return {
        userName: '',
        orderStatus: '',
        payDatePick: '',
        setModel:false,
        payDate: '',
        pageNum:1,
        pageSize:10,
        loading: false,
        columns: [
          {
            title:'序号',
            type: 'index',
            width: 70,
            align: 'center'
          },
          {title: '用户名', key: 'userName'},
          {title: '支付方式', key: 'orderType'},
          {title: '支付状态', key: 'orderStatus', render: (h, params) => {
              return h('span', params.row.orderStatus == 2 ? '已支付':'未支付');
            }},
          {title: '支付时间', key: 'payTime',width:185, render: (h, params) => {
              return h('span', params.row.payTime ? params.row.payTime.substring(0,10):'');
            }},
          {title: '实际支付金额', key: 'orderPrice'}
        ],
        tableData: {},
        formItem:{
          oneMonth:0,
          threeMonth:0,
          twelveMonth:0
        },
        ruleValidate: {
          oneMonth: [
            { required: true, validator:numberCheck, message: '请输入正确的金额', trigger: 'blur' }
          ],
          threeMonth: [
            { required: true, validator:numberCheck,message: '请输入正确的金额',trigger: 'blur' }
          ],
          twelveMonth: [
            { required: true, validator:numberCheck,message: '请输入正确的金额', trigger: 'blur' }
          ],
        }
      }
    },
    methods: {
      dateFormat(date){
        this.payDate=date;
      },
      openModal(){
        getPaymentAmount(this.formItem).then(res => {
          if (res.data.res === 0) {
            this.formItem.oneMonth = res.data.data.oneMonth
            this.formItem.threeMonth = res.data.data.threeMonth
            this.formItem.twelveMonth = res.data.data.twelveMonth
            this.setModel=true
          }
        })
      },
      set(){
        this.$refs.setForm.validate((valid) => {
          if (valid) {
            setPaymentAmount(this.formItem).then(res => {
              if (res.data.res === 0) {
                this.setModel = false
                this.$Message.success('设置成功!');
              }
            }).catch(error=>{
              this.$Message.error('设置失败');
            })
          }else {
            this.$Message.error('存在未通过校验');

          }
        })
      },
      handleSearch () {
        let data = {
          pageNum: this.pageNum,
          pageSize: this.pageSize
        }
        this.userName !=='' && (data.userName = this.userName)
        this.orderStatus !==''  && (data.orderStatus = this.orderStatus)
        this.payDate !=='' && (data.payDate = this.payDate)
        this.getTableDatas(data)
      },
      changePage (currPage, pagesize) {
        this.pageNum = currPage
        this.pageSize = pagesize
        this.handleSearch()
      },
      getTableDatas (condition) {
        this.loading = true
        getOrderPage(condition).then(res => {
          this.loading = false
          if (res.data.res === 0) {
            this.tableData = res.data.data
          }
        })
      }
    },
    created () {
      this.handleSearch()
    },
  }
</script>
