<template>
  <view class="content">
    <image src="../../static/assets/loading.gif" />
    <text>加载中...</text>
  </view>
</template>
<script>
export default {
  onLoad() {
    console.log("loadding");
    setTimeout(function() {
      uni.switchTab({
        url: `../index/index`
      });
    }, 3000);
  }
};
</script>
<style lang="scss" scoped>
.content {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  image {
    height: 200rpx;
    width: 200rpx;
  }
  text {
    font-size: 28rpx;
    color: #b2b2b2;
    text-align: center;
  }
}
</style>
