// 初期状態
let currentTurn = 1; // 現在のターン
let currentPlayer = 1; // 現在のプレイヤー (1P or 2P)
let diceValues = [1, 1, 1, 1, 1]; // ダイスの目
let heldDice = [false, false, false, false, false]; // 各ダイスのホールド状態

// ターン情報の更新
function updateTurnInfo() {
    document.getElementById("turn-info").textContent =
        `${currentTurn}ターン目: 現在のプレイヤー - ${currentPlayer === 1 ? "1P" : "2P"}`;
}

// ダイスを振る
function rollDice() {
    for (let i = 0; i < diceValues.length; i++) {
        if (!heldDice[i]) {
            diceValues[i] = Math.floor(Math.random() * 6) + 1; // 1〜6の乱数
        }
    }
    updateDiceDisplay();
    calculateScores();
}

// ダイス表示を更新
function updateDiceDisplay() {
    for (let i = 0; i < diceValues.length; i++) {
        const dice = document.getElementById(`dice${i + 1}`);
        dice.textContent = diceValues[i];
        dice.classList.toggle("held", heldDice[i]); // ホールド中のダイスにクラスを適用
    }
}

// ダイスをホールド/解除
function toggleHold(index) {
    heldDice[index] = !heldDice[index];
    updateDiceDisplay();
}

// 得点を計算
function calculateScores() {
    const scoreTable = {
        ones: diceValues.filter(v => v === 1).length * 1,
        twos: diceValues.filter(v => v === 2).length * 2,
        threes: diceValues.filter(v => v === 3).length * 3,
        fours: diceValues.filter(v => v === 4).length * 4,
        fives: diceValues.filter(v => v === 5).length * 5,
        sixes: diceValues.filter(v => v === 6).length * 6,
        threeOfAKind: hasOfAKind(3) ? diceValues.reduce((a, b) => a + b, 0) : 0,
        fourOfAKind: hasOfAKind(4) ? diceValues.reduce((a, b) => a + b, 0) : 0,
        fullHouse: isFullHouse() ? 25 : 0,
        smallStraight: isSmallStraight() ? 15 : 0,
        largeStraight: isLargeStraight() ? 30 : 0,
        yacht: hasOfAKind(5) ? 50 : 0,
    };

    // 表にスコアを反映
    updateScoreTable(scoreTable);
}

// スコアを表に表示
function updateScoreTable(scores) {
    const rows = document.querySelectorAll(".custom-table tbody tr");
    const keys = Object.keys(scores);
    rows.forEach((row, index) => {
        const scoreCell = row.children[currentPlayer];
        scoreCell.textContent = scores[keys[index]] || 0;
    });
}

// n個の同じ数字が存在するかどうかをチェック
function hasOfAKind(n) {
    const counts = {};
    for (let i = 0; i < diceValues.length; i++) {
        const value = diceValues[i];
        counts[value] = (counts[value] || 0) + 1;
    }
    return Object.values(counts).some(count => count >= n);
}

// フルハウスが存在するかどうかをチェック
function isFullHouse() {
    const counts = {};
    for (let i = 0; i < diceValues.length; i++) {
        const value = diceValues[i];
        counts[value] = (counts[value] || 0) + 1;
    }
    return Object.values(counts).some(count => count === 3) && Object.values(counts).some(count => count === 2);
}

// 小さいストレートが存在するかどうかをチェック
function isSmallStraight() {
    const values = diceValues.slice().sort((a, b) => a - b);
    for (let i = 0; i < values.length - 3; i++) {
        if (values[i] + 1 === values[i + 1] && values[i + 1] + 1 === values[i + 2] && values[i + 2] + 1 === values[i + 3]) {
            return true;
        }
    }
    return false;
}

// 大きいストレートが存在するかどうかをチェック
function isLargeStraight() {
    const values = diceValues.slice().sort((a, b) => a - b);
    for (let i = 0; i < values.length - 4; i++) {
        if (values[i] + 1 === values[i + 1] && values[i + 1] + 1 === values[i + 2] && values[i + 2] + 1 === values[i + 3] && values[i + 3] + 1 === values[i + 4]) {
            return true;
        }
    }
    return false;
}

// イベントリスナー
document.getElementById("roll-button").addEventListener("click", rollDice);
for (let i = 0; i < diceValues.length; i++) {
    document.getElementById(`dice${i + 1}`).addEventListener("click", () => toggleHold(i));
}

// 初期化
updateTurnInfo();
updateDiceDisplay();
