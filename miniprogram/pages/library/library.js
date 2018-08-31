Page({
  data: {
    date: '',
    day: '',
    locations: [],
    loading: true,
    libList: {
      'Odegaard Undergraduate Library (OUGL) Public Hours': '1454',
      'Foster Business Library': '1452',
      'Health Sciences Library': '1453',
      'Suzzallo and Allen Libraries': '1449',
    },
  },

  onLoad() {
    const d = new Date();
    this.setData({
      date: this.formatDate(d),
      day: this.formatDay(d),
    });
    const that = this;
    wx.cloud.callFunction({
      name: 'libraryToday',
      data: {
      },
      success: (res) => {
        that.setData({
          locations: JSON.parse(res.result).locations,
          loading: false,
        });
      },
    });
  },

  formatDate(d) {
    const monthDict = {
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
      11: 'December',
    };
    const date = `${monthDict[d.getMonth()]} ${d.getDate()}`;
    return date;
  },

  formatDay(d) {
    const dayDict = {
      0: 'Sunday',
      1: 'Monday',
      2: 'Tuesday',
      3: 'Wednesday',
      4: 'Thursday',
      5: 'Friday',
      6: 'Saturday',
    };
    return dayDict[d.getDay()];
  },

  getAvailability(e) {
    const url = `../libraryCheck/libraryCheck?lid=${e.currentTarget.dataset.lid}&title=${escape(e.currentTarget.dataset.title)}`;
    wx.navigateTo({
      url,
    });
  },
});
