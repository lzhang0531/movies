<template>
  <transition name="fade">
    <div class="fillInvitation">
      <div class="head">
        <i class="iconfont icon-left" @click="$router.back()"/>
        <span>填写邀请码</span>
      </div>
      <div class="content">
        <mt-field label="邀请码" placeholder="请输入邀请码" v-model="inviter" :state="state" @input.native="state=''"></mt-field>
      </div>
      <div class="text-center">
        <mt-button type="primary" size="small" class="mg-20t" @click="doInviter" style="width: 80%">兑换</mt-button>
      </div>
    </div>
  </transition>
</template>

<script>
  import { mapState } from 'vuex'

  export default {
    name: 'fillInvitation',
    data () {
      return {
        inviter: '',
        state:''
      }
    },
    computed: {
      ...mapState([
        'appUser',
      ]),
    },
    methods: {
      doInviter(){
        if(this.inviter!=''){
          console.log(this.appUser)
          this.$axios.post(`/manage/user/fill-invitation-code`,{
            inviter:this.inviter,
            id:this.appUser.userInfo.id
          }).then(res => {
            if (res.res === 0) {
              this.$toast({
                message: '兑换成功',
                iconClass: 'icon icon-success'
              });
            }else {
              this.$toast({
                message: '兑换失败!'+res.msg,
                iconClass: 'icon icon-error'
              });
            }
          }).catch(err=>{
            this.$toast({
              message: '兑换失败!',
              iconClass: 'icon icon-error'
            });
          })
        }else {
          this.state = 'error';
          this.$toast('请先填写邀请码')
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
  .fillInvitation {
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
      color: #222;
    }
    .icon-left {
      font-size: 25px;
      color: #222;
      position: absolute;
      left: 10px;
      top: 10px;
    }
    .content {
      margin-top: 50px;
      background: #fff;
      text-align: center;
      padding: 15px 0;
    }
    .text{
      font-size: 20px;
    }
    .mint-cell-wrapper{
      background: none;
    }
  }
  .mg-20t{
    margin-top: 20px;
  }
  .text-center{
    text-align: center;
  }
</style>
