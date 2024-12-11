const diceArea = document.getElementById("diceArea");
const rollDiceButton = document.getElementById("rollDice");
let diceValues = [0, 0, 0, 0, 0]; // サイコロの値を格納
let holdStatus = [false, false, false, false, false]; // サイコロのホールド状態を格納

// ダイスを振る処理
function rollDice() {
    diceValues = diceValues.map((value, index) => {
        if (!holdStatus[index]) {
            return Math.floor(Math.random() * 6) + 1; // 1〜6のランダムな値を生成
        }
        return value; // ホールドされているサイコロは変更しない
    });
    updateDiceDisplay();
    calculateScores(); // 振り直し後に役を再計算
}

// サイコロの表示を更新する
function updateDiceDisplay() {
    diceArea.innerHTML = ""; // サイコロエリアをクリア
    diceValues.forEach((value, index) => {
        const dice = document.createElement("div");
        dice.classList.add("dice");
        dice.id = `dice-${index}`;
        dice.textContent = value > 0 ? value : ""; // サイコロが未設定の場合は空欄
        if (holdStatus[index]) dice.classList.add("held"); // ホールド中の場合スタイルを変更
        dice.onclick = () => toggleHold(index); // クリックでホールド切り替え
        diceArea.appendChild(dice);
    });
}

// サイコロのホールド状態を切り替える
function toggleHold(index) {
    holdStatus[index] = !holdStatus[index]; // 状態を反転
    updateDiceDisplay(); // 表示を更新
}

// 役の得点を計算する
function calculateScores() {
    const scoreTable = {
        ones: calculateSumForNumber(1),
        twos: calculateSumForNumber(2),
        threes: calculateSumForNumber(3),
        fours: calculateSumForNumber(4),
        fives: calculateSumForNumber(5),
        sixes: calculateSumForNumber(6),
        threeOfAKind: hasOfAKind(3) ? diceValues.reduce((a, b) => a + b, 0) : 0,
        fourOfAKind: hasOfAKind(4) ? diceValues.reduce((a, b) => a + b, 0) : 0,
        fullHouse: isFullHouse() ? 25 : 0,
        smallStraight: isSmallStraight() ? 15 : 0,
        largeStraight: isLargeStraight() ? 30 : 0,
        yacht: hasOfAKind(5) ? 50 : 0,
        chance: diceValues.reduce((a, b) => a + b, 0),
    };

    updateScoreTable(scoreTable);
}

// 指定した目の合計を計算
function calculateSumForNumber(number) {
    return diceValues.filter(v => v === number).length * number;
}

// 同じ目が "count" 個揃っているか判定
function hasOfAKind(count) {
    const counts = {};
    diceValues.forEach(v => {
        counts[v] = (counts[v] || 0) + 1;
    });
    return Object.values(counts).some(v => v >= count);
}

// その他の役判定関数は前述のコードと同じ（省略可能）

// スコア表を更新する
function updateScoreTable(scoreTable) {
    const rows = document.querySelectorAll(".custom-table tbody tr");
    const scoreKeys = [
        "ones", "twos", "threes", "fours", "fives", "sixes",
        "threeOfAKind", "fourOfAKind", "fullHouse",
        "smallStraight", "largeStraight", "yacht", "chance",
    ];

    rows.forEach((row, index) => {
        const cells = row.querySelectorAll("td");
        if (index < scoreKeys.length) {
            const key = scoreKeys[index];
            cells[1].textContent = scoreTable[key]; // 1Pのスコア
            cells[2].textContent = scoreTable[key]; // 2Pのスコア
        }
    });
}

rollDiceButton.addEventListener("click", rollDice);
updateDiceDisplay();
