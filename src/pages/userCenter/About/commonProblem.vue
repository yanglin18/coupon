<template>
  <view class="content">
    <view class="title" id="title">常见问题</view>
    <view class="top">
      <uniCollapse @change="change">
        <uniCollapseItem
          class="collapse_item"
          :title="issue.title"
          :name="index"
          v-for="(issue, index) in issues"
          :key="index"
        >
          <view class="text">{{ issue.text }}</view></uniCollapseItem
        >
      </uniCollapse>
    </view>
  </view>
</template>
<script>
import uniCollapse from "@/components/uni-collapse/uni-collapse.vue";
import uniCollapseItem from "@/components/uni-collapse-item/uni-collapse-item.vue";
export default {
  components: {
    uniCollapse,
    uniCollapseItem
  },
  data() {
    return {
      issues: [
        {
          question: "在哪里可以购买星巴克？",
          answer:
            "API对接：用户买一个优惠券、系统需要先去A地址拿一个券码的账号、密码，然后再去B地址（是一个登陆页面）填上账号、密码后拿到对应的优惠券二维码并显示在客户端。A地址、B地址均由供应商提供，两个地址是固定的，且以上操作均由系统自动完成，非用户在客户端操作"
        },
        {
          question: "在哪里可以购买星巴克？",
          answer:
            "API对接：用户买一个优惠券、系统需要先去A地址拿一个券码的账号、密码，然后再去B地址（是一个登陆页面）填上账号、密码后拿到对应的优惠券二维码并显示在客户端。A地址、B地址均由供应商提供，两个地址是固定的，且以上操作均由系统自动完成，非用户在客户端操作"
        }
      ]
    };
  },
  onLoad() {
    uni.getStorage({
      key: "storage_key",
      success: res0 => {
        this.Ajax(
          "post",
          "member/user/question",
          { session3rd: res0.data.session3rd },
          res => {
            if (res.data.code === "200") {
              this.issues = res.data.data.list;
            }
          }
        );
      }
    });
  }
};
</script>
<style lang="scss" scoped>
.collapse_item {
}
.content {
  font-size: 36rpx;
  color: #000000;
  letter-spacing: 0.45px;
  /deep/.uni-collapse-cell__title-text {
    font-size: 36rpx;
    color: #000000;
    letter-spacing: 0.45px;
  }
}
.title {
  padding: 26rpx 40rpx 12rpx;
  font-size: 50rpx;
  letter-spacing: 0.62px;
  background: #ffffff;
}
.top {
  border-top: #f3f4f3 4px solid;
}
.text {
  padding: 16rpx 40rpx 40rpx;
  opacity: 0.6;
  font-size: 26rpx;
  color: #000000;
  letter-spacing: 0.43px;
  text-align: justify;
  line-height: 48rpx;
}
</style>
