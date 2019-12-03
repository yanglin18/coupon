<template>
  <view class="content">
    <view class="title" id="title">关于摩卡星</view>
    <view class="top">
      <view class="p1">
        <text
          >摩卡星星巴克优惠券小程序（以下简称“<text class="B">摩卡星</text
          >”）是一款提供星巴克专属优惠券的应用。</text
        >
      </view>
      <view class="p1">
        <text
          >摩卡星为您提供丰富的星巴克优惠券产品，在这里你可以通过购买优惠券，以更优惠的价格买到星巴克的饮品。摩卡星致力于为用户提供优质低价的优惠券，便捷的操作方式，极致的产品体验，只为您提高生活品质。</text
        >
      </view>
    </view>
  </view>
</template>
<script>
export default {
  data() {
    return {};
  },
  onPageScroll(top) {
    this.scrollFun(top);
  },
  onLoad() {
    uni.setNavigationBarColor({
      backgroundColor: "#FFFFFF",
      frontColor: "#000000"
    });
  },
  // 用户分享
  onShareAppMessage({ res }) {
    if (res.from === "button") {
      // 来自页面内分享按钮
    }
    return {
      title: "摩卡星",
      path: "/pages/loading/loading"
    };
  },
  methods: {}
};
</script>
<style lang="scss" scoped>
.content {
  background: #ffffff;
  height: 100vh;
  color: #000000;
}
.title {
  padding: 26rpx 40rpx 12rpx;
  font-size: 50rpx;
  letter-spacing: 0.62px;
  background: #ffffff;
  font-weight: bold;
}
.top {
  border-top: #f3f4f3 4px solid;
  background: #ffffff;
  padding: 40rpx;
  .row1 {
    font-size: 36rpx;
    letter-spacing: 0.45px;
  }
  .p1 {
    margin: 8rpx 0;
    font-size: 26rpx;
    color: rgba(0, 0, 0, 0.6);
    letter-spacing: 0.43px;
    text-align: justify;
    line-height: 48rpx;
    .B {
      font-weight: 600;
      color: #333333;
      letter-spacing: 0.38px;
    }
  }
}
</style>
