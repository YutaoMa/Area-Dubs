let timer = null;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    focus: false,
    value: '',
    loading: false,
    results: [],
    longitude: '-122.30588',
    latitude: '47.6550375',
    markers: [],
    scale: '16',
    help: `
    <ul>
      <li>可以通过建筑全程或简写搜索, 例如: ODE, Lander Hall</li>
      <li>部分关键词可以快速搜索到一类设施, 例如: Parking</li>
      <li>点击地图上展示的搜索结果可以进入路线查询界面</li>
    </ul>
    `,
    placeholder: '搜索'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if(options.hasOwnProperty('key')) {
      this.setData({
        focus: true,
        value: unescape(options.key)
      });
      this.search(this.data.value);
    }
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

  focusSearch: function() {
    this.setData({
      focus: true
    });
  },

  clearSearch: function() {
    this.setData({
      value: '',
      results: []
    });
  },

  cancelSearch: function() {
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
    if (key != '') {
      this.search(key);
    }
  },

  search: function(key) {
    let that = this;
    that.setData({
      loading: true
    });
    clearTimeout(timer);
    timer = setTimeout(function () {
      wx.cloud.callFunction({
        name: 'mapSearch',
        data: {
          key: key
        },
        success: function (res) {
          that.setData({
            results: res.result,
            loading: false
          });
        },
        fail: console.error
      })
    }, 1500);
  },

  getLocation: function(e) {
    wx.showLoading({
      title: '正在加载',
      mask: true
    });
    let id = e.currentTarget.dataset.id;
    let that = this;
    wx.cloud.callFunction({
      name: 'mapLocation',
      data: {
        id: id
      },
      success: function(res) {
        that.setData({
          placeholder: res.result.title.substring(0, 40),
          markers: [{
            id: res.result.id,
            latitude: res.result.latitude,
            longitude: res.result.longitude,
            callout: {
              content: res.result.title,
              display: 'ALWAYS',
              padding: '5',
              fontSize: '14'
            }
          }],
          latitude: res.result.latitude,
          longitude: res.result.longitude
        });
        wx.hideLoading();
        that.cancelSearch();
      },
      fail: console.error
    })
  },

  mapAction: function(e) {
    let id = e.markerId;
    wx.showActionSheet({
      itemList: ['从这里开始', '前往这里'],
      success: function(res) {
        let mode;
        if(res.tapIndex == 0) {
          mode = '0';
        } else {
          mode = '1';
        }
        let url = '../mapRoute/mapRoute';
        url += '?mode=' + mode;
        url += '&id=' + id;
        wx.navigateTo({
          url
        });
      }
    })
  }
})