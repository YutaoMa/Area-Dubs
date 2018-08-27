// pages/about/about.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    logged: false
  },

  bindGetUserInfo: function() {
    if(this.data.logged) return;
    wx.showLoading({
      title: '正在登录'
    });
    let that = this;
    wx.getUserInfo({
      success: function(res) {
        that.setData({
          userInfo: res.userInfo,
          logged: true
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
          logged: false
        });
      }
    });
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

  }
})