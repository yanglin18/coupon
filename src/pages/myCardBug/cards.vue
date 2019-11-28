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
    <!-- <swiper class="card_swiper" vertical="true">
        <swiper-item
          v-for="(item, index) in cards"
          :key="index"
          class="goods_card"
        >
          <view class="card_order">
            <text v-if="item.num !== 1">{{ index + 1 }}/{{ item.num }}</text>
          </view>
          <view class="name">
            <text>{{ item.goods_name }}</text>
          </view>
          <view class="userful_time">
            <text>有效期至：{{ item.expire_time }}</text>
          </view>
          <view class="QRcode">
            <canvas
              style="width: 210px; height: 210px;"
              canvas-id="myQrcode"
            ></canvas>
          </view>
          <view class="bottom">
            <text>优惠码每30秒自动更新，当天24时前有效，过期不退换</text>
          </view>
        </swiper-item>
      </swiper> -->

    <view
      v-for="(item, index) in cards"
      :key="index"
      class="goods_card"
      :class="{ showClass: item.show }"
    >
      <view class="card_order">
        <text v-if="item.num !== 1">{{ index + 1 }}/{{ item.num }}</text>
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
        <text>优惠码每30秒自动更新，当天24时前有效，过期不退换</text>
      </view>
    </view>
    <view class="affirm">
      <button @click="HaveScan">确认星伙伴已扫码</button>
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
    <!-- 遮罩 -->
    <view class="shadowBox" v-show="clickScna"></view>
  </view>
</template>

<script>
import drowQrcode from "@/components/weapp.qrcode.esm.js";
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
      order_id: "",
      cards: [],
      scrollTop: 0
    };
  },
  onLoad(val) {
    this.order_id = val.order_id;
    this.getOrderInfo();
  },
  mounted() {
    this.queryMultipleNodes();
  },
  onPageScroll() {
    this.queryMultipleNodes();
  },
  methods: {
    //声明节点查询的方法
    queryMultipleNodes() {
      [1, 2, 3].forEach((item, index) => {
        this.cards[index].show = !this.cards[index].show;
      });
    },
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
                let item = {};
                let cardList = [];
                for (let i = 0; i < cardsdata.ticket.length; i++) {
                  item.expire_time = cardsdata.expire_time;
                  item.goods_name = cardsdata.goods_name;
                  item.num = cardsdata.num;
                  item.status = cardsdata.status;
                  item.ticket = cardsdata.ticket[i];
                  item.show = false;
                  cardList.push(item);
                }
                this.cards = cardList;
              }
            }
          );
        }
      });
    },
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
      uni.showToast({
        title: "扫码已完成"
      });
      // 改全局数据值
      let app = getApp();
      app.globalData.share = true;
      console.log("app:", app);
      uni.switchTab({
        url: "./cardList"
      });
    },
    cancel() {
      this.clickScna = false;
    }
  }
};
</script>

<style lang="scss">
.content {
  position: relative;
  padding: 0 40rpx 160rpx;
  // height: 100vh;
  background: url("http://wechatapppro-1252524126.file.myqcloud.com/appuaB1Y9Wy1245/image/ueditor/69254200_1574076274.png")
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
  background: rgba(0, 0, 0, 0.4);
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
    .not_use {
      height: 420rpx;
      width: 420rpx;
      margin: 36rpx auto 0;
    }
    .used {
      height: 495rpx;
      width: 509rpx;
      position: relative;
      right: -60rpx;
      top: 72rpx;
      margin: 0;
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
  }
}
.Toast {
  opacity: 1;
  display: flex;
  flex-direction: column;
  background: #ffffff;
  border-radius: 24px;
  position: fixed;
  top: 50%;
  left: 0;
  transform: translateY(-50%);
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
