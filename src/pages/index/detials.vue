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
    <view class="goods_card">
      <view class="card_top">
        <view class="price">
          <text class="price_now">&yen;{{ producePrice() }}</text>
          <text class="price_original">&yen;{{ produceOriginalPrice() }}</text>
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
                v-if="buy_number === 1"
                src="../../static/images/no_reduce.png"
                @click="Toast('只有一张，不能再减少啦')"
              />
              <image v-else src="../../static/images/reduce.png" />
            </view>
            <view class="num">{{ buy_number }}</view>
            <view @click="add_number" class="add">
              <image
                v-if="buy_number === 10"
                src="../../static/images/no_add.png"
                @click="Toast('该优惠券最多只能买十张哦')"
              />
              <image v-else src="../../static/images/add.png" />
            </view>
          </view>
          <view class="purchase_limit">
            <text>最多可购买10张/次</text>
            <!-- <text class="inventory">库存：{{ goodsInfo.inventory }}</text> -->
          </view>
        </view>
        <view class="right">
          <!-- #ifndef MP-ALIPy -->
          <button v-if="is_getNumber" @click.stop="To_buy">
            去支付
          </button>
          <button
            v-else
            :open-type="is_getuserInfo ? 'getPhoneNumber' : 'getUserInfo'"
            @getphonenumber="GetPhoneNumber"
            @getuserinfo="GetUserInfo"
            @click.stop="To_buy1"
          >
            去支付
          </button>
          <!-- #endif -->
          <!-- #ifdef MP-ALIPAY -->
          <button v-if="is_getNumber" @click.stop="To_buy">
            去支付
          </button>
          <button
            v-else
            open-type="getAuthorize"
            @getAuthorize="onGetAuthorize"
            @error="onAuthError"
            @click.stop="To_buy1ALI"
            :scope="is_getuserInfo ? 'phoneNumber' : 'userInfo'"
            :disabled="HasSave ? false : true"
          >
            去支付
          </button>
          <!-- #endif -->
        </view>
      </view>
    </view>
  </view>
