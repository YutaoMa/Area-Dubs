const db = wx.cloud.database();
const canvasDb = db.collection('canvas');

Page({
  data: {
    userId: '',
    userInput: '',
  },

  onLoad() {
    const that = this;
    wx.cloud.callFunction({
      name: 'login',
      data: {
      },
      success: (res) => {
        that.setData({
          userId: res.result.openid,
        });
      },
    });
  },

  onInput(e) {
    this.setData({
      userInput: e.detail.value,
    });
  },

  upload() {
    const key = this.data.userInput;
    if (key.trim() !== '') {
      const that = this;
      wx.showLoading({
        title: '正在验证',
        mask: true,
      });
      wx.cloud.callFunction({
        name: 'canvasValidate',
        data: {
          key,
        },
        success: (res) => {
          const r = JSON.parse(res.result);
          wx.hideLoading();
          if (r.errors) {
            wx.showModal({
              title: '验证失败',
              content: '请检查 Key 后重试',
              showCancel: false,
            });
          } else {
            wx.showToast({
              title: '认证成功',
              icon: 'success',
            });
            canvasDb.add({
              data: {
                userId: that.data.userId,
                key,
              },
              success: () => {
                wx.navigateBack({
                });
              },
            });
          }
        },
      });
    } else {
      wx.showModal({
        title: '输入错误',
        content: '请输入正确的 API Key',
        showCancel: false,
      });
    }
  },
});
