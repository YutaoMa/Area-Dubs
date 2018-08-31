let timer = null;

Page({
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
    routeTime: '',
  },

  onLoad(options) {
    const { mode, id } = options;
    if (mode === '0') {
      this.setFrom({
        currentTarget: {
          dataset: {
            id,
          },
        },
      });
    } else if (mode === '1') {
      this.setTo({
        currentTarget: {
          dataset: {
            id,
          },
        },
      });
    }
  },

  focusSearchFrom() {
    this.setData({
      focusFrom: true,
    });
    this.cancelSearchTo();
  },

  focusSearchTo() {
    this.setData({
      focusTo: true,
    });
    this.cancelSearchFrom();
  },

  clearSearchFrom() {
    this.setData({
      valueFrom: '',
      resultsFrom: [],
    });
  },

  clearSearchTo() {
    this.setData({
      valueTo: '',
      resultsTo: [],
    });
  },

  cancelSearchFrom() {
    this.setData({
      valueFrom: '',
      focusFrom: false,
      resultsFrom: [],
    });
  },

  cancelSearchTo() {
    this.setData({
      valueTo: '',
      focusTo: false,
      resultsTo: [],
    });
  },

  onSearchFrom(e) {
    this.setData({
      valueFrom: e.detail.value,
    });
    const key = escape(this.data.valueFrom.trim());
    if (key !== '') {
      this.searchFrom(key);
    }
  },

  onSearchTo(e) {
    this.setData({
      valueTo: e.detail.value,
    });
    const key = escape(this.data.valueTo.trim());
    if (key !== '') {
      this.searchTo(key);
    }
  },

  searchFrom(key) {
    const that = this;
    that.setData({
      loading: true,
    });
    clearTimeout(timer);
    timer = setTimeout(() => {
      wx.cloud.callFunction({
        name: 'mapSearch',
        data: {
          key,
        },
        success: (res) => {
          that.setData({
            resultsFrom: res.result,
            loading: false,
          });
        },
      });
    }, 1500);
  },

  searchTo(key) {
    const that = this;
    that.setData({
      loading: true,
    });
    clearTimeout(timer);
    timer = setTimeout(() => {
      wx.cloud.callFunction({
        name: 'mapSearch',
        data: {
          key,
        },
        success: (res) => {
          that.setData({
            resultsTo: res.result,
            loading: false,
          });
        },
      });
    }, 1500);
  },

  setFrom(e) {
    wx.showLoading({
      title: '正在加载',
      mask: true,
    });
    const { id } = e.currentTarget.dataset;
    const that = this;
    wx.cloud.callFunction({
      name: 'mapLocation',
      data: {
        id,
      },
      success: (res) => {
        const markersTo = that.data.markers[1];
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
              fontSize: '14',
            },
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
    });
  },

  setTo(e) {
    wx.showLoading({
      title: '正在加载',
      mask: true,
    });
    const { id } = e.currentTarget.dataset;
    const that = this;
    wx.cloud.callFunction({
      name: 'mapLocation',
      data: {
        id,
      },
      success: (res) => {
        const markersFrom = that.data.markers[0];
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
              fontSize: '14',
            },
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
    });
  },

  searchRoute() {
    wx.showLoading({
      title: '搜索路径中',
      mask: true,
    });
    const that = this;
    wx.cloud.callFunction({
      name: 'mapRoute',
      data: {
        fromLat: that.data.fromLat,
        fromLong: that.data.fromLong,
        toLat: that.data.toLat,
        toLong: that.data.toLong,
      },
      success: (res) => {
        that.setData({
          routeDistance: res.result.distance,
          routeTime: res.result.time,
          polyline: [{
            points: res.result.route,
            width: 5,
            color: '#FF0000DD',
            arrowLine: true,
          }],
        });
        wx.hideLoading();
      },
    });
  },
});
