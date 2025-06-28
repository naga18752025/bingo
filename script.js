let isAnimating = false;
let freeClickMode = true;
let kaisu = 0;
let nagasa = 0;

function saveCardToStorage(columns) {
  localStorage.setItem("bingoCard", JSON.stringify(columns));
}

let drawnNumbers = [];

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

      if (value === "FREE") {
        cell.textContent = value;
      } else {
        if (animated) {
          animateCell(cell, value);
        } else {
          cell.textContent = value;
        }
      }

      if (value === "FREE") {
        cell.classList.add("free");
        cell.addEventListener("click", () => {
          if (isAnimating) return;
          cell.classList.toggle("marked");
          bingoAlert();
        });
      } else {
        cell.addEventListener("click", () => {
          if (isAnimating) return;
          const value = cell.textContent;
          if (freeClickMode || drawnNumbers.includes(Number(value))) {
            cell.classList.toggle("marked");
            bingoAlert();
          } else {
            alert("この数字はまだ出ていません！");
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
  const form = document.getElementById("password-form");
  if (form.style.display === "block") {
    document.getElementById("reset-button").textContent = "カードをリセット";
    form.style.display = "none";
  } else {
    document.getElementById("reset-button").textContent = "戻る";
    form.style.display = "block";
  }
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
  isAnimating = true;
  let count = 0;
  const maxCount = 30; // 表示切り替え回数
  const interval = setInterval(() => {
    const fakeValue = Math.floor(Math.random() * 75) + 1;
    cell.textContent = fakeValue;
    count++;
    if (count >= maxCount) {
      clearInterval(interval);
      cell.textContent = finalValue;
      isAnimating = false;
    }
  }, 100); // 50msごとに切り替え
}

function countReaches() {
  const cells = document.querySelectorAll("#bingo-grid div");
  const grid = [...Array(5)].map(() => Array(5));

  // セルを5x5の2次元配列に詰め直す
  cells.forEach((cell, i) => {
    const row = Math.floor(i / 5);
    const col = i % 5;
    grid[row][col] = cell.classList.contains("marked");
  });

  let reachCount = 0;

  // 横方向
  for (let row = 0; row < 5; row++) {
    const marked = grid[row].filter(v => v).length;
    if (marked === 4) reachCount++;
  }

  // 縦方向
  for (let col = 0; col < 5; col++) {
    let marked = 0;
    for (let row = 0; row < 5; row++) {
      if (grid[row][col]) marked++;
    }
    if (marked === 4) reachCount++;
  }

  // 斜め（左上→右下）
  let diag1 = 0;
  for (let i = 0; i < 5; i++) {
    if (grid[i][i]) diag1++;
  }
  if (diag1 === 4) reachCount++;

  // 斜め（右上→左下）
  let diag2 = 0;
  for (let i = 0; i < 5; i++) {
    if (grid[i][4 - i]) diag2++;
  }
  if (diag2 === 4) reachCount++;

  return reachCount;
}

let bingohubuki = true;
let bingoCount = 0;

function bingoAlert(){
  document.getElementById("bingo-message").style.fontSize = "40px";
  if (checkBingo()) {
    if(checkBingoCount() === 1){
      document.getElementById("bingo-message").textContent = "🎉 ビンゴ！ 🎉";
    }else if(checkBingoCount() === 2){
      document.getElementById("bingo-message").style.fontSize = "30px";
      document.getElementById("bingo-message").textContent = "🎉 ダブルビンゴ！ 🎉";
    }else if(checkBingoCount() === 3){
      document.getElementById("bingo-message").style.fontSize = "25px";
      document.getElementById("bingo-message").textContent = "🎉 トリプルビンゴ！ 🎉";
    }else{
      document.getElementById("bingo-message").style.fontSize = "30px";
      document.getElementById("bingo-message").textContent = `🎉 ${checkBingoCount()}本ビンゴ！ 🎉`
    }

    if((checkBingoCount() > bingoCount)){
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.6 }
      });
    }
    bingoCount = checkBingoCount();
  }else if(countReaches() === 1){
    document.getElementById("bingo-message").textContent = "リーチ！";
    bingoCount = 0;
  }else if(countReaches() === 2){
    document.getElementById("bingo-message").textContent = "ダブルリーチ！";
    bingoCount = 0;
  }else if(countReaches() === 3){
    document.getElementById("bingo-message").style.fontSize = "35px";
    document.getElementById("bingo-message").textContent = "トリプルリーチ！";
    bingoCount = 0;
  }else if(countReaches() > 3){
    const reach = countReaches();
    document.getElementById("bingo-message").textContent = `${reach}本リーチ！`;
    bingoCount = 0;
  }else {
    document.getElementById("bingo-message").textContent = "";
    bingoCount = 0;
  }
}

function checkBingoCount() {
  const cells = document.querySelectorAll("#bingo-grid div");
  const grid = [...Array(5)].map(() => Array(5));

  // セルを5x5の2次元配列に詰め直す
  cells.forEach((cell, i) => {
    const row = Math.floor(i / 5);
    const col = i % 5;
    grid[row][col] = cell.classList.contains("marked");
  });

  let bingoCount = 0;

  // 横方向チェック
  for (let row = 0; row < 5; row++) {
    if (grid[row].every(v => v)) bingoCount++;
  }

  // 縦方向チェック
  for (let col = 0; col < 5; col++) {
    if (grid.every(row => row[col])) bingoCount++;
  }

  // 斜めチェック（左上→右下）
  if (grid.every((row, i) => row[i])) bingoCount++;

  // 斜めチェック（右上→左下）
  if (grid.every((row, i) => row[4 - i])) bingoCount++;

  return bingoCount;
}

function triggerFlashEffect() {
  const flash = document.getElementById("flash-effect");
  flash.classList.remove("flash-overlay"); // 再トリガーのため一度消す
  void flash.offsetWidth; // リフローで再適用
  flash.classList.add("flash-overlay");
}