</template>
<script>
export default {
  data() {
    return {
      buy_number: 1,
      sum_number: 999,
      goodsId: "",
      goodsInfo: {},
      instructionsForUse: {},
      is_getuserInfo: false,
      is_getNumber: false,
      objQueryPid: "",
      buyFlag: null
    };
  },
  onReady() {
    this.getGoodInfo();
    this.getInstructionsForUse();
  },
  onShow() {
    this.getGoodInfo();
    this.getInstructionsForUse();
    const hasLogin = uni.getStorageSync("hasLogin");
    if (hasLogin) {
      this.is_getuserInfo = true;
    }
    console.log("hasLoginSSSSSSSSSSSSSSSSSSSSSdetail", hasLogin);
    const UserNumber = uni.getStorageSync("UserNumber");
    if (UserNumber) {
      this.is_getNumber = true;
    }
  },
  onLoad(val) {
    console.log("val", val);
    this.goodsId = val.id;
    this.buy_number = Number(val.buy_number);
    // this.instructionsForUse = JSON.parse(val.instructions);
    uni.setNavigationBarColor({
      backgroundColor: "#0D5A3A",
      frontColor: "#ffffff"
    });
  },
  // 用户分享
  onShareAppMessage() {
    return {
      // #ifdef MP-BAIDU
      title: "摩卡星",
      // #endif
      // #ifndef MP-BAIDU
      title: "这是喝星吧克最优惠的一种方式",
      // #endif
      path: "/pages/loading/loading",
      desc: "星吧克咖啡电子优惠券售卖平台"
      // imageUrl: "../../static/assets/logo.png"
    };
  },
  computed: {},
  methods: {
    // 优惠价格
    producePrice() {
      return (this.goodsInfo.price * this.buy_number).toFixed(2);
    },
    // 原价格
    produceOriginalPrice() {
      return this.goodsInfo.original_price * this.buy_number + ".00" || 0;
    },
    // 获取商品信息
    getGoodInfo() {
      this.Ajax(
        "post",
        "member/index/goods_info",
        { goods_id: this.goodsId },
        res => {
          if (res.data.code === "200") {
            this.goodsInfo = res.data.data.info;
          }
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
          if (res.data.code === "200") {
            this.instructionsForUse = res.data.data.instructions;
          }
        }
      );
    },
    // 直接去购买
    To_buy() {
      this.wxPayMent();
    },
    wxPayMent() {
      uni.showLoading({
        title: "加载中...",
        mask: true
      });
      if (this.buyFlag) {
        clearTimeout(this.buyFlag);
      }
      this.buyFlag = setTimeout(() => {
        // 先从storage拿到session3rd

        uni.getStorage({
          key: "storage_key",
          success: res0 => {
            // 调取后台接口，得到支付参数
            this.Ajax(
              "post",
              "member/order/create_order",
              {
                session3rd: res0.data.session3rd,
                goods_id: this.goodsInfo.goods_id,
                num: this.buy_number
              },
              res => {
                if (res.data.code === "200") {
                  console.log("去支付参数", res);
                  // 调起微信支付
                  // #ifdef MP-WEIXIN
                  uni.requestPayment({
                    provider: "wxpay",
                    timeStamp: String(res.data.data.timeStamp),
                    nonceStr: res.data.data.nonceStr,
                    package: res.data.data.package,
                    signType: res.data.data.signType,
                    paySign: res.data.data.paySign,
                    success: res1 => {
                      uni.hideLoading();
                      console.log("支付成功" + JSON.stringify(res));
                      this.getGoodInfo();
                      uni.navigateTo({
                        url:
                          "../myCardBug/cards?order_id=" +
                          res.data.data.order_id
                      });
                    },
                    fail: err => {
                      uni.hideLoading();
                      console.log("支付失败" + JSON.stringify(err));
                      uni.showToast({
                        title: "取消支付",
                        icon: "none"
                      });
                      // 记录取消支付的人
                      uni.getStorage({
                        key: "userID",
                        success: success => {
                          this.Record(
                            {
                              openId: success.data,
                              event_type: 3,
                              result: 0,
                              order_id: res.data.data.order_id,
                              msg: ""
                            },
                            record => {}
                          );
                        }
                      });
                    }
                  });
                  // #endif
                  // #ifdef MP-ALIPAY
                  my.tradePay({
                    // 调用统一收单交易创建接口（alipay.trade.create），获得返回字段支付宝交易号trade_no
                    tradeNO: res.data.data.trade_no,
                    success: res1 => {
                      console.log("调起支付成功！", res.data.data.order_id);
                      uni.hideLoading();
                      if (res1.resultCode == 9000) {
                        my.navigateTo({
                          url: `../myCardBug/cards?order_id=${res.data.data.order_id}`
                        });
                        console.log("执行了QQQQQQQQQQQQQQ");
                        // 记录支付成功的人
                        this.Record(
                          {
                            openId: res0.data.openid,
                            event_type: 3,
                            result: 1,
                            order_id: res.data.data.order_id,
                            msg: ""
                          },
                          record => {}
                        );
                      }
                    },
                    fail: res => {
                      console.log("调起支付失败！");
                      uni.hideLoading();
                      uni.showToast({
                        title: "取消支付",
                        icon: "none"
                      });
                      // 记录取消支付的人
                      this.Record(
                        {
                          openId: res0.data.openid,
                          event_type: 3,
                          result: 0,
                          order_id: res.data.data.order_id,
                          msg: ""
                        },
                        record => {}
                      );
                    }
                  });
                  // #endif
                  // #ifdef MP-BAIDU
                  swan.requestPolymerPayment({
                    orderInfo: res.data.data,
                    success: paysuccess => {
                      uni.hideLoading();
                      swan.showToast({
                        title: "支付成功",
                        icon: "success"
                      });
                      uni.navigateTo({
                        url: `../myCardBug/cards?order_id=${res.data.data.order_id}`
                      });
                      this.Record(
                        {
                          openId: res0.data.openid,
                          event_type: 3,
                          result: 1,
                          order_id: res.data.data.order_id,
                          msg: ""
                        },
                        record => {}
                      );
                    },
                    fail: err => {
                      uni.hideLoading();
                      swan.showToast({
                        title: "取消支付",
                        icon: "none"
                      });
                      console.log("pay fail", err);
                      // 记录取消支付的人
                      this.Record(
                        {
                          openId: res0.data.openid,
                          event_type: 3,
                          result: 0,
                          order_id: res.data.data.order_id,
                          msg: ""
                        },
                        record => {}
                      );
                    }
                  });
                  // #endif
                  // #ifdef MP-TOUTIAO
                  console.log(res.data.data, typeof res.data.data);
                  tt.pay({
                    orderInfo: res.data.data,
                    service: 1,
                    getOrderStatus(res) {
                      let { out_order_no } = res;
                      return new Promise(function(resolve, reject) {
                        // 商户前端根据 out_order_no 请求商户后端查询微信支付订单状态
                        tt.request({
                          url: "<your-backend-url>",
                          success(res) {
                            // 商户后端查询的微信支付状态，通知收银台支付结果
                            resolve({ code: 0 | 1 | 2 | 3 | 9 });
                          },
                          fail(err) {
                            reject(err);
                          }
                        });
                      });
                    },
                    success: payment => {
                      uni.hideLoading();
                      if (payment.code === 0) {
                        console.log("订单号", res.data.data.order_id);
                        uni.navigateTo({
                          url: `../myCardBug/cards?order_id=${res.data.data.order_id}`
                        });
                        this.Record(
                          {
                            openId: res0.data.openid,
                            event_type: 3,
                            result: 1,
                            order_id: res.data.data.order_id,
                            msg: ""
                          },
                          record => {}
                        );
                      }
                    },
                    fail: err => {
                      uni.hideLoading();
                      uni.showToast({
                        title: "取消支付",
                        icon: "none"
                      });
                      console.log("pay fail", err);
                      // 记录取消支付的人
                      this.Record(
                        {
                          openId: res0.data.openid,
                          event_type: 3,
                          result: 0,
                          order_id: res.data.data.order_id,
                          msg: ""
                        },
                        record => {}
                      );
                    }
                  });
                  // #endif
                } else {
                  if (res.data.code === "0032" || res.data.code === "0035") {
                    uni.showToast({
                      title: res.data.msg || "库存不足",
                      icon: "none"
                    });
                  } else {
                    uni.showToast({
                      title: "网络异常，请稍后重试",
                      icon: "none"
                    });
                  }
                }
              }
            );
          }
        });
      }, 500);
    },

    To_buy1() {
      // #ifdef MP-TOUTIAO
      if (this.is_getuserInfo) {
        console.log("拿到了基本信息");
        return;
      }
      uni.login({
        success: reslogin => {
          console.log("登录成功！", reslogin);
          uni.setStorageSync("resloginCode", reslogin.code);
          tt.getUserInfo({
            withCredentials: true,
            success: userinfo => {
              uni.showLoading({
                title: "登录中..."
              });
              if (reslogin.code) {
                this.Ajax(
                  "post",
                  "member/Login/bytegetLogin",
                  {
                    brand_id: 1,
                    channel: "byte",
                    code: reslogin.code,
                    detail: userinfo
                  },
                  res => {
                    console.log("调登录接口返回：", res);
                    if (res.data.code === "200") {
                      this.is_getuserInfo = true;
                      uni.hideLoading();
                      uni.setStorageSync("hasLogin", 1);
                      uni.setStorage({
                        key: "storage_key",
                        data: res.data.data
                      });
                      if (res.data.data.is_read === 0) {
                        getApp().globalData.is_read = false;
                      } else {
                        getApp().globalData.is_read = true;
                      }
                    } else {
                      uni.hideLoading();
                    }
                  }
                );
              } else {
                console.log("登录失败！" + res.errMsg);
              }
            },
            fail(res) {
              console.log(`getUserInfo 调用失败`);
              uni.openSetting({
                success(dataAu) {
                  console.log("打开了设置", dataAu);
                  if (dataAu.authSetting["scope.userInfo"]) {
                  }
                }
              });
            }
          });
        }
      });
      // #endif
    },
    // 支付宝获取基本信息或者手机号
    onGetAuthorize() {
      if (this.is_getuserInfo) {
        uni.showLoading({
          title: "加载中"
        });
        console.log("应该调起获取手机号", this.is_getuserInfo);
        my.getPhoneNumber({
          success: resNumber => {
            uni.hideLoading();
            console.log("获取手机号返回：", resNumber);
            uni.getStorage({
              key: "storage_key",
              success: storageRes => {
                this.Ajax(
                  "post",
                  "member/user/ali_mobile",
                  {
                    session3rd: storageRes.data.session3rd,
                    response: resNumber.response
                  },
                  resMobile => {
                    if (resMobile.data.code === "200") {
                      console.log("保存成功");
                      this.HasSave = true;
                      if (!this.is_read) {
                        this.userNotice = true; //弹出用户须知
                      }
                      uni.hideLoading();
                      this.is_getNumber = true;
                      uni.setStorageSync(
                        "UserNumber",
                        resMobile.data.data.mobile
                      );
                    } else {
                      this.HasSave = true;
                      uni.hideLoading();
                      uni.showToast({
                        title: "网络请求失败，请重试",
                        icon: "none"
                      });
                    }
                  }
                );
              }
            });
          },
          fail: res => {
            uni.showToast({
              title: "网络请求失败，请重试",
              icon: "none"
            });
            uni.hideLoading();
            console.log(res);
            console.log("getPhoneNumber_fail");
          }
        });
      } else {
        uni.showLoading({
          title: "加载中"
        });
        console.log("应该调起获取基本信息");
        my.getOpenUserInfo({
          success: resInfo => {
            let userInfo = JSON.parse(resInfo.response).response;
            console.log("获取基本信息返回", userInfo);
            this.is_getuserInfo = true;
            this.loginIn(userInfo);
            uni.hideLoading();
          },
          error: e => {
            console.log("错误信息", e);
            uni.hideLoading();
          }
        });
      }
    },
    To_buy1ALI(e) {},
    // 微信获取手机号
    GetPhoneNumber(res0) {
      uni.showLoading({
        title: "加载中..."
      });
      if (res0.detail.iv) {
        console.log("点击了同意手机号授权", res0.detail);
        // 判断登录态
        uni.checkSession({
          // 已登录状态
          success: loginres => {
            console.log("已登录状态：", loginres);
            // 获取手机号
            uni.getStorage({
              key: "storage_key",
              success: storageRes => {
                // #ifdef MP-TOUTIAO
                this.Ajax(
                  "post",
                  "member/user/byte_mobile",
                  {
                    session3rd: storageRes.data.session3rd,
                    encryptedData: res0.detail.encryptedData,
                    iv: res0.detail.iv
                  },
                  resMobile => {
                    if (resMobile.data.code === "200") {
                      uni.hideLoading();
                      this.is_getNumber = true;
                      uni.setStorageSync(
                        "UserNumber",
                        resMobile.data.data.mobile
                      );
                    } else {
                      this.HasSave = true;
                      uni.hideLoading();
                      uni.showToast({
                        title: "网络请求失败，请重试",
                        icon: "none"
                      });
                    }
                  }
                );
                // #endif
                // #ifndef MP-TOUTIAO
                uni.login({
                  success: loginRes => {
                    // #ifdef MP-WEIXIN
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
                          uni.hideLoading();
                          this.is_getNumber = true;
                          uni.setStorageSync(
                            "UserNumber",
                            resMobile.data.data.mobile
                          );
                        } else {
                          uni.hideLoading();
                        }
                      }
                    );
                    // #endif
                    // #ifdef MP-BAIDU
                    this.Ajax(
                      "post",
                      "member/user/bd_mobile",
                      {
                        session3rd: storageRes.data.session3rd,
                        code: loginRes.code,
                        detail: res0.detail
                      },
                      resMobile => {
                        if (resMobile.data.code === "200") {
                          uni.hideLoading();
                          this.is_getNumber = true;
                          uni.setStorageSync(
                            "UserNumber",
                            resMobile.data.data.mobile
                          );
                        } else {
                          uni.hideLoading();
                        }
                      }
                    );
                    // #endif
                  }
                });
                // #endif
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
        uni.hideLoading();
        console.log("点击了拒绝手机号授权");
      }
    },
    // 登录
    loginIn(user_info) {
      uni.showLoading({
        title: "加载中"
      });
      uni.getStorage({
        key: "obj.query.pid",
        success: pid => {
          this.objQueryPid = pid.data;
        }
      });
      // #ifdef MP-WEIXIN
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
                detail: this.user_info,
                pid: this.objQueryPid || 0
              },
              res => {
                console.log("调登录接口返回：", res);

                if (res.data.code === "200") {
                  this.is_getuserInfo = true;
                  uni.hideLoading();
                  uni.setStorageSync("hasLogin", 1);
                  uni.setStorage({
                    key: "storage_key",
                    data: res.data.data
                  });
                  if (res.data.data.mobile) {
                    uni.setStorageSync("UserNumber", res.data.data.mobile);
                  }
                  if (res.data.data.is_read === 0) {
                    getApp().globalData.is_read = false;
                  } else {
                    getApp().globalData.is_read = true;
                  }
                } else {
                  uni.hideLoading();
                  uni.showToast({
                    title: "网络请求失败，请重试",
                    icon: "none"
                  });
                }
              }
            );
          } else {
            console.log("登录失败！" + res.errMsg);
          }
        }
      });
      // #endif
      //   支付宝登录
      // #ifdef MP-ALIPAY
      my.getAuthCode({
        scopes: "auth_base",
        success: reslogin => {
          console.log("授权码为:", reslogin);
          if (reslogin.authCode) {
            this.Ajax(
              "post",
              "member/Login/aligetLogin",
              {
                brand_id: 1,
                channel: "ali",
                code: reslogin.authCode,
                detail: this.user_info,
                pid: 0
              },
              res => {
                console.log("调登录接口返回：", res);
                if (res.data.code === "200") {
                  uni.hideLoading();
                  this.is_getuserInfo = true;
                  uni.setStorageSync("hasLogin", 1);
                  uni.setStorage({
                    key: "storage_key",
                    data: res.data.data
                  });
                  if (res.data.data.mobile) {
                    uni.setStorageSync("UserNumber", res.data.data.mobile);
                  }
                  if (res.data.data.is_read === 0) {
                    getApp().globalData.is_read = false;
                  } else {
                    getApp().globalData.is_read = true;
                  }
                } else {
                  uni.hideLoading();
                }
              }
            );
          } else {
            console.log("登录失败！" + res.errMsg);
          }
        }
      });
      // #endif
      // 百度
      // #ifdef MP-BAIDU
      uni.login({
        success: reslogin => {
          console.log("resLogin:", reslogin);
          if (reslogin.code) {
            this.Ajax(
              "post",
              "member/Login/bdgetLogin",
              {
                brand_id: 1,
                channel: "baidu",
                code: reslogin.code,
                detail: this.user_info,
                pid: this.objQueryPid || 0
              },
              res => {
                console.log("调登录接口返回：", res);
                if (res.data.code === "200") {
                  uni.hideLoading();
                  this.is_getuserInfo = true;
                  uni.setStorageSync("hasLogin", 1);
                  uni.setStorage({
                    key: "storage_key",
                    data: res.data.data
                  });
                  if (res.data.data.mobile) {
                    uni.setStorageSync("UserNumber", res.data.data.mobile);
                  }
                  if (res.data.data.is_read === 0) {
                    getApp().globalData.is_read = false;
                  } else {
                    getApp().globalData.is_read = true;
                  }
                } else {
                  uni.hideLoading();
                  uni.showToast({
                    title: "登录失败请重试"
                  });
                }
              }
            );
          } else {
            console.log("登录失败！" + res.errMsg);
          }
        }
      });
      // #endif
    },
    // 获取基本信息
    GetUserInfo(res) {
      console.log(res);
      if (res.detail.iv) {
        console.log("点击了同意基本信息授权");
        this.user_info = res.detail;
        this.is_getuserInfo = true;
        // 记录同意授权的人
        uni.getStorage({
          key: "userID",
          success: success => {
            this.Record(
              {
                openId: success.data,
                event_type: 1,
                result: 1,
                order_id: "",
                msg: ""
              },
              record => {}
            );
          }
        });
        this.loginIn();
      } else {
        console.log("点击了拒绝授权");
        // 记录拒绝授权的人
        uni.getStorage({
          key: "userID",
          success: success => {
            this.Record(
              {
                openId: success.data,
                event_type: 1,
                result: 0,
                order_id: "",
                msg: ""
              },
              record => {}
            );
          }
        });
      }
    },
    // 减少购买数量
    reduce_number() {
      if (this.buy_number <= 1) {
        uni.showToast({
          title: "只有一张，不能再减少啦",
          icon: "none"
        });
        return;
      } else {
        this.buy_number--;
      }
    },
    // 增加购买数量
    add_number() {
      if (this.buy_number >= 10) {
        uni.showToast({
          title: "一次只能购买10张哦",
          icon: "none"
        });
        return;
      }
      if (this.buy_number >= this.goodsInfo.inventory) {
        uni.showToast({
          title: "哎呀，库存不够了~",
          icon: "none"
        });
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
    }
  }
};
</script>
<style lang="scss" scoped>
.content {
  background: url("http://wechatapppro-1252524126.file.myqcloud.com/appmTIXQdmp3575/image/ueditor/45537100_1575352285.png")
    no-repeat center;
  background-size: cover;
  min-height: 100vh;
  padding: 40rpx;
}
.tips {
  display: none;
  display: flex;
  flex-direction: column;
  font-size: 26rpx;
  color: #ffffff;
  .title {
    font-size: 30rpx;
    letter-spacing: -0.68px;
    padding-left: 6rpx;
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
  background-color: #ffffff;
  border-radius: 24rpx;
  height: 834rpx;
  display: flex;
  margin-top: 20rpx;
  flex-direction: column;
  justify-content: space-between;
  box-shadow: 1px 15px 35px -10px rgba(4, 32, 8, 0.6);
  overflow: hidden;
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
        font-family: HelveticaNeue-Bold;
        margin-right: 20rpx;
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
    }
  }
  image {
    height: 320rpx;
    width: 320rpx;
    margin: 0 auto;
  }
  .card_bottom {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding: 0 50rpx 64rpx;
    align-items: center;
    .left {
      display: flex;
      flex-direction: column;
      .number {
        display: flex;
        width: 184rpx;
        flex-direction: row;
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
        .add {
          display: flex;
          align-items: center;
          image {
            height: 40rpx;
            width: 40rpx;
          }
        }
        .num {
          color: #000000;
          font-size: 30rpx;
        }
      }
      .purchase_limit {
        margin-top: 14rpx;
        display: flex;
        flex-direction: row;
        .inventory {
          font-weight: bold;
          margin-left: 14rpx;
        }
        text {
          opacity: 0.4;
          font-family: PingFangSC-Semibold;
          font-size: 22rpx;
          color: #000000;
          letter-spacing: 0;
          text-align: right;
        }
      }
    }
    button {
      opacity: 0.95;
      background: #42b069;
      border-radius: 45rpx;
      font-size: 30rpx;
      color: #ffffff;
      height: 72rpx;
      width: 260rpx;
      line-height: 72rpx;
    }
  }
}
</style>
