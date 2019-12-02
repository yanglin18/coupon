<template>
  <view class="content">
    <view v-if="list.length === 0" class="empty">
      <view id="title" class="title">
        <text>我的卡券 </text>
      </view>
      <view class="tips">
        <image src="../../static/images/empty.png" />
        <view class="text">
          <text>您的卡券包暂时为空</text>
        </view>
        <view class="text">
          <text> 快去购买一张优惠券吧</text>
        </view>
      </view>
      <button @click="NavToIndex" size="mini">去选购</button>
    </view>
    <view v-else class="not_empty">
      <scroll-view
        :scroll-top="scrollTop"
        scroll-y="true"
        class="scroll-Y"
        @scrolltoupper="upper"
        @scroll="scroll"
      >
        <view id="title" class="title">
          <text>我的卡券 </text>
        </view>
        <view v-for="(item, index) in list" :key="index" class="by_mouth">
          <view class="mouth">
            <text>{{ item.date }}</text>
          </view>
          <view v-for="(val, idx) in item.order" :key="idx" class="lists">
            <view class="card_left">00000</view>
            <view class="listCard" @click="NavToDetail(val)">
              <view class="row1">
                <view class="order_name"
                  >{{ val.goods_name }}X{{ val.num }}</view
                >
                <view class="price">
                  <image src="../../static/assets/money.png" />
                  {{ val.price }}</view
                >
              </view>
              <view class="order_no"
                ><text>订单编号：</text>{{ val.order_number }}
                <text class="copy" @click.stop="copy_no(val.order_number)"
                  >复制</text
                ></view
              >
              <view class="buy_time"
                ><text>购买时间：</text>{{ val.add_time }}</view
              >
              <view class="row4">
                <view class="useful_time">
                  <text>有效期至：</text>{{ val.expire_time }}
                </view>
                <button v-if="val.status === '2'" class="isUsed" size="mini">
                  已收货
                </button>
                <button @click.stop="affirmReceive(val)" v-else size="mini">
                  确认收货
                </button>
              </view>
            </view>
          </view>
        </view>
      </scroll-view>
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
    <!-- 遮罩 -->
    <view class="shadowBox" v-show="share"></view>
  </view>
