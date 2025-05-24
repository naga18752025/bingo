function saveCardToStorage(columns) {
  localStorage.setItem("bingoCard", JSON.stringify(columns));
}

function loadCardFromStorage() {
  const data = localStorage.getItem("bingoCard");
  return data ? JSON.parse(data) : null;
}

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
  let columns = loadCardFromStorage();

  const animated = !columns;

  if (!columns) {
    columns = [
      generateColumnNumbers(1, 15),   // B
      generateColumnNumbers(16, 30),  // I
      generateColumnNumbers(31, 45),  // N
      generateColumnNumbers(46, 60),  // G
      generateColumnNumbers(61, 75),  // O
    ];
    columns[2][2] = "FREE";
    saveCardToStorage(columns); // 保存する
  }

  const grid = document.getElementById("bingo-grid");
  grid.innerHTML = ""; // 再生成対策（既にあれば一度消す）

  for (let row = 0; row < 5; row++) {
    for (let col = 0; col < 5; col++) {
      const cell = document.createElement("div");
      const value = columns[col][row];

      if (animated) {
        animateCell(cell, value);
      } else {
        cell.textContent = value;
      }

      if (value === "FREE") {
        cell.classList.add("free");
        cell.addEventListener("click", () => {
          cell.classList.toggle("marked");
          if (checkBingo()) {
            document.getElementById("bingo-message").textContent = "🎉 ビンゴ！ 🎉";
          }else{
            document.getElementById("bingo-message").textContent = "";
          }
        });
      } else {
        cell.addEventListener("click", () => {
          cell.classList.toggle("marked");
          if (checkBingo()) {
            document.getElementById("bingo-message").textContent = "🎉 ビンゴ！ 🎉";
          }else{
            document.getElementById("bingo-message").textContent = "";
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

function resetCard() {
  localStorage.removeItem("bingoCard");
  location.reload(); // ページ再読み込みで再生成される
}

function showPasswordForm() {
  document.getElementById("password-form").style.display = "block";
}

function checkPasswordAndReset() {
  const input = document.getElementById("reset-password").value;
  const correctPassword = "bingo123"; // ここを好きなパスワードに

  if (input === correctPassword) {
    localStorage.removeItem("bingoCard");
    location.reload(); // ページをリロード（カード再生成）
  } else {
    alert("パスワードが違います！");
  }
}

function animateCell(cell, finalValue) {
  let count = 0;
  const maxCount = 30; // 表示切り替え回数
  const interval = setInterval(() => {
    const fakeValue = Math.floor(Math.random() * 75) + 1;
    cell.textContent = fakeValue;
    count++;
    if (count >= maxCount) {
      clearInterval(interval);
      cell.textContent = finalValue;
    }
  }, 100); // 50msごとに切り替え
}
