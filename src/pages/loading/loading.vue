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
      // #ifdef MP-BAIDU
      title: "摩卡星",
      // #endif
      // #ifndef MP-BAIDU
      title: "这是喝星吧克最优惠的一种方式",
      // #endif
      path: "/pages/loading/loading",
      desc: "星吧克咖啡电子优惠券售卖平台"
      // imageUrl: "../../static/assets/logo.png"
    };
  },
  onShow() {
    console.log("onshow执行");
    uni.clearStorage();
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

    //微信 一个不用基本信息的登录判断是否是新用户
    // #ifdef  MP-WEIXIN
    uni.login({
      success: LoginRes => {
        console.log("success");
        this.Ajax(
          "post",
          "member/Login/getLogin",
          { brand_id: 1, channel: "wechat", code: LoginRes.code },
          res => {
            if (res.data.code === "200") {
              uni.setStorageSync("hasLogin", 1);
              console.log("老用户");
              uni.setStorage({
                key: "storage_key",
                data: res.data.data
              });
              if (res.data.data.mobile) {
                uni.setStorageSync("UserNumber", res.data.data.mobile);
              }
              uni.switchTab({
                url: "/pages/index/index"
              });
              if (res.data.data.is_read === 0) {
                getApp().globalData.is_read = false;
              } else {
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
              uni.setStorageSync("hasLogin", 0);
              console.log("新用户");
              uni.navigateTo({
                url: "/pages/index/authorize"
              });
            }
          }
        );
      },
      fail: error => {}
    });
    // #endif
    // 支付宝判断是否新用户
    // #ifdef MP-ALIPAY
    my.getAuthCode({
      scopes: "auth_base",
      success: reslogin => {
        if (reslogin.authCode) {
          this.Ajax(
            "post",
            "member/Login/aligetLogin",
            {
              brand_id: 1,
              channel: "ali",
              code: reslogin.authCode
            },
            res => {
              console.log("调登录接口返回：", res);
              if (res.data.data.openid) {
                uni.setStorage({
                  key: "userID",
                  data: res.data.data.openid
                });
              }
              if (res.data.code === "200") {
                uni.setStorageSync("hasLogin", 1);
                uni.setStorage({
                  key: "storage_key",
                  data: res.data.data
                });
                if (res.data.data.mobile) {
                  uni.setStorageSync("UserNumber", res.data.data.mobile);
                }
                uni.switchTab({
                  url: "/pages/index/index"
                });
                if (res.data.data.is_read === 0) {
                  getApp().globalData.is_read = false;
                } else {
                  getApp().globalData.is_read = true;
                }
              } else {
                uni.navigateTo({
                  url: "/pages/index/authorize"
                });
              }
            }
          );
        } else {
          console.log("获取授权码失败！" + res.errMsg);
        }
      }
    });
    // #endif
  },

  onLoad() {
    console.log("onload执行");
    // #ifdef MP-BAIDU
    uni.login({
      success: LoginRes => {
        console.log("success");
        this.Ajax(
          "post",
          "member/Login/bdgetLogin",
          { brand_id: 1, channel: "baidu", code: LoginRes.code },
          res => {
            if (res.data.code === "200") {
              uni.setStorageSync("hasLogin", 1);
              console.log("老用户");
              uni.setStorage({
                key: "storage_key",
                data: res.data.data
              });
              if (res.data.data.mobile) {
                uni.setStorageSync("UserNumber", res.data.data.mobile);
              }
              uni.switchTab({
                url: "/pages/index/index"
              });
              if (res.data.data.is_read === 0) {
                getApp().globalData.is_read = false;
              } else {
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
              uni.setStorageSync("hasLogin", 0);
              console.log("新用户");
              uni.navigateTo({
                url: "/pages/index/authorize"
              });
            }
          }
        );
      },
      fail: error => {}
    });
    // #endif
    // #ifdef MP-TOUTIAO
    uni.login({
      success:LoginRes=>{
        console.log("头条登录成功的信息",LoginRes);
                this.Ajax(
          "post",
          "member/Login/bytegetLogin",
          { brand_id: 1, channel: "byte", code: LoginRes.code },
          res => {
            if (res.data.code === "200") {
              uni.setStorageSync("hasLogin", 1);
              console.log("老用户");
              uni.setStorage({
                key: "storage_key",
                data: res.data.data
              });
              if (res.data.data.mobile) {
                uni.setStorageSync("UserNumber", res.data.data.mobile);
              }
              uni.switchTab({
                url: "/pages/index/index"
              });
              if (res.data.data.is_read === 0) {
                getApp().globalData.is_read = false;
              } else {
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
              uni.setStorageSync("hasLogin", 0);
              console.log("新用户");
              uni.navigateTo({
                url: "/pages/index/authorize"
              });
            }
          }
        );
      }
    })
    // #endif
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
