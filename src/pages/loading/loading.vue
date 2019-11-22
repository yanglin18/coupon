<template>
  <view>
    loadding~
  </view>
</template>
<script>
export default {
  onLoad() {
      console.log("loadding")
    setTimeout(function () {
            uni.switchTab({
                url:`../index/index`
            });
        }, 3000);
  }
};
</script>
