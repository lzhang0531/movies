<template>
  <div>
    <div class="search-con search-con-top">
      <span class="pd-6r">分类地区:</span>
      <Select v-model="areaCode" style="width:260px" filterable clearable placeholder="全部地区">
        <Option v-for="(key,item) in areaList" :value="item" :key="item">{{ key }}</Option>
      </Select>
      <Button @click="handleSearch" class="search-btn" type="primary">
        <Icon type="search"/>&nbsp;&nbsp;搜索
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
          <span>地区分类列表</span>
          <Button shape="circle" class="float-right" size="small"  type="primary" ghost @click="editModel=true">  新增分类</Button>
        </div>
      </TablePage>
    </div>
    <Modal v-model="editModel" ref="editModel" title="分类维护" @on-ok="onModalSave" @on-visible-change="onVisibleChange" :mask-closable="false" :loading="true">
      <Form :model="modalData" :label-width="80" ref="editForm"  :rules="ruleValidate">
        <FormItem label="分类名称" prop="categoryName">
          <Input v-model="modalData.categoryName"  style="width:260px"></Input>
        </FormItem>
        <FormItem label="地区" prop="areaCode">
          <Select v-model="modalData.areaCode" style="width:260px" filterable placeholder="请选择地区">
            <Option v-for="(key,item) in areaList" :value="item" :key="item">{{ key }}</Option>
          </Select>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>

<script>
  import { TablePage } from '_c/tables'
  import { AreaSelect } from '_c/base'
  import { getCategoryPage,addCategory,updateCategory,deleteCategory } from '@/api/data'
  import { areaList } from '@/libs/areaList'

  export default {
    name: 'movie_type_page',
    components: {
      TablePage,
      AreaSelect,
    },
    data () {
      return {
        areaList:areaList,
        areaCode: "",
        pageNum:1,
        pageSize:10,
        loading: false,
        columns: [
          {
            title:'序号',
            type: 'index',
            width: 100,
            align: 'center'
          },
          {title: '名称', key: 'categoryName'},
          {title: '所属地区', key: 'areaCode', render: (h, params) => {
              return h('span', areaList[params.row.areaCode]);
            }},
          {title: '创建时间', key: 'createTime'},
          {
            title: '操作',
            key: 'action',
            width: 150,
            align: 'center',
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'primary',
                    size: 'small',
                  },
                  style: {
                    marginRight: '5px',
                  },
                  on: {
                    click: () => {
                      this.modalData.id = params.row.id
                      this.modalData.areaCode = params.row.areaCode.toString();
                      this.modalData.categoryName = params.row.categoryName
                      console.log(this.modalData)
                      this.editModel = true
                    },
                  },
                }, '编辑'),
                h('Button', {
                  props: {
                    type: 'error',
                    size: 'small',
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
        modalData:{
          id:'',
          areaCode:"1",
          categoryName:'',
        },
        ruleValidate:{
          categoryName: [
            { required: true, message: '请输入地区名称', trigger: 'blur' }
          ],
          areaCode: [
            { required: true, message: '请选择地区', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      handleSearch () {
        this.getTableDatas(
          {
            pageNum: this.pageNum,
            pageSize: this.pageSize,
            areaCode: this.areaCode,
          },
        )
      },
      changePage (currPage, pagesize) {
        this.pageNum = currPage
        this.pageSize = pagesize
        this.handleSearch()
      },
      getTableDatas (condition) {
        this.loading = true
        getCategoryPage(condition).then(res => {
          this.loading = false
          if (res.data.res === 0) {
            this.tableData = res.data.data
          }
        })
      },
      remove (id) {
        deleteCategory(id).then(res => {
          if (res.data.res === 0) {
            this.$Message.success('删除成功!');
            this.handleSearch()
          }
        })
      },
      onVisibleChange(visible){
        if (!visible) {
          this.$refs.editForm.resetFields()
          this.modalData={
              id:'',
              areaCode:"1",
              categoryName:'',
          }
        }
      },
      onModalSave(){
        this.$refs.editForm.validate((valid) => {
          if (valid) {
            if(this.modalData.id){//编辑
              updateCategory(this.modalData).then(res => {
                this.$refs.editModel.buttonLoading = false
                if (res.data.res === 0) {
                  this.$Message.success('保存成功!');
                  this.handleSearch()
                  this.editModel = false
                }
              })
            }else {//新增
              addCategory({
                areaCode:this.modalData.areaCode,
                categoryName:this.modalData.categoryName,
              }).then(res => {
                this.$refs.editModel.buttonLoading = false
                if (res.data.res === 0) {
                  this.$Message.success('新增成功!');
                  this.handleSearch();
                  this.editModel = false
                }
              })
            }
          } else {
            this.$Message.error('请填写完必填项！');
            this.$refs.editModel.buttonLoading = false;
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
  .pd-6r{
    padding-right: 6px;
  }
</style>
