Page({
  data: {
    alerts: [],
    loading: true,
  },

  onLoad() {
    const that = this;
    wx.cloud.callFunction({
      name: 'alert',
      data: {
      },
      success: (res) => {
        that.setData({
          alerts: res.result,
          loading: false,
        });
      },
    });
  },
});
