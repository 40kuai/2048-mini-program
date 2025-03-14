// app.js
App({
  onLaunch: function() {
    // 初始化小程序时执行的逻辑
    console.log('小程序初始化完成');

    // 从本地存储获取历史最高分
    const highScore = wx.getStorageSync('highScore') || 0;
    this.globalData.highScore = highScore;
  },

  globalData: {
    highScore: 0 // 存储最高分
  }
});