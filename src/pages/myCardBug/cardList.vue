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
      :title="title"
    ></navigationbar>
    <scroll-view :trap-scroll="true" class="scrollBox" :scroll-y="list.length == 0 ? false : true" v-bind:style="{
          paddingBottom: tabHeight + 'px'
        }">
   <!-- #ifndef MP-TOUTIAO -->
      <view
        class="content"
      >
      <!-- #endif -->
      <!-- #ifdef MP-TOUTIAO -->
      <view
        class="content"
      >
      <!-- #endif -->
        <image
          :src="skin.img"
          class="allBgImg"
          v-bind:style="{
            paddingTop: navHeight + 'px',
            paddingBottom: tabHeight + 'px'
          }"
        ></image>
        <view v-if="list.length === 0" class="empty">
          <view id="title" class="title">
            <text>订单</text>
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
          <button class="empty_button" @click="NavToIndex" size="mini">
            去选购
          </button>
        </view>
        <view v-else class="not_empty">
          <view>
            <view id="title" class="title">
              <text>订单 </text>
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
                    <button
                      v-if="val.status === '2'"
                      class="isUsed"
                      size="mini"
                    >
                      已使用
                    </button>
                    <button
                      class="not_used"
                      v-else
                      size="mini"
                    >
                      待使用
                    </button>
                  </view>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>
    </scroll-view>
    <!-- 遮罩 -->
    <view class="shadowBox" v-show="share"></view>
    <!-- #ifndef MP-TOUTIAO -->
    <tabBar class="tabBar" :banner="skin.banner ? skin.banner : ''"></tabBar>
    <!-- #endif -->
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
      // #ifdef MP-WEIXIN
      title: "",
      // #endif
      // #ifdef MP-ALIPAY
      title: "",
      // #endif
      scrollTop: 0,
      orderList: "",
      list: [],
      share: false,
      beautifulPhoto: "",
      skin: {},
      navHeight: app.globalData.navHeight,
      tabHeight: app.globalData.tabHeight
    };
  },
  onLoad() {
    uni.setNavigationBarColor({
      backgroundColor: "#ffffff"
    });
    this.getSkin();
  },
  onShow() {
    this.getOrderList();
  },

  onPageScroll(scrollTop) {
    // #ifdef MP-WEIXIN
    if (scrollTop.scrollTop >= 80) {
      this.title = "订单";
    } else {
      this.title = "";
    }
    // #endif
    // #ifdef MP-ALIPAY
    if (scrollTop.scrollTop >= 120) {
      uni.setNavigationBarTitle({
        title: "订单"
      });
    } else {
      uni.setNavigationBarTitle({
        title: " "
      });
    }
    // #endif
  },

  // // 用户分享
  onShareAppMessage(option) {
    return {
      // #ifdef MP-WEIXIN
      title: "我告诉你，这是喝星巴克最优惠的方式",
      imageUrl: "../../static/images/shareCard.jpg",
      // #endif
      // #ifdef MP-ALIPAY
      title: "这是喝星吧克最优惠的一种方式",
      imageUrl: "../../static/assets/logo.png",
      path: "/pages/loading/loading",
      desc: "星吧克咖啡电子优惠券售卖平台",
      templateId: "",
      // #endif
      // #ifdef MP-TOUTIAO
      title: "摩卡星-喝星吧克最优惠的方式",
      imageUrl: "../../static/assets/logo.png",
      // #endif
    };
  },
  methods: {
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
        content: "确定"+val.num+"张“"+val.goods_name+"”已完成扫码吗？",
        confirmColor: "#42b069",
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
                        title: "扫码完成"
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
              title: "已取消",
              icon: "none"
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
<style lang="scss">
.main {
  display: flex;
  box-sizing: border-box;
  min-height: 100vh;
  overflow: hidden;
  .navbar {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: auto;
    z-index: 999;
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
.scrollBox {

  // height: 90vh;
  width: 100vw;
  z-index: 900;
  overflow: hidden;
  box-sizing: border-box;
}
.content {
  flex: 1;
  box-sizing: border-box;
  position: relative;
  min-height: 90vh;
}
.shadowBox {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  z-index: 1000;
}
.empty {
  display: flex;
  // height: 80vh;
  flex-direction: column;
  .title {
    font-size: 50rpx;
    color: #000000;
    font-weight: 500;
    line-height: 70rpx;
    padding: 14rpx 40rpx 40rpx;
  }
  .tips {
    position: absolute;
    top: 36%;
    left: 50%;
    transform: translate(-50%, -50%);
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
      font-size: 28rpx;
      color: grey;
    }
  }
  .empty_button {
    position: absolute;
    left: 50%;
    top: 70%;
    transform: translateX(-50%);
    border: 2rpx solid #00b657;
    border-radius: 45rpx;
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
      box-shadow: 1px 10px 70px -10px rgba(155, 166, 156, 0.2);
      display: flex;
      flex-direction: row;
      &:last-child {
        margin-bottom: 0;
      }
      .card_left {
        color: #ffffff;
        background: #ffffff;
        width: 40rpx;
        // height: 320rpx;
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
        padding: 46rpx 44rpx 44rpx 30rpx;
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
            font-weight: bold;
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
            font-weight: bold;
            text {
              font-weight: 600;
              font-weight: 500;
            }
          }
          .not_used {
            background: #ffffff;
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
            &:after {
              border: none;
            }
          }
          .isUsed {
            color: #8f8f8f;
            border: 2rpx solid #dfdfdf;
            background: #ffffff;
            display: inline-block;
            width: 160rpx;
            height: 60rpx;
            padding: 0 !important;
            margin: 0 !important;
            line-height: 60rpx;
            border-radius: 45rpx;
            font-size: 28rpx;
            font-weight: 600;
            &:after {
              border: none;
            }
          }
        }
      }
    }
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
      height: 100%;
      width: 100%;
      transform: rotate(-270deg);
      border-radius: 50%;
    }
  }
}
</style>
