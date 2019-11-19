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
    <view class="goods_card" >
      <view class="card_top" @click="NavToDetial">
        <view class="price">
          <text class="price_now">￥{{ price }}</text>
          <text class="price_original">￥{{ price_original }}</text>
        </view>
        <view class="name">
          <text>全国星巴克中杯通兑券</text>
        </view>
      </view>
      <!-- <view class="QRcode">
        <image  />v-if=
      </view> -->
      <view v-if="sum_number === 0" class="card_sell_out">
        <text>已售罄</text>
      </view>
      <view v-else class="card_bottom">
        <view class="left">
          <view class="number">
            <view @click="reduce_number" class="reduce">
              <image
                v-show="buy_number === 1"
                src="../../static/images/no_reduce.png"
              />
              <image
                v-show="buy_number !== 1"
                src="../../static/images/reduce.png"
              />
            </view>
            <view class="num">{{ buy_number }}</view>
            <view @click="add_number" class="add">
              <image
                v-show="buy_number === 10"
                src="../../static/images/no_add.png"
              />
              <image
                v-show="buy_number !== 10"
                src="../../static/images/add.png"
              />
            </view>
            <!-- <uni-number-box
              :value="buy_number"
              :min="1"
              :max="10"
            ></uni-number-box> -->
          </view>
          <view class="purchase_limit">
            <text>每日限购十张</text>
            <text>库存：{{ sum_number }}</text>
          </view>
        </view>
        <view class="right">
          <button size="mini">去支付</button>
        </view>
      </view>
    </view>
    <view class="active">
      <view class="card_content">
        <view class="text1">
          <text>你送她一杯子，她还你一辈子</text>
        </view>
        <view class="text2">
          <text>超值活动超值价格超值套装</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { uniNumberBox } from "@dcloudio/uni-ui";
export default {
  components: { uniNumberBox },
  data() {
    return {
      price: "24.00",
      price_original: "33.00",
      buy_number: 1,
      sum_number: 999
    };
  },
  onLoad() {
    // this.Ajax("post", "xxx", {}, res => {
    //   console.log(res);
    // });
  },
  onPullDownRefresh() {
    console.log("下拉啦！"), (notice = document.getElementsByClassName("tips"));
    (notice.style.display = "block"),
      setTimeout(function() {
        uni.stopPullDownRefresh();
      }, 1000);
  },
  methods: {
    // 减少购买数量
    reduce_number() {
      if (this.buy_number <= 1) {
        return;
      } else {
        this.buy_number--;
        this.NumChange();
      }
    },
    // 增加购买数量
    add_number() {
      if (this.buy_number >= 10) {
        return;
      } else {
        this.buy_number++;
        this.NumChange();
      }
    },
    NumChange() {
      this.price = String(24 * this.buy_number) + ".00";
      this.price_original = String(33 * this.buy_number) + ".00";
    },
    // 跳转到详情
    NavToDetial() {
      uni.navigateTo({
        url: "./detials"
      });
    }
  }
};
</script>

<style lang="scss">
.content {
  background: #e8e8e8;
  padding: 0 40rpx 40rpx;
}
.tips {
  display: none;
  display: flex;
  flex-direction: column;
  font-size: 26rpx;
  .title {
    // opacity: 0.6;
    display: flex;
    flex-direction: row;
    align-items: center;
    image{
      height: 48rpx;
      width: 40rpx;
      margin-right: 20rpx;
    }
    font-family: PingFangSC-Semibold;
    font-size: 30rpx;
    font-weight: 600;
    color: #000000;
    letter-spacing: -0.68px;
    padding: 10rpx;
  }
  .tip_content {
    display: flex;
    flex-direction: column;
    opacity: 0.6;
    font-family: PingFangSC-Regular;
    font-size: 24rpx;
    color: rgb(43, 43, 44);
    letter-spacing: -0.58rpx;
    line-height: 42rpx;
    .texta {
      padding: 10rpx;
    }
  }
}
.goods_card {
  background: url("http://wechatapppro-1252524126.file.myqcloud.com/appuaB1Y9Wy1245/image/ueditor/72823600_1574074898.png")
    no-repeat center;
  background-size: cover;
  border-radius: 15rpx;
  height: 417px;
  display: flex;
  margin-top: 30rpx;
  flex-direction: column;
  justify-content: space-between;
  .card_top {
    display: flex;
    flex-direction: column;
    padding: 40rpx 50rpx 0;
    .price {
      display: flex;
      flex-direction: row;
      align-items: baseline;
      color: #ffffff;
      justify-content: flex-start;
      .price_now {
        font-size: 90rpx;
        font-weight: 600;
        margin-left: 40rpx;
        font-family: HelveticaNeue-Bold;
        margin: 0 20rpx;
      }
      .price_original {
        font-size: 30rpx;
        text-decoration: line-through;
      }
    }
    .name {
      opacity: 0.8;
      font-weight: 600;
      font-family: PingFangSC-Semibold;
      font-size: 36rpx;
      color: #ffffff;
      letter-spacing: 0;
      margin: 10rpx;
    }
  }
  .card_sell_out {
    border-bottom-left-radius: 10rpx;
    border-bottom-right-radius: 10rpx;
    background-color: rgba(121, 182, 160, 0.8);
    font-family: PingFangSC-Medium;
    font-size: 36rpx;
    padding: 50rpx;
    color: #ffffff;
    text-align: center;
  }
  .card_bottom {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    padding-bottom: 50rpx;
    .left {
      display: flex;
      flex-direction: column;
      .number {
        display: flex;
        width: 200rpx;
        flex-direction: row;
        align-items: center;
        justify-content: space-around;
        .reduce {
          image {
            height: 40rpx;
            width: 40rpx;
          }
        }
        .num {
          color: #ffffff;
          font-size: 30rpx;
        }
        .add {
          image {
            height: 40rpx;
            width: 40rpx;
          }
        }
      }
      .purchase_limit {
        display: flex;
        flex-direction: row;
        text {
          padding: 10rpx;
          opacity: 0.6;
          font-family: PingFangSC-Semibold;
          font-size: 22rpx;
          color: #ffffff;
          letter-spacing: 0;
          text-align: right;
        }
      }
    }
    button {
      background-color: #ffffff;
      border-radius: 45rpx;
      font-family: PingFangSC-Semibold;
      padding: 0 80rpx;
      font-size: 30rpx;
      color: #005334;
      font-weight: 600;
    }
  }
}
.active {
  background: url("http://wechatapppro-1252524126.file.myqcloud.com/appuaB1Y9Wy1245/image/ueditor/56916900_1574074896.png")
    no-repeat center;
  background-size: cover;
  // margin-bottom: 40rpx;
  border-radius: 15rpx;
  height: 417px;
  display: flex;
  margin-top: 30rpx;
  flex-direction: column;
  .card_content {
    padding: 40rpx;
    .text1 {
      font-family: PingFangSC-Semibold;
      font-size: 40rpx;
      color: #ffffff;
      padding: 10rpx 0;
    }
    .text2 {
      opacity: 0.6;
      font-family: PingFangSC-Regular;
      font-size: 30rpx;
      color: #ffffff;
    }
  }
  .text1 {
    font-family: PingFangSC-Semibold;
    font-size: 40rpx;
    color: #ffffff;
  }
  .text2 {
    opacity: 0.6;
    font-family: PingFangSC-Regular;
    font-size: 30rpx;
    color: #ffffff;
  }
}
</style>
