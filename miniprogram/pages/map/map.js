let timer = null;

Page({
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
    placeholder: '搜索',
  },

  onLoad(options) {
    if (options.key != null) {
      this.setData({
        focus: true,
        value: unescape(options.key),
      });
      this.search(this.data.value);
    }
  },

  focusSearch() {
    this.setData({
      focus: true,
    });
  },

  clearSearch() {
    this.setData({
      value: '',
      results: [],
    });
  },

  cancelSearch() {
    this.setData({
      value: '',
      focus: false,
      results: [],
    });
  },

  onSearch(e) {
    this.setData({
      value: e.detail.value,
    });
    const key = escape(this.data.value.trim());
    if (key !== '') {
      this.search(key);
    }
  },

  search(key) {
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
            results: res.result,
            loading: false,
          });
        },
      });
    }, 1500);
  },

  getLocation(e) {
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
              fontSize: '14',
            },
          }],
          latitude: res.result.latitude,
          longitude: res.result.longitude,
        });
        wx.hideLoading();
        that.cancelSearch();
      },
    });
  },

  mapAction(e) {
    const id = e.markerId;
    wx.showActionSheet({
      itemList: ['从这里开始', '前往这里'],
      success: (res) => {
        let mode;
        if (res.tapIndex === 0) {
          mode = '0';
        } else {
          mode = '1';
        }
        const url = `../mapRoute/mapRoute?mode=${mode}&id=${id}`;
        wx.navigateTo({
          url,
        });
      },
    });
  },
});
