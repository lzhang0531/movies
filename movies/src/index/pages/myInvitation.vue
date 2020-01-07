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
  name: 'Invitation',
  data () {
    return {

    }
  },
  methods: {

  }
}
</script>
<style lang="less">

</style>
