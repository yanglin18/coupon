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
                url:`pages/index/index`
            });
        }, 7000);
  }
};
</script>
