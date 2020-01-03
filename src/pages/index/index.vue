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
    <scroll-view
      :trap-scroll="true"
      class="scrollBox"
      :class="userNotice || !userAgree ? 'indexFixed' : ''"
      :scroll-y="userNotice || !userAgree ? false : true"
      v-bind:style="{
        top: navHeight + 'px'
      }"
    >
      <view
        class="content"
        v-bind:style="{
          paddingBottom: 2 * tabHeight + 30 + 'px'
        }"
      >
        <image
          :src="skin.img"
          class="allBgImg"
          v-bind:style="{
            paddingTop: navHeight + 'px',
            paddingBottom: tabHeight + 'px'
          }"
        ></image>

        <button @click="cleanEvent">清理</button>
        <view
          class="goods_card"
          v-for="(item, index) in goodsInfo"
          :key="index"
          v-bind:style="{
            background: 'url(' + item.img + ')no-repeat center',
            backgroundSize: 'cover',
            height: item.height + 'rpx',
            width: item.width + 'rpx',
            color: item.color
          }"
        >
          <view class="card_top" @click="NavToDetial(item)">
            <view class="price">
              <text class="price_now">&yen;{{ producePrice(item) }}</text>
              <text class="price_original"
                >&yen;{{ produceOriginalPrice(item) }}</text
              >
            </view>
            <view class="name">
              <text>{{ item.goods_name }}</text>
            </view>
          </view>
          <view
            @click="sellOut"
            v-if="item.inventory === 0"
            class="card_sell_out"
          >
            <text>补货中</text>
          </view>
          <view v-else class="card_bottom">
            <view class="left">
              <view class="number">
                <view @click.stop="reduce_number(item)" class="reduce">
                  <image
                    v-if="item.buy_number === 1"
                    src="../../static/images/no_reduce.png"
                  />
                  <image v-else src="../../static/images/reduce.png" />
                </view>
                <view class="num">{{ item.buy_number }}</view>
                <view @click.stop="add_number(item)" class="add">
                  <image
                    v-if="item.buy_number === 10"
                    src="../../static/images/no_add.png"
                  />
                  <image v-else src="../../static/images/add.png" />
                </view>
              </view>
              <view class="purchase_limit">
                <text>最多可购买10张/次</text>
                <!-- <text class="inventory">库存：{{ item.inventory }}</text> -->
              </view>
            </view>
            <view class="right">
              <!-- 已授权的话第一个button生效，直接去购买 -->
              <!-- 未授权的话第二n个button生效，先逐渐授权 -->
              <!-- #ifndef MP-ALIPAY -->
              <button
                class="goods_card_button"
                v-if="is_getNumber"
                @click.stop="To_buy(item)"
              >
                去支付
              </button>
              <button
                v-else
                class="goods_card_button"
                :open-type="is_getuserInfo ? 'getPhoneNumber' : 'getUserInfo'"
                @getphonenumber="GetPhoneNumber"
                @getuserinfo="GetUserInfo"
                @click.stop="To_buy1"
                :disabled="HasSave ? false : true"
              >
                去支付
              </button>
              <!-- #endif -->
              <!-- #ifdef MP-ALIPAY -->
              <button
                class="goods_card_button"
                v-if="is_getNumber"
                @click.stop="To_buy(item)"
              >
                去支付
              </button>
              <button
                v-else
                class="goods_card_button"
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
        <!-- banner -->
        <view
          class="banner"
          @click="Share"
          v-for="(item, index) in banners"
          :key="index"
          v-bind:style="{
            background: 'url(' + item.img + ')no-repeat center',
            backgroundSize: 'cover',
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
        <!-- 温馨提示 -->
        <view v-if="userAgree === false" class="warmPrompt">
          <view class="Prompttitle">
            <text>温馨提示</text>
          </view>
          <view class="Promptcontent">
            <text>
              欢迎您来到摩卡星小程序，我们更新了《摩卡星用户使用协议》和《用户隐私政策》。为了让您更好地了解摩卡星，请先点击下方链接，仔细阅读，充分理解协议中的条款内容并通过勾选同意的形式后，再次进入摩卡星。
            </text>
          </view>
          <view class="check">
            <view>
              <image
                @click="agree"
                v-if="userOptions"
                src="../../static/assets/option.png"
              />
              <image
                @click="agree"
                v-else
                src="../../static/assets/option_no.png"
              />
            </view>
            <view>
              同意
              <text
                class="agreement"
                @click="NavToagreement('../userCenter/agreement/useAgreement')"
                >《摩卡星用户使用协议》</text
              >
              和
              <text
                class="agreement"
                @click="
                  NavToagreement('../userCenter/agreement/privacyAgreement')
                "
                >《摩卡星用户隐私保护政策》</text
              >
            </view>
          </view>
          <!-- 因为此按钮绑定的事件有三个：1.已经勾选隐私协议。2.调起基本信息授权。3.控制页面下滑露出使用须知 -->
          <!-- 因为调起基本信息无法控制，所以用两个一模一样的按钮。控制这三件事 -->
          <button
            class="check_button"
            :class="userOptions === true ? '' : 'opacity1'"
            @click="IHaveLearned"
          >
            我已了解
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
        <!-- 使用须知 -->
        <view v-if="userNotice" class="notice" catchtouchmove="true">
          <view class="notice_Content">
            <text class="notice_title">使用须知</text>
            <scroll-view scroll-y="true" class="texta">
              <text v-for="(item, index) in instructions_for_use" :key="index">
                {{ item }}
              </text>
            </scroll-view>
            <!-- 遮罩 -->
            <!-- <view class="whiteShadow"></view> -->
          </view>
          <view class="notice_bottom">
            <view class="notice_option">
              <image
                @click="iRemeberIt"
                v-if="is_read"
                src="../../static/assets/option.png"
              />
              <image
                @click="iRemeberIt"
                v-else
                src="../../static/assets/option_no.png"
              />
              <text>我记住了，以后不再提醒</text>
            </view>
            <view class="buttons">
              <button class="button1" @click="cancelNotice">取消</button>
              <button class="button2" @click="pay">确认支付</button>
            </view>
          </view>
        </view>
        <!-- 遮罩 -->
        <view
          class="shadowBox"
          catchtouchmove="ture"
          v-show="share || !userAgree || userNotice"
        ></view>
      </view>
    </scroll-view>

    <tabBar class="tabBar" :banner="skin.banner ? skin.banner : ''"></tabBar>
  </view>
