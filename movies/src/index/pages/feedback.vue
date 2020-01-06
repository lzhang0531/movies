<template>
  <transition name="fade">
    <div class="feedback">
      <div class="head">
        <i class="iconfont icon-left" @click="$router.back()"/>
        <span>意见反馈</span>
      </div>
      <div class="content">
        <div>
          <div class="label">手机号<span class="red">*</span></div>
          <mt-field label="" placeholder="必填" v-model="phone" :state="phoneState"></mt-field>
        </div>
        <div>
          <div class="label">意见反馈<span class="red">*</span></div>
          <mt-field label="" placeholder="必填"  type="textarea" rows="4" v-model="content" :state="contentState"></mt-field>
        </div>
      </div>
      <div class="text-center">
        <mt-button type="primary" size="small" class="mg-20t" @click="add" style="width: 80%">提交</mt-button>
      </div>
    </div>
  </transition>
</template>

<script>
  import { mapState } from 'vuex'

  export default {
    name: 'feedback',
    data () {
      return {
        inviter: '',
        phone:'',
        content:''
      }
    },
    computed: {
      ...mapState([
        'appUser',
      ]),
      phoneState () {
        return this.phone === '' ? '' : 'success'
      },
      contentState () {
        console.log(this.content)
        return this.content === ''? '' : 'success'
      }
    },
    methods: {
      add(){
        if(this.phone!=''&&this.content!=''){
          console.log(this.appUser)
          this.$axios.post(`/manage/feedback/add`,{
            phone:this.phone,
            content:this.content,
            userId:this.appUser.userInfo.id
          }).then(res => {
            if (res.res === 0) {
              this.$toast({
                message: '提交成功',
                iconClass: 'icon icon-success'
              });
            }else {
              this.$toast({
                message: '提交失败!'+res.msg,
                iconClass: 'icon icon-error'
              });
            }
          }).catch(err=>{
            this.$toast({
              message: '提交失败!',
              iconClass: 'icon icon-error'
            });
          })
        }else {
          this.$toast('请先填写必填项')
        }

      }
    },
  }
</script>

<style lang="stylus" scoped>
  .fade-enter-active, .fade-leave-active
    transition all .5s

  .fade-enter, .fade-leave-to
    transform translateX(100%)
</style>
<style lang="less" scoped>
  .feedback {
    position: fixed;
    top: 0;
    bottom: 0;
    width: 100%;
    z-index: 10;
    background: #eee;
    .head {
      width: 100%;
      background: #fff;
      position: absolute;
      top: 0;
      left: 0;
      text-align: center;
      padding: 15px 0;
      color: #999;
    }
    .icon-left {
      font-size: 25px;
      color: #bbb;
      position: absolute;
      left: 10px;
      top: 10px;
    }
    .content {
      margin-top: 50px;
      background: #fff;
      padding:15px 5px;
    }
    .text{
      font-size: 20px;
    }
    .red{
      color: red;
    }
    .label{
      padding-left: 10px;
      padding-bottom: 5px;
    }
  }
  .mg-20t{
    margin-top: 20px;
  }
  .text-center{
    text-align: center;
  }
</style>
