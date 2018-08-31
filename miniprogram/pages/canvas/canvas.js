const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    canvasKey: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      canvasKey: app.globalData.canvasKey
    });
  },

  refresh: function() {
    let key = app.globalData.canvasKey;
    if(key == '') {
      wx.showModal({
        title: '没有找到认证',
        content: '请尝试在设置页面重新认证',
        showCancel: false
      });
    } else {
      wx.showToast({
        title: '认证成功',
        icon: 'success'
      });
      this.setData({
        canvasKey: key
      });
    }
  }

})