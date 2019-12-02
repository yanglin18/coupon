<template>
  <view class="content">
    <view class="title" id="title">隐私保护政策</view>
    <view class="top">
      <view class="row1">
        <text>适用范围</text>
      </view>
      <view class="p1">
        <text>
          (1) 您使用摩卡星的网络服务时，根据摩卡星要求提供的个人信息；
          (2)您使用摩卡星时，上传及产生的非公开申请单资料等文字图片、数据信息；
          (3)摩卡星通过合法途径从其他途径取得的您的个人资料；
          (4)您认为不宜公开的其他内容。
        </text>
      </view>
      <view class="row1">
        <text>信息保密</text>
      </view>
      <view class="p1">
        <text
          >保护您的隐私是摩卡星的一项基本政策，摩卡星保证不对外公开或向第三方提供您的注册资料及您在使用网络服务时存储的非公开内容，但下列情况除外：事先获得您的明确授权；根据有关的法律法规要求；按照相关政府主管部门的要求；为维护社会公众的利益；为维护摩卡星的合法权益。</text
        >
      </view>
      <view class="row1">
        <text>信息使用</text>
      </view>
      <view class="p1">
        <text>
          (1)
          为服务用户的目的，摩卡星可能通过使用您的个人信息向您提供服务，包括但不限于向您发出活动和服务信息等；
          (2)
          您知悉并认可：摩卡星可能会与第三方合作向用户提供相关的网络服务，在此情况下，如该第三方同意承担与本网站同等的保护用户隐私的责任，则摩卡星有权将用户的注册资料等提供给该第三方。另外，在不透露单个用户隐私资料的前提下，摩卡星有权对整个用户数据库进行分析并对用户数据库进行商业上的利用.
        </text>
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
      backgroundColor: "#FFFFFF",
      frontColor: "#000000"
    });
  },
  onPageScroll(top) {
    this.scrollFun(top);
  },
  methods: {}
};
</script>
<style lang="scss" scoped>
.content {
  background: #f3f4f3;
  // height: 100vh;
  color: #000000;
}
.title {
  padding: 26rpx 40rpx 12rpx;
  font-size: 50rpx;
  letter-spacing: 0.62px;
  background: #ffffff;
}
.top {
  background: #ffffff;
  margin-top: 8rpx;
  padding: 0 40rpx 40rpx;
  .row1 {
    font-size: 36rpx;
    letter-spacing: 0.45px;
    padding: 40rpx 0 16rpx;
  }
  .p1 {
    // padding: 8rpx 0;
    opacity: 0.6;
    font-size: 26rpx;
    color: #000000;
    letter-spacing: 0.43px;
    text-align: justify;
    line-height: 48rpx;
  }
}
</style>
