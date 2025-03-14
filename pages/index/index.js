// 导入游戏逻辑
const Game = require('../../utils/game.js');

Page({
  data: {
    grid: [],
    score: 0,
    highScore: 0,
    gameOver: false,
    won: false,
    startX: 0,
    startY: 0,
    colors: {
      '0': '#ccc0b3',
      '2': '#eee4da',
      '4': '#ede0c8',
      '8': '#f2b179',
      '16': '#f59563',
      '32': '#f67c5f',
      '64': '#f65e3b',
      '128': '#edcf72',
      '256': '#edcc61',
      '512': '#edc850',
      '1024': '#edc53f',
      '2048': '#edc22e'
    }
  },

  onLoad: function() {
    // 获取系统信息以适配屏幕
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          windowWidth: res.windowWidth
        });
      }
    });

    // 初始化游戏
    this.game = new Game();
    this.initGame();

    // 获取最高分
    const app = getApp();
    this.setData({
      highScore: app.globalData.highScore
    });
  },

  // 初始化游戏
  initGame: function() {
    const gameState = this.game.init();
    this.setData({
      grid: gameState.grid,
      score: gameState.score,
      gameOver: false,
      won: false
    });
  },

  // 重新开始游戏
  restartGame: function() {
    this.initGame();
  },

  // 触摸开始事件
  touchStart: function(e) {
    this.setData({
      startX: e.touches[0].pageX,
      startY: e.touches[0].pageY
    });
  },

  // 触摸结束事件
  touchEnd: function(e) {
    const endX = e.changedTouches[0].pageX;
    const endY = e.changedTouches[0].pageY;
    const deltaX = endX - this.data.startX;
    const deltaY = endY - this.data.startY;

    // 判断滑动方向
    let direction = '';
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      // 水平方向滑动
      direction = deltaX > 0 ? 'right' : 'left';
    } else {
      // 垂直方向滑动
      direction = deltaY > 0 ? 'down' : 'up';
    }

    // 最小滑动距离
    const minDistance = 30;
    if (Math.abs(deltaX) < minDistance && Math.abs(deltaY) < minDistance) {
      return; // 滑动距离太小，不处理
    }

    // 执行移动
    this.moveGrid(direction);
  },

  // 移动网格
  moveGrid: function(direction) {
    if (this.data.gameOver || this.data.won) return;

    const moveResult = this.game.move(direction);

    if (moveResult.moved) {
      this.setData({
        grid: moveResult.grid,
        score: moveResult.score
      });

      // 更新最高分
      if (moveResult.score > this.data.highScore) {
        this.updateHighScore(moveResult.score);
      }

      // 检查游戏状态
      this.checkGameStatus();
    }
  },

  // 检查游戏状态
  checkGameStatus: function() {
    // 检查是否获胜
    if (this.game.hasWon()) {
      this.setData({
        won: true
      });
      wx.showToast({
        title: '恭喜你获胜！',
        icon: 'success',
        duration: 2000
      });
    }

    // 检查是否游戏结束
    if (this.game.isGameOver()) {
      this.setData({
        gameOver: true
      });
      wx.showModal({
        title: '游戏结束',
        content: '你的得分是: ' + this.data.score,
        showCancel: false,
        confirmText: '再来一局',
        success: (res) => {
          if (res.confirm) {
            this.restartGame();
          }
        }
      });
    }
  },

  // 更新最高分
  updateHighScore: function(newScore) {
    this.setData({
      highScore: newScore
    });

    // 更新全局数据
    const app = getApp();
    app.globalData.highScore = newScore;

    // 保存到本地存储
    wx.setStorageSync('highScore', newScore);
  },

  // 继续游戏（获胜后选择继续）
  continueGame: function() {
    this.setData({
      won: false
    });
  }
});