</template>

<script src="./index.js"></script>

<style lang="scss">
.main {
  box-sizing: border-box;
  height: 100vh;
  overflow: hidden;
  .navbar {
    position: fixed;
    width: 100%;
    height: auto;
    top: 0;
    left: 0;
    z-index: 5000;
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
  height: 100vh;
  overflow: hidden;
  box-sizing: border-box;
}
.indexFixed {
  position: fixed;
  top: 80px;
  left: 0;
  bottom: 0;
  right: 0;
}
.content {
  flex: 1;
  box-sizing: border-box;
  position: relative;
  padding: 24rpx 40rpx 40rpx;
  background-size: cover;
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
.warmPrompt {
  display: flex;
  flex-direction: column;
  margin: 100rpx 50rpx;
  padding: 60rpx 60rpx 100rpx;
  position: fixed;
  top: 44%;
  left: 0;
  z-index: 100;
  transform: translateY(-50%);
  background: #ffffff;
  color: #000000;
  border-radius: 24rpx;
  z-index: 1500;
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
    color: rgba($color: #000000, $alpha: 0.4);

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
      text-decoration: underline;
      font-weight: bold;
    }
  }
  .opacity1 {
    opacity: 0.6;
  }
  .check_button {
    background: #42b069;
    border-radius: 40rpx;
    margin: 52rpx auto 0;
    width: 530rpx;
    height: 80rpx;
    line-height: 80rpx;
    font-size: 30rpx;
    color: #f8f8f8;
  }
}
.notice {
  position: fixed;
  top: 26%;
  left: 50%;
  z-index: 1000;
  transform: translateX(-50%);
  padding: 60rpx 60rpx 100rpx;
  width: 630rpx;
  background: #ffffff;
  color: #000000;
  font-size: 30rpx;
  border-radius: 24rpx;
  box-sizing: border-box;
  z-index: 9999;
  overflow: auto;
  .notice_Content {
    text-align: center;
    position: relative;
    .whiteShadow {
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
      height: 100rpx;
      background-image: linear-gradient(
        180deg,
        rgba(255, 255, 255, 0) 0%,
        #ffffff 100%
      );
    }
    .notice_title {
      display: inline-block;
      text-align: center;
      font-size: 40rpx;
      font-weight: bold;
      margin: 0 auto 24rpx;
    }
    .texta {
      height: 408rpx;
      overflow: auto;
      display: flex;
      flex-direction: column;
      margin-top: 8rpx;
      // &::after {
      //   position: absolute;
      //   left: 0;
      //   bottom: 0;
      //   width: 100%;
      //   height: 100rpx;
      //   display: block;
      //   content: "";
      //   background-image: linear-gradient(
      //     180deg,
      //     rgba(255, 255, 255, 0) 0%,
      //     #ffffff 100%
      //   );
      // }
      text {
        margin-bottom: 8rpx;
        color: #666666;
        text-align: justify;
        line-height: 45rpx;
      }
    }
  }
  .notice_bottom {
    .notice_option {
      display: flex;
      align-items: center;
      margin-top: 40rpx;
      image {
        height: 36rpx;
        width: 36rpx;
        margin-right: 12rpx;
      }
      text {
        font-size: 24rpx;
        color: #be9e54;
        letter-spacing: 0.3px;
        font-weight: bold;
      }
    }
    .buttons {
      display: flex;
      flex-direction: row;
      margin-top: 52rpx;
      font-weight: bold;
      .button1 {
        height: 80rpx;
        width: 180rpx;
        line-height: 80rpx;
        border: 2rpx solid #00b265;
        border-radius: 40rpx;
        color: #42b069;
        margin-right: 20rpx;
      }
      .button2 {
        width: 350rpx;
        height: 80rpx;
        line-height: 80rpx;
        background: #42b069;
        border-radius: 40rpx;
        color: #ffffff;
      }
    }
  }
}
.goods_card {
  margin-bottom: 40rpx;
  border-radius: 24rpx;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-shadow: 1px 15px 40px -10px rgba(4, 32, 8, 0.6);
  overflow: hidden;
  .card_top {
    padding: 43rpx 50rpx 0;
    display: flex;
    flex-direction: column;
    padding-bottom: 425rpx;
    .price {
      display: flex;
      align-items: baseline;
      justify-content: flex-start;
      height: 108rpx;
      margin-bottom: 10rpx;
      color: #ffffff;
      .price_now {
        line-height: 108rpx;
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
      letter-spacing: 2rpx;
    }
  }
  .card_sell_out {
    border-bottom-left-radius: 15rpx;
    border-bottom-right-radius: 15rpx;
    background: rgba(121, 182, 160, 0.8);
    font-size: 36rpx;
    padding: 50rpx 0;
    color: #ffffff;
    text-align: center;
    font-weight: bold;
  }
  .card_bottom {
    padding: 60rpx 50rpx 64rpx;
    display: flex;
    align-items: center;
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
        .add {
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
          font-weight: bold;
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
        .inventory {
          margin-left: 14rpx;
        }
      }
    }
    .goods_card_button {
      background-color: #ffffff;
      border-radius: 45rpx;
      width: 260rpx;
      height: 72rpx;
      line-height: 72rpx;
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
  border-radius: 24rpx;
  display: flex;
  margin-top: 30rpx;
  flex-direction: column;
  box-shadow: 1px 15px 40px -10px rgba(4, 32, 8, 0.6);
  .card_content {
    padding: 60rpx 50rpx 0;
    .text1 {
      margin-bottom: 8rpx;
      font-size: 40rpx;
      color: #ffffff;
      font-weight: bold;
    }
    .text2 {
      opacity: 0.6;
      font-size: 30rpx;
      color: #ffffff;
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
