<template>
  <view class="content">
    <view class="title" id="title">常见问题</view>
    <view class="top">
      <view
        class="questionBox"
        v-for="(item, index) in issues"
        :key="index"
        @click="showValEvent(item)"
      >
        <view class="questionBox-title">
          <text>{{ item.title }}</text>
          <image
            src="../../../static/assets/toTop.png"
            mode=""
            v-show="item.showAllVal"
          ></image>
          <image
            src="../../../static/assets/toBottom.png"
            mode=""
            v-show="!item.showAllVal"
          ></image>
        </view>
        <view class="questionBox-ellipsisVal" v-if="!item.showAllVal">{{
          item.text
        }}</view>
        <view class="questionBox-allVal" v-if="item.showAllVal">{{
          item.text
        }}</view>
      </view>
    </view>
  </view>
</template>
<script>
export default {
  data() {
    return {
      issues: []
    };
  },
  onShow() {
    uni.getStorage({
      key: "storage_key",
      success: res0 => {
        this.Ajax(
          "post",
          "member/user/question",
          { session3rd: res0.data.session3rd },
          res => {
            if (res.data.code === "200") {
              this.issues = res.data.data.list.map(item => {
                item.showAllVal = false;
                return item;
              });
            }
          }
        );
      }
    });
  },
  onLoad() {
    uni.setNavigationBarColor({
      backgroundColor: "#FFFFFF",
      frontColor: "#000000"
    });
  },
  methods: {
    showValEvent(item) {
      item.showAllVal = !item.showAllVal;
    }
  }
};
</script>
<style lang="scss" scoped>
.content {
  font-size: 36rpx;
  color: #000000;
  letter-spacing: 0.45px;
  min-height: 100vh;
  background: #f3f4f3;
}
.title {
  padding: 26rpx 40rpx 12rpx;
  font-size: 50rpx;
  letter-spacing: 0.62px;
  font-weight: bold;
  background: #ffffff;
}
.top {
  border-top: 4px solid #f3f4f3;
  .questionBox {
    padding: 40rpx;
    margin-bottom: 16rpx;
    background: #fff;
    .questionBox-title {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 12rpx;
      text {
        font-size: 36rpx;
        letter-spacing: 0.45rpx;
      }
      image {
        width: 25rpx;
        height: 15rpx;
      }
    }
    .questionBox-allVal,
    .questionBox-ellipsisVal {
      opacity: 0.6;
      font-size: 26rpx;
      color: #000000;
      letter-spacing: 0.43rpx;
      text-align: justify;
      line-height: 48rpx;
    }

    .questionBox-ellipsisVal {
      width: 100%;
      overflow: hidden;
      display: -webkit-box;
      word-break: break-all;
      text-overflow: ellipsis;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
    }
  }
}
</style>
