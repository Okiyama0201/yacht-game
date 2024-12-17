// 初期状態
let currentTurn = 1;
let currentPlayer = 1;
let diceValues = [1, 1, 1, 1, 1];
let heldDice = [false, false, false, false, false];
let rollCount = 0; // 振り直し回数を追加

// プレイヤーのスコアを保持するオブジェクト
let playerScores = {
    1: { // プレイヤー1
        ones: null,
        twos: null,
        threes: null,
        fours: null,
        fives: null,
        sixes: null,
        threeOfAKind: null,
        fourOfAKind: null,
        fullHouse: null,
        smallStraight: null,
        largeStraight: null,
        yacht: null,
        chance: null
    },
    2: { // プレイヤー2
        ones: null,
        twos: null,
        threes: null,
        fours: null,
        fives: null,
        sixes: null,
        threeOfAKind: null,
        fourOfAKind: null,
        fullHouse: null,
        smallStraight: null,
        largeStraight: null,
        yacht: null,
        chance: null
    }
};

// ダイスを振る
function rollDice() {
    if (rollCount >= 3) {
        alert("このターンでの振り直し回数は3回までです！");
        return;
    }

    for (let i = 0; i < diceValues.length; i++) {
        if (!heldDice[i]) {
            diceValues[i] = Math.floor(Math.random() * 6) + 1;
        }
    }

    rollCount++; // 振り直し回数を増加
    updateDiceDisplay();
    calculateScores();
    updateTurnInfo();  // 振り直し回数が反映されるように更新
}


