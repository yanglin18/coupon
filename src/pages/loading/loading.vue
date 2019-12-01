<template>
  <view class="content">
    <image src="../../static/assets/loading.gif" />
    <text>加载中...</text>
  </view>
</template>
<script>
export default {
  onLoad() {
    // 一个不用基本信息的登录判断是否是新用户
    uni.login({
      success: LoginRes => {
        this.Ajax(
          "post",
          "member/Login/getLogin",
          { brand_id: 1, channel: "wechat", code: LoginRes.code },
          res => {
            if (res.data.data.length !== 0) {
              uni.setStorageSync("hasLogin", true);
              console.log("不是第一次来的顾客");
              uni.setStorage({
                key: "storage_key",
                data: res.data.data
              });
              uni.setStorage({
                key: "UserNumber",
                data: res.data.data.mobile
              });
              uni.switchTab({
                url: "../index/index"
              });
            } else {
              uni.setStorageSync("hasLogin", false);
              console.log("是第一次来的顾客");
              uni.navigateTo({
                url: "../index/authorize"
              });
            }
          }
        );
      },
      fail: error => {}
    });
  }
};
</script>
<style lang="scss" scoped>
.content {
  height: 100vh;
  display: flex;
  margin-top: -150rpx;
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
