<template>
  <view class="content">
    <!-- <view class="tips">
      <view class="title">
        <text>使用须知</text>
      </view>
      <view class="tip_content">
        <view class="texta">
          <text>适用时段：购买后24小时内有效，过期后不支持退换；</text>
        </view>
        <view class="texta">
          <text
            >适用产品：可在中国大陆区的星巴克门店内兑换任意一款中杯饮品（冰激凌系列除外）；</text
          >
        </view>
        <view class="texta">
          <text
            >不适用门店：瑧选上海烘培工坊、上海浦东机场店、上海世贸广场店、北京坊旗舰店、深圳万象城店、南京机场店</text
          >
        </view>
      </view>
    </view> -->
    <swiper
      :vertical="true"
      previous-margin="120px"
      next-margin="120px"
      @change="EventHandle"
      class="swiper"
    >
      <swiper-item>
        <view class="tips">
          <view class="title">
            <text>使用须知</text>
          </view>
          <view class="tip_content">
            <view class="texta">
              <text>适用时段：购买后24小时内有效，过期后不支持退换；</text>
            </view>
            <view class="texta">
              <text
                >适用产品：可在中国大陆区的星巴克门店内兑换任意一款中杯饮品（冰激凌系列除外）；</text
              >
            </view>
            <view class="texta">
              <text
                >不适用门店：瑧选上海烘培工坊、上海浦东机场店、上海世贸广场店、北京坊旗舰店、深圳万象城店、南京机场店</text
              >
            </view>
          </view>
        </view>
      </swiper-item>
      <swiper-item
        class="goods_card"
        v-for="(item, index) in cards"
        :id="index"
        :key="index"
      >
        <view class="card_order">
          <text>{{ item.id }}/{{ shuliang }}</text>
        </view>
        <view class="name">
          <text>全国星巴克中杯通兑券</text>
        </view>
        <view class="userful_time">
          <text>有效期：{{ item.userful_time }}</text>
        </view>
        <view class="QRcode">
          <image src="../../static/ceshi.jpg" />
        </view>
        <view class="tips">
          <text>优惠码每30秒自动更新，24小时内有效，过期不退换</text>
        </view>
      </swiper-item>
    </swiper>
    <!-- <view v-for="item in cards" :key="item" class="goods_card">
      <view class="card_order">
        <text>{{ item.id }}/{{ shuliang }}</text>
      </view>
      <view class="name">
        <text>全国星巴克中杯通兑券</text>
      </view>
      <view class="userful_time">
        <text>有效期：{{ item.userful_time }}</text>
      </view>
      <view class="QRcode">
        <image src="../../static/ceshi.jpg" />
      </view>
      <view class="tips">
        <text>优惠码每30秒自动更新，24小时内有效，过期不退换</text>
      </view>
    </view> -->
  </view>
</template>

<script>
export default {
  data() {
    return {
      title: "Hello",
      price: 24,
      price_original: 33,
      buy_number: 555,
      sum_number: 999,
      shuliang: 6,
      cards: [
        {
          image: "",
          id: 1,
          userful_time: "2019.11.08 00:00～2019.11.09 24:00"
        },
        {
          image: "",
          id: 2,
          userful_time: "2019.11.08 00:00～2019.11.09 24:00"
        },
        {
          image: "",
          id: 3,
          userful_time: "2019.11.08 00:00～2019.11.09 24:00"
        },
        {
          image: "",
          id: 4,
          userful_time: "2019.11.08 00:00～2019.11.09 24:00"
        },
        {
          image: "",
          id: 5,
          userful_time: "2019.11.08 00:00～2019.11.09 24:00"
        },
        { image: "", id: 6, userful_time: "2019.11.08 00:00～2019.11.09 24:00" }
      ]
    };
  },
  onLoad() {},
  methods: {
    EventHandle(e) {
      // console.log(e);
      // let swp = document.getElementById(e.detail.current);
      // swp.className = "card_order active";
      // console.log("swp:", swp);
    }
  }
};
</script>

<style lang="scss">
// 一个元素时的垂直居中
.center {
  display: flex;
  justify-content: center;
  align-items: center;
}
.content {
  padding: 0 50rpx;

  background: #e8e8e8;
}
.swiper {
  height: 600px;
}
.tips {
  display: flex;
  flex-direction: column;
  font-size: 26rpx;
  .title {
    opacity: 0.6;
    font-family: PingFangSC-Semibold;
    font-size: 28rpx;
    color: #000000;
    letter-spacing: -0.68px;
    padding: 10rpx;
  }
  .tip_content {
    display: flex;
    flex-direction: column;
    opacity: 0.6;
    font-family: PingFangSC-Regular;
    font-size: 24rpx;
    color: rgb(43, 43, 44);
    letter-spacing: -0.58rpx;
    line-height: 42rpx;
    .texta {
      padding: 10rpx;
    }
  }
}
.goods_card {
  :active {
    opacity: 1;
  }
  opacity: 0.5;
  background: #ffffff;
  border-radius: 15rpx;
  width: calc(100% - 30px);
  display: flex;
  margin: 40rpx 0;
  flex-direction: column;
  .card_order {
    @extend .center;
    margin: 50rpx 0 20rpx 0;
  }
  .name {
    @extend .center;
    opacity: 0.8;
    font-weight: 600;
    font-family: PingFangSC-Semibold;
    font-size: 36rpx;
    color: #000000;
    letter-spacing: 0;
    margin: 10rpx;
  }
  .userful_time {
    @extend .center;
    color: #000000;
    font-size: 26rpx;
    margin: 10rpx;
  }
  .QRcode {
    @extend .center;
    image {
      height: 400rpx;
      width: 400rpx;
    }
  }
  .tips {
    @extend .center;
    color: gray;
    font-size: 24rpx;
    margin: 20rpx 0 60rpx 10rpx;
  }
}
.active {
  opacity: 1;
}
</style>
