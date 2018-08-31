let timer = null;

Page({
  data: {
    value: '',
    focus: false,
    results: [],
    loading: false,
    help: `
    <ul>
      <li>可以通过专业全称或简写搜索, 例如: Psychology, HCDE</li>
      <li>点击结果跳转至学位详情, 点击专业下的学位名可以查看对应要求详情</li>
      <li>过长的学位名可以通过滑动文字框查看</li>
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
          name: 'degreeSearch',
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
    }
  },

  getDegree(e) {
    const { code, title, desc } = e.currentTarget.dataset;
    const url = `../degreeInfo/degreeInfo?code=${escape(code)}&title=${escape(title)}&desc=${escape(desc)}`;
    wx.navigateTo({
      url,
    });
  },
});
