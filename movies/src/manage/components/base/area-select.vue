<template>
  <Select v-model="selectVal" style="width:260px">
    <Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
  </Select>
</template>
<script>
  export default {
    name: 'AreaSelect',
    model: {
      prop: 'value',
      event: 'value-change'
    },
    props: {
      value: {
        default: 1
      },
    },
    data () {
      return {
        selectVal: this.value,
        cityList: [
          {
            value: '',
            label: '全部'
          },
          {
            value: 1,
            label: '大陆'
          },
          {
            value: 2,
            label: '欧美'
          },
          {
            value: 3,
            label: '日本'
          },
          {
            value: 4,
            label: '韩国'
          },
        ]
      }
    }
  }
</script>
