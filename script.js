// 初期状態
let currentTurn = 1;
let currentPlayer = 1;
let diceValues = [1, 1, 1, 1, 1];
let heldDice = [false, false, false, false, false];

// ターン情報の更新
function updateTurnInfo() {
    document.getElementById("turn-info").textContent =
        `${currentTurn}ターン目: 現在のプレイヤー - ${currentPlayer === 1 ? "1P" : "2P"}`;
}

// ダイスを振る
function rollDice() {
    for (let i = 0; i < diceValues.length; i++) {
        if (!heldDice[i]) {
            diceValues[i] = Math.floor(Math.random() * 6) + 1;
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
        dice.classList.toggle("held", heldDice[i]);
    }
}

// ダイスをホールド/解除
function toggleHold(index) {
    heldDice[index] = !heldDice[index];
    updateDiceDisplay();
}

// 得点を計算
function calculateScores() {
    const counts = {};
    diceValues.forEach(value => {
        counts[value] = (counts[value] || 0) + 1;
    });

    const scoreTable = {
        ones: diceValues.filter(v => v === 1).length * 1,
        twos: diceValues.filter(v => v === 2).length * 2,
        threes: diceValues.filter(v => v === 3).length * 3,
        fours: diceValues.filter(v => v === 4).length * 4,
        fives: diceValues.filter(v => v === 5).length * 5,
        sixes: diceValues.filter(v => v === 6).length * 6,
        threeOfAKind: hasOfAKind(3) ? diceValues.reduce((a, b) => a + b, 0) : 0,
        fourOfAKind: hasOfAKind(4) ? diceValues.reduce((a, b) => a + b, 0) : 0,
        fullHouse: Object.values(counts).includes(3) && Object.values(counts).includes(2) ? 25 : 0,
        smallStraight: isSmallStraight() ? 15 : 0,
        largeStraight: isLargeStraight() ? 30 : 0,
        yacht: hasOfAKind(5) ? 50 : 0,
        chance: diceValues.reduce((a, b) => a + b, 0),
    };

    updateScoreTable(scoreTable);
}

// スコアを表に表示
function updateScoreTable(scores) {
    const rows = document.querySelectorAll(".custom-table tbody tr");

    const mapping = {
        ones: 0,
        twos: 1,
        threes: 2,
        fours: 3,
        fives: 4,
        sixes: 5,
        threeOfAKind: 8,
        fourOfAKind: 9,
        fullHouse: 10,
        smallStraight: 11,
        largeStraight: 12,
        yacht: 13,
        chance: 14,
    };

    Object.keys(scores).forEach(key => {
        const rowIndex = mapping[key];
        if (rowIndex !== undefined) {
            const row = rows[rowIndex];
            const scoreCell = row.children[currentPlayer];
            scoreCell.textContent = scores[key];
        }
    });
}

// その他の関数はそのまま

// n個の同じ数字が存在するかどうかをチェック
function hasOfAKind(n) {
    const counts = {};
    for (let i = 0; i < diceValues.length; i++) {
        const value = diceValues[i];
        counts[value] = (counts[value] || 0) + 1;
    }
    return Object.values(counts).some(count => count >= n);
}

// スモールストレートの判定
function isSmallStraight() {
    const uniqueValues = [...new Set(diceValues)].sort();
    return (
        uniqueValues.join("").includes("1234") ||
        uniqueValues.join("").includes("2345") ||
        uniqueValues.join("").includes("3456")
    );
}

// ラージストレートの判定
function isLargeStraight() {
    const uniqueValues = [...new Set(diceValues)].sort().join("");
    return uniqueValues === "12345" || uniqueValues === "23456";
}

// 次のターン
function nextTurn() {
    currentPlayer = currentPlayer === 1 ? 2 : 1;

    if (currentPlayer === 1) {
        currentTurn++;
    }

    if (currentTurn > 13) {
        endGame();
    } else {
        updateTurnInfo();
        resetDice();
    }
}

// ゲーム終了処理
function endGame() {
    alert("ゲーム終了！結果を確認してください。");
}

// ダイスをリセット
function resetDice() {
    diceValues = [1, 1, 1, 1, 1];
    heldDice = [false, false, false, false, false];
    updateDiceDisplay();
}

// イベントリスナー
document.getElementById("roll-button").addEventListener("click", rollDice);
for (let i = 0; i < diceValues.length; i++) {
    document.getElementById(`dice${i + 1}`).addEventListener("click", () => toggleHold(i));
}

// 初期化
updateTurnInfo();
updateDiceDisplay();
