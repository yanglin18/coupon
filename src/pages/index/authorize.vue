<template>
  <view class="content">
    <view class="top">
      <text>允许微信授权后，可体验更多功能</text>
    </view>
    <view class="bottom">
      <button
        class="button1"
        open-type="getUserInfo"
        @getuserinfo="GetUserInfo"
      >
        授权基本信息
      </button>
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
    wx.hideHomeButton({
      success: res => {}
    });
  },
  onLoad() {
    uni.setNavigationBarColor({
      backgroundColor: "#F3F4F3",
      frontColor: "#000000"
    });
  },
  methods: {
    GetUserInfo(res) {
      if (res.detail.userInfo) {
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
        console.log("点击了拒绝授权");
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
    // 登录
    loginIn(user_info) {
      uni.getStorage({
        key: "obj.query.pid",
        success: pid => {
          this.objQueryPid = pid.data;
        }
      });
      uni.login({
        success: reslogin => {
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
                  uni.setStorageSync("hasLogin", true);
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
                }
              }
            );
          } else {
            console.log("登录失败！" + res.errMsg);
          }
        }
      });
    },
    backToIndex() {
      uni.switchTab({
        url: "./index"
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
