<template>
  <view class="content">
    <image src="../../static/assets/loading.gif" />
    <text>加载中...</text>
  </view>
</template>
<script>
export default {
  // 用户分享
  onShareAppMessage() {
    return {
      title: "我告诉你，这是喝星巴克最优惠的方式",
      path: "/pages/loading/loading",
      imageUrl: "../../static/images/shareCard.jpg"
    };
  },
  onShow() {
    // 无网络状态下进小程序跳转到无网络页面
    uni.getNetworkType({
      success: network => {
        if (network.networkType === "none") {
          uni.redirectTo({
            url: "/pages/loading/no_network"
          });
        }
      }
    });
    // 一个不用基本信息的登录判断是否是新用户
    // #ifdef  MP-WEIXIN
    uni.login({
      success: LoginRes => {
        this.Ajax(
          "post",
          "member/Login/getLogin",
          { brand_id: 1, channel: "wechat", code: LoginRes.code },
          res => {
            if (res.data.code === "200") {
              uni.setStorageSync("hasLogin", true);
              console.log("老顾客");
              uni.setStorage({
                key: "storage_key",
                data: res.data.data
              });
              if (res.data.data.mobile) {
                uni.setStorageSync("UserNumber", res.data.data.mobile);
              }
              uni.switchTab({
                url: "../index/index"
              });
              if(res.data.data.is_read ===0){
                getApp().globalData.is_read = false;
              }
              else{
                getApp().globalData.is_read = true;
              }
              
            } else {
              if (res.data.code === "0020") {
                // 将用户id或者游客id存到storage
                uni.setStorage({
                  key: "userID",
                  data: res.data.data.openid
                });
              }
              uni.setStorageSync("hasLogin", false);
              console.log("新顾客");
              uni.navigateTo({
                url: "../index/authorize"
              });
            }
          }
        );
      },
      fail: error => {}
    });
    // #endif
    // #ifdef  MP-ALIPAY
    uni.switchTab({
      url: "../index/index"
    });
    // #endif
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
    // #ifdef  MP-WEIXIN
    let obj = wx.getLaunchOptionsSync();
    uni.setStorage({
      key: "obj.query.pid",
      data: obj.query.pid
    });
    // #endif
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
