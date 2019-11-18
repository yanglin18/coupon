<script>
export default {
  onLaunch: function() {
    uni.authorize({
      scope: "scope.userInfo",
      success() {
		  console.log("userinfo")
        uni.getuserInfo();
      }
    });
  },
  onShow: function() {
    console.log("App Show");
  },
  onHide: function() {
    console.log("App Hide");
  }
};
</script>

<style>
/*每个页面公共css */
</style>
