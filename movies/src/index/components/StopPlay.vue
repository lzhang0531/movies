<template>
  <transition name="fade">
    <div class="stopPlay">
      <!--<i class="iconfont icon-left" @click="hide"/>-->
      <div class="content">
        <div class="text">开通会员或使用免费次数观看完整版{{userId}}</div>
        <div class="text-center">
          <mt-button type="primary" size="small" class="mg-20t" @click="$router.push('/buyMember')" style="width: 80%;background-color: #faaf00"> <i class="ui-subscript ui-subscript-red" style="overflow: hidden">推荐</i>开通会员</mt-button>
          <mt-button v-if="freeTimes > 0" type="primary" size="small" class="mg-20t" @click="useFree" style="width: 80%">扣除免费次数(剩余{{freeTimes}}次)</mt-button>
          <mt-button v-else type="primary" size="small" class="mg-20t" @click="useFree" style="width: 80%;">邀请新用户</mt-button>
          <div class="tip" v-if="freeTimes === 0">您的免费次数为0次，邀请新用户填写邀请码可获得免费次数</div>
        </div>
        <p></p>
      </div>
    </div>
  </transition>
</template>

<script>
  // import { mapState } from 'vuex'

  export default {
    name: 'StopPlay',
    props: {
      freeTimes: {
        type: Number,
        default:0
      },
      videoId: {
        type: String,
        default:''
      },
      userId: {
        type: String,
        default:''
      }
    },
    data () {
      return {

      }
    },
  /*  computed: {
      ...mapState([
        'appUser',
      ]),
    },*/
    methods: {
      hide(){
        this.$parent.isShow = false
      },
      useFree(){
        if(this.userId && this.freeTimes > 0 && this.videoId){
          this.$axios.put(`/manage/user/use-free-time`,{
            videoId:this.videoId,
            id:this.userId
          }).then(res => {
            if (res.res === 0) {
              this.$toast({
                message: '扣除成功',
                iconClass: 'icon icon-success'
              });
              this.$router.back();
            }else {
              this.$toast({
                message: '扣除失败!'+res.msg,
                iconClass: 'icon icon-error'
              });
            }
          }).catch(err=>{
            this.$toast({
              message: '查询用户信息失败!',
              iconClass: 'icon icon-error'
            });
          })
        }else {
          this.state = 'error';
          this.$toast('查询用户信息失败')
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
  .stopPlay {
    position: fixed;
    top: 0;
    height: 210px;
    /*bottom: 0;*/
    width: 100%;
    z-index: 100;
    /*background: #333333d4;*/
    background: #333;
    color: #fff;
    .icon-left {
      font-size: 25px;
      color: #fff;
      position: absolute;
      left: 15px;
      top: 15px;
    }
    .content{
      position: absolute;
      top:50%;
      left:50%;
      width:100%;
      transform:translate(-50%,-50%);
      .text{
        margin-bottom: 10px;
        padding: 0 10%;
        font-weight: bold;
      }
      .tip{
        padding: 0 12%;
        line-height: 20px;
        font-size: 13px;
        text-align: left;
        color: #eeeeee;
        margin-top: 5px;
      }
    }
  }
  .mg-20t{
    margin-top: 20px;
  }
  .text-center{
    text-align: center;
  }
</style>
