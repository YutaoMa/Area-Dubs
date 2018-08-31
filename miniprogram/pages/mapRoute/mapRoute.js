let timer = null;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    longitude: '-122.30588',
    latitude: '47.6550375',
    scale: '16',
    fromLat: '',
    fromLong: '',
    toLat: '',
    toLong: '',
    fromId: '',
    toId: '',
    loading: false,
    markers: [{}, {}],
    resultsFrom: [],
    resultsTo: [],
    valueFrom: '',
    valueTo: '',
    focusFrom: '',
    focusTo: '',
    help: `
    <ul>
      <li>指定开始, 结束地点以查找路径</li>
    </ul>
    `,
    placeholderFrom: '起始地点',
    placeholderTo: '目标终点',
    polyline: [],
    routeDistance: '',
    routeTime: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let mode = options.mode;
    let id = options.id;
    if(mode == '0') {
      this.setFrom({
        currentTarget: {
          dataset: {
            id: id
          }
        }
      });
    } else if (mode == '1') {
      this.setTo({
        currentTarget: {
          dataset: {
            id: id
          }
        }
      });
    }
  },

  focusSearchFrom: function() {
    this.setData({
      focusFrom: true
    });
    this.cancelSearchTo();
  },

  focusSearchTo: function() {
    this.setData({
      focusTo: true
    });
    this.cancelSearchFrom();
  },

  clearSearchFrom: function() {
    this.setData({
      valueFrom: '',
      resultsFrom: []
    });
  },

  clearSearchTo: function() {
    this.setData({
      valueTo: '',
      resultsTo: []
    });
  },

  cancelSearchFrom: function() {
    this.setData({
      valueFrom: '',
      focusFrom: false,
      resultsFrom: []
    })
  },

  cancelSearchTo: function() {
    this.setData({
      valueTo: '',
      focusTo: false,
      resultsTo: []
    });
  },

  onSearchFrom: function(e) {
    this.setData({
      valueFrom: e.detail.value
    });
    let key = escape(this.data.valueFrom.trim());
    if (key != '') {
      this.searchFrom(key);
    }
  },
  
  onSearchTo: function(e) {
    this.setData({
      valueTo: e.detail.value
    });
    let key = escape(this.data.valueTo.trim());
    if(key != '') {
      this.searchTo(key);
    }
  },

  searchFrom: function (key) {
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
            resultsFrom: res.result,
            loading: false
          });
        },
        fail: console.error
      })
    }, 1500);
  },

  searchTo: function (key) {
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
            resultsTo: res.result,
            loading: false
          });
        },
        fail: console.error
      })
    }, 1500);
  },

  setFrom: function(e) {
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
      success: function (res) {
        let markersTo = that.data.markers[1];
        that.setData({
          placeholderFrom: res.result.title.substring(0, 40),
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
          }, markersTo],
          latitude: res.result.latitude,
          fromLat: res.result.latitude,
          longitude: res.result.longitude,
          fromLong: res.result.longitude,
          fromId: res.result.id,
        });
        wx.hideLoading();
        that.cancelSearchFrom();
      },
      fail: console.error
    })
  },

  setTo: function (e) {
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
      success: function (res) {
        let markersFrom = that.data.markers[0];
        that.setData({
          placeholderTo: res.result.title.substring(0, 40),
          markers: [markersFrom, {
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
          toLat: res.result.latitude,
          longitude: res.result.longitude,
          toLong: res.result.longitude,
          toId: res.result.id,
        });
        wx.hideLoading();
        that.cancelSearchTo();
      },
      fail: console.error
    })
  },

  searchRoute: function() {
    wx.showLoading({
      title: '搜索路径中',
      mask: true
    });
    let that = this;
    wx.cloud.callFunction({
      name: 'mapRoute',
      data: {
        fromLat: that.data.fromLat,
        fromLong: that.data.fromLong,
        toLat: that.data.toLat,
        toLong: that.data.toLong
      },
      success: function(res) {
        that.setData({
          routeDistance: res.result.distance,
          routeTime: res.result.time,
          polyline: [{
            points: res.result.route,
            width: 5,
            color: '#FF0000DD',
            arrowLine: true
          }]
        });
        wx.hideLoading();
      },
      fail: console.error
    })
  }
})