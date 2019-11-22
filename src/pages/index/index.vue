<template>
  <view class="content" :animation="animationData">
    <view id="tips" style="height=0" class="tips">
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
    <view class="goods_card" @click="NavToDetial">
      <view class="card_top">
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
            <view @click.stop="reduce_number" class="reduce">
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
            <view @click.stop="add_number" class="reduce">
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
          <!-- <button size="mini">去支付</button> -->
          <button open-type="getUserInfo" @getuserinfo="GetUserInfo">
            去购买
          </button>
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
    <view v-if="userAgree === false" class="warmPrompt">
      <view class="Prompttitle">
        <text>温馨提示</text>
      </view>
      <view class="Promptcontent">
        <text>
          欢迎您来到星冰乐用心券大家庭，我们更新了《星冰乐小程序服务指南》、《星冰乐付费服务协议》和《用户隐私政策协议》，请先点击下方链接，仔细阅读，充分理解协议中的条款内容后通过勾选统一的形式后，再次进入星冰乐用心券大家庭。
        </text>
      </view>
      <view class="check">
        <view>
          <image
            @click="agree"
            v-show="userOptions === true"
            src="../../static/assets/option.png"
          />
          <image
            @click="agree"
            v-show="userOptions === false"
            src="../../static/assets/option_no.png"
          />
        </view>
        <view>
          <text>
            同意
            <text
              class="agreement"
              @click="NavToagreement('/pages/userCenter/About/privacyPolicy')"
              >《星冰乐小程序服务指南》</text
            >
            、
            <text
              class="agreement"
              @click="NavToagreement('/pages/userCenter/About/privacyPolicy')"
              >《星冰乐付费服务协议》</text
            >
            和
            <text
              class="agreement"
              @click="NavToagreement('/pages/userCenter/About/privacyPolicy')"
              >《用户隐私政策协议》</text
            >
          </text>
        </view>
      </view>
      <!-- 因为此按钮绑定的事件有三个：1.已经勾选隐私协议。2.调起基本信息授权。3.控制页面下滑露出使用须知 -->
      <!-- 因为调起基本信息无法控制，所以用两个一模一样的按钮。控制这三件事 -->
      <button v-if="!userOptions" @click="NotLearned">
        我已了解
      </button>
      <button
        v-else
        open-type="getUserInfo"
        @getuserinfo="GetUserInfo"
        @click="IHaveLearned"
      >
        我已了解
      </button>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      userOptions: false, //用户是否勾选
      userAgree: false, //用户是否点击“我已了解”
      price: "24.00",
      price_original: "33.00",
      buy_number: 1,
      sum_number: 999,
      animationData: {}
    };
  },
  onLoad() {
    // this.Ajax("post", "xxx", {}, res => {
    //   console.log(res);
    // });
    let animation = uni.createAnimation({
      duration: 1000
    });
    this.animation = animation;

    animation.translate(0, -175).step();
    this.animationData = animation.export();
  },
  onPageScroll() {
    let animation = uni.createAnimation({
      duration: 1000
    });
    this.animation = animation;

    animation.translate(0, -175).step();
    this.animationData = animation.export();
  },
  onPullDownRefresh() {
    console.log("下拉啦！");
    let animation = uni.createAnimation({
      duration: 1000
    });
    this.animation = animation;

    animation.translate(0, 0).step();
    this.animationData = animation.export();
  },
  methods: {
    // 下拉出现提示
    pullDown() {
      var query = uni.createSelectorQuery();
      // 选择id
      query.select("#tips").boundingClientRect();
      console.log("query", query);
      query.exec(function(res) {
        let height = res[0].height;
        console.log("res:", res);
      });
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
    // 跳转到详情
    NavToDetial() {
      uni.navigateTo({
        url: "./detials"
      });
    },
    // 获取基本信息
    GetUserInfo(res) {
      console.log(res);
      if (res.detail.userInfo) {
        console.log("点击了同意授权");
      } else {
        console.log("点击了拒绝授权");
      }
    },
    // 未勾选情况下点我已了解
    NotLearned() {
      uni.showToast({
        title: "请勾选服务/隐私协议",
        duration: 1000,
        icon: "none"
      });
    },
    // 我已了解
    IHaveLearned() {
      if (this.userOptions === false) {
        return;
      } else {
        this.userAgree = true;
        var animation = uni.createAnimation({
          duration: 1000
        });
        this.animation = animation;
        animation.translate(0, 0).step();
        this.animationData = animation.export();
      }
    },
    // 用户同意协议
    agree() {
      this.userOptions = !this.userOptions;
    },
    // 跳转到协议详情
    NavToagreement(e) {
      console.log(e);
      uni.navigateTo({
        url: e
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
.warmPrompt {
  display: flex;
  flex-direction: column;
  margin: 100rpx 50rpx;
  padding: 60rpx 60rpx 100rpx;
  position: fixed;
  top: 556rpx;
  left: 0;
  z-index: 100;
  background: #ffffff;
  color: #000000;
  border-radius: 24rpx;
  .Prompttitle {
    font-size: 40rpx;
    margin: 0 auto;
  }
  .Promptcontent {
    font-size: 30rpx;
    margin: 24rpx auto 0;
    opacity: 0.6;
    letter-spacing: 0;
    text-align: justify;
    line-height: 52rpx;
  }
  .check {
    display: flex;
    align-items: center;
    font-size: 22rpx;
    color: #000000;
    opacity: 0.4;
    margin: 38rpx auto 0;
    letter-spacing: 0.28px;
    text-align: justify;
    line-height: 40rpx;
    image {
      height: 36rpx;
      width: 36rpx;
      margin-right: 12rpx;
    }
    .agreement {
      color: #be9e54;
      opacity: 1;
    }
  }
  button {
    background: #42b069;
    border-radius: 40rpx;
    margin: 52rpx auto 0;
    width: 530rpx;
    font-size: 30rpx;
    color: #f8f8f8;
  }
}
.tips {
  // display: none;
  // display: flex;
  // flex-direction: column;
  font-size: 26rpx;
  .title {
    // opacity: 0.6;
    display: flex;
    align-items: center;
    image {
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
          // margin-right: 16rpx;
          &:last-child {
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

function newFunction() { animationData; { } }
