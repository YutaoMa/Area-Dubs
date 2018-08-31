Page({
  data: {
    title: '',
    code: '',
    desc: '',
    degrees: [],
    loading: true,
  },

  onLoad(options) {
    const { title, code, desc } = options;
    this.setData({
      title: unescape(title),
      code: unescape(code),
      desc: unescape(desc),
    });
    const that = this;
    wx.cloud.callFunction({
      name: 'degreeInfo',
      data: {
        code,
      },
      success: (res) => {
        that.setData({
          degrees: res.result.credentials,
          loading: false,
        });
      },
    });
  },

  getDegreeReq(e) {
    const { code, title } = e.currentTarget.dataset;
    if (code != null) {
      const url = `../degreeReq/degreeReq?code=${escape(code)}&title=${escape(title)}`;
      wx.navigateTo({
        url,
      });
    } else {
      wx.showModal({
        title: '提示',
        content: '该专业不提供详细信息',
        showCancel: false,
      });
    }
  },
});
