import Vue from "vue";
import App from "./App";

Vue.config.productionTip = false;

App.mpType = "app";

let baseURL = "https://coupon.houselai.com";
// let baseURL = "https://coupontest.yingbei365.com";
Vue.prototype.Ajax = (method, url, data, callback) => {
  // let m = ""
  // for(let key in data){
  //   console.log("Main的key",key)
  //   m += `${key}&`
  // }
  // console.log("mmm",m);
  let Url = baseURL + "/public/index.php/" + url;
  uni.request({
    method: method,
    url: Url, //仅为示例，并非真实接口地址。
    data: data,
    header: {
      "content-type": "application/json"
    },
    success: res => {
      if (res.data.code !== "200" && res.data.code !== "0020") {
      }
      callback(res);
    },
    fail: error => {
      uni.showToast({
        title: "网络异常，请稍后重试",
        icon: "none"
      });
    },
    complete: com => {}
  });
};
Vue.prototype.Record = (data, callback) => {
  uni.request({
    method: "post",
    url: baseURL + "/public/index.php/member/Record/index",
    data: data,
    header: {
      "content-type": "application/json"
    },
    success: res => {
      if (res.data.code !== "200") {
        // uni.showToast({
        //   title: res.data.msg || "网络异常，请稍后重试",
        //   icon: "none"
        // });
      }
      callback(res);
    }
  });
};

const app = new Vue({
  ...App
});
app.$mount();
