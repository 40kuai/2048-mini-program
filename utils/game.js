// 游戏核心逻辑
class Game {
  constructor() {
    this.grid = Array(4).fill().map(() => Array(4).fill(0));
    this.score = 0;
  }

  // 初始化游戏
  init() {
    this.grid = Array(4).fill().map(() => Array(4).fill(0));
    this.score = 0;
    this.addNumber();
    this.addNumber();
    return {
      grid: this.grid,
      score: this.score
    };
  }

  // 在随机空位置添加数字（2或4）
  addNumber() {
    const available = [];
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.grid[i][j] === 0) {
          available.push({x: i, y: j});
        }
      }
    }
    if (available.length > 0) {
      const randomCell = available[Math.floor(Math.random() * available.length)];
      this.grid[randomCell.x][randomCell.y] = Math.random() < 0.9 ? 2 : 4;
    }
  }

  // 移动和合并逻辑
  move(direction) {
    let moved = false;
    const previousGrid = JSON.parse(JSON.stringify(this.grid));

    // 根据方向重排数组
    const rotateGrid = (grid, times) => {
      let newGrid = JSON.parse(JSON.stringify(grid));
      while (times-- > 0) {
        const rotated = Array(4).fill().map(() => Array(4).fill(0));
        for (let i = 0; i < 4; i++) {
          for (let j = 0; j < 4; j++) {
            rotated[i][j] = newGrid[3 - j][i];
          }
        }
        newGrid = rotated;
      }
      return newGrid;
    };

    // 向左移动一行
    const moveLeft = (row) => {
      const newRow = row.filter(cell => cell !== 0);
      for (let i = 0; i < newRow.length - 1; i++) {
        if (newRow[i] === newRow[i + 1]) {
          newRow[i] *= 2;
          this.score += newRow[i];
          newRow.splice(i + 1, 1);
        }
      }
      while (newRow.length < 4) {
        newRow.push(0);
      }
      return newRow;
    };

    // 根据方向旋转网格
    let rotations = {
      'left': 0,
      'up': 1,
      'right': 2,
      'down': 3
    };

    this.grid = rotateGrid(this.grid, rotations[direction]);

    // 移动每一行
    for (let i = 0; i < 4; i++) {
      const newRow = moveLeft(this.grid[i]);
      if (JSON.stringify(newRow) !== JSON.stringify(this.grid[i])) {
        moved = true;
      }
      this.grid[i] = newRow;
    }

    // 旋转回原来的方向
    this.grid = rotateGrid(this.grid, (4 - rotations[direction]) % 4);

    if (moved) {
      this.addNumber();
    }

    return {
      grid: this.grid,
      score: this.score,
      moved: moved
    };
  }

  // 检查游戏是否结束
  isGameOver() {
    // 检查是否有空格
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.grid[i][j] === 0) {
          return false;
        }
      }
    }

    // 检查是否可以合并
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        const current = this.grid[i][j];
        // 检查右边
        if (j < 3 && current === this.grid[i][j + 1]) {
          return false;
        }
        // 检查下边
        if (i < 3 && current === this.grid[i + 1][j]) {
          return false;
        }
      }
    }

    return true;
  }

  // 检查是否胜利（达到2048）
  hasWon() {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.grid[i][j] === 2048) {
          return true;
        }
      }
    }
    return false;
  }
}

module.exports = Game;