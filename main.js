

function createPlayer(name) {
    return {
        name,
        turn: false,
        color: null,
        player_elem: null,
        checkedCellsIds: [],
        set_color(value) {
            this.color = value;
        },
        move() {
            console.log("The player clicked to make a move.");
        },
        setPlayerElem(elem) {
            this.player_elem = elem;
        },
        displayDataInCell() {
            if (!this.player_elem) {
                console.error("Player element is not set!");
                return;
            }
            const text = this.player_elem.querySelector("p");
            text.textContent = this.turn
                ? `Name: ${this.name}\nScore: 0\n\nMY TURN!`
                : `Name: ${this.name}\nScore: 0\n\nOTHER PLAYER'S TURN!`;
        }
    };
}

function createCell(container, id) {
    const new_cell = document.createElement("div");
    new_cell.classList.add("item");
    new_cell.id = id;
    container.appendChild(new_cell);
}

function createPlayerCell(container, class_name) {
    const new_cell = document.createElement("div");
    new_cell.classList.add(class_name);
    const text = document.createElement("p");
    new_cell.appendChild(text);
    container.appendChild(new_cell);
}

const board = (function() {
    const totalCells = 9;
    return {
        initBoard: function() {
            const container = document.querySelector(".container");
            container.innerHTML = "";
            createPlayerCell(container, "player_1");
            createPlayerCell(container, "player_2");
            for (let i = 1; i <= totalCells; i++) {
                createCell(container, i);
            }
        }
    };
})();

const game = (function() {
    let play_cells = [];
    let unavailable_cellIds = [];
    let finished = false;

    return {
        populateGameWithCells: function() {
            const container = document.querySelector(".container");
            play_cells = [...container.querySelectorAll(".item")];
        },
        startRound: function(player_1, player_2) {
            play_cells.forEach(item => {
                item.addEventListener("click", function handleClick() {
                    if (finished) return; 
                    if (unavailable_cellIds.includes(item.id)) {
                        alert("This cell is already used!");
                    } else {
                        const activePlayer = player_1.turn ? player_1 : player_2;
                        item.style.backgroundColor = activePlayer.color;
                        unavailable_cellIds.push(item.id); 
                        activePlayer.checkedCellsIds.push(item.id);
                        
                        if (game.checkWinCondition(activePlayer)) { 
                            alert(`${activePlayer.name} wins!`);
                            finished = true;
                            setTimeout(game.resetGame, 1000);
                        } else {
                            switchTurn(player_1, player_2);
                        }
                    }
                });
            });
        },
        checkWinCondition: function(player) { 
            const winningCombinations = [
                ["1", "2", "3"], ["4", "5", "6"], ["7", "8", "9"], // Rows
                ["1", "4", "7"], ["2", "5", "8"], ["3", "6", "9"], // Columns
                ["1", "5", "9"], ["3", "5", "7"]                  // Diagonals
            ];
            return winningCombinations.some(combination =>
                combination.every(id => player.checkedCellsIds.includes(id))
            );
        },
        resetGame: function() {
            finished = false;
            unavailable_cellIds = [];
            board.initBoard();
            game.populateGameWithCells();
            player_1.checkedCellsIds = [];
            player_2.checkedCellsIds = [];
            playerConfig(player_1, player_2);
            game.startRound(player_1, player_2);
        }
    };
})();


function playerConfig(player_1, player_2) {
    player_1.setPlayerElem(document.querySelector(".player_1"));
    player_2.setPlayerElem(document.querySelector(".player_2"));
    player_1.color = "crimson";
    player_2.color = "darkgreen";
    player_1.displayDataInCell();
    player_2.displayDataInCell();
}

function switchTurn(player_1, player_2) {
    player_1.turn = !player_1.turn;
    player_2.turn = !player_2.turn;
    player_1.displayDataInCell();
    player_2.displayDataInCell();
}

function main() {
    window.player_1 = createPlayer("Jhon");
    window.player_2 = createPlayer("Valerie");
    board.initBoard();
    playerConfig(player_1, player_2);
    game.populateGameWithCells(); 
    

    if (Math.random() < 0.5) {
        player_1.turn = true;
    } else {
        player_2.turn = true;
    }
    player_1.displayDataInCell();
    player_2.displayDataInCell();

    game.startRound(player_1, player_2);
} 

main();
