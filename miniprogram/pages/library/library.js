// pages/library/library.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    date: '',
    day: '',
    locations: [],
    loading: true,
    libList: {
      'Odegaard Undergraduate Library (OUGL) Public Hours': '1454',
      'Foster Business Library': '1452',
      'Health Sciences Library': '1453',
      'Suzzallo and Allen Libraries': '1449'
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let d = new Date();
    this.setData({
      date: this.formatDate(d),
      day: this.formatDay(d)
    });
    let that = this;
    wx.cloud.callFunction({
      name: 'libraryToday',
      data: {
      },
      success: function(res) {
        that.setData({
          locations: JSON.parse(res.result).locations,
          loading: false
        });
      },
      fail: console.error
    });
  },

  formatDate: function(d) {
    let monthDict = {
      0: 'January',
      1: 'February',
      2: 'March',
      3: 'April',
      4: 'May',
      5: 'June',
      6: 'July',
      7: 'August',
      8: 'September',
      9: 'October',
      10: 'November',
      11: 'December'
    };
    let date = monthDict[d.getMonth()] + ' ' + d.getDate();
    return date;
  },

  formatDay: function(d) {
    let dayDict = {
      0: 'Sunday',
      1: 'Monday',
      2: 'Tuesday',
      3: 'Wednesday',
      4: 'Thursday',
      5: 'Friday',
      6: 'Saturday'
    };
    return dayDict[d.getDay()];
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

  getAvailability: function(e) {
    let url = '../libraryCheck/libraryCheck';
    url += '?lid=' + e.currentTarget.dataset.lid;
    url += '&title=' + escape(e.currentTarget.dataset.title);
    wx.navigateTo({
      url
    });
  }
})