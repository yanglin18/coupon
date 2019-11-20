<template>
  <view class="content">
    <view class="title" id="title">隐私保护政策</view>
    <view class="top">
      <view class="row1">
        <text>隐私权政策</text>
      </view>
      <view class="p1">
        <text>于2018年11月1日最新修订，并于2018年12月5日生效。</text>
      </view>
      <view class="p1">
        <text
          >星巴克企业管理（中国）有限公司（以下简称“星巴克中国”）及其关联公司（以下统称“星巴克”或“我们”）非常重视您的隐私和个人信息保护。</text
        >
      </view>
      <view class="p1">
        <text
          >在下列情形中，我们可能会收集、使用和保存您的信息： 
          (1)当您购买及/或使用星巴克在中国大陆地区提供的产品和/或服务； 
          (2)当您访问、浏览及/或使用：
        </text>
      </view>
      <!-- <view class="p1">
        <text>(1) 当您购买及/或使用星巴克在中国大陆地区提供的产品和/或服务；</text>
      </view>
      <view class="p1">
        <text>(2) 当您访问、浏览及/或使用：</text>
      </view> -->
      <view class="p2">
        <text>
          (a)网址为www.starbucks.com.cn（也可通过www.starbucks.cn登录）的星巴克中国官方网站（以下简称“星巴克中国官网”）及星巴克在中国大陆地区运营和管理的其他网站（以下统称为“星巴克网站”）；
          (b)星巴克在中国大陆地区运营和管理的星巴克移动应用（以下简称“星巴克App”）；
          (c)星巴克在任何第三方网站、移动应用或社交媒体平台（以下简称“第三方平台”）上建立并经营的线上渠道（以下统称“星巴克线上渠道”），包括但不限于Starbucks星巴克天猫官方旗舰店（starbucks.tmall.com，以下简称“星巴克天猫旗舰店”）、星巴克用星说社交礼品平台
        </text>
      </view>
      <view class="p1">
        <text
          >在下列情形中，我们可能会收集、使用和保存您的信息： 
          (1)当您购买及/或使用星巴克在中国大陆地区提供的产品和/或服务； 
          (2)当您访问、浏览及/或使用：
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
  onPageScroll(top) {
    this.scrollFun(top);
  },
  methods: {
    scrollFun(top) {
      //创建节点选择器
      var query = wx.createSelectorQuery();
      //选择id
      query.select("#title").boundingClientRect();
      query.exec(function(res) {
        //res就是 所有标签为myText的元素的信息 的数组
        let height = res[0].height;
        if (top.scrollTop > height) {
          uni.setNavigationBarTitle({
            title: "隐私保护政策"
          });
        } else {
          uni.setNavigationBarTitle({
            title: ""
          });
        }
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
}
.top {
  background: #ffffff;
  margin-top: 8rpx;
  padding: 40rpx;
  .row1 {
    font-size: 36rpx;
    letter-spacing: 0.45px;
  }
  .p1 {
    padding: 8rpx 0;
    opacity: 0.6;
    font-size: 26rpx;
    color: #000000;
    letter-spacing: 0.43px;
    text-align: justify;
    line-height: 48rpx;
  }
  .p2 {
    padding: 8rpx 0 8rpx 40rpx;
    opacity: 0.6;
    font-size: 26rpx;
    color: #000000;
    letter-spacing: 0.43px;
    text-align: justify;
    line-height: 48rpx;
  }
}
</style>
