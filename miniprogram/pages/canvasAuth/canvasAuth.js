let app = getApp();
const db = wx.cloud.database();
const canvasDb = db.collection('canvas');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userId: '',
    userInput: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    wx.cloud.callFunction({
      name: 'login',
      data: {
      },
      success: function (res) {
        that.setData({
          userId: res.result.openid
        });
      },
      fail: console.error
    });
  },

  onInput: function(e) {
    this.setData({
      userInput: e.detail.value
    });
  },

  upload: function() {
    let key = this.data.userInput;
    if(key.trim() != '') {
      let that = this;
      wx.showLoading({
        title: '正在验证',
        mask: true
      });
      wx.cloud.callFunction({
        name: 'canvasValidate',
        data: {
          key: key
        },
        success: function(res) {
          let r = JSON.parse(res.result);
          wx.hideLoading();
          if (r.errors) {
            wx.showModal({
              title: '验证失败',
              content: '请检查 Key 后重试',
              showCancel: false
            });
          } else {
            wx.showToast({
              title: '认证成功',
              icon: 'success'
            })
            canvasDb.add({
              data: {
                userId: that.data.userId,
                key: key
              },
              success: function(res) {
                wx.navigateBack({
                });
              },
              fail: console.error
            });           
          }
        },
        fail: console.error
      });
    } else {
      wx.showModal({
        title: '输入错误',
        content: '请输入正确的 API Key',
        showCancel: false
      });
    }
  }

})