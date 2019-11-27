<template>
  <view class="content">
    <view class="title" id="title">修改资料</view>
    <view class="top">
      <view class="row1" @click="Toast">
        <text>头像</text>
        <image :src="user_info.head_img" />
      </view>
      <view class="row" @click="Toast">
        <text>昵称</text>
        <text class="right">{{ user_info.user_name }}</text>
      </view>
      <view class="row" @click="Toast">
        <text>性别</text>
        <text class="right">{{ user_info.gender }}</text>
      </view>
      <view class="row" @click="Toast">
        <text>绑定手机</text>
        <text class="right">{{ user_info.mobile }}</text>
      </view>
      <view class="row">
        <text>生日</text>
        <!-- <text class="right" v-if="birthday!=='请选择生日'">{{
          birthday
        }}</text> -->
        <picker
          v-if="user_info.birthday === '请选择生日'"
          mode="date"
          :value="user_info.birthday"
          :start="startDate"
          :end="endDate"
          @change="bindDateChange"
        >
          <view class="uni-input">{{ user_info.birthday }} </view>
        </picker>
        <text  v-else class="right">{{
          user_info.birthday
        }}</text>
      </view>
    </view>
  </view>
</template>
<script>
export default {
  data() {
    return {
      userData: {},
      startDate: "1900-00-00",
      endDate: "2019-00-00",
      user_info: {}
    };
  },
  onLoad(e) {
    this.userData = e;
    // this.birthday = "2000-01-01";
    this.userData.icon = "../../static/images/user.jpg";
    this.getUserInfo();
  },
  methods: {
    bindDateChange(e) {
      // uni.showToast({
      //   title: "生日只能修改一次，请确认无误",
      //   duration: 1000,
            // icon:"none"
      // });
      console.log("e:", e);
      this.user_info.birthday = e.detail.value;
      uni.getStorage({
        key: "storage_key",
        success: res0 => {
          this.Ajax(
            "post",
            "member/user/set_field",
            {
              session3rd: res0.data.session3rd,
              field: "birthday",
              data: this.user_info.birthday
            },
            res => {
              if (res.data.code === "200") {
                console.log("修改生日结果：", res);
              }
            }
          );
        }
      });
    },
    // 获取基本信息
    getUserInfo() {
      let that = this;
      let session3rd = "";
      uni.getStorage({
        key: "storage_key",
        success: res0 => {
          that.Ajax(
            "post",
            "member/user/index",
            { session3rd: res0.data.session3rd },
            res => {
              if (res.data.code === "200") {
                that.user_info = res.data.data.info;
                console.log(
                  "that.user_info.birthday:",
                  that.user_info.birthday
                );
                if (!that.user_info.birthday) {
                  that.user_info.birthday = "请选择生日";
                }
                console.log("user_info:", this.user_info);
              }
            }
          );
        }
      });
    },
    Toast() {
      uni.showToast({
        title: "头像昵称性别不可修改",
        duration: 1000,
        icon:'none'
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.content {
  background: #f3f4f3;
  // height: 100vh;
  color: #000000;
}
.title {
  padding: 26rpx 40rpx 16rpx;
  font-size: 50rpx;
  letter-spacing: 0.62px;
  background: #ffffff;
}
.top {
  background: #ffffff;
  margin-top: 22rpx;
  padding: 0 40rpx;
  font-size: 30rpx;
  color: #000000;
  letter-spacing: 0.38px;
  .row1 {
    display: flex;
    justify-content: space-between;
    padding: 21rpx 0;
    border-bottom: 1px solid rgba(97, 97, 97, 0.2);
    image {
      height: 60rpx;
      width: 60rpx;
    }
  }
  .row {
    padding: 30rpx 0;
    border-bottom: 1px solid rgba(97, 97, 97, 0.2);
    display: flex;
    justify-content: space-between;
    .right {
      opacity: 0.4;
      letter-spacing: 0.38px;
      text-align: right;
    }
  }
}
</style>
