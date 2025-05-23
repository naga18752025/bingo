function generateColumnNumbers(start, end) {
  const numbers = [];
  for (let i = start; i <= end; i++) {
    numbers.push(i);
  }

  // シャッフル
  for (let i = numbers.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
  }

  return numbers.slice(0, 5);
}

function generateBingoCard() {
  const columns = [
    generateColumnNumbers(1, 15),   // B
    generateColumnNumbers(16, 30),  // I
    generateColumnNumbers(31, 45),  // N
    generateColumnNumbers(46, 60),  // G
    generateColumnNumbers(61, 75),  // O
  ];

  // 中央にFREE
  columns[2][2] = "FREE";

  const grid = document.getElementById("bingo-grid");

  for (let row = 0; row < 5; row++) {
    for (let col = 0; col < 5; col++) {
      const cell = document.createElement("div");
      const value = columns[col][row];

      cell.innerHTML = `<span class="cell-number">${value}</span>`;
      
      if (value === "FREE") {
        cell.classList.add("free");
          cell.addEventListener("click", () => {
            cell.classList.remove("free");
            cell.classList.add("marked");
            if (checkBingo()) {
              document.getElementById("bingo-message").textContent = "🎉 ビンゴ！ 🎉";
            }
          });
      } else {
        // クリックイベントで「穴を開ける」
        cell.addEventListener("click", () => {
          cell.classList.add("marked");
          if (checkBingo()) {
            document.getElementById("bingo-message").textContent = "🎉 ビンゴ！ 🎉";
          }
        });
      }

      grid.appendChild(cell);
    }
  }
}


// 起動時に呼び出し
generateBingoCard();

function checkBingo() {
  const cells = document.querySelectorAll("#bingo-grid div");
  const grid = [...Array(5)].map(() => Array(5));

  // セルを5x5の2次元配列に詰め直す
  cells.forEach((cell, i) => {
    const row = Math.floor(i / 5);
    const col = i % 5;
    grid[row][col] = cell.classList.contains("marked");
  });

  // 横方向チェック
  for (let row = 0; row < 5; row++) {
    if (grid[row].every(v => v)) return true;
  }

  // 縦方向チェック
  for (let col = 0; col < 5; col++) {
    if (grid.every(row => row[col])) return true;
  }

  // 斜めチェック
  if (grid.every((row, i) => row[i])) return true;
  if (grid.every((row, i) => row[4 - i])) return true;

  return false;
}
