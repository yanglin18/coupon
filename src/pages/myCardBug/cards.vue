<template>
  <view class="content">
    <view :class="clickScna === false ? '' : 'contentOp'">
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
      <swiper class="card_swiper" vertical="true">
        <!-- <swiper-item class="tips">
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
        </swiper-item> -->
        <swiper-item v-for="item in cards" :key="item" class="goods_card">
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
          <view class="bottom">
            <text>优惠码每30秒自动更新，当天24时前有效，过期不退换</text>
          </view>
        </swiper-item>
        <!-- <swiper-item>
          <button class="affirm" @click="HaveScan">确认星伙伴已扫码</button>
        </swiper-item> -->
      </swiper>

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
        <view class="bottom">
          <text>优惠码每30秒自动更新，当天24时前有效，过期不退换</text>
        </view>
      </view> -->
      <button class="affirm" @click="HaveScan">确认星伙伴已扫码</button>
    </view>
    <!-- 弹窗 -->
    <view class="Toast" v-if="clickScna">
      <view class="title">已扫码确认</view>
      <view class="row1">10张“星巴克中杯通兑券“已完成扫码？</view>
      <view class="row2"> （在“我的摩卡券”可查看已购买的券码）</view>
      <view class="button">
        <button size="mini" class="button1" @click="cancel">未完成</button>
        <button size="mini" class="button2" @click="submit">
          确认星伙伴已扫码
        </button>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      clickScna: false, //是否点击下面确认扫描按钮
      title: "Hello",
      price: 24,
      price_original: 33,
      buy_number: 555,
      sum_number: 999,
      CardHeight: 0,
      TipsHeight: 0,
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
  onLoad() {
    var query = uni.createSelectorQuery();
    //选择id
    query.select(".goods_card").boundingClientRect();
    query.select(".tips").boundingClientRect();
    query.exec(function(res) {
      console.log("res1", res);
      var CardHeight = res[0].height; //每个卡片的高度
      var TipsHeight = res[1].height;
    });
    // console.log(TipsHeight)
  },
  //监听屏幕滚动 判断上下滚动
  onPageScroll: function(ev) {
    //ev是当前屏幕向上滚动的距离
    var _this = this;
    //当滚动的top值最大或最小时，为什么要做这一步是因为在手机实测小程序的时候会发生滚动条回弹，所以为了处理回弹，设置默认最大最小值
    console.log("TipsHeight", this.TipsHeight);
    console.log("CardHeight", this.CardHeight);
    if (ev.scrollTop <= 0) {
      ev.scrollTop = 0;
    } else if (ev.scrollTop > uni.getSystemInfoSync().windowHeight) {
      ev.scrollTop = uni.getSystemInfoSync().windowHeight;
    }
    //判断浏览器滚动条上下滚动
    if (
      ev.scrollTop > this.data.scrollTop ||
      ev.scrollTop == uni.getSystemInfoSync().windowHeight
    ) {
      console.log("下");
      //向下滚动
    } else {
      console.log("上");
      //向上滚动
    }
    //给scrollTop重新赋值
    setTimeout(function() {
      _this.setData({
        scrollTop: ev.scrollTop
      });
    }, 0);
  },
  methods: {
    EventHandle(e) {
      // console.log(e);
      // let swp = document.getElementById(e.detail.current);
      // swp.className = "card_order active";
      // console.log("swp:", swp);
    },
    // 点击确认扫码
    HaveScan() {
      this.clickScna = true;
    },
    submit() {
      this.clickScna = false;
    },
    cancel() {
      this.clickScna = false;
    }
  }
};
</script>

<style lang="scss">
.content {
  padding: 0 40rpx 160rpx;
  // height: 100vh;
  background: url("http://wechatapppro-1252524126.file.myqcloud.com/appuaB1Y9Wy1245/image/ueditor/69254200_1574076274.png")
    no-repeat center;
  background-size: cover;
  // /deep/ .uni-swiper-slide-frame{
  //   height: 476px !important;
  // }
}
.contentOp {
  opacity: 0.4;
}
.card_swiper {
  height: 934rpx;
}
swiper.uni-swiper-slide-frame {
  height: 786rpx !important;
}
.tips {
  height: 256rpx !important;
  display: flex;
  padding-top: 19rpx;
  flex-direction: column;
  margin-bottom: 26rpx;
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
  height: 786rpx !important;
  width: calc(100% - 128rpx) !important;
  background: #ffffff;
  border-radius: 24rpx;
  display: flex;
  margin-bottom: 40rpx;
  padding: 34rpx 64rpx 114rpx;
  color: #000000;
  flex-direction: column;
  .card_order {
    margin: 0 auto;
  }
  .name {
    margin: 14rpx auto 0;
    font-weight: 600;
    font-size: 40rpx;
  }
  .userful_time {
    font-size: 26rpx;
    margin: 14rpx auto 0;
    letter-spacing: 0.43px;
    opacity: 0.6;
  }
  .QRcode {
    margin: 36rpx auto 0;
    image {
      height: 420rpx;
      width: 420rpx;
    }
  }
  .bottom {
    // opacity: 0.4;
    margin: 40rpx auto 0;
    font-size: 22rpx;
    opacity: 0.4;
    letter-spacing: 0;
  }
}
.affirm {
  background: #ffffff;
  border-radius: 40rpx;
  font-size: 30rpx;
  color: #0d5a39;
  letter-spacing: 0;
  width: 530rpx;
}
.Toast {
  opacity: 1;
  display: flex;
  flex-direction: column;
  background: #ffffff;
  border-radius: 24px;
  top: 520rpx;
  position: fixed;
  left: 0;
  z-index: 100;
  margin: 0 60rpx;
  padding: 80rpx 40rpx 100rpx;
  color: #000000;
  .title {
    font-size: 40rpx;
    margin: 0 auto;
  }
  .row1 {
    opacity: 0.6;
    font-size: 30rpx;
    line-height: 52rpx;
    margin: 30rpx auto 0;
  }
  .row2 {
    opacity: 0.6;
    font-size: 26rpx;
    line-height: 52rrpx;
    margin: 0 auto 50rpx;
  }
  .button {
    .button1 {
      border: 2rpx solid #00b265;
      border-radius: 40rpx;
      font-size: 30rpx;
      color: #42b069;
      letter-spacing: 0;
    }
    .button2 {
      margin-left: 20rpx;
      border-radius: 40rpx;
      background: #42b069;

      font-size: 30rpx;
      color: #f8f8f8;
      letter-spacing: 0;
    }
  }
}
.active {
  opacity: 1;
}
</style>
