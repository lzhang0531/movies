<template>
  <div>
    <div class="search-con search-con-top">
      <span class="mg-6l pd-6r">被邀请月份:</span>
      <DatePicker type="month"  v-model="invitedMonthPick"  style="width: 200px" @on-change="dateFormat"></DatePicker>
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
          <span>邀请统计</span>
        </div>
      </TablePage>
    </div>
  </div>
</template>

<script>
  import { TablePage } from '_c/tables'
  import { getInvitePage} from '@/api/data'

  export default {
    name: 'movie_type_page',
    components: {
      TablePage,
    },
    data () {
      return {
        invitedMonthPick: new Date(),
        invitedMonth: '',
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
          {title: '邀请码', key: 'invitationCode'},
          {title: '邀请数', key: 'amount'},
        ],
        tableData: {},
      }
    },
    methods: {
      dateFormat(date){
        this.invitedMonth=date;
      },
      handleSearch () {
        let data = {
          pageNum: this.pageNum,
          pageSize: this.pageSize
        }
        this.invitedMonth !== '' && (data.invitedMonth = this.invitedMonth)
        this.getTableDatas(data)
      },
      changePage (currPage, pagesize) {
        this.pageNum = currPage
        this.pageSize = pagesize
        this.handleSearch()
      },
      getTableDatas (condition) {
        this.loading = true
        getInvitePage(condition).then(res => {
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
