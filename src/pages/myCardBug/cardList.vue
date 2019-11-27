<template>
  <view class="content">
    <view v-if="list.length === 0" class="empty">
      <view class="tips">
        <image src="../../static/images/empty.png" />
        <view class="text">
          <text>您的卡券包暂时为空 快去购买一张优惠券吧</text>
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
                <button v-else size="mini">确认收货</button>
              </view>
            </view>
          </view>
        </view>
      </scroll-view>
    </view>
  </view>
</template>
<script>
export default {
  data() {
    return {
      // list: [],
      scrollTop: 0,
      orderList: "",
      list: []
    };
  },
  onLoad() {
    this.getOrderList();
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
    //   跳转到订单详情
    NavToDetail(er) {
      console.log("e:", er);
      uni.navigateTo({
        url: "./cards?order_id=" + er.order_id
      });
    },
    // 跳转到首页
    NavToIndex() {
      uni.switchTab({
        url: '../index/index'
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
  background: #f3f4f3;
  padding-bottom: 40rpx;
}
.empty {
  display: flex;
  height: 100vh;
  flex-direction: column;
  .tips {
    margin-top: 200rpx;
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
    margin-top: 400rpx;
    border: 2rpx solid #00b657;
    border-radius: 45rpx;
    font-family: PingFangSC-Semibold;
    font-size: 30rpx;
    color: #42b069;
    padding: 0 80rpx;
    font-size: 500;
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
      font-family: PingFangSC-Semibold;
      margin-bottom: 16rpx;
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
</style>
