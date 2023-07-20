const Board = () => {
    const winningCombos = [
        [1, 2, 3], [4, 5, 6], [7, 8, 9],
        [1, 4, 7], [2, 5, 8], [3, 6, 9],
        [1, 5, 9], [3, 5, 7]
    ];
    let boardValues = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    const gameWon = () => {
        return winningCombos.some(
            winningCombo => {
                return (winningCombo.every(index => {
                        return boardValues[index - 1] == 'o'
                    }) 
                    || (winningCombo.every(index => {
                        return boardValues[index - 1] == 'x'
                    }))
                )  
            }
        );
    };
    const noFreeFields = () => {
        return boardValues.every(item => typeof item !== 'number');
    };
    const insertValue = (symbol, index) => {
        boardValues[index] = symbol;
    };
    const resetValues = () => {
        boardValues = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    }
    const resetDisplay = () => {
        const fields = document.querySelectorAll(`.board div`);
        fields.forEach(field => field.innerHTML = "");
        const gameMessage = document.querySelector(".game-messages");
        gameMessage.innerHTML = "";
    }
    return {insertValue, gameWon, noFreeFields, resetValues, resetDisplay};
};

const Player = (symbol, imagePath) => {
    let wins = 0;
    const getWins = () => wins
    const win = () => {
        wins++;
    };
    return {win, getWins, symbol, imagePath};
};

const ticTacToeGame = () => {
    const player1 = Player("o", "images/circle-outline.svg");
    const player2 = Player("x", "images/close.svg");
    const board = Board();
    const xPlayerWinCount = document.querySelector("#x");
    const oPlayerWinCount = document.querySelector("#o");
    const currentPlayerImage = () => {
        return currentPlayer.imagePath;
    }
    let currentPlayer = [player1, player2][Math.round(Math.random())]

    const playerTurn = (id, field) => {
        if (board.gameWon() || board.noFreeFields()) {
            return
        }
        board.insertValue(currentPlayer.symbol, id - 1);
        field.innerHTML = `<img src="${currentPlayer.imagePath}" alt=""></img>`
        if (board.gameWon()) {
            displayMessage(`<img src="${currentPlayer.imagePath}" style="width: clamp(40px, 5vw, 60px);" alt=""></img> wins!`)
            currentPlayer.win()
            if (currentPlayer.symbol == "x") {
                xPlayerWinCount.textContent = currentPlayer.getWins()
            } else {
                oPlayerWinCount.textContent = currentPlayer.getWins()
            }
        } else if (board.noFreeFields()) {
            displayMessage("It's a tie!")
        }
        switchPlayer();
    };
    const resetGame = () => {
        board.resetValues();
        board.resetDisplay();
    }
    const displayMessage = message => {
        const messageContainer = document.querySelector(".game-messages")
        messageContainer.innerHTML = `<p>${message}</p><button onclick="game.resetGame()" class="reset-btn">Reset</button` 
    }
    const switchPlayer = () => {
        if (currentPlayer == player1) {
            currentPlayer = player2
        } else {
            currentPlayer = player1
        }
    };
    return {playerTurn, currentPlayerImage, resetGame};
};

const game = ticTacToeGame();

for(i = 1; i <= 9; i++) {
    const field = document.querySelector(`#id-${i}`);   
    field.addEventListener("click", (e) => {
        const id = Number(e.target.id.slice(-1))
        if (id == 0) return
        game.playerTurn(id, field);
    });
};
