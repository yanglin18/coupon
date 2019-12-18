<script>
export default {
  onLaunch: function() {
    uni.getSystemInfo({
      success: res => {
        console.log("设备信息：", res);
        this.globalData.statusBarHeight = res.statusBarHeight; //状态栏的高度
        if (res.system.substring(0, 7) === "Android") {
          let bread = res.model.substring(0, 8);
          this.globalData.navHeight = 68; //自定义的顶部导航栏总高度
          this.globalData.tabHeight = 54;
        } else {
          let bread = res.model.substring(0, 8);
          console.log("型号：", bread);
          if (res.screenHeight >= 810) {
            this.globalData.navHeight = 88;
            this.globalData.tabHeight = 82;
            this.globalData.isIosX = true;
          } else {
            this.globalData.navHeight = 64;
            this.globalData.tabHeight = 48;
          }
        }
      }
    });
    console.log("APP Launch");
  },
  onShow: function() {
    console.log("App Show");
    
  },
  onHide: function() {
    console.log("App Hide");
  },
  globalData: {
    share: false
  }
};
</script>

<style lang="scss">
/*每个页面公共css */
* {
  font-family: "PingFangSC-Regular", "webfont", "Helvetica Neue", Helvetica,
    "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
}
.tabBarIcon {
  image {
    height: 44rpx;
    width: 46rpx;
  }
}
button {
  background: transparent;
  // 清除微信自带样式
  &::after {
    display: none;
  }
}

.allBgImg {
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  z-index: -1;
  box-sizing: border-box;
}
</style>
