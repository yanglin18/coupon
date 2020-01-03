import navigationbar from "@/components/navigationBar/navigationBar";
import tabBar from "@/components/tabBar/tabBar";
export default {
  components: {
    navigationbar,
    tabBar
  },
  data() {
    const app = getApp();
    return {
      userOptions: false, //用户是否勾选
      userAgree: true, //用户是否点击“我已了解”
      is_read: app.globalData.is_read, //用户是否点击“我记住了，不用再提醒”
      goodsInfo: [], //商品信息
      instructions_for_use: "", //使用须知
      banners: {}, //banner
      skin: {}, //皮肤
      sum_number: 66,
      animationData: {}, //动画
      user_info: {}, //用户信息,
      share: false, //点击分享
      is_getuserInfo: false,
      beautifulPhoto: "", //美图保存地址
      is_getNumber: false,
      // 展示温馨提示
      showTips: true,
      // 购买开关（防多次点击）
      buyFlag: null,
      objQueryPid: "", //登录时需要的Pid
      navHeight: app.globalData.navHeight,
      tabHeight: app.globalData.tabHeight,
      userNotice: false,
      goodItem: "",
      HasSave: true, //防止多次唤起手机号授权
      // #ifdef MP-WEIXIN
      title: "摩卡星",
      // #endif
      // #ifdef MP-ALIPAY
      title: ""
      // #endif
    };
  },
  computed: {},
  // watch: {
  //   userAgree(val) {
  //     console.log("WatchQQQQQQWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW", val);
  //     if (!val) {
  //       console.log("if", val);
  //       setTimeout(() => {
  //         uni.hideTabBar({
  //           fail() {
  //             console.log("失败");
  //           }
  //         });
  //       }, 500);
  //     }
  //   }
  // },
  // 如果detail里面授权登录和手机号，标识返回到主页
  onShow() {
    setTimeout(() => {
      uni.hideTabBar({
        fail() {
          console.log("失败");
        }
      });
    }, 300);
    this.getGoodsInfo();
    const UserNumber = uni.getStorageSync("UserNumber");
    if (UserNumber) {
      this.is_getNumber = true;
    }
    const hasLogin = uni.getStorageSync("hasLogin");
    if (hasLogin) {
      this.is_getuserInfo = true;
    }
    console.log("hasLoginSSSSSSSSSSSSSSSSSSSSSindex", hasLogin);
    console.log("登录成功？", hasLogin, this.is_getuserInfo);
    console.log("手机号？", this.is_getNumber);
  },
  onLoad() {
    this.getInstructionsForUse();
    this.getBanner();
    this.getSkin();
    this.showTips = false;
    const isAuthorizeLogin = uni.getStorageSync("isAuthorizeLogin");
    console.log("是在授权页登录过了吗？", isAuthorizeLogin);
    const aa = uni.getStorageSync("hasLogin");
    if (aa && !isAuthorizeLogin) {
      this.userAgree = true;
      uni.hideTabBar();
    } else {
      this.userAgree = false;
      uni.hideTabBar();
    }
    uni.setNavigationBarColor({
      backgroundColor: "#FFFFFF"
      // frontColor: "#000000"
    });
  },
  // 用户分享
  onShareAppMessage() {
    return {
      title: "这是喝星吧克最优惠的一种方式",
      path: "/pages/loading/loading",
      desc: "星吧克咖啡电子优惠券售卖平台"
      // imageUrl: "../../static/assets/logo.png"
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
    cleanEvent() {
      uni.getStorage({
        key: "storage_key",
        success: res0 => {
          this.Ajax(
            "post",
            "member/User/del_user",
            { session3rd: res0.data.session3rd },
            res => {
              if (res.data.code === "200") {
                console.log("清理成功!");
              }
            }
          );
        }
      });
    },
    onGetAuthorize() {
      if (this.is_getuserInfo) {
        console.log("应该调起获取手机号", this.is_getuserInfo);
        uni.showLoading();
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
        uni.showLoading();
        console.log("应该调起获取基本信息", this.is_getuserInfo);
        my.getOpenUserInfo({
          success: resInfo => {
            let userInfo = JSON.parse(resInfo.response).response;
            console.log("获取基本信息返回", userInfo);
            this.loginIn(userInfo);
            this.is_getuserInfo = true;
            uni.hideLoading();
          },
          error: e => {
            uni.hideLoading();
            console.log("错误信息", e);
          }
        });
      }
    },
    // 支付宝拒绝基本信息or手机e号授权
    onAuthError(e) {
      console.log("拒绝授权", e);
    },
    // 登录
    loginIn(user_info) {
      uni.showLoading();
      uni.getStorage({
        key: "obj.query.pid",
        success: pid => {
          this.objQueryPid = pid.data;
        }
      });
      //   #ifdef MP-WEIXIN
      uni.login({
        success: reslogin => {
          console.log("登录成功！", reslogin);
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
                if (res.data.code === "200") {
                  uni.hideLoading();
                  uni.setStorageSync("hasLogin", 1);
                  uni.setStorage({
                    key: "storage_key",
                    data: res.data.data,
                    success: function(e) {
                      console.log("success", e);
                    }
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
      //   #endif
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
                detail: user_info,
                pid: 0
              },
              res => {
                console.log("调登录接口返回：", res);
                if (res.data.code === "200") {
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
                }
              }
            );
          } else {
            console.log("登录失败！" + res.errMsg);
          }
        }
      });
      // #endif
      // #ifdef MP-BAIDU
      uni.login({
        success: reslogin => {
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
    // 优惠价格
    producePrice(item) {
      return item.price * item.buy_number;
    },
    // 原价格
    produceOriginalPrice(item) {
      return item.original_price * item.buy_number + ".00" || 0;
    },
    // 获取商品信息
    getGoodsInfo() {
      this.Ajax("post", "member/index/index", { brand_id: 1 }, res => {
        if (res.data.code === "200") {
          this.goodsInfo = res.data.data.list.map(item => {
            item.buy_number = 1;
            return item;
          });
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
    // 获取皮肤
    getSkin() {
      this.Ajax("post", "member/index/skin", { brand_id: 1 }, res => {
        console.log(res);
        if (res.data.code === "200") {
          this.skin = res.data.data.skin;
          console.log("皮肤：", this.skin);
        }
      });
    },
    // 分享
    Share() {
      // #ifdef MP-ALIPAY
      uni.showSharePanel({
        withShareTicket: true
      });
      // #endif
      // #ifdef MP-WEIXIN
      if (!this.is_getuserInfo) {
        uni.navigateTo({
          url: "../index/authorize"
        });
        return;
      }
      uni.hideTabBar({
        animation: true
      });
      this.share = true;
      uni.getStorage({
        key: "storage_key",
        success: res0 => {
          console.log("storage参数：", res0);
          this.Ajax(
            "post",
            "member/user/my_qrcode",
            { session3rd: res0.data.session3rd },
            res => {
              if (res.data.code === "200") {
                console.log("我要的生成美图", res.data.data.list);
                this.beautifulPhoto = res.data.data.list;
              }
            }
          );
        }
      });
      // #endif
      // #ifdef MP-BAIDU
      swan.openShare();
      // #endif
    },
    // 长按保存图片
    saveImg(url) {
      console.log("长按图片");
      // 先获取相册权限
      uni.authorize({
        scope: "scope.writePhotosAlbum",
        success(res) {
          console.log("授权成功", res);
          uni.setStorage({
            key: "PhotoAlbum",
            data: "true"
          });
        },
        fail(error) {
          // console.log("error:", error);
          uni.showToast({
            title: "请授权后再保存",
            duration: 1000,
            icon: "none"
          });
          uni.setStorage({
            key: "PhotoAlbum",
            data: "false"
          });
        },
        complete() {}
      });
      // 再保存
      uni.getStorage({
        key: "PhotoAlbum",
        success: res0 => {
          if (res0.data === "true") {
            // 处理图片
            console.log("开始处理图片");
            uni.getImageInfo({
              src: url,
              success: function(image) {
                let image_path = image.path;
                console.log("处理后的图片路径", image);
                uni.saveImageToPhotosAlbum({
                  filePath: image_path,
                  success: function(res0) {
                    uni.showToast({
                      title: "保存成功",
                      duration: 1000
                    });
                  },
                  fail: function(error) {
                    console.log("保存到手机失败");
                  }
                });
              },
              fail: error => {
                console.log("获取图片信息失败");
              }
            });
          } else {
            console.log("进入false");
            // 重新调起设置授权相册
            uni.showModal({
              title: "提示",
              content: "必须要授权后才能保存哦",
              confirmText: "去授权",
              success: function(res) {
                if (res.confirm) {
                  uni.openSetting({
                    success(dataAu) {
                      if (dataAu.authSetting["scope.writePhotosAlbum"]) {
                        uni.setStorage({
                          key: "PhotoAlbum",
                          data: "true"
                        });
                      }
                    }
                  });
                } else if (res.cancel) {
                  console.log("用户点击取消");
                }
              }
            });
          }
        }
      });
    },
    // 关闭分享
    close_share() {
      this.share = false;
    },
    // 减少购买数量
    reduce_number(item) {
      if (item.buy_number <= 1) {
        uni.showToast({
          title: "只有一张，不能再减少啦",
          icon: "none"
        });
        return;
      }
      item.buy_number--;
    },
    // 增加购买数量
    add_number(item) {
      if (item.buy_number >= 10) {
        uni.showToast({
          title: "一次只能购买10张哦",
          icon: "none"
        });
        return;
      }
      if (item.buy_number >= item.inventory) {
        uni.showToast({
          title: "哎呀，库存不够了~",
          icon: "none"
        });
        return;
      }
      item.buy_number++;
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
    NavToDetial(item) {
      if (item.inventory === 0) {
        uni.showToast({
          title: "全力补货中，请稍等...",
          icon: "none"
        });
        return;
      }
      let inst = JSON.stringify(this.instructions_for_use);
      uni.navigateTo({
        url: "./detials?id=" + item.goods_id + "&buy_number=" + item.buy_number
      });
    },
    sellOut() {
      uni.showToast({
        title: "全力补货中，请稍等...",
        icon: "none"
      });
    },
    //点击去支付
    To_buy(item) {
      if (!this.is_read) {
        this.userNotice = true;
        this.goodItem = item; //弹出用户须知
        return;
      } else {
        this.wxPayMent(item);
      }
    },
    // 微信支付
    wxPayMent(item) {
      console.log("to_buy", item);
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
                goods_id: item.goods_id,
                num: item.buy_number
              },
              res => {
                if (res.data.code === "200") {
                  console.log("支付数据：", res.data.data);
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
                      this.getGoodsInfo();
                      // 记录支付成功的人
                      uni.getStorage({
                        key: "userID",
                        success: success => {
                          this.Record(
                            {
                              openId: success.data,
                              event_type: 3,
                              result: 1,
                              order_id: res.data.data.order_id,
                              msg: ""
                            },
                            record => {}
                          );
                        }
                      });
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
                    success: res0 => {
                      console.log("调起支付成功！", res.data.data.order_id);
                      uni.hideLoading();
                      if (res0.resultCode == 9000) {
                        my.navigateTo({
                          url: `../myCardBug/cards?order_id=${res.data.data.order_id}`
                        });
                        this.getGoodsInfo();
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
                    fail: e => {
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
                    success: res => {
                      swan.showToast({
                        title: "支付成功",
                        icon: "success"
                      });
                    },
                    fail: err => {
                      swan.showToast({
                        title: "支付失败，请稍后重试",
                        icon: "none"
                      });
                      console.log("pay fail", err);
                    }
                  });
                  // #endif
                } else {
                  uni.hideLoading();
                  if (res.data.code === "0032" || res.data.code === "0035") {
                    uni.showToast({
                      title: res.data.msg || "库存不足",
                      icon: "none"
                    });
                    this.getGoodsInfo();
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
    To_buy1() {},
    // 支付宝小程序中点击去支付获取信息或手机号
    To_buy1ALI(e) {},
    // 获取手机号
    GetPhoneNumber(res0) {
      if (res0.detail.iv) {
        uni.showLoading({
          title: "加载中..."
        });
        console.log("点击了同意授权", res0.detail);
        this.HasSave = false;
        // 判断登录态
        uni.checkSession({
          // 已登录状态
          success: loginres => {
            console.log("已登录：", loginres);
            // 获取手机号
            uni.getStorage({
              key: "storage_key",
              success: storageRes => {
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
                    // #endif
                    // ifdef MP-ABIDU
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
                    // endif
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
        uni.hideLoading();
        console.log("点击了拒绝授权");
      }
    },

    // 获取基本信息
    GetUserInfo(res) {
      console.log(res);
      if (res.detail.userInfo) {
        console.log("点击了同意基本信息授权");
        this.user_info = res.detail;
        this.is_getuserInfo = true;
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
    // 未勾选情况下点我已了解
    NotLearned() {
      uni.showToast({
        title: "请勾选服务/隐私协议",
        icon: "none"
      });
    },
    // 我已了解
    IHaveLearned() {
      if (!this.userOptions) {
        this.NotLearned();
      } else {
        uni.removeStorageSync("isAuthorizeLogin");
        this.userAgree = true;
        this.showTips = true;
        // 记录同意协议的人
        uni.getStorage({
          key: "userID",
          success: resKey => {
            this.Record(
              {
                openId: resKey.data,
                event_type: 2,
                result: 1,
                order_id: "",
                msg: ""
              },
              record => {}
            );
          }
        });
      }
    },
    // 用户同意协议
    agree() {
      this.userOptions = !this.userOptions;
    },
    iRemeberIt() {
      this.is_read = !this.is_read;
      // console.log("用户是否阅读了", this.is_read);
    },
    // 跳转到协议详情
    NavToagreement(val) {
      console.log(val);
      uni.navigateTo({
        url: val
      });
    },
    // 我了解了，不用再提醒我
    set_field() {
      if (this.is_read) {
        uni.getStorage({
          key: "storage_key",
          success: res0 => {
            this.Ajax(
              "post",
              "member/user/set_field",
              {
                session3rd: res0.data.session3rd,
                field: "is_read",
                data: 1
              },
              res => {
                if (res.data.code === "200") {
                } else {
                }
              }
            );
          }
        });
      }
    },
    cancelNotice() {
      this.userNotice = false;
      this.is_read = false;
    },
    pay() {
      this.userNotice = false;
      this.set_field();
      this.wxPayMent(this.goodsInfo[0]);
    }
  }
};
