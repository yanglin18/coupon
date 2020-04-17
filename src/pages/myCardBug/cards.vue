<template>
  <view class="content">
    <view class="tips">
      <view class="title">
        <image src="../../static/assets/coffee.png" />
        <text>使用须知</text>
      </view>
      <view class="tip_content">
        <view class="texta">
          <text v-for="(item, index) in instructionsForUse" :key="index">{{
            item
          }}</text>
        </view>
      </view>
    </view>
    <view
      v-for="(item, index) in cards"
      :key="index"
      class="goods_card"
      :class="{ showClass: !item.showF }"
    >
      <view class="card_order">
        <text class="order1" v-if="item.num !== 1">{{ index + 1 }}</text>
        <text v-if="item.num !== 1">/{{ item.num }}</text>
      </view>
      <view class="name">
        <text>{{ item.goods_name }}</text>
      </view>
      <view class="userful_time">
        <text>有效期至：{{ item.expire_time }}</text>
      </view>
      <view class="QRcode">
        <!-- <canvas
          style="width: 210px; height: 210px;"
          canvas-id="myQrcode"
        ></canvas> -->
        <image
          class="used"
          v-if="item.status === '2'"
          src="../../static/images/stamp_qrCode.png"
        />
        <image class="not_use" v-else :src="item.ticket" />
      </view>
      <view class="bottom">
        <text>优惠码仅在上述有效期内可用，过期不退换</text>
      </view>
    </view>
    <view class="affirm">

    </view>
    <!-- 弹窗 -->
    <!-- 遮罩 -->
    <view class="shadowBox" v-show="clickScna"></view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      clickScna: false, //是否点击下面确认扫描按钮
      title: "Hello",
      sum_number: 999,
      CardHeight: 0,
      TipsHeight: 0,
      order_id: "",
      cards: [],
      scrollTop: 0,
      instructionsForUse: "", //使用须知
      listIndex: 1,
      num: 0,
      status: ""
    };
  },
  onLoad(val) {
    this.order_id = val.order_id;
    uni.setNavigationBarColor({
      backgroundColor: "#0D5A3A",
      frontColor: "#ffffff"
    });
    this.getOrderInfo();
  },
  onShow() {
    // this.getOrderInfo();
  },
  onPageScroll(ev) {
    //ev是当前屏幕向上滚动的距离
    if (ev.scrollTop <= 0) {
      ev.scrollTop = 0;
    }
    //判断浏览器滚动条上下滚动
    if (
      ev.scrollTop > this.scrollTop ||
      ev.scrollTop == uni.getSystemInfoSync().windowHeight
    ) {
      console.log("下");
      let height = 430;
      if (ev.scrollTop >= this.listIndex * height - 100) {
        this.listIndex++;
        if (this.listIndex >= this.cards.length) {
          this.listIndex = this.cards.length;
        }
        this.cards.forEach((item, index) => {
          if (this.listIndex - 1 === index) {
            item.showF = 1;
          } else {
            item.showF = 0;
          }
        });
      }
    } else {
      console.log("上");
      let height = 430;
      console.log(ev.scrollTop, this.listIndex * height);
      if (this.listIndex * height - ev.scrollTop >= 2 * height - 100) {
        this.listIndex--;
        if (this.listIndex <= 1) {
          this.listIndex = 1;
        }
        this.cards.forEach((item, index) => {
          if (this.listIndex - 1 === index) {
            item.showF = 1;
          } else {
            item.showF = 0;
          }
        });
      }
    }
    //给scrollTop重新赋值
    setTimeout(() => {
      this.scrollTop = ev.scrollTop;
    }, 0);
  },
  // 用户分享
  onShareAppMessage(option) {
    return {
      // #ifdef MP-WEIXIN
      title: "我告诉你，这是喝星巴克最优惠的方式",
      imageUrl: "../../static/images/shareCard.jpg",
      // #endif
      // #ifdef MP-ALIPAY
      title: "这是喝星吧克最优惠的一种方式",
      imageUrl: "../../static/assets/logo.png",
      path: "/pages/loading/loading",
      desc: "星吧克咖啡电子优惠券售卖平台",
      templateId: "",
      // #endif
      // #ifdef MP-TOUTIAO
      title: "摩卡星-喝星吧克最优惠的方式",
      imageUrl: "../../static/assets/logo.png",
      // #endif
    };
  },
  methods: {
    // 获取订单详情
    getOrderInfo() {
      uni.getStorage({
        key: "storage_key",
        success: res0 => {
          this.Ajax(
            "post",
            "member/order/order_info",
            { order_id: this.order_id, session3rd: res0.data.session3rd },
            res => {
              if (res.data.code === "200") {
                let cardsdata = res.data.data;
                console.log("carddata:", cardsdata);
                let cardList = [];
                this.instructionsForUse = cardsdata.instructions;
                this.num = cardsdata.num;
                this.status = cardsdata.status;
                for (let i = 0; i < cardsdata.ticket.length; i++) {
                  let item = {};
                  item.expire_time = cardsdata.expire_time;
                  item.goods_name = cardsdata.goods_name;
                  item.num = cardsdata.num;
                  item.status = cardsdata.status;
                  item.ticket = cardsdata.ticket[i];

                  if (i === 0) {
                    item.showF = 1;
                  } else {
                    item.showF = 0;
                  }
                  cardList.push(item);
                }
                console.log("status:", this.status);
                this.cards = cardList;
              } else {
                if (res.data.code === "0031") {
                  this.getOrderInfo();
                }
              }
            }
          );
        }
      });
    },
  }
};
</script>

