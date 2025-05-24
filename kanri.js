let isClickable = true;

const supabaseUrl = "https://ngvdppfzcgbkdtjlwbvh.supabase.co"; // あなたのURL
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ndmRwcGZ6Y2dia2R0amx3YnZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgwODU5NjMsImV4cCI6MjA2MzY2MTk2M30.6bVDy_sbtV4k_AvGeQ_aTtRhz4tBsJb2o_q8Y-OmwMA";             // あなたの鍵
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

function paswordCheck(){
  const input = document.getElementById("password").value;
  const correct = "kotekDoer1875"; // ← ここで正解パスワードを設定
  
  if (input === correct) {
    window.location.href = "./f7QXpB29VcJmRUyTK1NwZLqE34gsHD.html"; // ← 行き先ページを指定
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
const allNumbers = [];

for (let i = 1; i <= 75; i++){
  numbers2.push(i);
}

async function bingoNumber() {
  if (!isClickable) return;

  isClickable = false;

  if (numbers2.length === 0) {
    document.getElementById("number").textContent = "終了！";
    return;
  }
  const index = Math.floor(Math.random() * numbers2.length);
  const number = numbers2[index];
  numbers2.splice(index, 1); // 番号を1回限りにする
  allNumbers.push(number);
  const { error } = await supabase
    .from("bingo_numbers")
    .insert([{ number }]);

  if (error) {
    console.error("Supabaseへの保存に失敗:", error.message);
  }
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
      document.getElementById("koremade").textContent = allNumbers.join(", ");
    }
  }, flashInterval);
  setTimeout(() => {
    isClickable = true;
  }, 3000);
}

async function bingoReset(){
  const { error } = await supabase
    .from("bingo_numbers")
    .delete()
    .neq("id", 0);

  if (error) {
    console.error("Supabaseのデータ削除に失敗:", error.message);
  }

  
  allNumbers.length = [];
  document.getElementById("koremade").textContent = allNumbers.join(", ");
  for (let i = 1; i <= 75; i++){
    numbers2.push(i);
  }
  document.getElementById("number").textContent = "番号";
}
