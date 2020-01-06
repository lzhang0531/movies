<template>
  <transition name="fade">
    <div class="user">
      <div class="userinfo-wrapper">
        <div class="avatar">
          <img src="~index/common/images/user.png" width="32">
        </div>
        <div class="info">
          <span class="text" v-if="appUser.userInfo.userName">{{ appUser.userInfo.userName }}</span>
          <span class="text" v-if="!appUser.userInfo.memberFlag">点击购买会员</span>
          <span class="text" v-if="appUser.userInfo.memberFlag">会员有效期： {{ appUser.userInfo.memberEndTime.substring(0,10) }}</span>
        </div>
        <i class="iconfont icon-left" @click="$router.back()"/>
      </div>
      <div class="menu-wrapper">
        <ul class="menus">
          <li class="menu-item" @click="$router.push('/list/1')">
            <i class="iconfont icon-history"/>
            <span class="text">购买记录</span>
            <i class="iconfont icon-right"/>
          </li>
          <li class="menu-item">
            <i class="iconfont icon-email"/>
            <span class="text">意见反馈</span>
            <i class="iconfont icon-right" />
          </li>
          <li class="menu-item"  @click="invitationModal=true">
            <i class="iconfont icon-share"/>
            <span class="text">我的邀请码</span>
            <i class="iconfont icon-right"/>
          </li>
          <li class="menu-item">
            <i class="iconfont icon-user"/>
            <span class="text">填写邀请码</span>
            <i class="iconfont icon-right"/>
          </li>
        </ul>
      </div>
      <div class="ui-dialog" :class="{'show' :invitationModal}">
        <div class="ui-dialog-cnt">
          <div class="ui-dialog-bd">
            <p>邀请好友填写邀请码，可以获得免费观看次数</p>
            <p id="invitationCode">{{ appUser.userInfo.invitationCode }}</p>
          </div>
          <div class="ui-dialog-ft">
            <button type="button" data-role="button" @click="invitationModal=false">我知道了</button>
            <!--<button type="button" data-role="button" @click="copyInvitationModal">复制邀请码</button>-->
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { mapState,mapActions } from 'vuex'

export default {
  name: 'User',
  data () {
    return {
      invitationModal:false,
      invitationModal2:true,
    }
  },
  computed: {
    ...mapState([
      'appUser'
    ]),
  },
  created () {
    if(!this.appUser.userInfo.userName){
      this.getUserInfo(this.appUser.deviceId)
    }
  },
  methods: {
    ...mapActions([
      'getUserInfo'
    ]),
    copyInvitationModal(){
 /*     const range = document.createRange();
      range.selectNode(document.getElementById('invitationCode'));
      const selection = window.getSelection();
      if(selection.rangeCount > 0) selection.removeAllRanges();
      selection.addRange(range);
      console.log(range)
      document.execCommand('copy');*/
   /*   const copy=document.getElementById("invitationCode");
      copy.select(); // 选择对象
      document.execCommand("Copy")*/
      this.invitationModal=false;
    }
  }
}
</script>

<style lang="stylus" scoped>
.user
  position fixed
  top 0
  bottom 0
  width 100%
  z-index 10
  background #fff
  .userinfo-wrapper
    display flex
    justify-content center
    align-items center
    height 175px
    background url('~index/common/images/background.jpg') no-repeat
    background-size cover
    .avatar
      display flex
      align-items center
      justify-content center
      width 67px
      height 67px
      background #eee
      border-radius 50%
    .info
      display flex
      flex-direction column
      padding-left 10px
      font-size 13px
      color #fff
      .text
        flex 1
        line-height 33px
    .icon-left
      position absolute
      top 10px
      left 10px
      font-size 25px
      color #fff
  .menu-wrapper
    .menus
      padding-left 10px
      .menu-item
        padding 10px
        font-size 18px
        line-height 25px
        list-style none
        border-bottom 1px solid #d8d8d8
        color #333
        .iconfont
          vertical-align text-bottom
          font-size 25px
          color #999
          margin-right 8px
        .icon-email
          font-weight bold
        .count
          float right
          margin-right 5px
          color #999
          font-size 15px
        .icon-right
          font-size 20px
          float right
  .btn-wrapper
    padding 20px
    .logout-btn
      width 100%
      height 48px
      line-height 48px
      font-size 18px
      border none
      border-radius 48px
      color #fff
      background-color #f13900
      outline none
.fade-enter-active, .fade-leave-active
  transition all .5s
.fade-enter, .fade-leave-to
  transform translateX(100%)
</style>
