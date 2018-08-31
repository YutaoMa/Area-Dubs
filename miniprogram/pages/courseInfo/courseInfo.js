Page({
  data: {
    title: '',
    terms: [],
    loading: true,
    code: '',
  },

  onLoad(options) {
    const { code } = options;
    this.setData({
      code: unescape(code),
    });
    const that = this;
    wx.cloud.callFunction({
      name: 'courseDetails',
      data: {
        code,
      },
      success: (res) => {
        that.setData({
          loading: false,
          title: res.result.title,
          terms: res.result.terms,
        });
      },
    });
  },

  getInstructor(e) {
    const { name } = e.currentTarget.dataset;
    wx.showLoading({
      title: '搜索评价中',
      mask: true,
    });
    const fullName = name.split(' ');
    const firstName = fullName[0];
    const lastName = fullName[fullName.length - 1];
    wx.cloud.callFunction({
      name: 'instructor',
      data: {
        first: firstName,
        last: lastName,
      },
      success: (res) => {
        wx.hideLoading();
        if (res.result === 'Not Found') {
          wx.showModal({
            title: '提示',
            content: '没有找到评价',
            showCancel: false,
          });
        } else {
          wx.showModal({
            title: `${res.result.teacherfirstname_t} ${res.result.teacherlastname_t}`,
            content: `Overall Quality: ${res.result.averageratingscore_rf}\r\nLevel of Difficulty: ${res.result.averageeasyscore_rf}\r\nNumber of Ratings: ${res.result.total_number_of_ratings_i}`,
            showCancel: false,
          });
        }
      },
    });
  },

  getBuilding(e) {
    const key = e.currentTarget.dataset.building;
    wx.showModal({
      title: '跳转到地图',
      content: '是否查询该教学楼位置',
      success: (res) => {
        if (res.confirm) {
          wx.navigateTo({
            url: `../map/map?key=${escape(key)}`,
          });
        }
      },
    });
  },
});
