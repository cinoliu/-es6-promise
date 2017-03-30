//index.js
var util = require('../../utils/util')
var wxApi = require('../../utils/wxApi')
var wxRequest = require('../../utils/wxRequest')
import config from '../../utils/config'
//获取应用实例
var app = getApp()
Page({
  data: {
    userInfo: {}
  },
  onLoad: function () {
    var that = this;
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 10000
    })
    //1.获取code
    var wxLogin = wxApi.wxLogin()
    wxLogin().then(res => {
      console.log('1.成功了')
      console.log(res.code)
      var url = config.getOpenidUrl;
      var params = {
        appid: "wxed78****2d465",
        secret: "e9c5e4c*****9ecc5ebd811",
        js_code: res.code,
        grant_type: "authorization_code"
      }
      //2.获取openid
      return wxRequest.getRequest(url, params)
    }).
      then(res => {
        console.log('2.成功了')
        console.log(res)
        var url = app.globalData.ip + config.searchDgUrl
        var data = util.json2Form({ phoneNumber: '15971908021' })
        //3.获取绑定手机号码
        return wxRequest.postRequest(url, data)
      }).
      then(res => {
        console.log('3.成功了')
        console.log(res)
        //4.获取系统信息
        var wxGetSystemInfo = wxApi.wxGetSystemInfo()
        return wxGetSystemInfo()
      }).
      then(res => {
        console.log('4.成功了')
        console.log(res)
        //5.获取用户信息
        var wxGetUserInfo = wxApi.wxGetUserInfo()
        return wxGetUserInfo()
      }).
      then(res => {
        console.log('5.成功了')
        console.log(res.userInfo)
        that.setData({
          userInfo: res.userInfo
        })
      })
      .finally(function (res) {
        console.log('finally~')
        wx.hideToast()
      })
  }
})