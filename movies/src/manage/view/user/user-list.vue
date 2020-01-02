<template>
  <div>
    <div class="search-con search-con-top">
      <span class="mg-6l pd-6r">用户名:</span>
      <Input v-model="userName" type="text"style="width:180px" ></Input>
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
          <span>用户列表</span>
        </div>
      </TablePage>
    </div>
  </div>
</template>

<script>
  import { TablePage } from '_c/tables'
  import { getUserPage,setSale,cancelSale,openMember,closeMember,deleteUser } from '@/api/data'
  export default {
    name: 'movie_type_page',
    components: {
      TablePage
    },
    data () {
      return {
        userName: '',
        pageNum:1,
        pageSize:10,
        loading: false,
        memberDate:'',
        columns: [
          {
            title:'序号',
            type: 'index',
            width: 70,
            align: 'center'
          },
          {title: '用户名', key: 'userName'},
          {title: '是否为会员', key: 'memberFlag', render: (h, params) => {
              return h('span', params.row.memberFlag ? '是':'否');
            }},
          {title: '会员结束时间', key: 'memberEndTime',width:185, render: (h, params) => {
              return h('span', params.row.memberEndTime.substring(0,10));
            }},
          {title: '是否为销售', key: 'saleFlag', render: (h, params) => {
              return h('span', params.row.saleFlag ? '是':'否');
            }},
          {title: '注册时间', key: 'createTime',width:185},
          {
            title: '操作',
            width:200,
            key: 'action',
            fixed:'right',
            align: 'center',
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type:  'primary',
                    size: 'small',
                    ghost: params.row.memberFlag,
                  },
                  style: {
                    marginRight: '5px',
                  },
                  on: {
                    click: () => {
                      if(params.row.memberFlag){
                        closeMember({id:params.row.id}).then(res => {
                          this.callback(res,'关闭')
                        })
                      }else {
                        this.$Modal.confirm({
                          render: (h) => {
                            return h('DatePicker', {
                              props: {
                                type: 'date',
                                placeholder: '选择会员结束时间'
                              },
                              style:{
                                width: 200,
                              },
                              on: {
                                'on-change': (val) => {
                                  this.memberDate = val;
                                }
                              }
                            })
                          },
                          onOk:()=>{
                            return false
                            openMember({id:params.row.id,memberEndTime:this.memberDate}).then(res => {
                              this.callback(res,'开通')
                              this.memberDate = '';
                            })
                          }
                        })
                      }
                    },
                  },
                }, params.row.memberFlag ? '关闭会员':'开通会员'),
                h('Button', {
                  props: {
                    type:  'warning',
                    ghost: params.row.saleFlag,
                    size: 'small',
                  },
                  style: {
                    marginRight: '5px',
                  },
                  on: {
                    click: () => {
                      if(params.row.saleFlag){
                        cancelSale({id:params.row.id}).then(res => {
                          this.callback(res,'取消')
                        })
                      }else {
                        setSale({id:params.row.id}).then(res => {
                          this.callback(res,'设置')
                        })
                      }
                    },
                  },
                },  params.row.saleFlag ? '取消销售':'设为销售')
              ])
            },
          },
        ],
        tableData: {}
      }
    },
    methods: {
      callback(res,type){
        if (res.data.res === 0) {
          this.$Message.success(type+'成功!');
          this.handleSearch()
        }else {
          this.$Message.success(type+'失败!'+res.data.msg || '');
        }
      },
      handleSearch () {
        let data = {
            pageNum: this.pageNum,
            pageSize: this.pageSize
          }
        this.userName !=='' && (data.userName = this.userName)
        this.getTableDatas(data)
      },
      changePage (currPage, pagesize) {
        this.pageNum = currPage
        this.pageSize = pagesize
        this.handleSearch()
      },
      getTableDatas (condition) {
        this.loading = true
        getUserPage(condition).then(res => {
          this.loading = false
          if (res.data.res === 0) {
            this.tableData = res.data.data
          }
        })
      },
      remove (id) {
        deleteUser(id).then(res => {
          if (res.data.res === 0) {
            this.$Message.success('删除成功!');
            this.handleSearch()
          }else {
            this.$Message.error('删除失败!');
          }
        })
      },
    },
    created () {
      this.handleSearch()
    },
  }
</script>
<style>
  .pd-6r{
    padding-right: 6px;
  }
</style>
