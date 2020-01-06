<template>
  <div>
    <div class="search-con search-con-top">
      <DatePicker type="date"  v-model="statisticsDayPick"  style="width: 200px" @on-change="dateFormat"></DatePicker>
      <Button @click="getUserstatistics" class="search-btn mg-10l" type="primary">
        搜索
      </Button>
    </div>
    <div class="mg-10t">
      <Row :gutter="20">
        <i-col :xs="12" :md="12" :lg="12" style="height: 120px;padding-bottom: 10px;">
          <infor-card shadow color="#2d8cf0" icon="md-person-add" :icon-size="36">
            <!--<count-to :end="userCount" count-class="count-style"/>-->
            <span>{{userCount}}</span>
            <p>用户数量</p>
          </infor-card>
        </i-col>
        <i-col :xs="12" :md="12" :lg="12" style="height: 120px;padding-bottom: 10px;">
          <infor-card shadow color="#19be6b" icon="md-locate" :icon-size="36">
            <!--<count-to :end="orderCount" count-class="count-style"/>-->
            <span>{{orderCount}}</span>
            <p>订单数量</p>
          </infor-card>
        </i-col>
      </Row>
    </div>
  </div>
</template>

<script>
  import InforCard from '_c/info-card'
  import CountTo from '_c/count-to'
  import { getUserstatistics } from '@/api/data'

  export default {
    name: 'movie_type_page',
    components: {
      InforCard,
      CountTo,
    },
    data () {
      return {
        statisticsDayPick: new Date(),
        statisticsDay: new Date(),
        userCount:0,
        orderCount:0
      }
    },
    methods: {
      dateFormat(date){
        this.statisticsDay = date;
      },
      getUserstatistics () {
        getUserstatistics({statisticsDay:this.statisticsDay}).then(res => {
          if (res.res === 0) {
            this.userCount = res.data.userCount
            this.orderCount = res.data.orderCount
          }
        })
      },
    },
    created () {
      this.getUserstatistics()
    },
  }
</script>
