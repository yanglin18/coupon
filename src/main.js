import Vue from "vue";
import App from "./App";
import { callbackify } from "util";

Vue.config.productionTip = false;

App.mpType = "app";

let baseURL = "https://coupon.houselai.com/public/index.php/";
Vue.prototype.Ajax = (method, url, data, callback) => {
  let Url = baseURL + url;
  uni.request({
    method: method,
    url: Url, //仅为示例，并非真实接口地址。
    data: data,
    header: {
      "content-type": "application/json"
    },
    success: res => {
      if (res.data.code !== "200" && res.data.code !== "0020") {
        // uni.showToast({
        //   title: res.data.msg || "网络异常，请稍后重试",
        //   icon: "none"
        // });
      }
      callback(res);
    },
    fail: error => ({}),
    complete: com => {
      uni.getNetworkType({
        success: network => {
          if (network.networkType === "none") {
            uni.navigateTo({
              url:'pages/loading/no_network'
            })
          }
        }
      });
    }
  });
};
Vue.prototype.Record =(data,callback) => {
  uni.request({
    method:"post",
    url:'https://coupon.houselai.com/public/index.php/member/Record/index',
    data:data,
    header: {
      "content-type": "application/json"
    },
    success: res => {
      if (res.data.code !== "200" ) {
        // uni.showToast({
        //   title: res.data.msg || "网络异常，请稍后重试",
        //   icon: "none"
        // });
      }
      callback(res);
    },
  })

}

const app = new Vue({
  ...App
});
app.$mount();
