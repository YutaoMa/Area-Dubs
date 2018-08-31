Page({
  data: {
    title: '',
    loading: true,
    content: [],
  },

  onLoad(options) {
    const code = unescape(options.code);
    this.setData({
      title: unescape(options.title),
    });
    const that = this;
    wx.cloud.callFunction({
      name: 'degreeReq',
      data: {
        code,
      },
      success: (res) => {
        that.setData({
          content: res.result,
          loading: false,
        });
      },
    });
  },
});
