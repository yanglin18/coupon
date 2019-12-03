<template>
  <view class="content">
    <view>
      <view class="top_card">
        <view class="title">
          <text>个人中心 </text>
        </view>
        <view class="bottom" @click="NavToModify">
          <view class="left">
            <image :src="user_info.head_img || default_avter" />

            <button
              size="mini"
              open-type="getUserInfo"
              @getuserinfo="GetUserInfo"
              v-if="hasNotLogin"
              class="Login_in"
            >
              登录
            </button>
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
            <image src="../../static/assets/service.png" />
            <text>联系客服</text>
          </view>
          <image class="arrow" src="../../static/assets/toRight.png" />
        </view>
        <view class="service" @click="NavTo('./about')">
          <view class="left">
            <image src="../../static/assets/about.png" />
            <text>关于</text>
          </view>

          <image class="arrow" src="../../static/assets/toRight.png" />
        </view>
      </view>
      <view @click="Share" class="share">分享海报 </view>
    </view>
    <!-- 分享弹窗 -->
    <view v-if="share" class="sharePopup">
      <view class="imgWrap" @longpress="saveImg(beautifulPhoto.filename)">
        <image :src="beautifulPhoto.show_img" class="bgImage"></image>
        <view class="weixinIcon">
          <view class="image_share">
            <button open-type="share">
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
          <text @click="callUS">手机号：<text style="color: #0080ff;">13570303413</text></text>
        </view>
        <view class="copy_weixin">
          <text>微信号：mokaxing001</text>
          <text @click="copy_no" class="copy">复制</text>
        </view>
      </view>
      <view class="contactBottom" @click="Iknow">
        <text>我知道了</text>
      </view>
    </view>
    <!-- 遮罩 -->
    <view class="shadowBox" v-show="share || contactUS"></view>
  </view>
</template>
<script>
export default {
  data() {
    return {
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
      hasNotLogin: false, //没有登录
      contactUS: false,
      is_getuserInfo: false,
      UserInfo: {},
      objQueryPid:'',
      default_avter: "../../static/assets/default_avter.png"
    };
  },
  onShow() {
    this.getUserInfo();
    const hasLogin = uni.getStorageSync("hasLogin");
    if (hasLogin) {
      this.hasNotLogin = false;
    }
    uni.login({
      success: LoginRes => {
        this.Ajax(
          "post",
          "member/Login/getLogin",
          { brand_id: 1, channel: "wechat", code: LoginRes.code },
          res => {
            if (res.data.code === "200") {
              uni.setStorageSync("hasLogin", true);
              console.log("不是第一次来的顾客");
              this.hasNotLogin = false;
            } else {
              uni.setStorageSync("hasLogin", false);
              this.hasNotLogin = true;
            }
          }
        );
      },
      fail: error => {}
    });
  },
  onLoad() {
    uni.setNavigationBarColor({
      backgroundColor: "#FFFFFF",
      frontColor: "#000000"
    });
  },
  methods: {
    // 获取基本信息
    getUserInfo() {
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
                console.log("user_info:", this.user_info);
              }
            }
          );
        }
      });
    },
    // 获取基本信息授权
    GetUserInfo(res) {
      console.log(res);
      if (res.detail.userInfo) {
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
        uni.setStorage({
          key: "userInfo",
          data: this.is_getuserInfo,
          success: userInfo => {
            console.log("个人中心已经授权基本信息了");
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
    // 登录
    loginIn() {
      uni.getStorage({
        key: "obj.query.pid",
        success: pid => {
          this.objQueryPid = pid.data;
        }
      });
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
                  this.getUserInfo();
                  uni.setStorageSync("hasLogin", true);
                  uni.setStorage({
                    key: "storage_key",
                    data: res.data.data,
                    success: function(e) {
                      console.log("success", e);
                    }
                  });
                  uni.setStorage({
                    key: "UserNumber",
                    data: res.data.data.mobile
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
    // 联系客服
    contactService() {
      if (this.hasNotLogin) {
        return;
      }
      this.contactUS = true;
      uni.hideTabBar({
        animation: true
      });
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
      uni.showTabBar({
        animation: true
      });
    },
    // 跳转
    NavTo(e) {
      if (this.hasNotLogin) {
        return;
      }
      uni.navigateTo({
        url: e
      });
    },
    // 跳转到修改
    NavToModify() {
      if (this.hasNotLogin) {
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
      if (this.hasNotLogin) {
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
    },
    // 关闭分享
    close_share() {
      this.share = false;
      uni.showTabBar({
        animation: true
      });
    },
    // 登出
    loginOutEvent() {
      uni.showModal({
        title: "提示",
        content: "您确定要退出登录吗？",
        success: function(res) {
          if (res.confirm) {
            uni.getStorage({
              key: "storage_key",
              success: res0 => {
                this.Ajax(
                  "post",
                  "member/Login/login_out",
                  { session3rd: res0.data.session3rd },
                  res => {
                    if (res.data.code === "200") {
                      console.log(res);
                    }
                  }
                );
              }
            });
          } else if (res.cancel) {
            console.log("用户点击取消");
          }
        }
      });
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
<style lang="scss" scoped>
.content {
  position: relative;
  background: #f3f4f3;
  min-height: 100vh;
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
  background: rgba(0, 0, 0, 0.5);
}
.top_card {
  background: #ffffff;
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
        background: #ffffff;
        font-weight: bold;
        font-size: 40rpx;
        padding: 0 400rpx 0 0;
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
      }
      image {
        height: 25rpx;
        width: 25rpx;
        margin-left: 19rpx;
      }
    }
  }
}
.about {
  margin-top: 16rpx;
  background: #ffffff;
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
    }
    .left {
      display: flex;
      flex-direction: row;
      align-items: center;
      image {
        height: 32rpx;
        width: 32rpx;
        margin-right: 12rpx;
      }
    }
	image {
	  height: 32rpx;
	  width: 32rpx;
	}
  }
  .deline {
    border-bottom: 0.5px solid rgba(97, 97, 97, 0.2);
  }
}
.share {
  height: 260rpx;
  margin: 16rpx 40rpx 0;
  background: #ffffff;
  border-radius: 16rpx;
  color: #ffffff;
}
.contactUS {
  position: fixed;
  top: 500rpx;
  width: 640rpx;
  margin: 0 55rpx;
  padding: 76rpx 0 0;
  z-index: 100;
  background: #ffffff;
  border-radius: 24rpx;
  font-size: 34rpx;

  .contactTop {
	padding-left: 145rpx;
    padding-bottom: 37rpx;
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
  margin: 0 50rpx;
  display: flex;
  flex-direction: column;
  margin: 0 50rpx;
  position: fixed;
  height: 85vh;
  top: 100rpx;
  left: 0;
  z-index: 100;
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
      button {
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
      height: 100%;
      width: 100%;
      transform: rotate(-270deg);
      border-radius: 50%;
    }
  }
}
</style>
