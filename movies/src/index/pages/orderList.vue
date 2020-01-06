<template>
  <Transition name="fade">
    <div class="order">
      <div class="head">
        <i class="iconfont icon-left" @click="$router.back()"/>
        <span>购买记录</span>
      </div>
      <div class="content-wrapper">
        <ScrollView :data="orderList" :pull-up-load="true" @pulling-up="loadMore">
          <orderCard
            v-for="order in orderList"
            :key="order.id"
            :order="order"
          />
          <div class="pull-up-wrap">
            <p v-show="pullUpLoading">正在加载...</p>
            <p v-show="noMore">没有更多了~</p>
          </div>
        </ScrollView>
        <div v-show="noResult" class="no-result">
          <p class="text">没有相关订单</p>
        </div>
      </div>
      <div v-show="!orderList.length&&!noResult" class="loading-wrap">
        <Loading/>
      </div>
    </div>
  </Transition>
</template>

<script>
  import { mapState } from 'vuex'
  import orderCard from '../components/global/orderCard'

  export default {
    name: 'orderList',
    components: {
      orderCard
    },
    data () {
      return {
        orderList: [],
        count: -1,
        page: 1,
        pullUpLoading: false,
        categories: [],
        userId: '',
      }
    },
    computed: {
      noMore () {
        console.log("noMore==="+this.count === this.orderList.length && this.count !== 0)
        return this.count === this.orderList.length && this.count !== 0
      },
      noResult () {
        console.log("noResult==="+this.count === 0)

        return this.count === 0
      },
      ...mapState([
        'appUser'
      ])
    },
    created () {
      this.getOrderList()
    },
    beforeRouteUpdate  (to, from, next) {
      this.page = 1
      this.orderList = []
      this.count = 0
      next()
      this.getOrderList()
    },
    methods: {
      getOrderList () {
        console.log(this.appUser.userInfo.id)
        const params = {
          pageNum: this.page,
          pageSize: 10,
          userId : this.appUser.userInfo.id
        }
        this.$axios.get('/manage/order/page', { params }).then(res => {
          if (res.res=== 0) {
            this.orderList = this.orderList.concat(res.data.list)
            this.count = res.data.total
            console.log(this.orderList)
          }
          this.$nextTick(() => {
            this.pullUpLoading = false
          })
        })
      },
      loadMore () {
        const { orderList, count } = this
        if (orderList.length === count) return
        this.page += 1
        this.pullUpLoading = true
        this.getOrderList()
      }
    }
  }
</script>

<style lang="stylus" scoped>
  .order-wrapper
    padding 10px 20px
    box-sizing: border-box
    border-bottom: 1px solid #e6e6e6
    text-align:center
    .title
      text-align:left
      color: #333
      font-size: 17px
      font-weight: 700
      line-height:20px
      overflow: hidden
      text-overflow: ellipsis
      display: -webkit-box
      -webkit-line-clamp: 2
      -webkit-box-orient: vertical
  .order
    z-index 10
    .content-wrapper
      position fixed
      top 60px
      right 0
      bottom 0
      left 0
      background #fff
      z-index 10
      .pull-up-wrap
        height 30px
        line-height 30px
        text-align center
        color $gray
    .loading-wrap
      display flex
      align-items center
      height 100%
  .fade-leave-active
    transition all .5s
  .fade-leave-to
    transform translateX(100%)
  .no-result
    position absolute
    top 40%
    left 50%
    transform translate(-50%,-50%)
    color #999
    text-align center
    .img
      width 100px
      height 100px
      filter grayscale(1)
      margin-bottom 15px
</style>
<style lang="less" scoped>
  .order{
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
  }
</style>
