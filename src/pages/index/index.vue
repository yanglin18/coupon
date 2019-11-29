<template>
  <view class="content">
    <view id="tips" :class="computedClassStr">
      <view class="title">
        <image src="../../static/assets/coffee.png" />
        <text>使用须知</text>
      </view>
      <view class="tip_content">
        <view class="texta">
          <text>{{ instructions_for_use }}</text>
        </view>
      </view>
    </view>
    <view
      class="goods_card"
      @click="NavToDetial"
      v-bind:style="{
        background: 'url(' + goodsInfo.img + ')no-repeat center',
        height: goodsInfo.height + 'rpx',
        width: goodsInfo.width + 'rpx',
        color: goodsInfo.color
      }"
    >
      <view class="card_top">
        <view class="price">
          <text class="price_now">&yen;{{ producePrice }}</text>
          <text class="price_original">&yen;{{ produceOriginalPrice }}</text>
        </view>
        <view class="name">
          <text>{{ goodsInfo.goods_name }}</text>
        </view>
      </view>
      <view
        v-if="goodsInfo.inventory === 0"
        class="card_sell_out"
        @click.stop="Toast('该优惠券暂时没货哦')"
      >
        <text>已售罄</text>
      </view>
      <view v-else class="card_bottom">
        <view class="left">
          <view class="number">
            <view @click.stop="reduce_number" class="reduce">
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
            <view @click.stop="add_number" class="reduce">
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
          </view>
          <view class="purchase_limit">
            <text>每日限购十张</text>
            <text>库存：{{ goodsInfo.inventory }}</text>
          </view>
        </view>
        <view class="right">
          <!-- 已授权的话第一个button生效，直接去购买 -->
          <!-- 未授权的话第二个button生效，先逐渐授权 -->
            <button
            v-if="is_getNumber"
            @click.stop="To_buy"
          >
            去购买
          </button>
          <button
          v-else
            :open-type="is_getuserInfo ? 'getPhoneNumber' : 'getUserInfo'"
            @getphonenumber="GetPhoneNumber"
            @getuserinfo="GetUserInfo"
            @click.stop="To_buy1"
          >
            去购买
          </button>
        </view>
      </view>
    </view>
    <view
      class="banner"
      v-for="(item, index) in banners"
      :key="index"
      v-bind:style="{
        background: 'url(' + item.img + ')no-repeat center',
        height: item.height + 'rpx',
        width: item.width + 'rpx',
        color: item.color
      }"
    >
      <view class="card_content">
        <view class="text1">
          <text>{{ item.title }}</text>
        </view>
        <view class="text2">
          <text>{{ item.introduce }}</text>
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
      <button
        :open-type="userOptions ? 'getUserInfo' : ''"
        @getuserinfo="GetUserInfo"
        @click="IHaveLearned"
      >
        我已了解
      </button>
    </view>
    <!-- 遮罩 -->
    <view class="shadowBox" v-show="!userAgree"></view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      userOptions: false, //用户是否勾选
      userAgree: false, //用户是否点击“我已了解”
      goodsInfo: {}, //商品信息
      instructions_for_use: "", //使用须知
      banners: {}, //banner
      buy_number: 1,
      sum_number: 66,
      animationData: {}, //动画
      user_info: {}, //用户信息,
      is_getuserInfo: false,
      is_getNumber:false,
      // 展示温馨提示
      showTips: true
    };
  },
  computed: {
    // 优惠价格
    producePrice() {
      return this.goodsInfo.price * this.buy_number + ".00" || 0;
    },
    // 原价格
    produceOriginalPrice() {
      return this.goodsInfo.original_price * this.buy_number + ".00" || 0;
    },
    computedClassStr() {
      return this.showTips ? "tips" : "hideTips";
    }
  },
  onLoad() {
    let obj = wx.getLaunchOptionsSync()
    console.log("obj:",obj);
    let isFir = uni.getStorageSync("isFirst");
    if (isFir) {
      console.log("不是第一次来的顾客");
      this.userAgree = true;
      this.loginWithoutInfo();//不是新用户就直接登录，不需要授权
      this.is_getuserInfo = true;  
    } else {
      console.log("是第一次来的顾客");
      this.userAgree = false;
    }
    this.getGoodsInfo();
    this.getInstructionsForUse();
    this.getBanner();
    this.showTips = false;
  },
  // 用户分享
  onShareAppMessage({ res }) {
    if (res.from === "button") {
      // 来自页面内分享按钮
      console.log(res.target);
    }
    return {
      title: "摩卡星",
      path: "/pages/index/index"
    };
  },
  onPageScroll() {
    this.showTips = false;
  },
  onPullDownRefresh() {
    console.log("下拉");
    this.showTips = true;
    console.log(this.showTips);
    uni.stopPullDownRefresh();
  },
  methods: {
    // 不用基本信息的登录
    loginWithoutInfo() {
      uni.login({
        success: LoginRes => {
          this.Ajax(
            "post",
            "member/Login/getLogin",
            { brand_id: 1, channel: "wechat", code: LoginRes.code },
            res => {
              console.log("登录测试000", res);
              if (res.data.code === "200") {
              }
            }
          );
        }
      });
    },
    // 获取商品信息
    getGoodsInfo() {
      this.Ajax("post", "member/index/index", { brand_id: 1 }, res => {
        if (res.data.code === "200") {
          this.goodsInfo = res.data.data.list[0];
        }
      });
    },
    // 获取使用须知
    getInstructionsForUse() {
      this.Ajax(
        "post",
        "member/index/instructions_for_use",
        { brand_id: 1 },
        res => {
          if (res.data.code === "200") {
            this.instructions_for_use = res.data.data.instructions;
          }
        }
      );
    },
    // 获取banner
    getBanner() {
      this.Ajax("post", "member/index/banner", {}, res => {
        console.log(res);
        if (res.data.code === "200") {
          this.banners = res.data.data.list;
        }
        console.log("信息：", this.banners);
      });
    },
    // 减少购买数量
    reduce_number() {
      if (this.buy_number <= 1) {
        return;
      }
      this.buy_number--;
    },
    // 增加购买数量
    add_number() {
      if (this.buy_number >= 10) {
        return;
      }
      this.buy_number++;
    },
    // 提示
    Toast(e) {
      uni.showToast({
        title: e,
        duration: 3000,
        icon: "none"
      });
    },
    // 数量增减联动价格
    // 跳转到详情
    NavToDetial() {
      uni.navigateTo({
        url: "./detials?id=" + this.goodsInfo.goods_id
      });
    },
    // 直接去购买
    To_buy() {
      let that = this;
      // 先从storage拿到session3rd
      uni.getStorage({
        key: "storage_key",
        success: res0 => {
          console.log("storage参数：", res0);
          // 调取后台接口，得到支付参数
          this.Ajax(
            "post",
            "member/order/create_order",
            {
              session3rd: res0.data.session3rd,
              goods_id: that.goodsInfo.goods_id,
              num: that.buy_number
            },
            res => {
              if (res.data.code === "200") {
                console.log("去支付参数", res);
                // 调起支付
                console.log("签名:", res.data.data.paySign);
                uni.requestPayment({
                  provider: "wxpay",
                  timeStamp: String(res.data.data.timeStamp),
                  nonceStr: res.data.data.nonceStr,
                  package: res.data.data.package,
                  signType: res.data.data.signType,
                  paySign: res.data.data.paySign,
                  success: function(res1) {
                    console.log("支付成功" + JSON.stringify(res));
                    that.getGoodsInfo();
                    uni.navigateTo({
                      url:
                        "../myCardBug/cards?order_id=" + res.data.data.order_id
                    });
                  },
                  fail: function(err) {
                    console.log("支付失败" + JSON.stringify(err));
                    uni.showToast({
                      title: "取消支付",
                      icon:"none"
                    });
                  }
                });
              }
            }
          );
        }
      });
    },
    To_buy1(e){

    },
    // 获取手机号
    GetPhoneNumber(res0) {
      if (res0.detail) {
        console.log("点击了同意授权", res0.detail);
        this.is_getNumber = true;
        // 判断登录态
        uni.checkSession({
          // 已登录状态
          success: loginres => {
            console.log("已登录：", loginres);
            // 获取手机号
            uni.getStorage({
              key: "storage_key",
              success: storageRes => {
                console.log("storageRes:", storageRes);
                uni.login({
                  success: loginRes => {
                    this.Ajax(
                      "post",
                      "member/user/set_mobile",
                      {
                        session3rd: storageRes.data.session3rd,
                        code: loginRes.code,
                        encryptedData: res0.detail.encryptedData,
                        iv: res0.detail.iv
                      },
                      resMobile => {
                        if (resMobile.data.code === "200") {

                        }
                      }
                    );
                  }
                });
              },
              fail: errorStorage => {
                console.log("获取session3rd的storage失败", errorStorage);
              }
            });
          },
          fail: error => {
            this.loginIn();
          }
        });
      } else {
        console.log("点击了拒绝授权");
      }
    },
    // 登录
    loginIn() {
      uni.login({
        success: reslogin => {
          console.log("登录返回：", reslogin);
          if (reslogin.code) {
            this.Ajax(
              "post",
              "member/Login/getLogin",
              {
                brand_id: 1,
                channel: "wechat",
                code: reslogin.code,
                detail: this.user_info
              },
              res => {
                console.log("调登录接口返回：", res);
                if (res.data.code === "200") {
                  uni.setStorage({
                    key: "storage_key",
                    data: res.data.data,
                    success: function(e) {
                      console.log("success", e);
                    }
                  });
                }
              }
            );
          } else {
            console.log("登录失败！" + res.errMsg);
          }
        }
      });
    },
    // 获取基本信息
    GetUserInfo(res) {
      console.log(res);
      if (res.detail.userInfo) {
        console.log("点击了同意基本信息授权");
        uni.setStorageSync("isFirst", res.detail.userInfo);
        this.user_info = res.detail;
        this.is_getuserInfo = true;
        this.loginIn();
      } else {
        console.log("点击了拒绝授权");
      }
    },
    // 未勾选情况下点我已了解
    NotLearned() {
      uni.showToast({
        title: "请勾选服务/隐私协议",
        duration: 3000,
        icon: "none"
      });
    },
    // 我已了解
    IHaveLearned() {
      if (!this.userOptions) {
        this.NotLearned();
      } else {
        uni.checkSession({
          success: loginRes => {}
        });
        this.userAgree = true;
        this.showTips = true;
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
  position: relative;
  background: #e8e8e8;
  padding: 24rpx 40rpx 40rpx;
}
.shadowBox {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
}
.warmPrompt {
  display: flex;
  flex-direction: column;
  margin: 100rpx 50rpx;
  padding: 60rpx 60rpx 100rpx;
  position: fixed;
  top: 50%;
  left: 0;
  z-index: 100;
  transform: translateY(-50%);
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
  height: auto;
  font-size: 26rpx;
  padding: 50rpx 0 20rpx;
  overflow: hidden;
  transition: all 0.5s;
  box-sizing: border-box;
  .title {
    display: flex;
    align-items: center;
    margin-top: 8rpx;
    image {
      height: 48rpx;
      width: 40rpx;
      margin-right: 20rpx;
    }
    font-size: 30rpx;
    font-weight: 600;
    color: #000000;
    letter-spacing: -0.68px;
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
      margin-top: 8rpx;
    }
  }
}
.hideTips {
  height: 0 !important;
  padding: 0 !important;
  overflow: hidden;
  transition: all 0.5s;
  box-sizing: border-box;
  image {
    height: 0;
  }
}
.goods_card {
  // background: url("http://wechatapppro-1252524126.file.myqcloud.com/appuaB1Y9Wy1245/image/ueditor/72823600_1574074898.png")
  //   no-repeat center;
  background-size: cover;
  border-radius: 15rpx;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  .card_top {
    padding: 43rpx 50rpx 0;
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
    padding: 50rpx 0;
    color: #ffffff;
    text-align: center;
  }
  .card_bottom {
    padding: 0 50rpx 64rpx;
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
.banner {
  // background: url("http://wechatapppro-1252524126.file.myqcloud.com/appuaB1Y9Wy1245/image/ueditor/56916900_1574074896.png")
  //   no-repeat center;
  background-size: cover;
  // margin-bottom: 40rpx;
  border-radius: 15rpx;
  display: flex;
  margin-top: 30rpx;
  flex-direction: column;
  .card_content {
    padding: 60rpx 50rpx 0;
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
}
</style>