</template>
<script>
export default {
  data() {
    return {
      // list: [],
      scrollTop: 0,
      orderList: "",
      list: [],
      share: false,
      beautifulPhoto: ""
    };
  },
  onLoad() {
    uni.setNavigationBarColor({
      backgroundColor: "#F3F4F3",
      frontColor: "#ffffff"
    });
  },
  onShow() {
    this.getOrderList();
    let app = getApp();
    this.share = app.globalData.share;
    console.log("是支付完成进入的卡券页面", this.share);
    if (this.share) {
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
                console.log("我要的生成美图", res.data.data.list[0]);
                this.beautifulPhoto = res.data.data.list;
              }
            }
          );
        }
      });
      // 获取相册权限
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
    }
  },

  onPageScroll(top) {
    this.scrollFun(top);
  },
  methods: {
    // 获取storage里的session3rd

    // 获取订单信息
    getOrderList() {
      uni.getStorage({
        key: "storage_key",
        success: res0 => {
          this.Ajax(
            "post",
            "member/order/order_list",
            { brand_id: 1, session3rd: res0.data.session3rd },
            res => {
              if (res.data.code === "200") {
                this.orderList = res.data.data.list;
              }
              console.log("订单列表数据：", this.orderList);
              let arr = [];
              let item;
              for (item in this.orderList) {
                console.log(item);
                let obj = {};
                obj.date = item;
                obj.order = this.orderList[item];
                arr.push(obj);
              }
              console.log("arr", arr);
              this.list = arr;
            }
          );
        }
      });
    },
    scrollFun(top) {
      //创建节点选择器
      var query = uni.createSelectorQuery();
      //选择id
      query.select("#title").boundingClientRect();
      query.exec(function(res) {
        let height = res[0].height;
        if (top.scrollTop > height) {
          uni.setNavigationBarTitle({
            title: "我的卡券"
          });
        } else {
          uni.setNavigationBarTitle({
            title: ""
          });
        }
      });
    },
    // 关闭分享
    close_share() {
      this.share = false;
      let app = getApp();
      app.globalData.share = false;
    },
    // 长按保存图片
    saveImg(src) {
      console.log("长按图片");
      uni.getStorage({
        key: "PhotoAlbum",
        success: res0 => {
          if (res0.data === "true") {
            // 处理图片
            uni.getImageInfo({
              src: src,
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
                      console.log("设置信息：", dataAu); //
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
    //   跳转到订单详情
    NavToDetail(er) {
      console.log("e:", er);
      uni.navigateTo({
        url: "./cards?order_id=" + er.order_id + "status=" + er.status
      });
    },
    // 跳转到首页
    NavToIndex() {
      uni.switchTab({
        url: "../index/index"
      });
    },
    // 复制订单号
    copy_no(e) {
      console.log("e:", e);
      uni.setClipboardData({
        data: e,
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
    },
    // 确认收货
    affirmReceive(val) {
      let that = this;
      console.log("val:", val);
      uni.showModal({
        title: "",
        content: "您确定已收到所有饮品吗？",
        success: function(resShowModel) {
          if (resShowModel.confirm) {
            uni.getStorage({
              key: "storage_key",
              success: res0 => {
                that.Ajax(
                  "post",
                  "member/order/confirm_order",
                  { order_id: val.order_id, session3rd: res0.data.session3rd },
                  res => {
                    if (res.data.code === "200") {
                      uni.showToast({
                        title: "收货成功"
                      });
                      that.getOrderList();
                    }
                  }
                );
              }
            });
          } else if (resShowModel.cancel) {
            console.log("用户点击取消");
            uni.showToast({
              title: "取消收货",
              icon: "none"
            });
          }
        }
      });
    },
    upper(e) {
      console.log(e);
    },
    lower(e) {
      console.log(e);
    },
    scroll(e) {
      console.log(e);
      //   this.old.scrollTop = e.detail.scrollTop;
    }
  },
  onHide() {}
};
</script>
<style lang="scss" scoped>
.content {
  min-height: 100vh;
  background: #f3f4f3;
  padding-bottom: 40rpx;
  position: relative;
}
.shadowBox {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
}
.empty {
  display: flex;
  height: 100vh;
  flex-direction: column;
  .title {
    font-family: PingFangSC-Semibold;
    font-size: 50rpx;
    color: #000000;
    font-weight: 500;
    line-height: 70rpx;
    padding: 14rpx 40rpx 40rpx;
  }
  .tips {
    margin-top: 280rpx;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    image {
      margin: 0 auto;
      height: 190rpx;
      width: 218rpx;
      margin-bottom: 36rpx;
    }
    .text {
      margin: 0 auto;
      text {
        text-align: center;
      }
      opacity: 0.3;
      font-family: PingFangSC-Regular;
      font-size: 28rpx;
      color: grey;
    }
  }
  button {
    margin-top: 256rpx;
    border: 2rpx solid #00b657;
    border-radius: 45rpx;
    font-family: PingFangSC-Semibold;
    font-size: 30rpx;
    color: #42b069;
    font-size: 500;
    width: 300rpx;
    height: 80rpx;
    line-height: 80rpx;
  }
}
.not_empty {
  .title {
    font-family: PingFangSC-Semibold;
    font-size: 50rpx;
    color: #000000;
    font-weight: 500;
    line-height: 70rpx;
    padding: 14rpx 40rpx 40rpx;
  }
  .by_mouth {
    display: flex;
    flex-direction: column;
    margin-bottom: 40rpx;
    .mouth {
      opacity: 0.6;
      font-family: PingFangSC-Regular;
      font-size: 30rpx;
      margin: 0 40rpx 16rpx;
      color: #000000;
      text-align: justify;
    }
    .lists {
      display: flex;
      font-size: 26rpx;
      flex-direction: column;
      margin-bottom: 16rpx;
      box-shadow: 1px 10px 20px -10px rgba(4, 32, 8, 0.2);
      display: flex;
      flex-direction: row;
      &:last-child {
        margin-bottom: 0;
      }
      .card_left {
        color: #ffffff;
        background: #ffffff;
        width: 40rpx;
        height: 320rpx;
        margin-right: 4rpx;
        border-top-right-radius: 14rpx;
        border-bottom-right-radius: 14rpx;
      }
      .listCard {
        background: #ffffff;
        border-top-left-radius: 14rpx;
        border-bottom-left-radius: 14rpx;
        flex: 1;
        border-left: #979797 dashed 1px;
        padding: 40rpx 44rpx 50rpx 30rpx;
        .row1 {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          color: #000000;
          .order_name {
            font-size: 32rpx;
            letter-spacing: 0.4px;
            font-weight: 600;
          }
          .price {
            image {
              height: 36rpx;
              width: 28rpx;
              margin-right: 12rpx;
            }
            font-size: 40rpx;
            letter-spacing: 0.5px;
            text-align: right;
          }
        }
        .order_no {
          margin-top: 16rpx;
          .copy {
            text-decoration: underline;
            font-size: 24rpx;
            font-weight: 500;
            color: #141615;
            padding-left: 20rpx;
          }
          text {
            color: gray;
          }
        }
        .buy_time {
          margin-top: 12rpx;
          text {
            color: gray;
          }
        }
        .row4 {
          margin-top: 16rpx;
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          align-items: center;
          .useful_time {
            color: #be9e54;
            text {
              font-weight: 600;
            }
          }
          .isUsed {
            color: #8f8f8f;
            border: 2rpx solid #dfdfdf;
          }
          button {
            display: inline-block;
            width: 160rpx;
            height: 60rpx;
            padding: 0 !important;
            margin: 0 !important;
            line-height: 60rpx;
            border: 2rpx solid #00b657;
            border-radius: 45rpx;
            font-size: 28rpx;
            color: #42b069;
            font-weight: 600;
          }
        }
      }
    }
  }
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
