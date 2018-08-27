let timer = null;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    value: '',
    focus: false,
    results: [],
    loading: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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

  focusSearch: function () {
    this.setData({
      focus: true
    });
  },

  clearSearch: function () {
    this.setData({
      value: '',
      results: []
    });
  },

  cancelSearch: function () {
    this.setData({
      value: '',
      focus: false,
      results: []
    });
  },

  onSearch: function(e) {
    this.setData({
      value: e.detail.value
    });
    let key = escape(this.data.value.trim());
    if(key != '') {
      let that = this;
      that.setData({
        loading: true
      });
      clearTimeout(timer);
      timer = setTimeout(function() {
        wx.cloud.callFunction({
          name: 'degreeSearch',
          data: {
            key: key
          },
          success: function(res) {
            that.setData({
              results: res.result,
              loading: false
            });
          },
          fail: console.error
        });
      }, 1500);
    }
  },

  getDegree: function(e) {
    let code = e.currentTarget.dataset.code;
    let title = e.currentTarget.dataset.title;
    let desc = e.currentTarget.dataset.desc;
    let url = '../degreeInfo/degreeInfo';
    url += '?code=' + escape(code);
    url += '&title=' + escape(title);
    url += '&desc=' + escape(desc);
    wx.navigateTo({
      url
    });
  }
})
