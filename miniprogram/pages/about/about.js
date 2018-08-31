let app = getApp();
const db = wx.cloud.database();
const canvasDb = db.collection('canvas');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    logged: false,
    canvasKey: '',
    userId: ''
  },

  bindGetUserInfo: function() {
    if(this.data.logged) return;
    wx.showLoading({
      title: '正在登录',
      mask: true
    });
    let that = this;
    wx.getUserInfo({
      success: function(res) {
        that.setData({
          userInfo: res.userInfo,
          logged: true
        });
        wx.cloud.callFunction({
          name: 'login',
          data: {
          },
          success: function(res) {
            that.setData({
              userId: res.result.openid
            });
          },
          fail: console.error
        });
        wx.hideLoading();
      }
    });
  },

  logout: function() {
    let that = this;
    wx.showActionSheet({
      itemList: ['退出登录'],
      itemColor: '#F76260',
      success: function() {
        that.setData({
          userInfo: {},
          userId: '',
          logged: false
        });
      }
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      canvasKey: app.globalData.canvasKey
    });
  },

  canvasAuth: function() {
    let that = this;
    canvasDb.where({
      userId: this.data.userId
    }).get({
      success: function(res) {
        if(res.data.length > 0) {
          that.setData({
            canvasKey: res.data[0].key
          });
          app.globalData.canvasKey = that.data.canvasKey;
          wx.showToast({
            title: '重新认证成功',
            icon: 'success',
            duration: 3000
          });
        } else {
          wx.showModal({
            title: '该用户未上传认证',
            content: '是否跳转到上传页面',
            success: function(res) {
              if(res.confirm) {
                wx.navigateTo({
                  url: '../canvasAuth/canvasAuth'
                });
              }
            }
          });
        }
      },
      fail: console.error
    });
  }

})