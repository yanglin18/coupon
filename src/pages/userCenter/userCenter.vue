<template>
  <view class="content">
    <view class="top_card">
      <view class="title">
        <text>个人中心 </text>
      </view>
      <view class="bottom">
        <view class="left">
          <image src="../../static/images/user.jpg" />
          <text>{{ user_name }}</text>
        </view>
        <view class="right" @click="NavToModify">
          <text>修改资料</text>
          <image src="../../static/assets/toRight.png" />
        </view>
      </view>
    </view>
    <view class="about">
      <view class="service deline" @click="contactService">
        <view class="left">
          <image src="../../static/assets/service.png" />
          <text>联系客服</text>
        </view>
        <image src="../../static/assets/toRight.png" />
      </view>
      <view class="service" @click="NavTo('./about')">
        <view class="left">
          <image src="../../static/assets/about.png" />
          <text>关于</text>
        </view>

        <image src="../../static/assets/toRight.png" />
      </view>
    </view>
    <view class="share">分享海报 </view>
    <botton class="logout">退出登录</botton>
  </view>
</template>
<script>
export default {
  data() {
    return {
      user_icon: "../../static/images/user.png",
      user_name: "喵喵喵",
      gender: "男",
      phoneNumber: "12345678212",
      weixin: "XXXXXX"
    };
  },
  onLoad() {
    uni.login({
      provider: "weixin",
      success: function(loginRes) {
        console.log(loginRes);
        // 获取用户信息
      }
    });
  },
  methods: {
    contactService() {
      uni.showModal({
        content: "星小孩（微信号：960411wsy）",
        confirmText: "我知道了",
        showCancel: false,
        confirmColor: "#42B069",
        success(res) {}
      });
    },
    NavTo(e) {
      uni.navigateTo({
        url: e
      });
    },
    NavToModify() {
      let name = this.user_name;
      let icon = this.user_icon;
      let gender = this.gender;
      let phoneNumber = this.phoneNumber;
      let weixin = this.weixin;
      uni.navigateTo({
        url:
          "./modifyData?name=" +
          name +
          "&icon=" +
          icon +
          "&gender=" +
          gender +
          "&phoneNumber=" +
          phoneNumber +
          "&weixin=" +
          weixin
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.content {
  background: #f3f4f3;
  height: 100vh;
}
.top_card {
  background: #ffffff;
  padding: 26rpx 40rpx 50rpx;
  .title {
    font-size: 50rpx;
    color: #000000;
    font-weight: 600;
    line-height: 70rpx;
  }
  .bottom {
    display: flex;
    margin-top: 40rpx;
    justify-content: space-between;
    .left {
      display: flex;
      flex-direction: row;
      align-items: center;
      image {
        height: 120rpx;
        width: 120rpx;
        border-radius: 50%;
        margin-right: 24rpx;
      }
      text {
        font-size: 40rpx;
        color: #000000;
        letter-spacing: 0.5px;
      }
    }
    .right {
      display: flex;
      align-items: center;
      text {
        opacity: 0.4;
        font-size: 26rpx;
        color: #000000;
        letter-spacing: 0.32px;
      }
      image {
        height: 25rpx;
        width: 25rpx;
        margin-left: 19rpx;
      }
    }
  }
}
.about {
  margin-top: 20rpx;
  background: #ffffff;
  padding: 0 50rpx 0 40rpx;
  .service {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding: 30rpx 0;
    font-size: 30rpx;
    color: #000000;
    letter-spacing: 0.38px;
    .left {
      display: flex;
      flex-direction: row;
      align-items: center;
    }
    image {
      height: 26rpx;
      width: 26rpx;
      margin-right: 12rpx;
    }
  }
  .deline {
    border-bottom: 0.5px solid rgba(97, 97, 97, 0.2);
  }
}
.share {
  height: 260rpx;
  margin: 16rpx 40rpx 0;
  background: #ffffff;
  border-radius: 16rpx;
  color: #ffffff;
}
.logout {
  display: inline-block;
  padding: 20rpx 203rpx;
  margin: 50rpx 110rpx 0 !important;
  border: 2rpx solid #00b360;
  border-radius: 40rpx;
  font-size: 30rpx;
  color: #00b35f;
  letter-spacing: 0;
}
</style>
