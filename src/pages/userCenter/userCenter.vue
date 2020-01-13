<template>
  <view
    class="main"
    v-bind:style="{
      paddingTop: navHeight + 'px'
    }"
  >
    <navigationbar
      class="navbar"
      :status_img="skin.status_img"
      :title="text"
    ></navigationbar>
    <view class="content">
      <image
        :src="skin.img"
        :default-source="skin.img"
        class="allBgImg"
        v-bind:style="{
          paddingTop: navHeight + 'px',
          paddingBottom: tabHeight + 'px'
        }"
      ></image>
      <view>
        <view class="top_card">
          <view class="title">
            <text>个人中心 </text>
          </view>
          <view class="bottom" @click="NavToModify">
            <view class="left">
              <image :src="user_info.head_img || default_avter" />
              <!-- #ifndef MP-ALIPAY -->
              <button
                size="mini"
                open-type="getUserInfo"
                @getuserinfo="GetUserInfo"
                @click="ByteLoginIn"
                v-if="!hasLogin1"
                class="Login_in"
              >
                登录
              </button>
              <!-- #endif -->
              <!-- #ifdef MP-ALIPAY -->
              <button
                size="mini"
                open-type="getAuthorize"
                @getAuthorize="GetAuthorize"
                @error="onAuthError"
                scope="userInfo"
                v-if="!hasLogin1"
                class="Login_in"
              >
                登录
              </button>
              <!-- #endif -->
              <text v-else class="name">{{ user_info.user_name }}</text>
            </view>
            <view class="right">
              <image class="arrow" src="../../static/assets/toRight.png" />
            </view>
          </view>
        </view>
        <view class="about">
          <view class="service deline" @click="contactService">
            <view class="left">
              <image class="leftImage" src="../../static/assets/service.png" />
              <text>联系客服</text>
            </view>
            <image class="arrow" src="../../static/assets/toRight.png" />
          </view>
          <view class="service" @click="NavTo('./about')">
            <view class="left">
              <image class="leftImage" src="../../static/assets/about.png" />
              <text>关于</text>
            </view>

            <image class="arrow" src="../../static/assets/toRight.png" />
          </view>
        </view>
        <button open-type="share" @click="Share" class="share">
          <image src="../../static/images/share3.jpg" />
        </button>
      </view>
      <!-- 分享弹窗 -->
      <view v-if="share" class="sharePopup">
        <view class="imgWrap" @longpress="saveImg(beautifulPhoto.filename)">
          <image :src="beautifulPhoto.show_img" class="bgImage"></image>
          <view class="weixinIcon">
            <view class="image_share">
              <button class="image_share_button" open-type="share">
                <image src="../../static/assets/weixin.png" class="imgIcon" />
              </button>
              <view class="text_weixin">
                微信好友
              </view>
            </view>
          </view>
        </view>
        <!-- 关闭按钮 -->
        <view class="close" @click="close_share">
          <image class="close_img" src="../../static/assets/close.png" />
        </view>
      </view>
      <!-- 联系客服弹窗 -->
      <view v-if="contactUS" class="contactUS">
        <view class="contactTop">
          <view class="Phone_number">
            <text @click="callUS"
              >手机号：<text style="color: #42B069;">13570303413</text></text
            >
          </view>
          <view class="copy_weixin">
            <text>微信号：mokaxing01</text>
            <text @click="copy_no" class="copy">复制</text>
          </view>
        </view>
        <view class="contactBottom" @click="Iknow">
          <text>我知道了</text>
        </view>
      </view>
    </view>
    <!-- #ifndef MP-TOUTIAO -->
    <tabBar class="tabBar" :banner="skin.banner ? skin.banner : ''"></tabBar>
    <!-- #endif -->
    <!-- 遮罩 -->
    <view class="shadowBox" v-show="share || contactUS"></view>
  </view>
