function formatDate(date) {
  var d = new Date(date),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;

  return [year, month, day].join('-');
}

function formatNow() {
  return formatDate(Date.now());
}

function formatThen(offset) {
  let date = new Date();
  date.setDate(date.getDate() + offset);
  return formatDate(date);
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    lid: '',
    title: '',
    date: '',
    startDate: '',
    endDate: '',
    loading: true,
    times: '',
    odeList: [{
      name: '1st Floor',
      gid: '3066'
    }, {
      name: '2nd Floor',
      gid: '3067'
    }, {
      name: '3rd Floor',
      gid: '3068'
    }],
    fosterList: [{
      name: 'Group Study Rooms',
      gid: '2590'
    }],
    healthList: [{
      name: 'Group Study Rooms',
      gid: '2591'
    }, {
      name: 'Media:scape',
      gid: '3065'
    }],
    suzzalloList: [{
      name: 'Suzzallo Group Study Rooms',
      gid: '3069'
    }, {
      name: 'Research Commons',
      gid: '3070'
    }],
    index: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      lid: options.lid,
      title: unescape(options.title),
      date: formatNow(),
      startDate: formatNow(),
      endDate: formatThen(6),
      loading: true
    });
    this.getTimes();
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

  updateDate: function(e) {
    this.setData({
      date: e.detail.value,
      loading: true
    });
    this.getTimes();
  },

  updateGroup: function(e) {
    this.setData({
      index: e.detail.value,
      loading: true
    });
    this.getTimes();
  },

  getTimes: function() {
    let lid = this.data.lid;
    let gid = '';
    if (lid == '1454') {
      gid = this.data.odeList[this.data.index].gid;
    } else if (lid == '1452') {
      gid = this.data.fosterList[this.data.index].gid;
    } else if (lid == '1453') {
      gid = this.data.healthList[this.data.index].gid;
    } else if (lid == '1449') {
      gid = this.data.suzzalloList[this.data.index].gid;
    }
    let that = this;
    wx.cloud.callFunction({
      name: 'libraryCheck',
      data: {
        gid: gid,
        date: that.data.date
      },
      success: function(res) {
        that.setData({
          times: res.result,
          loading: false
        });
      },
      fail: console.error
    });
  }
})