<template>
  <view class="content">
    <image src="../../static/assets/no_notwork.png" />
    <text>网络连接不成功</text>
    <text>请稍后再试试吧</text>
    <button>重新加载</button>
  </view>
</template>
<script>
export default {
  onLoad() {
    console.log("loadding");
    // setTimeout(function() {
    //   uni.switchTab({
    //     url: `../index/index`
    //   });
    // }, 3000);
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
    padding-bottom: 46rpx;
  }
  text {
    font-size: 28rpx;
    color: #b2b2b2;
    text-align: center;
  }
  button {
    margin-top: 256rpx;
    width: 300rpx;
    border: 2rpx solid #42b069;
    border-radius: 40rpx;
    font-size: 30rpx;
    color: #42b069;
  }
}
</style>
