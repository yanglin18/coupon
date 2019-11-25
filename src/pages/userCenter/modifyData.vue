<template>
  <view class="content">
    <view class="title" id="title">修改资料</view>
    <view class="top">
      <view class="row1">
        <text>头像</text>
        <image :src="userData.icon" />
      </view>
      <view class="row">
        <text>昵称</text>
        <text class="right">{{ userData.name }}</text>
      </view>
      <view class="row">
        <text>性别</text>
        <text class="right">{{ userData.gender }}</text>
      </view>
      <view class="row">
        <text>绑定手机</text>
        <text class="right">{{ userData.phoneNumber }}</text>
      </view>
      <view class="row">
        <text>生日</text>
        <!-- <text class="right" v-if="birthday!=='请选择生日'">{{
          birthday
        }}</text> -->
        <picker
          mode="date"
          :value="birthday"
          :start="startDate"
          :end="endDate"
          @change="bindDateChange"
        >
          <view class="uni-input">{{ birthday }}</view>
        </picker>
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
      birthday:"请选择生日"
    };
  },
  onLoad(e) {
    this.userData = e;
    // this.birthday = "2000-01-01";
    this.userData.icon = "../../static/images/user.jpg";
  },
  methods: {
    bindDateChange(e) {
        console.log("e:",e)
      this.birthday = e.detail.value;
      console.log(this.birthday)
    },
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
