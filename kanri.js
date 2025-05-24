function paswordCheck(){
  const input = document.getElementById("password").value;
  const correct = "kotekDoer1875"; // ← ここで正解パスワードを設定
  
  if (input === correct) {
    window.location.href = "./kanri.html"; // ← 行き先ページを指定
    return false; // フォームの送信をキャンセル（リダイレクトだけする）
  } else {
    alert("パスワードが違います！");
    return false; // 送信しない（ページ遷移しない）
  }
}

function PasswordCheck2() {
  const input = document.getElementById("send-password").value;
  const correctPassword = "kousyoudayo"; // ここを好きなパスワードに

  if (input === correctPassword) {
    document.querySelector(".container").style.display = "flex";
    document.querySelector(".pass2").style.display = "none";
  } else {
    alert("パスワードが違います！");
  }
}

const numbers2 = [];

for (let i = 1; i <= 75; i++){
  numbers2.push(i);
}

function bingoNumber() {
  if (numbers2.length === 0) {
    document.getElementById("number").textContent = "終了！";
    return;
  }

  const index = Math.floor(Math.random() * numbers2.length);
  const number = numbers2[index];
  numbers2.splice(index, 1); // 番号を1回限りにする
  let count = 0;
  const maxFlashes = 50;  // フラッシュの回数
  const flashInterval = 50; // ミリ秒間隔

  const interval = setInterval(() => {
    const fakeNumber = Math.floor(Math.random() * 75) + 1;
    document.getElementById("number").textContent = fakeNumber;

    count++;
    if (count >= maxFlashes) {
      clearInterval(interval); // ストップ
      document.getElementById("number").textContent = number; // 本物を表示
    }
  }, flashInterval);
}

function bingoReset(){
  for (let i = 1; i <= 75; i++){
    numbers2.push(i);
  }
}
