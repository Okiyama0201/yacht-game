let currentTurn = 1;
let currentPlayer = 1;
let diceValues = [1, 1, 1, 1, 1];
let heldDice = [false, false, false, false, false];
let rollCount = 0; 

let playerScores = {
    1: { 
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
    2: { 
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

function rollDice() {
    if (rollCount >= 3) {
        alert("振り直し回数は3回までです！");
        return;
    }

    for (let i = 0; i < diceValues.length; i++) {
        if (!heldDice[i]) {
            diceValues[i] = Math.floor(Math.random() * 6) + 1;
        }
    }

    rollCount++; 
    updateDiceDisplay();
    calculateScores();
    updateTurnInfo();  
}


function updateTurnInfo() {
    document.getElementById("turn-info").textContent =
        `${currentTurn}ターン目: 現在のプレイヤー - ${currentPlayer === 1 ? "1P" : "2P"}`;
    updateSubtotal(); 
    updateBonus();
}

function updateDiceDisplay() {
    for (let i = 0; i < diceValues.length; i++) {
        const dice = document.getElementById(`dice${i + 1}`);
        
        const diceImage = `images/dice${diceValues[i]}.png`;
        
        dice.innerHTML = `<img src="${diceImage}" alt="Dice ${diceValues[i]}" />`;
        dice.classList.toggle("held", heldDice[i]);
    }
}

function toggleHold(index) {
    if (rollCount === 0) { 
        alert("現在はホールドできません！");
        return;
    }
    heldDice[index] = !heldDice[index];
    updateDiceDisplay();
}

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

    let subtotal = 0; 

    Object.keys(scores).forEach((key) => {
        const rowIndex = mapping[key];
        if (rowIndex !== undefined) {
            const row = rows[rowIndex];
            const scoreCell = row.children[currentPlayer];

            if (!scoreCell.classList.contains("locked")) {
                scoreCell.textContent = scores[key];
            }

            if (scoreCell.classList.contains("locked") && rowIndex < 6) {
                subtotal += parseInt(scoreCell.textContent, 10) || 0;
            }
        }
    });

    const subtotalRow = rows[6]; 
    const subtotalCell = subtotalRow.children[currentPlayer];

    if (!subtotalCell.classList.contains("locked")) {
        subtotalCell.textContent = `${subtotal}/63`;
    }

    updateTotalScore();
}

function hasOfAKind(n) {
    const counts = {};
    for (let i = 0; i < diceValues.length; i++) {
        const value = diceValues[i];
        counts[value] = (counts[value] || 0) + 1;
    }
    return Object.values(counts).some(count => count >= n);
}

function isSmallStraight() {
    const uniqueValues = [...new Set(diceValues)].sort();
    return (
        uniqueValues.join("").includes("1234") ||
        uniqueValues.join("").includes("2345") ||
        uniqueValues.join("").includes("3456")
    );
}

function isLargeStraight() {
    const uniqueValues = [...new Set(diceValues)].sort().join("");
    return uniqueValues === "12345" || uniqueValues === "23456";
}

function nextTurn() {
    currentPlayer = currentPlayer === 1 ? 2 : 1;

    if (currentPlayer === 1) {
        currentTurn++;
    }

    if (currentTurn > 13) {
        updateTurnInfo();
        endGame();
    } else {
        rollCount = 0;  
        updateTurnInfo();  
        resetDice();
    }
}

function calculateTotalScore(playerNumber) {
    let totalScore = 0;
    let categories = ['ワンズ', 'ツーズ', 'スリーズ', 'フォーズ', 'ファイブズ', 'シックス', 
                      'スリーオブアカインド', 'フォーオブアカインド', 'フルハウス', 'スモールストレート', 
                      'ラージストレート', 'ヨット', 'チャンス'];
    
    categories.forEach(category => {
        let scoreCell = document.getElementById(`score-${playerNumber}p-${category}`);
        if (scoreCell) {
            totalScore += parseInt(scoreCell.textContent) || 0; 
        }
    });

    let bonusCell = document.getElementById(`bonus-${playerNumber}p`);
    totalScore += parseInt(bonusCell.textContent) || 0;  

    return totalScore;
}

function endGame() {
    document.getElementById('turn-info').textContent = '';

    document.querySelector('.dice-container').style.display = 'none';
    
    document.getElementById('roll-button').style.display = 'none';
    
    document.getElementById('back-to-title').style.display = 'inline-block';

    alert("ゲーム終了！結果を確認してください。");

    let totalScore1p = calculateTotalScore(1);  
    let totalScore2p = calculateTotalScore(2); 

    document.querySelector('.total-score').style.display = 'table';  
    document.getElementById('total-1p').textContent = totalScore1p; 
    document.getElementById('total-2p').textContent = totalScore2p; 

    let winner = totalScore1p > totalScore2p ? '1P' : (totalScore1p < totalScore2p ? '2P' : '引き分け');
    document.getElementById('winner-display').textContent = winner + 'の勝利！';
    document.getElementById('winner-display').style.display = 'block';  
}

document.getElementById('back-to-title').addEventListener("click", function() {
    window.location.href = "start.html";  
});

function resetDice() {
    diceValues = [1, 1, 1, 1, 1];
    heldDice = [false, false, false, false, false];
    updateDiceDisplay();
}

document.getElementById("roll-button").addEventListener("click", rollDice);
for (let i = 0; i < diceValues.length; i++) {
    document.getElementById(`dice${i + 1}`).addEventListener("click", () => toggleHold(i));
}

function lockScore(clickedCell) {
    const scoreValue = parseInt(clickedCell.textContent, 10); 
    const role = clickedCell.getAttribute("data-role"); 

    if (currentPlayer === 1) {
        playerScores[1][role] = scoreValue;
    } else {
        playerScores[2][role] = scoreValue;
    }

    console.log(`プレイヤー${currentPlayer}が選択した役: ${role}、得点: ${scoreValue}`);

    clickedCell.classList.add("locked"); 
    clickedCell.style.backgroundColor = "lightgray"; 
    clickedCell.style.cursor = "not-allowed"; 

    nextTurn();
}

function updateBonus(player) {
    const subtotal1P = parseInt(document.querySelector('tr:nth-child(7) td:nth-child(2)').innerText, 10); 
    const subtotal2P = parseInt(document.querySelector('tr:nth-child(7) td:nth-child(3)').innerText, 10); 

    const bonus1P = document.getElementById('bonus-1p');
    const bonus2P = document.getElementById('bonus-2p');

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

function updateSubtotal() {
    const rows = document.querySelectorAll(".custom-table tbody tr");
    const subtotalRow = rows[6];  
    const subtotalCell1P = subtotalRow.children[1];  
    const subtotalCell2P = subtotalRow.children[2];  

    let subtotal1P = 0;
    let subtotal2P = 0;

    for (let i = 0; i < 6; i++) { 
        const scoreCell1P = rows[i].children[1]; 
        const scoreCell2P = rows[i].children[2]; 

        if (scoreCell1P.classList.contains("locked")) {
            subtotal1P += parseInt(scoreCell1P.textContent, 10) || 0;
        }

        if (scoreCell2P.classList.contains("locked")) {
            subtotal2P += parseInt(scoreCell2P.textContent, 10) || 0; 
        }
    }

    subtotalCell1P.textContent = `${subtotal1P}/63`;
    subtotalCell2P.textContent = `${subtotal2P}/63`;
}

function initializeScoreTable() {
    const rows = document.querySelectorAll(".custom-table tbody tr");
    const subtotalRow = rows[6];  
    const subtotalCell1P = subtotalRow.children[1]; 
    const subtotalCell2P = subtotalRow.children[2]; 

    subtotalCell1P.textContent = "0/63"; 
    subtotalCell2P.textContent = "0/63"; 
}

initializeScoreTable();

const scoreTableCells = document.querySelectorAll(".custom-table tbody td");

scoreTableCells.forEach((cell) => {
    cell.addEventListener("click", (event) => {
        const clickedCell = event.target;

        const currentColumnIndex = currentPlayer; 

        const cellColumnIndex = Array.from(clickedCell.parentNode.children).indexOf(clickedCell);

        if (cellColumnIndex !== currentColumnIndex) {
            alert("現在のプレイヤーの列しか選択できません！");
            return;
        }

        if (clickedCell.classList.contains("locked")) {
            alert("このセルはすでに選択されています！");
            return;
        }

        const cellValue = clickedCell.textContent.trim();
        const row = clickedCell.parentNode;

        if (row.children[0].textContent.includes("小計") || row.children[0].textContent.includes("ボーナス")) {
            alert("この行は空白にできません！");
            return;
        }

        if (!isNaN(cellValue) && cellValue !== "") {
            clickedCell.classList.add("locked"); 
            clickedCell.style.backgroundColor = "lightgray"; 
            clickedCell.style.cursor = "not-allowed"; 

            const rows = document.querySelectorAll(".custom-table tbody tr");
            rows.forEach((row) => {
                const currentPlayerCell = row.children[currentColumnIndex]; 
                const allCellsInRow = row.children;

                Array.from(allCellsInRow).forEach((cell, index) => {
                    if (index === currentColumnIndex && !cell.classList.contains("locked")) {
                        if (row.children[0].textContent.includes("小計") || row.children[0].textContent.includes("ボーナス")) {
                            return;
                        }
                        cell.textContent = ""; 
                    }
                });
            });

            const score = parseInt(cellValue, 10); 
            console.log(`プレイヤー${currentPlayer}が選択したスコア: ${score}`);

            nextTurn();
        } else {
            alert("このセルは選択できません");
        }
    });
});

document.getElementById("show-roles").addEventListener("click", function() {
    document.getElementById("role-modal").style.display = "block";
});

document.querySelector("#role-modal .close-button").addEventListener("click", function() {
    document.getElementById("role-modal").style.display = "none";
});

window.addEventListener("click", function(event) {
    let modal = document.getElementById("role-modal");
    if (event.target === modal) {
        modal.style.display = "none";
    }
});

updateTurnInfo();
updateDiceDisplay();