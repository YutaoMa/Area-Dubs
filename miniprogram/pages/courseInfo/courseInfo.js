// pages/courseInfo/courseInfo.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '',
    terms: [],
    loading: true,
    code: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let code = options.code;
    this.setData({
      code: unescape(code)
    });
    let that = this;
    wx.cloud.callFunction({
      name: 'courseDetails',
      data: {
        code: code
      },
      success: function(res) {
        that.setData({
          loading: false,
          title: res.result.title,
          terms: res.result.terms
        });
      },
      fail: console.error
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  getInstructor: function(e) {
    let name = e.currentTarget.dataset.name;
    wx.showLoading({
      title: '搜索评价中',
      mask: true
    });
    let fullName = name.split(" ");
    let firstName = fullName[0];
    let lastName = fullName[fullName.length - 1];
    wx.cloud.callFunction({
      name: 'instructor',
      data: {
        first: firstName,
        last: lastName
      },
      success: function(res) {
        wx.hideLoading();
        if (res.result == 'Not Found') {
          wx.showModal({
            title: '提示',
            content: '没有找到评价',
            showCancel: false
          });
        } else {
          wx.showModal({
            title: res.result.teacherfirstname_t + ' ' + res.result.teacherlastname_t,
            content: 'Overall Quality: ' + res.result.averageratingscore_rf + '\r\nLevel of Difficulty: ' + res.result.averageeasyscore_rf + '\r\nNumber of Ratings: ' + res.result.total_number_of_ratings_i,
            showCancel: false
          });
        }
      },
      fail: console.error
    });
  },

  getBuilding: function(e) {
    let key = e.currentTarget.dataset.building;
    wx.showModal({
      title: '跳转到地图',
      content: '是否查询该教学楼位置',
      success: function(res) {
        if(res.confirm) {
          wx.navigateTo({
            url: '../map/map?key=' + escape(key)
          });
        }
      }
    });
  }
})