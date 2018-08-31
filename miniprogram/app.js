App({
  onLaunch() {
    wx.cloud.init();

    this.globalData = {
      canvasKey: '',
    };
  },
});
