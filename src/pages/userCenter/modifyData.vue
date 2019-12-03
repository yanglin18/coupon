<template>
  <view class="content">
    <view class="title" id="title">个人信息</view>
    <view class="top">
      <view class="row1" @click="Toast(1)">
        <text>头像</text>
        <image :src="user_info.head_img" />
      </view>
      <view class="row" @click="Toast(2)">
        <text>昵称</text>
        <text class="right">{{ user_info.user_name }}</text>
      </view>
      <view class="row" @click="Toast(3)">
        <text>性别</text>
        <text class="right">{{ user_info.gender > 1 ? "女" : "男" }}</text>
      </view>
      <view class="row" @click="Toast(4)">
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
          :value="birthday"
          :start="startDate"
          :end="endDate"
          @change="bindDateChange"
        >
          <view class="uni-input">{{ birthday }} </view>
        </picker>
        <text v-else class="right" @click="Toast(5)">{{
          user_info.birthday
        }}</text>
      </view>
    </view>
    <button v-show="!user_info.birthday && user_info.birthday !== '请选择生日'" @click="saveChange" class="save">保存</button>
  </view>
</template>
<script>
export default {
  data() {
    return {
      userData: {},
      startDate: "1900-00-00",
      endDate: "2019-00-00",
      user_info: {},
      birthday: "请选择生日"
    };
  },
  onLoad(e) {
    this.userData = e;
    // this.birthday = "2000-01-01";
    this.userData.icon = "../../static/images/user.jpg";
    this.getUserInfo();
    uni.setNavigationBarColor({
      backgroundColor: "#ffffff",
      frontColor: "#000000"
    });
  },
    // 用户分享
  onShareAppMessage({ res }) {
    return {
      title: "摩卡星",
      path: "/pages/loading/loading"
    };
  },
  methods: {
    bindDateChange(e) {
      this.birthday = e.detail.value;
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
                if (!that.user_info.birthday) {
                  that.user_info.birthday = "请选择生日";
                }
              }
              console.log("用户数据：", that.user_info);
            }
          );
        }
      });
    },
    saveChange() {
      uni.showModal({
        title: "",
        content: "生日信息保存后不可更改，您确定要保存吗？",
        confirmColor: "#42b069",
        success: resShowModel => {
          if (resShowModel.confirm) {
            uni.getStorage({
              key: "storage_key",
              success: res0 => {
                this.Ajax(
                  "post",
                  "member/user/set_field",
                  {
                    session3rd: res0.data.session3rd,
                    field: "birthday",
                    data: this.birthday
                  },
                  res => {
                    if (res.data.code === "200") {
                      uni.showToast({
                        title: "保存成功"
                      });
                      uni.navigateBack();
                    } else {
                      uni.showToast({
                        title: "保存失败"
                      });
                    }
                  }
                );
              }
            });
          }
          else{

          }
        }
      });
    },
    Toast(type) {
      let title;
      switch (type) {
        case 1:
          title = "头像不可修改";
          break;
        case 2:
          title = "昵称不可修改";
          break;
        case 3:
          title = "性别不可修改";
          break;
        case 4:
          title = "绑定手机不可修改";
          break;
        case 5:
          title = "生日只可修改1次";
          break;
      }
      uni.showToast({
        title: title,
        duration: 1000,
        icon: "none"
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.content {
  background: #f3f4f3;
  min-height: 100vh;
  color: #000000;
}
.title {
  padding: 26rpx 40rpx 16rpx;
  font-size: 50rpx;
  letter-spacing: 0.62px;
  background: #ffffff;
  font-weight: bold;
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
    height: 60rpx;
    border-bottom: 1px solid #eaeaea;
    image {
      border-radius: 50%;
      height: 60rpx;
      width: 60rpx;
    }
    text {
      line-height: 30rpx;
      padding-top: 12rpx;
    }
  }
  .row {
    padding: 30rpx 0;
    height: 42rpx;
    border-bottom: 1px solid #eaeaea;
    display: flex;
    justify-content: space-between;
    .right {
      opacity: 0.4;
      letter-spacing: 0.38px;
      text-align: right;
    }
    &:last-child {
      border-bottom: 0;
    }
  }
}
.save {
  height: 80rpx;
  width: 530rpx;
  line-height: 80rpx;
  border: 2rpx solid #00b360;
  border-radius: 40rpx;
  font-size: 30rpx;
  color: #00b35f;
  margin-top: 60rpx;
}
</style>
