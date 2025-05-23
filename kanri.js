const numbers2 = [];

for (let i = 1; i <= 75; i++){
  numbers2.push(i);
}

function bingoNumber() {
  if (numbers2.length === 0) {
    document.getElementById("number").textContent = "もう番号はありません！";
    return;
  }

  const index = Math.floor(Math.random() * numbers2.length);
  const number = numbers2[index];
  numbers2.splice(index, 1); // 番号を1回限りにする

  document.getElementById("number").textContent = number;
}