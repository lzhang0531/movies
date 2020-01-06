<template>
  <transition name="fade">
    <div class="buyMember">
      <div class="head">
        <i class="iconfont icon-left" @click="$router.back()"/>
        <span>购买会员</span>
      </div>
      <div class="content">
        <div class="mg-10b">
          <div class="label">选择开通频道</div>
          <div>
            <div class="tabs">
              <div class="item"  v-for="(key,item) in areaList"  :class="{'active' : areaCode === item}" @click="areaCode=item">
                <!--<i class="iconfont icon-dui" v-show="areaCode === item"/>-->
                {{key}}
              </div>
            </div>
          </div>
        </div>
        <div>
          <div class="label">选择开通时长</div>
          <div class="tabs">
            <div class="item" :class="{'active' : amountType === 'oneMonth'}" @click="amountType='oneMonth',amount=1">
              <!--<i class="iconfont icon-dui" v-show="amountType === 'oneMonth'"/>-->
              1个月
            </div>
            <div class="item" :class="{'active' : amountType === 'threeMonth'}" @click="amountType='threeMonth',amount=3">
              <!--<i class="iconfont icon-dui" v-show="amountType === 'threeMonth'"/>-->
              3个月
            </div>
            <div class="item" :class="{'active' : amountType === 'twelveMonth'}" @click="amountType='twelveMonth',amount=12">
              <!--<i class="iconfont icon-dui" v-show="amountType === 'twelveMonth'"/>-->
              12个月
            </div>
          </div>
        </div>
        <div>
          <div class="label">选择支付方式</div>
          <div class="tabs">
          <div class="item" :class="{'active' : orderType === 'alipay'}" @click="orderType='alipay'">
            <!--<i class="iconfont icon-dui" v-show="orderType === 'alipay'"/>-->
            支付宝支付
          </div>
          <div class="item" :class="{'active' : orderType === 'wechat'}" @click="orderType='wechat'">
            <!--<i class="iconfont icon-dui" v-show="orderType === 'wechat'"/>-->
            微信支付
          </div>
          </div>
        </div>
      </div>
      <div class="ui-row-flex ui-whitespace pay-bottom">
        <div class="ui-col ui-col-2 text-left">总计: ￥<span class="price">{{orderPrice}}</span></div>
        <div class="ui-col button text-center" @click="pay">确认支付</div>
      </div>
      <div v-show="payFlag" @click="$router.back()" class="pay-result">支付已完成?点此处返回>></div>
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
        amountObj:{},
        amountType: 'oneMonth',
        amount: '1',
        areaCode:'1',
        orderType:'alipay',
        areaList:areaList,
        payFlag:false
      }
    },
    computed: {
      ...mapState([
        'appUser',
      ]),
      orderPrice(){
        return Number(this.amountObj[this.amountType]).toFixed(2)
      }
    },
    beforeCreate () {
      this.$axios.get(`/manage/order/get-payment-amount`).then(res=>{
        this.amountObj = res.data
      })
    },
    methods: {
      pay(){
        if(this.appUser.userInfo.id!=''&&this.orderPrice!=''){
          this.$axios.post(`/manage/order/create`,{
            orderType:this.orderType,
            orderPrice:this.orderPrice,
            areaCode:this.areaCode,
            amount:this.amount,
            userId:this.appUser.userInfo.id
          }).then(res => {
            if (res.res === 0) {
              window.location.href='alipays://platformapi/startapp?appId=20000067&appClearTop=false&startMultApp=YES&showTitleBar=YES&showToolBar=NO&showLoading=YES&pullRefresh=YES&url=http%3A%2F%2F47.111.232.212%3A7001%2Falipay.html%3Fu%3D2088102755515502%26a%3D-0.14'
              this.payFlag=true;
            }else {
              this.$toast({
                message: '创建订单失败!'+res.msg,
                iconClass: 'icon icon-error'
              });
            }
          }).catch(err=>{
            this.$toast({
              message: '创建订单失败!',
              iconClass: 'icon icon-error'
            });
          })
        }else {
          this.$toast('创建订单失败')
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
    font-size 15px
    .item
      flex 1
      text-align center
      padding: 10px 2px;
      border: 1px solid #e2e2e2;
      color #999
      box-sizing: border-box;
      margin-right: 10px;
      border-radius: 8px;
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
      padding:15px 0;
      background-color: #fff;
      > div{
        padding: 0 10px;
        margin-bottom: 10px;
      }
    }
    .text{
      font-size: 20px;
    }
    .label{
      padding: 10px 0;
      color:#3b3b3b
    }
    .active{
      border-color: #e8931b;
      color:  #e8931b;
      background-color: #f3bc4a38;
      .iconfont{
        font-weight: bold;
      }
    }
    .price{
      font-weight: bold;
      color:  #e8931b;
      font-size: 1.3em;
    }
    .ui-whitespace{
      padding-right: 0;
    }
    .pay-bottom{
      margin-top: 10px;
      background-color: #fff;
      line-height: 40px;
    }
  }
  .mg-20t{
    margin-top: 20px;
  }
  .text-center{
    text-align: center;
  }
  .pay-result{
    width: 100%;
    text-align: center;
    margin-top:20px;
    color: #696969;
    font-size: 1.2em;
  }
</style>
