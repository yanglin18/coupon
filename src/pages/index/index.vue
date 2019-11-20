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
          <text class="price_now">&yen;{{ price }}</text>
          <text class="price_original">&yen;{{ price_original }}</text>
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
            <view @click="add_number" class="reduce">
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
  padding: 24rpx 40rpx 40rpx;
}
.tips {
  display: none;
  // display: flex;
  // flex-direction: column;
  font-size: 26rpx;
  .title {
    // opacity: 0.6;
    display: flex;
    align-items: center;
    image{
      height: 48rpx;
      width: 40rpx;
      margin-right: 20rpx;
    }
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
  padding: 43rpx 50rpx 64rpx;
  height: 417px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  .card_top {
    display: flex;
    flex-direction: column;
    .price {
      display: flex;
      align-items: baseline;
      color: #ffffff;
      .price_now {
        font-size: 90rpx;
        font-weight: 600;
      }
      .price_original {
        margin-left: 15rpx;
        opacity: 0.6;
        font-size: 30rpx;
        text-decoration: line-through;
      }
    }
    .name {
      opacity: 0.8;
      font-weight: 600;
      font-size: 36rpx;
      color: #ffffff;
      letter-spacing: 0;
    }
  }
  .card_sell_out {
    border-bottom-left-radius: 10rpx;
    border-bottom-right-radius: 10rpx;
    background-color: rgba(121, 182, 160, 0.8);
    font-size: 36rpx;
    padding: 50rpx;
    color: #ffffff;
    text-align: center;
  }
  .card_bottom {
    display: flex;
    justify-content: space-between;
    .left {
      display: flex;
      flex-direction: column;
      .number {
        display: flex;
        width: 184rpx;
        align-items: center;
        justify-content: space-between;
        .reduce {
          display: flex;
          align-items: center;
          image {
            height: 40rpx;
            width: 40rpx;
          }
        }
        .num {
          color: #ffffff;
          font-size: 30rpx;
        }
      }
      .purchase_limit {
        display: flex;
        margin-top: 14rpx;
        text {
          opacity: 0.6;
          font-size: 22rpx;
          color: #ffffff;
          letter-spacing: 0;
          text-align: right;
          margin-right: 16rpx;
          &:last-child{
            margin-right: 0;
          }
        }
      }
    }
    button {
      background-color: #ffffff;
      border-radius: 45rpx;
      width: 260rpx;
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
  padding: 60rpx 50rpx 0;
  flex-direction: column;
  .card_content {
    .text1 {
      margin-bottom: 8rpx;
      font-size: 40rpx;
      color: #ffffff;
    }
    .text2 {
      opacity: 0.6;
      font-size: 30rpx;
      color: #ffffff;
    }
  }
  .text1 {
    font-size: 40rpx;
    color: #ffffff;
  }
  .text2 {
    opacity: 0.6;
    font-size: 30rpx;
    color: #ffffff;
  }
}
</style>
