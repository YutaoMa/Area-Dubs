const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userName: '',
    term: '',
    terms: [],
    canvasKey: '',
    courses: [],
    loading: true,
    termIndex: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      canvasKey: app.globalData.canvasKey
    });
    this.getUserName();
    this.getTerms();
  },

  getUserName: function() {
    let that = this;
    wx.cloud.callFunction({
      name: 'canvasUser',
      data: {
        key: that.data.canvasKey
      },
      success: function(res) {
        that.setData({
          userName: JSON.parse(res.result).name
        });
      },
      fail: console.error
    });
  },

  getTerms: function() {
    let that = this;
    wx.cloud.callFunction({
      name: 'canvasTerms',
      data: {
        key: that.data.canvasKey
      },
      success: function(res) {
        that.setData({
          terms: res.result
        });
        that.getTermCourses(that.data.terms[that.data.termIndex].id);
      },
      fail: console.error
    });
  },

  getTermCourses: function(termId) {
    let that = this;
    this.setData({
      loading: true
    });
    wx.cloud.callFunction({
      name: 'canvasTermCourses',
      data: {
        key: that.data.canvasKey,
        termId: termId
      },
      success: function(res) {
        that.setData({
          courses: res.result,
          loading: false
        });
      },
      fail: console.error
    });
  },

  updateTerm: function(e) {
    this.setData({
      termIndex: e.detail.value
    });
    this.getTermCourses(this.data.terms[this.data.termIndex].id);
  }
})