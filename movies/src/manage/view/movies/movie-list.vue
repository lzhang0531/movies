<template>
  <div>
    <div class="search-con search-con-top">
      <span class="pd-6r">地区:</span>
      <Select v-model="areaCode" style="width:180px" filterable clearable placeholder="全部地区">
        <Option v-for="(key,item) in areaList" :value="item" :key="item">{{ key }}</Option>
      </Select>
      <span class="mg-6l pd-6r">类型:</span>
      <Select v-model="categoryCode" style="width:180px" filterable clearable placeholder="全部类型">
        <Option v-for="item in categoryList" :value="item.categoryCode" :key="item.categoryCode">{{ item.categoryName }}</Option>
      </Select>
      <span class="mg-6l pd-6r">关键字:</span>
      <Input v-model="fuzzy" type="text"  placeholder="电影名称关键字" style="width:180px" ></Input>
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
          <span>视频列表</span>
          <Button shape="circle" class="float-right" size="small" type="primary" ghost @click="editModel=true">新增视频</Button>
        </div>
      </TablePage>
    </div>
    <Modal v-model="editModel" title="视频维护"  @on-visible-change="onVisibleChange" :mask-closable="false" :footer-hide="true" >
      <MovieEdit v-model="modalData" :categoryList="categoryList" ref="editModel" @saveSuccess="handleSearch"/>
    </Modal>
  </div>
</template>

<script>
  import { TablePage } from '_c/tables'
  import { getCategoryList,getVideoPage,deleteVideo,stickyVideo,cancelStickyVideo } from '@/api/data'
  import { areaList } from '@/libs/areaList'
  import MovieEdit from './movie-edit'
  const modalDataRest = {
    payFlag:true,
    videoPath:'',
    thumbnailPath:'',
    introduction:'',
    areaCode:'1',
    categoryCode:'',
    name:'',
  }

  export default {
    name: 'movie_type_page',
    components: {
      TablePage,
      MovieEdit,
    },
    data () {
      return {
        areaList:areaList,
        categoryList:[],
        areaCode: '',
        categoryCode: '',
        fuzzy: '',
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
          {title: '名称', key: 'name'},
          {title: '所属地区', key: 'areaCode', render: (h, params) => {
              return h('span', areaList[params.row.areaCode]);
            }
            },
          {title: '所属类型', key: 'categoryName'},
          {title: '简介', key: 'introduction',tooltip:true},
          {title: '置顶时间', key: 'stickyTime',width:185},
          {title: '创建时间', key: 'createTime',width:185},
          {
            title: '操作',
            // width:200,
            key: 'action',
            fixed:'right',
            align: 'center',
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'default',
                    size: 'small',
                  },
                  style: {
                    marginTop: '5px',
                    display: params.row.stickyTime ? 'inline' :'none',
                  },
                  on: {
                    click: () => {
                      cancelStickyVideo({id:params.row.id}).then(res => {
                        if (res.data.res === 0) {
                          this.$Message.success('取消置顶成功!');
                          this.handleSearch()
                        }else {
                          this.$Message.success('取消置顶失败!');
                        }
                      })
                    },
                  },
                }, '取消置顶'),
                h('Button', {
                  props: {
                    type: 'primary',
                    size: 'small',
                  },
                  style: {
                    marginRight: '5px',
                    marginTop: '2px'
                  },
                  on: {
                    click: () => {
                      stickyVideo({id:params.row.id}).then(res => {
                        if (res.data.res === 0) {
                          this.$Message.success('置顶成功!');
                          this.handleSearch()
                        }else {
                          this.$Message.success('置顶失败!');
                        }
                      })
                    },
                  },
                }, '置顶'),
                h('Button', {
                  props: {
                    type: 'success',
                    size: 'small',
                  },
                  style: {
                    marginTop: '2px',
                    marginRight: '5px',
                  },
                  on: {
                    click: () => {
                      Object.assign(this.modalData,params.row)
                      this.modalData.areaCode = this.modalData.areaCode.toString()
                      this.editModel = true
                    },
                  },
                }, '编辑'),
                h('Button', {
                  props: {
                    type: 'error',
                    size: 'small',
                  },
                  style: {
                    marginTop: '2px',
                    marginRight: '5px',
                  },
                  on: {
                    click: () => {
                      this.remove(params.row.id)
                    },
                  },
                }, '删除'),
              ])
            },
          },
        ],
        tableData: {},
        editModel:false,
        modalData:  Object.assign({},modalDataRest),
        ruleValidate:{
          VideoName: [
            { required: true, message: '请输入地区名称', trigger: 'blur' }
          ],
          areaCodes: [
            { required: true, message: '请选择地区', trigger: 'blur',type: 'array'}
          ]
        }
      }
    },
    methods: {
      handleSearch () {
        let data = {
            pageNum: this.pageNum,
            pageSize: this.pageSize
          }
        this.areaCode !=='' && (data.areaCode = this.areaCode)
        this.categoryCode !=='' && (data.categoryCode = this.categoryCode)
        this.fuzzy !=='' && (data.fuzzy = this.fuzzy)
        this.getTableDatas(data)
      },
      changePage (currPage, pagesize) {
        this.pageNum = currPage
        this.pageSize = pagesize
        this.handleSearch()
      },
      getTableDatas (condition) {
        this.loading = true
        getVideoPage(condition).then(res => {
          this.loading = false
          if (res.data.res === 0) {
            this.tableData = res.data.data
          }
        })
      },
      remove (id) {
        deleteVideo(id).then(res => {
          if (res.data.res === 0) {
            this.$Message.success('删除成功!');
            this.handleSearch()
          }else {
            this.$Message.error('删除失败!');
          }
        })
      },
      onVisibleChange(visible){
        if (!visible) {
          this.modalData = Object.assign({},modalDataRest)
          this.$refs['editModel'].formValidate = this.modalData
        }
      }
    },
    beforeCreate(){
      getCategoryList().then(res => {
        if (res.data.res === 0) {
          this.categoryList = res.data.data;
        }
      })
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
