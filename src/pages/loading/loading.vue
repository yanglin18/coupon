<template>
  <view class="content">
    <image src="../../static/assets/loading.gif" />
    <text>加载中...</text>
  </view>
</template>
<script>
export default {
    // 用户分享
  onShareAppMessage({ res }) {
    if (res.from === "button") {
      // 来自页面内分享按钮
    }
    return {
      title: "摩卡星",
      path: "/pages/index/index"
    };
  },
  onLoad() {
    uni.setNavigationBarColor({
      backgroundColor: "#F3F4F3",
      frontColor: "#000000"
    });
    uni.getSetting({
      success: succ => {
        if (succ.authSetting["scope.writePhotosAlbum"]) {
          uni.setStorage({
            key: "PhotoAlbum",
            data: "true"
          });
        }
      }
    });
    let obj = wx.getLaunchOptionsSync();
    uni.setStorage({
      key:"obj.query.pid",
      data:obj.query.pid
    })
    // 一个不用基本信息的登录判断是否是新用户
    uni.login({
      success: LoginRes => {
        this.Ajax(
          "post",
          "member/Login/getLogin",
          { brand_id: 1, channel: "wechat", code: LoginRes.code },
          res => {
            if (res.data.code === "200") {
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
              if (res.data.code === "0020") {
                // 将用户id或者游客id存到storage
                uni.setStorage({
                  key: "userID",
                  data: res.data.data.openid
                });
              }
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
