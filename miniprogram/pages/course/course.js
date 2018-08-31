let timer = null;

Page({
  data: {
    focus: false,
    value: '',
    loading: false,
    results: [],
    help: `
    <ul>
      <li>可以通过课号或关键字搜索, 课号中不使用空格, 例如: ENGL111, CSE143</li>
      <li>点击搜索结果跳转至详情页面, 然后可以通过点击 Schedule 搜索教学楼位置, 点击 Instructor 查询 Ratemyprofessors 评价</li>
    </ul>
    `,
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
      const that = this;
      that.setData({
        loading: true,
      });
      clearTimeout(timer);
      timer = setTimeout(() => {
        wx.cloud.callFunction({
          name: 'courseSearch',
          data: {
            code: key,
          },
          success: (res) => {
            that.setData({
              results: res.result,
              loading: false,
            });
          },
        });
      }, 1500);
    }
  },

  getCourse(e) {
    const { code } = e.currentTarget.dataset;
    const url = `../courseInfo/courseInfo?code=${escape(code)}`;
    wx.navigateTo({
      url,
    });
  },
});