// ターン情報の更新
function updateTurnInfo() {
    document.getElementById("turn-info").textContent =
        `${currentTurn}ターン目: 現在のプレイヤー - ${currentPlayer === 1 ? "1P" : "2P"} (振り直し回数: ${rollCount}/3)`;
    // 小計を更新
    updateSubtotal();  // 役を決めたタイミングで小計を更新
    updateBonus();
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
    if (rollCount === 0) { // 1回目の振りではホールドを無効にする
        alert("最初の振りではホールドできません！");
        return;
    }
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

    let subtotal = 0; // 小計の計算用

    // ワンズからシックスまでのスコアのみ加算
    Object.keys(scores).forEach((key) => {
        const rowIndex = mapping[key];
        if (rowIndex !== undefined) {
            const row = rows[rowIndex];
            const scoreCell = row.children[currentPlayer];

            // セルがロックされていない場合のみ値を更新
            if (!scoreCell.classList.contains("locked")) {
                scoreCell.textContent = scores[key];
            }

            // ロックされたセルのスコアを合計
            if (scoreCell.classList.contains("locked") && rowIndex < 6) { // ワンズからシックスまで
                subtotal += parseInt(scoreCell.textContent, 10) || 0;
            }
        }
    });

    // 小計行にロックされたセルの合計を表示
    const subtotalRow = rows[6];  // 小計行 (通常は7行目)
    const subtotalCell = subtotalRow.children[currentPlayer];

    if (!subtotalCell.classList.contains("locked")) {
        subtotalCell.textContent = `${subtotal}/63`;
    }

    // ワンズからシックスの合計を更新
    updateTotalScore();
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

// ターンの開始時にリセット
function nextTurn() {
    currentPlayer = currentPlayer === 1 ? 2 : 1;

    if (currentPlayer === 1) {
        currentTurn++;
    }

    if (currentTurn > 13) {
        endGame();
    } else {
        rollCount = 0;  // 振り直し回数をリセット
        updateTurnInfo();  // ターン情報を更新
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

// スコアがロックされた時に記録する
function lockScore(clickedCell) {
    const scoreValue = parseInt(clickedCell.textContent, 10); // セル内の数字を取得
    const role = clickedCell.getAttribute("data-role"); // 役名を取得

    // プレイヤーのスコアに記録
    if (currentPlayer === 1) {
        playerScores[1][role] = scoreValue;
    } else {
        playerScores[2][role] = scoreValue;
    }

    console.log(`プレイヤー${currentPlayer}が選択した役: ${role}、得点: ${scoreValue}`);

    // セルをロック
    clickedCell.classList.add("locked"); // セルをロック
    clickedCell.style.backgroundColor = "lightgray"; // 視覚的に固定されたことを示す
    clickedCell.style.cursor = "not-allowed"; // ポインタを変更

    // 次のプレイヤーへ移行
    nextTurn();
}

// 小計のセルの値を取得してボーナスを計算する関数
function updateBonus(player) {
    const subtotal1P = parseInt(document.querySelector('tr:nth-child(7) td:nth-child(2)').innerText, 10); // 1Pの小計
    const subtotal2P = parseInt(document.querySelector('tr:nth-child(7) td:nth-child(3)').innerText, 10); // 2Pの小計

    // ボーナスを設定するセルを取得
    const bonus1P = document.getElementById('bonus-1p');
    const bonus2P = document.getElementById('bonus-2p');

    // 1Pまたは2Pの小計が63以上ならボーナス35を表示
    if (subtotal1P >= 63) {
        bonus1P.innerText = 35;
    } else {
        bonus1P.innerText = "";
    }

    if (subtotal2P >= 63) {
        bonus2P.innerText = 35;
    } else {
        bonus2P.innerText = "";
    }
}

// 小計を更新
function updateSubtotal() {
    const rows = document.querySelectorAll(".custom-table tbody tr");
    const subtotalRow = rows[6];  // 小計行 (通常は7行目)
    const subtotalCell1P = subtotalRow.children[1];  // プレイヤー1の小計セル
    const subtotalCell2P = subtotalRow.children[2];  // プレイヤー2の小計セル

    let subtotal1P = 0;
    let subtotal2P = 0;

    // ワンズからシックスまでのスコアを加算
    for (let i = 0; i < 6; i++) { // ワンズからシックスまで
        const scoreCell1P = rows[i].children[1]; // プレイヤー1のセル
        const scoreCell2P = rows[i].children[2]; // プレイヤー2のセル

        // プレイヤー1
        if (scoreCell1P.classList.contains("locked")) {
            subtotal1P += parseInt(scoreCell1P.textContent, 10) || 0; // スコアがロックされていれば加算
        }

        // プレイヤー2
        if (scoreCell2P.classList.contains("locked")) {
            subtotal2P += parseInt(scoreCell2P.textContent, 10) || 0; // スコアがロックされていれば加算
        }
    }

    // 小計をセルに表示
    subtotalCell1P.textContent = `${subtotal1P}/63`;
    subtotalCell2P.textContent = `${subtotal2P}/63`;
}


// 初期化時に小計セルに0/63を表示
function initializeScoreTable() {
    const rows = document.querySelectorAll(".custom-table tbody tr");
    const subtotalRow = rows[6];  // 小計行 (通常は7行目)
    const subtotalCell1P = subtotalRow.children[1];  // プレイヤー1の小計セル
    const subtotalCell2P = subtotalRow.children[2];  // プレイヤー2の小計セル

    subtotalCell1P.textContent = "0/63"; // 初期値
    subtotalCell2P.textContent = "0/63"; // 初期値
}

// ゲーム開始時に初期化を実行
initializeScoreTable();

// スコア表にクリックイベントを追加
const scoreTableCells = document.querySelectorAll(".custom-table tbody td");

// 各セルにクリックイベントを設定
scoreTableCells.forEach((cell) => {
    cell.addEventListener("click", (event) => {
        const clickedCell = event.target;

        // 現在のプレイヤーに対応する列番号
        const currentColumnIndex = currentPlayer; // 1P=1, 2P=2

        // セルが現在のプレイヤーの列かどうかを確認
        const cellColumnIndex = Array.from(clickedCell.parentNode.children).indexOf(clickedCell);

        // 列が一致しない場合は選択できない
        if (cellColumnIndex !== currentColumnIndex) {
            alert("現在のプレイヤーの列しか選択できません！");
            return;
        }

        // セルがすでに固定されている場合はクリックを無効化
        if (clickedCell.classList.contains("locked")) {
            alert("このセルはすでに選択されています！");
            return;
        }

        // セルの内容が数字かどうかを判定
        const cellValue = clickedCell.textContent.trim();
        const row = clickedCell.parentNode;

        // 「小計」や「ボーナス」行の場合、数字を空白にしない
        if (row.children[0].textContent.includes("小計") || row.children[0].textContent.includes("ボーナス")) {
            // 何もしない
            alert("この行は空白にできません！");
            return;
        }

        if (!isNaN(cellValue) && cellValue !== "") {
            // 選択したセルをロック（固定）
            clickedCell.classList.add("locked"); // セルをロック
            clickedCell.style.backgroundColor = "lightgray"; // 視覚的に固定されたことを示す
            clickedCell.style.cursor = "not-allowed"; // ポインタを変更

            // 現在のプレイヤーの列の中で、固定されていないセルの数字を空白にする
            const rows = document.querySelectorAll(".custom-table tbody tr");
            rows.forEach((row) => {
                const currentPlayerCell = row.children[currentColumnIndex]; // 現在のプレイヤーのセルを取得
                const allCellsInRow = row.children;

                Array.from(allCellsInRow).forEach((cell, index) => {
                    // 現在のプレイヤーの列内で、ロックされていないセルの数字を空白にする
                    if (index === currentColumnIndex && !cell.classList.contains("locked")) {
                        // 「小計」や「ボーナス」の行はスキップ
                        if (row.children[0].textContent.includes("小計") || row.children[0].textContent.includes("ボーナス")) {
                            return;
                        }
                        cell.textContent = ""; // 数字を空白にする
                    }
                });
            });

            // 固定されたセルの数字を保持
            const score = parseInt(cellValue, 10); // セル内の数字を取得
            console.log(`プレイヤー${currentPlayer}が選択したスコア: ${score}`);

            // 次のプレイヤーへ移行
            nextTurn();
        } else {
            // 数字がないセルを選択した場合の処理
            alert("このセルは選択できません");
        }
    });
});


// 初期化
updateTurnInfo();
updateDiceDisplay();