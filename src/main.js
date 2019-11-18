import Vue from 'vue'
import App from './App'
import {
  callbackify
} from 'util';

Vue.config.productionTip = false

App.mpType = 'app'

Vue.prototype.Ajax = (method, url, data, callback) => {
  uni.request({
    method: method,
    url: url, //仅为示例，并非真实接口地址。
    data: data,
    header: {
      "content-type": "application/json"
    },
    success: (res) => {
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