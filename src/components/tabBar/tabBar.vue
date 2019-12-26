<template>
  <view
    class="tabBar"
    v-bind:style="{
      height: tabHeight + 'px',
      background: 'url(' + banner + ')no-repeat center/cover',
    }"
  >
    <view v-for="(tab, index) in tabs" :key="index" class="tabBarItem">
      <navigator
        :url="tab.pagePath"
        open-type="switchTab"
        class="oneTab"
        hover-class="none"
      >
        <image
          class="i_active"
          :src="tab.active ? tab.selectedIconPath : tab.iconPath"
        ></image>
        <text :class="tab.active ? 'active' : ''">{{ tab.text }}</text>
        <view v-if="isIosX" style="height:28px;width:100%"></view>
      </navigator>
    </view>
  </view>
</template>
<script>
export default {
  props: ["banner"],
  data() {
    const app = getApp();
    return {
      page: "",
      navHeight: app.globalData.navHeight,
      tabHeight: app.globalData.tabHeight,
      isIosX:app.globalData.isIosX,
      tabs: [
        {
          pagePath: "../../pages/index/index",
          iconPath: "../../static/tabs/index_u.png",
          selectedIconPath: "../../static/tabs/index.png",
          text: "摩卡星",
          active: false
        },
        {
          pagePath: "../../pages/myCardBug/cardList",
          iconPath: "../../static/tabs/myCardBug_u.png",
          selectedIconPath: "../../static/tabs/myCardBug.png",
          text: "我的卡券",
          active: false
        },
        {
          pagePath: "../../pages/userCenter/userCenter",
          iconPath: "../../static/tabs/userCenter_u.png",
          selectedIconPath: "../../static/tabs/userCenter.png",
          text: "星中心",
          active: false
        }
      ]
    };
  },

  created() {
    this.page = getCurrentPages()[0].route;
    console.log(this.page);
  },
  watch: {
    page(val) {
      switch (val) {
        case "pages/index/index":
          this.tabs[0].active = true;
          this.tabs[1].active = false;
          this.tabs[2].active = false;
          break;
        case "pages/myCardBug/cardList":
          this.tabs[0].active = false;
          this.tabs[1].active = true;
          this.tabs[2].active = false;
          break;
        case "pages/userCenter/userCenter":
          this.tabs[0].active = false;
          this.tabs[1].active = false;
          this.tabs[2].active = true;
          break;
      }
    }
  },
  methods: {}
};
</script>
<style lang="scss" scoped>
.tabBar {
  display: flex;
  justify-content: space-around;
  border-top: #EEEDEA solid 1px;
  .tabBarItem {
    flex: 1;
    display: flex;
    justify-content: center;
    .oneTab {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      // padding-bottom: 35rpx;
      // margin-top: -40rpx;
      // padding-top: 10rpx;
      image {
        height: 48rpx;
        width: 48rpx;
      }
      text {
        font-size: 22rpx;
        color: #666666;
        letter-spacing: -0.53px;
      }
      .active {
        color: #00b35f;
      }
    }
  }
}
</style>
