<template>
  <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
    {{JSON.stringify(formValidate)}}
    <FormItem label="电影名称" prop="name">
      <Input v-model="formValidate.name"></Input>
    </FormItem>
    <FormItem label="简介" prop="introduction">
      <Input v-model="formValidate.introduction" type="textarea" :autosize="{minRows: 2,maxRows: 5}"></Input>
    </FormItem>
    <FormItem label="地区" prop="areaCode">
      <Select v-model="formValidate.areaCode" style="width:180px" filterable>
        <Option v-for="(key,item) in areaList" :value="item" :key="item">{{ key }}</Option>
      </Select>
    </FormItem>
    <FormItem label="类型" prop="categoryCode">
      <Select v-model="formValidate.categoryCode" style="width:180px" filterable>
        <Option v-for="item in categoryList" :value="item.categoryCode" :key="item.categoryCode">{{ item.categoryName
          }}
        </Option>
      </Select>
    </FormItem>
    <FormItem label="是否付费" prop="payFlag">
      <RadioGroup v-model="formValidate.payFlag">
        <Radio :label='true'>是</Radio>
        <Radio :label='false'>否</Radio>
      </RadioGroup>
    </FormItem>
    <FormItem label="缩略图" prop="thumbnailPath">
      <img v-if="formValidate.thumbnailPath" :src="`/file/${formValidate.thumbnailPath}`" style="height: 167px">
      <div style="width: 344px;height:167px;border: 1px solid #eee;" v-if="!formValidate.thumbnailPath"></div>
      <Upload
        action="/manage/file/upload"
        :data="{
        categoryCode:formValidate.categoryCode,
        areaCode:formValidate.areaCode
        }"
        ref="upload"
        :show-upload-list="false"
        :on-success="handlePicSuccess"
        :accept="['jpg','jpeg','png']"
        :format="['jpg','jpeg','png']"
        :max-size="2048"
        :on-format-error="handleFormatError"
        :on-exceeded-size="handleMaxSize"
        :before-upload="handleBeforeUpload"
      >
        <Button icon="ios-cloud-upload-outline">上传图片</Button>
      </Upload>
    </FormItem>
    <FormItem label="视频" prop="thumbnailPath">
      <Upload
        action="/manage/file/upload"
        :data="{
        categoryCode:formValidate.categoryCode,
        areaCode:formValidate.areaCode
        }"
        :default-file-list="defaultList"
        ref="video"
        :on-success="handleVideoSuccess"
        :accept="['MPEG','MPG','AVI','MOV','DAT','RM']"
        :format="['MPEG','MPG','AVI','MOV','DAT','RM']"
        :on-format-error="handleFormatError"
        :before-upload="handleBeforeVideoUpload"
      >
        <Button icon="ios-cloud-upload-outline">上传视频</Button>
      </Upload>
    </FormItem>
    <FormItem>
      <Button type="primary" @click="onSave('formValidate')">保存</Button>
      <!--<Button @click="handleReset('formValidate')" style="margin-left: 8px">Reset</Button>-->
    </FormItem>
  </Form>
</template>
<script>
  import { areaList } from '@/libs/areaList'
  import { addVideo, updateVideo } from '@/api/data'

  export default {
    name: 'MovieEdit',
    props: {
      categoryList: {
        type: [Object],
        default: [],
      },
      value: {
        type: [Object],
        default () {
          return {
            'payFlag': 1,
            'videoPath': '',
            'thumbnailPath': '',
            'introduction': '',
            'areaCode': '',
            'categoryCode': '',
            'name': '',
          }
        },
      },
    },
    data () {
      return {
        areaList: areaList,
        formValidate: this.value,
        defaultList: [],
        videoUploadSuccess: true,
        ruleValidate: {
          name: [
            {required: true, message: '请输入电影名称', trigger: 'blur'},
          ],
          thumbnailPath: [
            {required: true, message: '请上传缩略图', trigger: 'blur'},
          ],
          videoPath: [
            {required: true, message: '请上传视频', trigger: 'change'},
          ],
          introduction: [
            {required: true, message: '请输入简介', trigger: 'blur'},
            {type: 'string', max: 500, message: '不能超过500字', trigger: 'blur'},
          ],
          areaCode: [
            {required: true, message: '请选择地区', trigger: 'change'},
          ],
          payFlag: [
            {required: true, message: '请选择是否付费', type: 'boolean', trigger: 'change'},
          ],
          categoryCode: [
            {required: true, type: 'number', message: '请选择类型', trigger: 'change'},
            // {required: true, type: 'array', min: 1, message: 'Choose at least one hobby', trigger: 'change'},
            // {type: 'array', max: 2, message: 'Choose two hobbies at best', trigger: 'change'},
          ],
        },
      }
    },
    methods: {
      handlePicSuccess (res, file) {
        if (res.res === 0) {
          this.formValidate.thumbnailPath = res.data.filePath
        } else {
          this.$Notice.warning({
            title: '上传失败',
            desc: res.data.msg,
          })
        }
      },
      handleVideoSuccess (res, file) {
        if (res.res === 0) {
          this.videoUploadSuccess = true
          this.formValidate.videoPath = res.data.filePath
        } else {
          this.$Notice.warning({
            title: '上传失败',
            desc: res.data.msg,
          })
        }
      },
      handleMaxSize (file) {
        this.$Notice.warning({
          title: '文件超出大小',
          desc: '文件大小  ' + file.name + ' 太大',
        })
      },
      handleFormatError (file) {
        this.$Notice.warning({
          title: '文件类型错误',
          desc: '文件：' + file.name + '不是相应类型文件。',
        })
      },
      handleBeforeUpload (file) {
        const check = this.formValidate.areaCode !== '' && this.formValidate.categoryCode !== ''
        if (!check) {
          this.$Notice.warning({
            title: '请先选择地区和类型',
          })
        }
        return check
      },
      handleBeforeVideoUpload (file) {
        const check = this.formValidate.areaCode !== '' && this.formValidate.categoryCode !== ''
        if (!check) {
          this.$Notice.warning({
            title: '请先选择地区和类型',
          })
        }
        this.$refs.video.clearFiles()
        this.videoUploadSuccess = false
        return check
      },
      handleReset () {
        this.$refs['formValidate'].resetFields()
      },
      onSave () {
        this.$refs.formValidate.validate((valid) => {
          if (!this.videoUploadSuccess || !this.formValidate.videoPath) {
            this.$Notice.warning({
              title: '未检测到视频源',
              desc:'请先选择视频，或等待视频上传完成'
            })
            return false
          }
          if (valid) {
            if (this.formValidate.id) {//编辑
              updateVideo(this.formValidate).then(res => {
                if (res.data.res === 0) {
                  this.$Message.success('保存成功!')
                  this.$emit('saveSuccess')
                  this.$parent.editModel = false
                } else {
                  this.$Notice.warning({
                    title: '保存失败',
                    desc: res.data.msg,
                  })
                }
              })
            } else {//新增
              addVideo(this.formValidate).then(res => {
                if (res.data.res === 0) {
                  this.$Message.success('新增成功!')
                  this.$emit('saveSuccess')
                  this.$parent.editModel = false
                } else {
                  this.$Notice.warning({
                    title: '新增失败',
                    desc: res.data.msg,
                  })
                }
              })
            }
          } else {
            this.$Message.error('请填写完必填项！')
          }
        })
      },
    },
    computed: {
      defaultList () {
        return this.formValidate.id ? [
          {
            name: this.formValidate.videoPath,
            url: this.formValidate.videoPath,
          }] : []
      },
    },
  }
</script>
