const app = getApp();

Page({
  data: {
    userName: '',
    term: '',
    terms: [],
    canvasKey: '',
    courses: [],
    loading: true,
    termIndex: 0,
  },

  onLoad() {
    this.setData({
      canvasKey: app.globalData.canvasKey,
    });
    this.getUserName();
    this.getTerms();
  },

  getUserName() {
    const that = this;
    wx.cloud.callFunction({
      name: 'canvasUser',
      data: {
        key: that.data.canvasKey,
      },
      success: (res) => {
        that.setData({
          userName: JSON.parse(res.result).name,
        });
      },
    });
  },

  getTerms() {
    const that = this;
    wx.cloud.callFunction({
      name: 'canvasTerms',
      data: {
        key: that.data.canvasKey,
      },
      success: (res) => {
        that.setData({
          terms: res.result,
        });
        that.getTermCourses(that.data.terms[that.data.termIndex].id);
      },
    });
  },

  getTermCourses(termId) {
    const that = this;
    this.setData({
      loading: true,
    });
    wx.cloud.callFunction({
      name: 'canvasTermCourses',
      data: {
        key: that.data.canvasKey,
        termId,
      },
      success: (res) => {
        that.setData({
          courses: res.result,
          loading: false,
        });
      },
    });
  },

  updateTerm(e) {
    this.setData({
      termIndex: e.detail.value,
    });
    this.getTermCourses(this.data.terms[this.data.termIndex].id);
  },
});
