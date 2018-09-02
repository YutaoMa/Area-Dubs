import config from './config';

App({
  onLaunch() {
    wx.cloud.init(config.cloudEnv);

    this.globalData = {
      canvasKey: '',
    };
  },
});
