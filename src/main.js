import Vue from 'vue'
import App from './App'
import {
  callbackify
} from 'util';

Vue.config.productionTip = false

App.mpType = 'app'

let baseURL = 'https://coupon.houselai.com/public/index.php/';
Vue.prototype.Ajax = (method, url, data, callback) => {
  let Url = baseURL + url;
  uni.request({
    method: method,
    url: Url, //仅为示例，并非真实接口地址。
    data: data,
    header: {
      "content-type": "application/json"
    },
    success: (res) => {
      console.log(res.data.code);
      if(res.data.code !== "200"){
        uni.showToast({
          title:"网络异常，请稍后重试",
          icon:"none"
        })
      }
      callback(res);
    },
    fail: (error) => {
      console.log(error);
    }
  });
};

const app = new Vue({
  ...App
})
app.$mount()