<template>
  <view class="content">
    <!-- <view v-if="!isLoginIn" class="notLoginIn">
      <button>去登录</button>
    </view> -->
    <view>
      <view class="top_card">
        <view class="title">
          <text>个人中心 </text>
        </view>
        <view class="bottom">
          <view class="left">
            <image :src="user_info.head_img" />
            <text>{{ user_info.user_name }}</text>
          </view>
          <view class="right" @click="NavToModify">
            <text>修改资料</text>
            <image src="../../static/assets/toRight.png" />
          </view>
        </view>
      </view>
      <view class="about">
        <view class="service deline" @click="contactService">
          <view class="left">
            <image src="../../static/assets/service.png" />
            <text>联系客服</text>
          </view>
          <image src="../../static/assets/toRight.png" />
        </view>
        <view class="service" @click="NavTo('./about')">
          <view class="left">
            <image src="../../static/assets/about.png" />
            <text>关于</text>
          </view>

          <image src="../../static/assets/toRight.png" />
        </view>
      </view>
      <view @click="Share" class="share">分享海报 </view>

    </view>
    <!-- 分享弹窗 -->
    <view v-if="share" class="sharePopup">
      <view @longpress="saveImg" class="img">
        <!-- <image src="data:image/png;base64,{{src2}}"></image> -->
        <image :src="src2" />
      </view>
      <view class="weixinIcon">
        <view class="image_share">
          <button open-type="share">
            <image src="../../static/assets/weixin.png" />
          </button>
          <view class="text_weixin">
            微信好友
          </view>
        </view>
      </view>
      <view class="close" @click="close_share">
        <image class="close_img" src="../../static/assets/close.png" />
      </view>
    </view>
    <!-- 遮罩 -->
    <view class="shadowBox" v-show="share"></view>
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
      isLoginIn:false //是否登录
    };
  },
  onLoad() {
    this.getUserInfo();
    // 获取access_token
    // uni.request({
    //   url:
    //     "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wx57c616cdb4fe8bd7&secret=f9978d2f3071dc8ab2b500df05512b17",
    //   success: res => {
    //     // console.log("获取access_token", res);
    //     this.access_token = res.data.access_token;
    //     // console.log("access_token:", this.access_token);
    //   }
    // });
    uni.request({
      //注意：下面的access_token值可以不可以直接复制使用，需要自己请求获取
      url:
        "https://api.weixin.qq.com/wxa/getwxacodeunlimit?access_token=" +
        this.access_token,
      data: {
        scene: "1234",
        page: "" //这里按照需求设置值和参数
      },
      method: "POST",
      responseType: "arraybuffer", //设置响应类型
      success: res => {
        console.log("小程序码", res);
        this.src2 =
          "data:image/png;base64," + uni.arrayBufferToBase64(res.data); //对数据进行转换操作
      },
      fail: e => {
        console.log("错误", e);
      }
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
    // 联系客服
    contactService() {
      uni.showModal({
        content: "星小孩（微信号：960411wsy）",
        confirmText: "我知道了",
        showCancel: false,
        confirmColor: "#42B069",
        success(res) {}
      });
    },
    // 跳转
    NavTo(e) {
      uni.navigateTo({
        url: e
      });
    },
    // 跳转到修改
    NavToModify() {
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
      this.share = true;
      // 获取相册权限
      uni.authorize({
        scope: "scope.writePhotosAlbum",
        success(res) {
          console.log("授权成功", res);
        },
        fail(error) {
          console.log("error:", error);
          uni.showToast({
            title: "请授权后再保存",
            duration: 1000,
            icon:"none"
          });
        },
        complete() {
        }
      });
    },
    // 关闭分享
    close_share() {
      this.share = false;
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
    saveImg() {
      console.log("长按图片");
      // 处理图片
      uni.getImageInfo({
        src: "../../static/images/share2.png",
        success: function(image) {
          let image_path = image.path;
          uni.saveImageToPhotosAlbum({
            filePath: image_path,
            success: function(res) {
              uni.showToast({
                title: "保存成功",
                duration: 1000
              });
            },
            fail: function(error) {
              console.log(error);
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
  height: 100vh;
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
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
}
.top_card {
  background: #ffffff;
  padding: 26rpx 40rpx 50rpx;
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
      image {
        height: 25rpx;
        width: 25rpx;
        margin-left: 19rpx;
      }
    }
  }
}
.about {
  margin-top: 20rpx;
  background: #ffffff;
  padding: 0 50rpx 0 40rpx;
  .service {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding: 30rpx 0;
    font-size: 30rpx;
    color: #000000;
    letter-spacing: 0.38px;
    .left {
      display: flex;
      flex-direction: row;
      align-items: center;
    }
    image {
      height: 26rpx;
      width: 26rpx;
      margin-right: 12rpx;
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
.sharePopup {
  margin: 0 50rpx;
  display: flex;
  flex-direction: column;
  margin: 0 50rpx;
  position: fixed;
  top: 100rpx;
  left: 0;
  z-index: 100;
  border-radius: 24rpx;
  .img {
    background: url("http://wechatapppro-1252524126.file.myqcloud.com/appuaB1Y9Wy1245/image/ueditor/17860300_1574677608.png")
      no-repeat center;
    background-size: cover;
    height: 820rpx;
    width: 650rpx;
  }
  .weixinIcon {
    background: #ffffff;
    padding: 42rpx 0;
    border-bottom-right-radius: 24rpx;
    border-bottom-left-radius: 24rpx;
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
      image {
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
