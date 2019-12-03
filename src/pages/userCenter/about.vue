<template>
  <view class="content">
    <view class="title">关于</view>
    <view class="top">
      <view class="row" @click="NavTo('./About/aboutMKX')">
        <text>关于摩卡星</text>
        <image src="../../static/assets/toRight.png" />
      </view>
      <view class="row" @click="NavTo('./About/privacyPolicy')">
        <text>隐私保护政策</text>
        <image src="../../static/assets/toRight.png" />
      </view>
      <view class="row" @click="NavTo('./About/commonProblem')">
        <text>常见问题</text>
        <image src="../../static/assets/toRight.png" />
      </view>
    </view>
  </view>
</template>
<script>
export default {
  data() {
    return {};
  },
  onLoad() {
    uni.setNavigationBarColor({
      backgroundColor: "#ffffff",
      frontColor: "#000000"
    });
  },
    // 用户分享
  onShareAppMessage() {
    return {
      title: "我告诉你，这是喝星巴克最优惠的方式",
      path: "/pages/loading/loading",
      imageUrl:'../../static/images/shareCard.jpg'
    };
  },
  methods: {
    NavTo(e) {
      uni.navigateTo({
        url: e
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.content {
  background: #f3f4f3;
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
  margin-top: 10rpx;
  background: #ffffff;
  padding: 0 50rpx 0 40rpx;
  .row {
    padding: 30rpx 0;
    display: flex;
    justify-content: space-between;
    border-bottom: 0.5px solid rgba(97, 97, 97, 0.2);
    text {
      letter-spacing: 0.38px;
      font-size: 30rpx;
    }
    image {
      height: 25rpx;
      width: 15rpx;
      margin: auto 0;
    }
  }
}
</style>
