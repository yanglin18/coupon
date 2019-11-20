<template>
  <view class="content">
    <view class="tips">
      <view class="title">
        <image src="../../static/assets/coffee.png" />
        <text>使用须知</text>
      </view>
      <view class="tip_content">
        <view class="texta">
          <text>适用时段：购买后24小时内有效，过期后不支持退换；</text>
        </view>
        <view class="texta">
          <text
            >适用产品：可在中国大陆区的星巴克门店内兑换任意一款中杯饮品（冰激凌系列除外）；</text
          >
        </view>
        <view class="texta">
          <text
            >不适用门店：瑧选上海烘培工坊、上海浦东机场店、上海世贸广场店、北京坊旗舰店、深圳万象城店、南京机场店</text
          >
        </view>
      </view>
    </view>
    <swiper
      :vertical="true"
      previous-margin="120px"
      next-margin="120px"
      @change="EventHandle"
      class="swiper"
    >
      <swiper-item
        class="goods_card"
        v-for="(item, index) in cards"
        :id="index"
        :key="index"
      >
        <view class="card_order">
          <text>{{ item.id }}/{{ shuliang }}</text>
        </view>
        <view class="name">
          <text>全国星巴克中杯通兑券</text>
        </view>
        <view class="userful_time">
          <text>有效期：{{ item.userful_time }}</text>
        </view>
        <view class="QRcode">
          <image src="../../static/QRcode.png" />
        </view>
        <view class="tips">
          <text>优惠码每30秒自动更新，24小时内有效，过期不退换</text>
        </view>
      </swiper-item>
    </swiper>
    <!-- </view> -->

    <!-- <view v-for="item in cards" :key="item" class="goods_card">
      <view class="card_order">
        <text>{{ item.id }}/{{ shuliang }}</text>
      </view>
      <view class="name">
        <text>全国星巴克中杯通兑券</text>
      </view>
      <view class="userful_time">
        <text>有效期：{{ item.userful_time }}</text>
      </view>
      <view class="QRcode">
        <image src="../../static/ceshi.jpg" />
      </view>
      <view class="tips">
        <text>优惠码每30秒自动更新，24小时内有效，过期不退换</text>
      </view>
    </view> -->
  </view>
</template>

<script>
export default {
  data() {
    return {
      title: "Hello",
      price: 24,
      price_original: 33,
      buy_number: 555,
      sum_number: 999,
      shuliang: 6,
      cards: [
        {
          image: "",
          id: 1,
          userful_time: "2019.11.09 23:00:02"
        },
        {
          image: "",
          id: 2,
          userful_time: "2019.11.09 23:00:02"
        },
        {
          image: "",
          id: 3,
          userful_time: "2019.11.09 23:00:02"
        },
        {
          image: "",
          id: 4,
          userful_time: "2019.11.09 23:00:02"
        },
        {
          image: "",
          id: 5,
          userful_time: "2019.11.09 23:00:02"
        },
        { image: "", id: 6, userful_time: "2019.11.09 23:00:02" }
      ],
       scrollTop: 0
    };
  },
  onLoad() {},
   //监听屏幕滚动 判断上下滚动
  onPageScroll: function (ev) {
    var _this = this;
    //当滚动的top值最大或最小时，为什么要做这一步是因为在手机实测小程序的时候会发生滚动条回弹，所以为了处理回弹，设置默认最大最小值
    if (ev.scrollTop <= 0) {
      ev.scrollTop = 0;
    } else if (ev.scrollTop > uni.getSystemInfoSync().windowHeight) {
      ev.scrollTop = uni.getSystemInfoSync().windowHeight;
    }
    //判断浏览器滚动条上下滚动
    if (ev.scrollTop > this.data.scrollTop || ev.scrollTop == uni.getSystemInfoSync().windowHeight) {
      console.log("下")
      //向下滚动
    } else {
       console.log("上")
      //向上滚动
    }
    //给scrollTop重新赋值
    setTimeout(function () {
      _this.setData({
        scrollTop: ev.scrollTop
      })
    }, 0)
  },
  methods: {
    EventHandle(e) {
      // console.log(e);
      // let swp = document.getElementById(e.detail.current);
      // swp.className = "card_order active";
      // console.log("swp:", swp);
    }
  }
};
</script>

<style lang="scss">
// 一个元素时的垂直居中
.center {
  display: flex;
  justify-content: center;
  align-items: center;
}
.content {
  padding: 0 40rpx;
  // height: 100vh;
  background: url("http://wechatapppro-1252524126.file.myqcloud.com/appuaB1Y9Wy1245/image/ueditor/69254200_1574076274.png")
    no-repeat center;
  background-size: cover;
}
.swiper {
  height: 650px;
}
.tips {
  display: flex;
  padding-top: 19rpx;
  flex-direction: column;
  color: #ffffff;
  font-size: 26rpx;
  .title {
    display: flex;
    align-items: center;
    image {
      height: 48rpx;
      width: 40rpx;
      margin-right: 20rpx;
    }
    font-size: 30rpx;
    letter-spacing: -0.68px;
  }
  .tip_content {
    display: flex;
    flex-direction: column;
    opacity: 0.6;
    font-size: 24rpx;
    .texta {
      margin-top: 10rpx;
    }
  }
}
.goods_card {
  background: #ffffff;
  border-radius: 24rpx;
  display: flex;
  margin-top: 40rpx;
  margin-bottom: 114rpx;
  color: #000000;
  flex-direction: column;
  .card_order {
    margin: 34rpx auto 0;
  }
  .name {
    margin: 7rpx auto 0;
    font-weight: 600;
    font-size: 40rpx;
  }
  .userful_time {
    font-size: 26rpx;
    margin: 7rpx auto 0;
    letter-spacing: 0.43px;
    opacity: 0.6;
  }
  .QRcode {
    margin: 36rpx auto 0;
    image {
      height: 400rpx;
      width: 400rpx;
    }
  }
  .tips {
    // opacity: 0.4;
    font-size: 22rpx;
    margin: 40rpx auto 0;
  }
}
.active {
  opacity: 1;
}
</style>
