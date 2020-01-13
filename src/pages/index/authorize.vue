<template>
  <view class="content">
    <view class="top">
      <!-- #ifdef MP-WEIXIN -->
      <text>允许微信授权后，可体验更多功能</text>
      <!-- #endif -->
      <!-- #ifdef MP-ALIPAY -->
      <text>允许支付宝授权后，可体验更多功能</text>
      <!-- #endif -->
      <!-- #ifdef MP-BAIDU -->
      <text>允许百度授权后，可体验更多功能</text>
      <!-- #endif -->
    </view>
    <view class="bottom">
      <!--#ifndef MP-ALIPAY-->
      <button
        class="button1"
        open-type="getUserInfo"
        @getuserinfo="GetUserInfo"
        @click="ByteLoginIn"
      >
        授权基本信息
      </button>
      <!-- #endif -->
      <!--#ifdef MP-ALIPAY-->
      <button
        class="button1"
        open-type="getAuthorize"
        @getAuthorize="onGetAuthorize"
        @error="onAuthError"
        scope="userInfo"
      >
        授权基本信息
      </button>
      <!-- #endif -->
      <button class="button2" @click="backToIndex">跳过</button>
    </view>
  </view>
</template>
<script>
export default {
  data() {
    return {
      is_getuserInfo: false,
      objQueryPid: ""
    };
  },
  onShow() {
    // #ifdef  MP-WEIXIN
    wx.hideHomeButton({
      success: res => {}
    });
    // #endif
  },
  onLoad() {
    uni.setNavigationBarColor({
      backgroundColor: "#F3F4F3",
      frontColor: "#000000"
    });
  },
  methods: {
    GetUserInfo(res) {
      if (res.detail.iv) {
        console.log("点击了同意基本信息授权", res);
        this.is_getuserInfo = true;
        // 记录同意授权的人
        uni.getStorage({
          key: "userID",
          success: success => {
            this.Record(
              {
                openId: success.data,
                event_type: 1,
                result: 1,
                order_id: "",
                msg: ""
              },
              record => {}
            );
          }
        });
        this.loginIn(res.detail);
      } else {
        console.log("点击了拒绝授权", res);
        // record拒绝授权的人
        uni.getStorage({
          key: "userID",
          success: success => {
            this.Record(
              {
                openId: success.data,
                event_type: 1,
                result: 0,
                order_id: "",
                msg: ""
              },
              record => {}
            );
          }
        });
      }
    },
    onGetAuthorize(res) {
      my.getOpenUserInfo({
        success: resInfo => {
          let userInfo = JSON.parse(resInfo.response).response;
          console.log("QQQQ", userInfo);
          this.loginIn(userInfo);
        },
        error: e => {
          console.log("错误信息", e);
        }
      });
    },
    // 头条的获取基本信息和登录
    ByteLoginIn() {
      // #ifdef MP-TOUTIAO
      uni.login({
        success: reslogin => {
          console.log("登录成功！", reslogin);
          uni.setStorageSync("resloginCode", reslogin.code);
          tt.getUserInfo({
            withCredentials: true,
            success: userinfo => {
              if (reslogin.code) {
                this.Ajax(
                  "post",
                  "member/Login/bytegetLogin",
                  {
                    brand_id: 1,
                    channel: "byte",
                    code: reslogin.code,
                    detail: userinfo
                  },
                  res => {
                    console.log("调登录接口返回：", res);
                    if (res.data.code === "200") {
                      uni.setStorageSync("hasLogin", 1);
                      uni.setStorage({
                        key: "storage_key",
                        data: res.data.data,
                        success: function(e) {}
                      });
                      if (res.data.data.mobile) {
                        uni.setStorageSync("UserNumber", res.data.data.mobile);
                      }
                      uni.setStorageSync("isAuthorizeLogin", true);
                      uni.switchTab({
                        url: "./index"
                      });
                      if (res.data.data.is_read === 0) {
                        getApp().globalData.is_read = false;
                      } else {
                        getApp().globalData.is_read = true;
                      }
                    } else {
                    }
                  }
                );
              } else {
                console.log("登录失败！" + res.errMsg);
              }
            },
            fail(res) {
              console.log(`getUserInfo 调用失败`);
            }
          });
        }
      });
      // #endif
    },
    // 登录
    loginIn(user_info) {
      uni.getStorage({
        key: "obj.query.pid",
        success: pid => {
          this.objQueryPid = pid.data;
        }
      });
      // 支付宝
      // #ifdef MP-ALIPAY
      my.getAuthCode({
        scopes: "auth_base",
        success: reslogin => {
          console.log("授权码为:", reslogin);
          if (reslogin.authCode) {
            this.Ajax(
              "post",
              "member/Login/aligetLogin",
              {
                brand_id: 1,
                channel: "ali",
                code: reslogin.authCode,
                detail: user_info,
                pid: 0
              },
              res => {
                console.log("调登录接口返回：", res);
                if (res.data.code === "200") {
                  uni.setStorageSync("hasLogin", 1);
                  uni.setStorage({
                    key: "storage_key",
                    data: res.data.data
                  });
                  if (res.data.data.mobile) {
                    uni.setStorageSync("UserNumber", res.data.data.mobile);
                  }
                  uni.setStorageSync("isAuthorizeLogin", true);
                  uni.switchTab({
                    url: "/pages/index/index"
                  });
                  if (res.data.data.is_read === 0) {
                    getApp().globalData.is_read = false;
                  } else {
                    getApp().globalData.is_read = true;
                  }
                }
              }
            );
          } else {
            console.log("登录失败！" + res.errMsg);
          }
        }
      });
      // #endif
      // 微信
      // #ifdef MP-WEIXIN
      uni.login({
        success: reslogin => {
          console.log("resLogin:", reslogin);
          if (reslogin.code) {
            this.Ajax(
              "post",
              "member/Login/getLogin",
              {
                brand_id: 1,
                channel: "wechat",
                code: reslogin.code,
                detail: user_info,
                pid: this.objQueryPid || 0
              },
              res => {
                console.log("调登录接口返回：", res);
                if (res.data.code === "200") {
                  uni.setStorageSync("hasLogin", 1);
                  uni.setStorage({
                    key: "storage_key",
                    data: res.data.data,
                    success: function(e) {}
                  });
                  if (res.data.data.mobile) {
                    uni.setStorageSync("UserNumber", res.data.data.mobile);
                  }
                  uni.setStorageSync("isAuthorizeLogin", true);
                  uni.switchTab({
                    url: "./index"
                  });
                  if (res.data.data.is_read === 0) {
                    getApp().globalData.is_read = false;
                  } else {
                    getApp().globalData.is_read = true;
                  }
                }
              }
            );
          } else {
            console.log("登录失败！" + res.errMsg);
          }
        }
      });
      // #endif
      // #ifdef MP-BAIDU
      uni.login({
        success: reslogin => {
          console.log("resLogin:", reslogin);
          if (reslogin.code) {
            this.Ajax(
              "post",
              "member/Login/bdgetLogin",
              {
                brand_id: 1,
                channel: "baidu",
                code: reslogin.code,
                detail: user_info,
                pid: this.objQueryPid || 0
              },
              res => {
                console.log("调登录接口返回：", res);
                if (res.data.code === "200") {
                  uni.setStorageSync("hasLogin", 1);
                  uni.setStorage({
                    key: "storage_key",
                    data: res.data.data,
                    success: function(e) {}
                  });
                  if (res.data.data.mobile) {
                    uni.setStorageSync("UserNumber", res.data.data.mobile);
                  }
                  uni.setStorageSync("isAuthorizeLogin", true);
                  uni.switchTab({
                    url: "./index"
                  });
                  if (res.data.data.is_read === 0) {
                    getApp().globalData.is_read = false;
                  } else {
                    getApp().globalData.is_read = true;
                  }
                }
              }
            );
          } else {
            console.log("登录失败！" + res.errMsg);
          }
        }
      });
      // #endif
    },
    backToIndex() {
      console.log("backToIndex");
      uni.switchTab({
        url: "/pages/index/index"
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.content {
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  .top {
    padding-top: 424rpx;
    margin: 0 auto;
    text {
      opacity: 0.6;
      font-size: 30rpx;
      color: #000000;
      text-align: center;
      line-height: 52rpx;
    }
  }
  .bottom {
    padding-bottom: 394rpx;
    margin: 0 auto;
    .button1 {
      background: #42b069;
      border-radius: 44rpx;
      font-size: 30rpx;
      color: #f8f8f8;
      text-align: center;
      width: 630rpx;
      margin-bottom: 30rpx;
      height: 88rpx;
      line-height: 88rpx;
    }
    .button2 {
      display: flex;
      align-items: center;
      justify-content: center;
      border: 2rpx solid #00b265;
      border-radius: 40rpx;
      font-size: 30rpx;
      color: #42b069;
      width: 630rpx;
      height: 80rpx;
      line-height: 80rpx;
    }
  }
}
</style>
