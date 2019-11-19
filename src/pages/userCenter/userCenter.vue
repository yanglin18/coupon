<template>
  <view class="content">
    <view class="top_card">
      <view class="title">
        <text>个人中心 </text>
      </view>
      <view class="bottom">
        <view class="left">
          <image src="../../static/images/user.jpg" />
          <text>{{ user_name }}</text>
        </view>
        <view class="right">
          <text>修改资料</text>
          <image src="../../static/assets/toRight.png" />
        </view>
      </view>
    </view>
    <view class="about">
      <view class="service deline">
        <view class="left">
          <image src="../../static/assets/service.png" />
          <text>联系客服</text>
        </view>
        <image src="../../static/assets/toRight.png" />
      </view>
      <view class="service">
        <view class="left">
          <image src="../../static/assets/about.png" />
          <text>关于</text>
        </view>

        <image src="../../static/assets/toRight.png" />
      </view>
    </view>
  </view>
</template>
<script>
export default {
  data() {
    return {
      user_icon: "../../static/images/user.png",
      user_name: "喵喵喵"
    };
  }
};
</script>
<style lang="scss" scoped>
.content {
  background: #f3f4f3;
  height: 100vh;
}
.top_card {
  background: #ffffff;
  padding: 20rpx 40rpx 50rpx;
  .title {
    font-family: PingFangSC-Semibold;
    font-size: 50rpx;
    color: #000000;
    font-weight: 600;
    line-height: 70rpx;
    margin: 20rpx 0 40rpx;
  }
  .bottom {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    .left {
      display: flex;
      flex-direction: row;
      align-items: center;
      image {
        height: 120rpx;
        width: 120rpx;
        border-radius: 50%;
      }
      text {
        font-family: PingFangSC-Semibold;
        font-size: 40rpx;
        color: #000000;
      }
    }
    .right {
      display: flex;
      flex-direction: row;
      align-items: center;
      text {
        opacity: 0.4;
        font-family: PingFangSC-Regular;
        font-size: 26rpx;
        color: #000000;
      }
      image {
        height: 26rpx;
        width: 26rpx;
        margin-left: 10rpx;
      }
    }
  }
}
.about {
  margin-top: 20rpx;
  background: #ffffff;
  .service {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-bottom: 4rpx;
    padding: 30rpx 0;
    .left {
      display: flex;
      flex-direction: row;
      align-items: center;
    }
    image {
      height: 26rpx;
      width: 26rpx;
      margin: 10rpx 20rpx;
    }
  }
  .deline {
    border-bottom: 0.5px solid #979797;
  }
}
</style>
