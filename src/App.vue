<script>
export default {
  onLaunch: function() {
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
button{
	background: transparent;
	// 清除微信自带样式
	&::after{
		display: none;
	}
}
</style>
