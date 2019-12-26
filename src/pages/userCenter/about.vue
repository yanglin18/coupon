<template>
  <view class="content">
    <view class="title">关于</view>
    <view class="top">
      <view class="row" @click="NavTo('./About/aboutMKX')">
        <text>关于摩卡星</text>
        <image src="../../static/assets/toRight.png" />
      </view>
      <view class="row" @click="NavTo('./About/privacyPolicy')">
        <text>隐私保护政策</text>
        <image src="../../static/assets/toRight.png" />
      </view>
      <!-- #ifdef MP-WEIXIN -->
      <button
        :open-type="hasLogin ? '' : 'getUserInfo'"
        @getuserinfo="GetUserInfo"
        class="rowButton"
        @click="NavTo('./About/commonProblem')"
      >
        <text>常见问题</text>
        <image src="../../static/assets/toRight.png" />
      </button>
      <!-- #endif -->
      <!-- #ifdef MP-ALIPAY -->
      <button
        :open-type="hasLogin ? '' : 'getAuthorize'"
        @getAuthorize="onGetAuthorize"
        class="rowButton"
        @click="NavTo('./About/commonProblem')"
        scope="userInfo"
      >
        <text>常见问题</text>
        <image src="../../static/assets/toRight.png" />
      </button>
      <!-- #endif -->
    </view>
  </view>
</template>
<script>
export default {
  data() {
    return {
      hasLogin: false,
      UserInfo: {},
      objQueryPid: ""
    };
  },
  onLoad() {
    uni.setNavigationBarColor({
      backgroundColor: "#ffffff",
      frontColor: "#000000"
    });
    let h = uni.getStorageSync("hasLogin");
    if (h) {
      this.hasLogin = true;
    }
  },
  // 用户分享
  onShareAppMessage() {
    return {
      title: "我告诉你，这是喝星巴克最优惠的方式",
      path: "/pages/loading/loading",
      imageUrl: "../../static/images/shareCard.jpg"
    };
  },
  methods: {
    NavTo(e) {
      if (e === "./About/commonProblem") {
        if (!this.hasLogin) {
          return;
        }
      }
      uni.navigateTo({
        url: e
      });
    },
    onGetAuthorize() {
      my.getOpenUserInfo({
        success: resInfo => {
          let userInfo = JSON.parse(resInfo.response).response;
          console.log("获取基本信息返回", userInfo);
          this.loginIn(userInfo);
        },
        error: e => {
          console.log("错误信息", e);
        }
      });
    },
    // 获取基本信息授权
    GetUserInfo(res) {
      console.log(res);
      if (res.detail.userInfo) {
        console.log("点击了同意基本信息授权");
        this.UserInfo = res.detail;
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
        this.loginIn();
      } else {
        console.log("点击了拒绝授权");
        // 记录拒绝授权的人
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
    // 登录
    loginIn(user_info) {
      uni.getStorage({
        key: "obj.query.pid",
        success: pid => {
          this.objQueryPid = pid.data;
        }
      });
      // #ifdef MP-WEIXIN
      uni.login({
        success: reslogin => {
          console.log("登录返回：", reslogin);
          if (reslogin.code) {
            this.Ajax(
              "post",
              "member/Login/getLogin",
              {
                brand_id: 1,
                channel: "wechat",
                code: reslogin.code,
                detail: this.UserInfo,
                pid: this.objQueryPid || 0
              },
              res => {
                console.log("调登录接口返回：", res);

                if (res.data.code === "200") {
                  this.get;
                  uni.setStorageSync("hasLogin", true);
                  this.hasLogin = true;
                  uni.setStorage({
                    key: "storage_key",
                    data: res.data.data
                  });
                  if (res.data.data.mobile) {
                    uni.setStorageSync("UserNumber", res.data.data.mobile);
                  }
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
                  uni.setStorageSync("hasLogin", true);
                  uni.setStorage({
                    key: "storage_key",
                    data: res.data.data
                  });
                  if (res.data.data.mobile) {
                    uni.setStorageSync("UserNumber", res.data.data.mobile);
                  }
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
  font-weight: bold;
}
.top {
  margin-top: 10rpx;
  background: #ffffff;
  padding: 0 50rpx 0 40rpx;
  .row {
    padding: 30rpx 0;
    display: flex;
    justify-content: space-between;
    border-bottom: 0.5px solid rgba(97, 97, 97, 0.2);
    text {
      letter-spacing: 0.38px;
      font-size: 30rpx;
    }
    image {
      height: 25rpx;
      width: 15rpx;
      margin: auto 0;
    }
  }
  .rowButton {
    padding: 13rpx 0;
    margin: 0;
    display: flex;
    justify-content: space-between;
    border-bottom: 0.5px solid rgba(97, 97, 97, 0.2);
    border: none;
    text {
      letter-spacing: 0.38px;
      font-size: 30rpx;
    }
    image {
      height: 25rpx;
      width: 15rpx;
      margin: auto 0;
    }
    &:after {
      border: none;
    }
    &:last-child {
      border-bottom: none;
    }
  }
}
</style>
