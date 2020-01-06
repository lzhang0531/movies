<template>
  <div>
    <div class="search-con search-con-top">
      <span class="mg-6l pd-6r">用户名:</span>
      <Input v-model="userName" type="text" style="width:180px"></Input>
      <span class="mg-6l pd-6r">手机号:</span>
      <Input v-model="phone" type="text" style="width:180px"></Input>
      <span class="mg-6l pd-6r">处理状态:</span>
      <Select v-model="feedbackStatus" style="width:180px" filterable>
        <Option value="2" >已处理</Option>
        <Option value="1" >未处理</Option>
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
          <span>意见反馈列表</span>
        </div>
      </TablePage>
    </div>
  </div>
</template>

<script>
  import { TablePage } from '_c/tables'
  import { getFeedbackPage, dealFeedback} from '@/api/data'

  export default {
    name: 'movie_type_page',
    components: {
      TablePage,
    },
    data () {
      return {
        userName: '',
        phone: '',
        feedbackStatus: '',
        pageNum: 1,
        pageSize: 10,
        loading: false,
        memberDate: '',
        memberAreaCode: '',
        memberId: '',
        columns: [
          {
            title: '序号',
            type: 'index',
            width: 70,
            align: 'center',
          },
          {title: '用户名', key: 'userName'},
          {title: '反馈内容', key: 'content'},
          {title: '手机号', key: 'phone'},
          {
            title: '反馈时间', key: 'createTime', width: 185,
            render: (h, params) => {
              return h('span', params.row.createTime.substring(0,16))
            },
          },
          {
            title: '操作',
            width: 100,
            key: 'action',
            fixed: 'right',
            align: 'center',
            render: (h, params) => {
              if(params.row.feedbackStatus == 2){
                return h('span', '已处理')
              }
              return h('div', [
                h('Button', {
                  props: {
                    type: 'primary',
                    size: 'small',
                  },
                  on: {
                    click: () => {
                        this.$Modal.confirm({
                          title:'处理',
                          content:'标记为已处理？',
                          onOk: () => {
                            dealFeedback({id: params.row.id}).then(res => {
                              this.callback(res, '处理')
                            })
                          },
                        })
                    },
                  },
                }, '处理')
              ])
            },
          },
        ],
        tableData: {},
      }
    },
    methods: {
      callback (res, type) {
        if (res.data.res === 0) {
          this.$Message.success(type + '成功!')
          this.handleSearch()
        } else {
          this.$Message.success(type + '失败!' + res.data.msg || '')
        }
      },
      handleSearch () {
        let data = {
          pageNum: this.pageNum,
          pageSize: this.pageSize,
        }
        this.userName !== '' && (data.userName = this.userName)
        this.feedbackStatus !== '' && (data.feedbackStatus = this.feedbackStatus)
        this.phone !== '' && (data.phone = this.phone)
        this.getTableDatas(data)
      },
      changePage (currPage, pagesize) {
        this.pageNum = currPage
        this.pageSize = pagesize
        this.handleSearch()
      },
      getTableDatas (condition) {
        this.loading = true
        getFeedbackPage(condition).then(res => {
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
<style>
  .pd-6r {
    padding-right: 6px;
  }
</style>
