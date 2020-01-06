<template>
  <transition name="fade">
    <div class="buyMember">
      <div class="head">
        <i class="iconfont icon-left" @click="$router.back()"/>
        <span>购买会员</span>
      </div>
      <div class="content">
        <div>
          <div class="label">选择开通频道</div>
          <div>
            <div class="tabs">
              <div class="item"  v-for="(key,item) in areaList" id="item">
                {{ key }}
              </div>
            </div>
          </div>
        </div>
        <div>
          <div class="label">选择开通时长</div>
        </div>
        <div>
          <div class="label">选择开通时长</div>
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
  import { areaList } from '@/libs/areaList'

  export default {
    name: 'buyMember',
    data () {
      return {
        inviter: '',
        phone:'',
        content:'',
        areaList:areaList

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
          this.$axios.post(`/manage/buyMember/add`,{
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
  .tabs
    display flex
    flex 1
    font-size 17px
    .item
      flex 1
      text-align center
</style>
<style lang="less" scoped>
  .buyMember {
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
      padding:15px 10px ;
    }
    .text{
      font-size: 20px;
    }
    .label{
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
