const app = getApp();
const db = wx.cloud.database();
const canvasDb = db.collection('canvas');

Page({
  data: {
    logged: false,
    canvasKey: '',
    userId: '',
  },

  bindGetUserInfo() {
    wx.showLoading({
      title: '正在登录',
      mask: true,
    });
    const that = this;
    wx.cloud.callFunction({
      name: 'login',
      data: {
      },
      success: (loginRes) => {
        that.setData({
          userId: loginRes.result.openId,
          logged: true,
        });
      },
    });
    wx.hideLoading();
  },

  logout() {
    const that = this;
    wx.showActionSheet({
      itemList: ['退出登录'],
      itemColor: '#F76260',
      success: () => {
        that.setData({
          userId: '',
          logged: false,
        });
      },
    });
  },

  onLoad() {
    this.setData({
      canvasKey: app.globalData.canvasKey,
    });
  },

  canvasAuth() {
    const that = this;
    canvasDb.where({
      userId: this.data.userId,
    }).get({
      success: (res) => {
        if (res.data.length > 0) {
          that.setData({
            canvasKey: res.data[0].key,
          });
          app.globalData.canvasKey = that.data.canvasKey;
          wx.showToast({
            title: '重新认证成功',
            icon: 'success',
            duration: 3000,
          });
        } else {
          wx.showModal({
            title: '该用户未上传认证',
            content: '是否跳转到上传页面',
            success: (modalRes) => {
              if (modalRes.confirm) {
                wx.navigateTo({
                  url: '../canvasAuth/canvasAuth',
                });
              }
            },
          });
        }
      },
    });
  },
});
