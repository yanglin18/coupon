<template>
  <view class="content">
    <view class="tips">
      <view class="title">
        <image src="../../static/assets/coffee.png" />
        <text>使用须知</text>
      </view>
      <view class="tip_content">
        <view class="texta">
          <text>{{ instructionsForUse }}</text>
        </view>
      </view>
    </view>
    <view class="goods_card">
      <view class="card_top">
        <view class="price">
          <text class="price_now">&yen;{{ goodsInfo.price }}</text>
          <text class="price_original"
            >&yen;{{ goodsInfo.original_price }}</text
          >
        </view>
        <view class="name">
          <text>{{ goodsInfo.goods_name }}</text>
        </view>
      </view>

      <image src="../../static/images/RQcode.png" />

      <view class="card_bottom">
        <view class="left">
          <view class="number">
            <view @click="reduce_number" class="reduce">
              <image
                v-show="buy_number === 1"
                src="../../static/images/no_reduce.png"
                @click="Toast('只有一张，不能再减少啦')"
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
                @click="Toast('该优惠券最多只能买十张哦')"
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
            <text>库存：{{ goodsInfo.inventory }}</text>
          </view>
        </view>
        <view class="right">
          <button size="mini">去支付</button>
        </view>
      </view>
    </view>
  </view>
</template>
<script>
export default {
  data() {
    return {
      price: "24.00",
      price_original: "33.00",
      buy_number: 1,
      sum_number: 999,
      goodsId: "",
      goodsInfo: {},
      instructionsForUse: ""
    };
  },
  onLoad(id) {
    this.goodsId = id.id;
    this.getGoodInfo();
    this.getInstructionsForUse();
    console.log("id:", this.goodsId);
  },
  methods: {
    // 获取商品信息
    getGoodInfo() {
      this.Ajax(
        "post",
        "member/index/goods_info",
        { goods_id: this.goodsId },
        res => {
          console.log(res);
          if (res.data.code === "200") {
            this.goodsInfo = res.data.data.info;
          }
          console.log("信息：", this.goodsInfo);
        }
      );
    },
    // 获取使用须知
    getInstructionsForUse() {
      this.Ajax(
        "post",
        "member/index/instructions_for_use",
        { brand_id: 1 },
        res => {
          console.log(res);
          if (res.data.code === "200") {
            this.instructionsForUse = res.data.data.instructions;
          }
          console.log("信息：", this.instructionsForUse);
        }
      );
    },
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
    // 提示
    Toast(e) {
      uni.showToast({
        title: e,
        duration: 3000,
        icon: "none"
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.content {
  background: url("http://wechatapppro-1252524126.file.myqcloud.com/appuaB1Y9Wy1245/image/ueditor/69254200_1574076274.png")
    no-repeat center;
  background-size: cover;
  height: 100vh;
  padding: 0 40rpx 40rpx;
}
.tips {
  display: none;
  display: flex;
  flex-direction: column;
  font-size: 26rpx;
  color: #ffffff;
  .title {
    opacity: 0.6;
    font-family: PingFangSC-Semibold;
    font-size: 28rpx;
    letter-spacing: -0.68px;
    padding: 10rpx;
    display: flex;
    align-items: center;
    image {
      height: 48rpx;
      width: 40rpx;
      margin-right: 20rpx;
    }
  }
  .tip_content {
    display: flex;
    flex-direction: column;
    opacity: 0.6;
    font-family: PingFangSC-Regular;
    font-size: 24rpx;
    letter-spacing: -0.58rpx;
    line-height: 42rpx;
    .texta {
      padding: 10rpx;
    }
  }
}
.goods_card {
  background-color: #ffffff;
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
      color: #000000;
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
      color: #000000;
      letter-spacing: 0;
      margin: 10rpx;
    }
  }
  image {
    height: 400rpx;
    width: 400rpx;
    margin: 0 auto;
  }
  .card_bottom {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
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
          color: #000000;
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
          color: #000000;
          letter-spacing: 0;
          text-align: right;
        }
      }
    }
    button {
      background-color: #005334;
      border-radius: 45rpx;
      font-family: PingFangSC-Semibold;
      padding: 0 80rpx;
      font-size: 30rpx;
      color: #ffffff;
      font-weight: 600;
    }
  }
}
</style>