</template>
<script>
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
      text: "",
      user_icon: "../../static/images/user.png",
      user_name: "喵喵喵",
      gender: "男",
      phoneNumber: "12345678212",
      weixin: "XXXXXX",
      share: false, //点击分享
      access_token: "",
      user_info: {},
      src2: "",
      isLoginIn: false, //是否登录
      beautifulPhoto: "", //美图保存地址
      hasLogin1: null, //是否登录
      contactUS: false,
      is_getuserInfo: false,
      UserInfo: {},
      objQueryPid: "",
      default_avter: "../../static/assets/default_avter.png",
      skin: {},
      navHeight: app.globalData.navHeight,
      tabHeight: app.globalData.tabHeight
    };
  },
  onShow() {
    this.getUser();
    const hasLogin = uni.getStorageSync("hasLogin");
    if (hasLogin) {
      this.hasLogin1 = true;
    }
    console.log("hasLoginSSSSSSSSSSSSSSSSSSSSSusercenter", hasLogin);
  },
  onLoad() {
    this.getSkin();
    uni.setNavigationBarColor({
      backgroundColor: "#FFFFFF",
      frontColor: "#000000"
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
  methods: {
    // 获取基本信息
    getUser() {
      console.log("qweqwwwe");
      let that = this;
      let session3rd = "";
      uni.getStorage({
        key: "storage_key",
        success: res0 => {
          that.Ajax(
            "post",
            "member/user/index",
            { session3rd: res0.data.session3rd },
            res => {
              if (res.data.code === "200") {
                that.user_info = res.data.data.info;
                console.log("user_info:", that.user_info);
              }
            }
          );
        }
      });
    },
    // 获取基本信息授权
    GetUserInfo(res) {
      console.log(res);
      if (res.detail.iv) {
        console.log("点击了同意基本信息授权");
        this.is_getuserInfo = true;
        this.UserInfo = res.detail;
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
    // 头条的获取基本信息和登录
    ByteLoginIn() {
      // #ifdef MP-TOUTIAO
      if (this.is_getuserInfo === true) {
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
                      uni.setStorageSync("hasLogin", 1);
                      this.hasLogin1 = true;
                      uni.setStorage({
                        key: "storage_key",
                        data: res.data.data,
                        success: () => {
                          this.getUser();
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
                    }
                  }
                );
              } else {
                console.log("登录失败！" + res.errMsg);
              }
            },
            fail(res) {
              console.log(`getUserInfo 调用失败`);
            }
          });
        }
      });
      // #endif
    },
    // 支付宝授权
    GetAuthorize() {
      my.getOpenUserInfo({
        success: resInfo => {
          console.log("支付宝用户基本信息：", resInfo);
          let userInfo = JSON.parse(resInfo.response).response;
          this.loginIn(userInfo);
        },
        error: e => {
          console.log("错误信息", e);
        }
      });
    },
    onAuthError() {},
    // 登录
    loginIn(user_info) {
      uni.getStorage({
        key: "obj.query.pid",
        success: pid => {
          this.objQueryPid = pid.data;
        }
      });
      // 支付宝
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
                if (res.data.code === "200") {
                  uni.setStorageSync("hasLogin", 1);
                  this.hasLogin1 = true;
                  uni.setStorage({
                    key: "storage_key",
                    data: res.data.data,
                    success: () => {
                      this.getUser();
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
                }
              }
            );
          } else {
            console.log("登录失败！" + res.errMsg);
          }
        }
      });
      // #endif
      // 微信
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
                detail: this.UserInfo,
                pid: this.objQueryPid || 0
              },
              res => {
                console.log("调登录接口返回：", res);

                if (res.data.code === "200") {
                  uni.setStorageSync("hasLogin", 1);
                  this.hasLogin1 = true;
                  uni.setStorage({
                    key: "storage_key",
                    data: res.data.data,
                    success: e => {
                      this.getUser();
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
                detail: this.UserInfo,
                pid: this.objQueryPid || 0
              },
              res => {
                console.log("调登录接口返回：", res);
                if (res.data.code === "200") {
                  uni.setStorageSync("hasLogin", 1);
                  this.hasLogin1 = true;
                  uni.setStorage({
                    key: "storage_key",
                    data: res.data.data,
                    success: e => {
                      this.getUser();
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
    // 联系客服
    contactService() {
      this.contactUS = true;
    },
    // 拨打电话
    callUS() {
      uni.makePhoneCall({
        phoneNumber: "13570303413" //仅为示例
      });
    },
    // 我知道了
    Iknow() {
      this.contactUS = false;
    },
    // 跳转
    NavTo(e) {
      uni.navigateTo({
        url: e
      });
    },
    // 跳转到修改
    NavToModify() {
      if (!this.hasLogin1) {
        return;
      }
      let name = this.user_name;
      let icon = this.user_icon;
      let gender = this.gender;
      let phoneNumber = this.phoneNumber;
      let weixin = this.weixin;
      uni.navigateTo({
        url:
          "./modifyData?name=" +
          name +
          "&icon=" +
          icon +
          "&gender=" +
          gender +
          "&phoneNumber=" +
          phoneNumber +
          "&weixin=" +
          weixin
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
      if (!this.hasLogin1) {
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
    // 关闭分享
    close_share() {
      this.share = false;
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
    // 复制订单号
    copy_no() {
      uni.setClipboardData({
        data: "mokaxing001",
        success: function() {
          uni.getClipboardData({
            success: function() {
              uni.showToast({
                title: "复制成功"
              });
            }
          });
        }
      });
    }
  }
};
</script>
<style lang="scss">
.main {
  display: flex;
  box-sizing: border-box;
  min-height: 100vh;
  .navbar {
    position: fixed;
    width: 100%;
    height: auto;
    z-index: 999;
    top: 0;
    left: 0;
    background: #ffffff;
  }
  .tabBar {
    position: fixed;
    width: 100%;
    height: auto;
    z-index: 999;
    bottom: 0;
    background: #ffffff;
  }
}
.content {
  flex: 1;
  position: relative;
  /deep/ .uni-button:after {
    border: 0 !important;
  }
}
.notLoginIn {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.shadowBox {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  z-index: 1000;
}
.top_card {
  padding: 26rpx 50rpx 50rpx 40rpx;
  .title {
    font-size: 50rpx;
    color: #000000;
    font-weight: 600;
    line-height: 70rpx;
  }
  .bottom {
    display: flex;
    margin-top: 40rpx;
    justify-content: space-between;
    .left {
      display: flex;
      flex-direction: row;
      align-items: center;
      .name {
        font-weight: bold;
      }
      .Login_in {
        color: #999999;
        font-weight: bold;
        font-size: 40rpx;
        padding: 0 400rpx 0 0;
        border: 0px;
        &:after {
          border: none;
        }
      }
      image {
        height: 120rpx;
        width: 120rpx;
        border-radius: 50%;
        margin-right: 24rpx;
      }
      text {
        font-size: 40rpx;
        color: #000000;
        letter-spacing: 0.5px;
      }
    }
    .right {
      display: flex;
      align-items: center;
      text {
        opacity: 0.4;
        font-size: 26rpx;
        color: #000000;
        letter-spacing: 0.32px;
      }
      .arrow {
        width: 15rpx;
        height: 25rpx;
        margin-left: 19rpx;
      }
      // image {
      //   height: 25rpx;
      //   width: 25rpx;
      //   margin-left: 19rpx;
      // }
    }
  }
}
.about {
  margin-top: 16rpx;
  padding: 0 50rpx 0 40rpx;
  .service {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding: 30rpx 0;
    height: 42rpx;
    font-size: 30rpx;
    color: #000000;
    letter-spacing: 0.38px;
    .arrow {
      width: 15rpx;
      height: 25rpx;
      margin-top: 8rpx;
    }
    .left {
      display: flex;
      flex-direction: row;
      align-items: center;
    }
    .leftImage {
      height: 32rpx;
      width: 32rpx;
      margin-right: 12rpx;
    }
  }
  .deline {
    border-bottom: 0.5px solid rgba(97, 97, 97, 0.2);
  }
}
.share {
  margin: 16rpx 40rpx 0;
  background: #ffffff;
  border-radius: 16rpx;
  color: #ffffff;
  height: 240rpx;
  image {
    height: 240rpx;
    width: 670rpx;
    border-radius: 16rpx;
  }
}
.contactUS {
  position: fixed;
  top: 47%;
  transform: translateY(-50%);
  width: 640rpx;
  margin: 0 55rpx;
  padding: 50rpx 0 0;
  background: #ffffff;
  border-radius: 24rpx;
  font-size: 34rpx;
  z-index: 1500;

  .contactTop {
    padding-left: 110rpx;
    padding-bottom: 50rpx;
    border-bottom: 2rpx solid #e5e5e5;
    .copy_weixin {
      color: #353535;
      font-weight: bold;
      text-align: left;
      line-height: 47.6rpx;
      .copy {
        display: inline;
        text-decoration: underline;
        font-size: 24rpx;
        font-weight: 500;
        color: #141615;
        padding-left: 20rpx;
      }
    }
    .Phone_number {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      text {
        color: #353535;
        font-weight: bold;
        text-align: center;
        line-height: 47.6rpx;
      }
    }
  }
  .contactBottom {
    font-weight: bold;
    color: #42b069;
    letter-spacing: 2rpx;
    text-align: center;
    line-height: 47.6rpx;
    padding-top: 30rpx;
    padding-bottom: 32rpx;
  }
}
.sharePopup {
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 54%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1500;
  border-radius: 28rpx;
  .imgWrap {
    display: flex;
    flex-direction: column;
    width: 650rpx;
    border-radius: 24rpx;
    overflow: hidden;
    .bgImage {
      width: 100%;
      height: 816rpx;
      overflow: hidden;
    }
  }
  .weixinIcon {
    width: 100%;
    background: #ffffff;
    padding: 42rpx 0;
    .image_share {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      .image_share_button {
        line-height: inherit;
        background: #ffffff;
        &:after {
          border: none;
        }
      }
      .imgIcon {
        position: relative;
        height: 72rpx;
        margin: 0 auto;
        width: 87rpx;
      }
    }
    .text_weixin {
      display: flex;
      justify-content: center;
      align-items: center;
      opacity: 0.6;
      margin: 0 auto;
      font-size: 26rpx;
      color: #311b0e;
      letter-spacing: 0.43px;
    }
  }
  .close {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 70rpx;
    width: 70rpx;
    margin: 0 auto;
    margin-top: 30rpx;
    image {
      height: 70rpx;
      width: 70rpx;
      transform: rotate(-270deg);
      border-radius: 50%;
    }
  }
}
</style>
