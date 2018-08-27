// pages/degreeInfo/degreeInfo.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '',
    code: '',
    desc: '',
    degrees: [],
    loading: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let title = options.title;
    let code = options.code;
    let desc = options.desc;
    this.setData({
      title: unescape(title),
      code: unescape(code),
      desc: unescape(desc)
    });
    let that = this;
    wx.cloud.callFunction({
      name: 'degreeInfo',
      data: {
        code: code
      },
      success: function(res) {
        that.setData({
          degrees: res.result.credentials,
          loading: false
        });
      },
      fail: console.error
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  getDegreeReq: function(e) {
    let code = e.currentTarget.dataset.code;
    let title = e.currentTarget.dataset.title;
    if(code != null) {
      let url = '../degreeReq/degreeReq';
      url += '?code=' + escape(code);
      url += '&title=' + escape(title);
      wx.navigateTo({
        url
      });
    } else {
      wx.showModal({
        title: '提示',
        content: '该专业不提供详细信息',
        showCancel: false
      });
    }
  }
})