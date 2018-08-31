const app = getApp();

Page({
  data: {
    canvasKey: '',
  },

  onLoad() {
    this.setData({
      canvasKey: app.globalData.canvasKey,
    });
  },

  refresh() {
    const key = app.globalData.canvasKey;
    if (key === '') {
      wx.showModal({
        title: '没有找到认证',
        content: '请尝试在设置页面重新认证',
        showCancel: false,
      });
    } else {
      wx.showToast({
        title: '认证成功',
        icon: 'success',
      });
      this.setData({
        canvasKey: key,
      });
    }
  },
});
