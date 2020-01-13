<template>
  <view
    class="navigation"
    v-bind:style="{
      height: navHeight + 'px',
      background: 'url(' + navBg + ') no-repeat center/cover'
    }"
  >
    <view
      class="tool_bar"
      v-bind:style="{ height: statusBarHeight + 'px' }"
      style="height:40rpx"
    ></view>
    <view class="title">
      <text>{{ title }}</text>
    </view>
  </view>
</template>
<script>
export default {
  props: ["status_img", "title"],
  computed: {
    navBg() {
      return this.status_img;
    }
  },
  data() {
    const app = getApp();
    return {
      navHeight: app.globalData.navHeight,
      // title: "自定义的状态栏",
      statusBarHeight: app.globalData.statusBarHeight
    };
  },
  created() {
    console.log(this.title);
  },
  onLoad() {
    console.log("状态栏高度：", this.navHeight);
  },
  methods: {}
};
</script>
<style lang="scss" scoped>
.navigation {
  // height:
  position: fixed;
  top: 0;
  left: 0;
  // z-index: 999;
  width: 100vw;
  height: var(--status-bar-height);
  background: #ffffff;

  .title {
    width: 100%;
    margin: 0 auto;
    text-align: center;
    position: absolute;
    // left: 50%;
    // transform: translateX(-50%);
  }
}
</style>