<style lang="scss" scoped>
.content {
  position: relative;
  padding: 0 40rpx 160rpx;
  min-height: 100vh;
  background: url("http://wechatapppro-1252524126.file.myqcloud.com/appmTIXQdmp3575/image/ueditor/45537100_1575352285.png")
    no-repeat center;
  background-size: cover;
  // /deep/ .uni-swiper-slide-frame{
  //   height: 476px !important;
  // }
}
.shadowBox {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
}
.card_swiper {
  height: 934rpx;
}
swiper.uni-swiper-slide-frame {
  height: 786rpx !important;
}
.tips {
  // height: 256rpx !important;
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
    line-height: 42rpx;
    .texta {
      display: flex;
      flex-direction: column;
      margin-top: 8rpx;
      text {
        margin-bottom: 8rpx;
      }
    }
  }
}
.goods_card {
  background: #ffffff;
  border-radius: 24rpx;
  display: flex;
  margin-bottom: 40rpx;
  padding: 34rpx 66rpx 100rpx;
  color: rgba($color: #000000, $alpha: 0.6);
  flex-direction: column;
  .card_order {
    margin: 0 auto;
    font-size: 26rpx;
    .order1 {
      color: #000000;
      opacity: 1;
      font-size: 40rpx;
      font-weight: bold;
    }
  }
  .name {
    margin: 14rpx auto 0;
    font-weight: 600;
    font-size: 40rpx;
  }
  .userful_time {
    font-size: 26rpx;
    margin: 8rpx auto 0;
    letter-spacing: 0.43px;
    opacity: 0.6;
  }
  .QRcode {
    margin: 0 auto;
    .not_use {
      height: 420rpx;
      width: 420rpx;
      margin: 36rpx auto 0;
    }
    .used {
      height: 446rpx;
      width: 509rpx;
      position: relative;
      right: -50rpx;
      top: 36rpx;
      margin: 0;
    }
  }
  .bottom {
    // opacity: 0.4;
    margin: 28rpx auto 0;
    font-size: 22rpx;
    opacity: 0.4;
    letter-spacing: 0;
  }
}
.showClass {
  opacity: 0.4;
}
.affirm {
  margin: 60rpx auto 0;
  display: flex;
  justify-content: center;
  button {
    background: #ffffff;
    border-radius: 40rpx;
    font-size: 30rpx;
    color: #0d5a39;
    width: 530rpx;
    height: 80rpx;
    line-height: 80rpx;
    font-weight: bold;
  }
}
.Toast {
  opacity: 1;
  display: flex;
  flex-direction: column;
  background: #ffffff;
  border-radius: 24rpx;
  height: 500rpx;
  width: 630rpx;
  position: fixed;
  top: 46%;
  left: 0;
  transform: translateY(-50%);
  z-index: 100;
  margin: 0 60rpx;
  color: #000000;
  .title {
    font-size: 40rpx;
    margin: 80rpx auto 30rpx;
    font-weight: bold;
  }
  .row1 {
    opacity: 0.6;
    font-size: 30rpx;
    line-height: 52rpx;
    margin: 30rpx auto 0;
    font-weight: bold;
  }
  .row2 {
    opacity: 0.6;
    font-size: 26rpx;
    line-height: 52rrpx;
    margin: 0 auto 50rpx;
  }
  .button {
    margin: 0 auto;
    .button1 {
      background: #ffffff;
      border: 2rpx solid #00b265;
      border-radius: 40rpx;
      font-size: 30rpx;
      color: #42b069;
      letter-spacing: 0;
      width: 160rpx;
      height: 80rpx;
      line-height: 80rpx;
      padding: 0;
    }
    .button2 {
      margin-left: 20rpx;
      border-radius: 40rpx;
      background: #42b069;
      width: 350rpx;
      height: 80rpx;
      line-height: 80rpx;
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
