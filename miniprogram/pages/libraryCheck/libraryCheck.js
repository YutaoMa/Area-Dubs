function formatDate(date) {
  const d = new Date(date);
  let month = `${d.getMonth() + 1}`;
  let day = `${d.getDate()}`;
  const year = d.getFullYear();

  if (month.length < 2) month = `0${month}`;
  if (day.length < 2) day = `0${day}`;

  return [year, month, day].join('-');
}

function formatNow() {
  return formatDate(Date.now());
}

function formatThen(offset) {
  const date = new Date();
  date.setDate(date.getDate() + offset);
  return formatDate(date);
}

Page({
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
      gid: '3066',
    }, {
      name: '2nd Floor',
      gid: '3067',
    }, {
      name: '3rd Floor',
      gid: '3068',
    }],
    fosterList: [{
      name: 'Group Study Rooms',
      gid: '2590',
    }],
    healthList: [{
      name: 'Group Study Rooms',
      gid: '2591',
    }, {
      name: 'Media:scape',
      gid: '3065',
    }],
    suzzalloList: [{
      name: 'Suzzallo Group Study Rooms',
      gid: '3069',
    }, {
      name: 'Research Commons',
      gid: '3070',
    }],
    index: 0,
  },

  onLoad(options) {
    this.setData({
      lid: options.lid,
      title: unescape(options.title),
      date: formatNow(),
      startDate: formatNow(),
      endDate: formatThen(6),
      loading: true,
    });
    this.getTimes();
  },

  updateDate(e) {
    this.setData({
      date: e.detail.value,
      loading: true,
    });
    this.getTimes();
  },

  updateGroup(e) {
    this.setData({
      index: e.detail.value,
      loading: true,
    });
    this.getTimes();
  },

  getTimes() {
    const { lid } = this.data;
    let gid = '';
    if (lid === '1454') {
      ({ gid } = this.data.odeList[this.data.index]);
    } else if (lid === '1452') {
      ({ gid } = this.data.fosterList[this.data.index]);
    } else if (lid === '1453') {
      ({ gid } = this.data.healthList[this.data.index]);
    } else if (lid === '1449') {
      ({ gid } = this.data.suzzalloList[this.data.index]);
    }
    const that = this;
    wx.cloud.callFunction({
      name: 'libraryCheck',
      data: {
        gid,
        date: that.data.date,
      },
      success: (res) => {
        that.setData({
          times: res.result,
          loading: false,
        });
      },
    });
  },
});
