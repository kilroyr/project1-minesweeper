let board = [];
let rows = 8;
let columns = 8;

let minesCount = 10;
let minesLocation = []; // "2-2", "3-4", "2-1"

let tilesClicked = 0; //goal to click all tiles except the ones containing mines

let gameOver = false;

window.onload = function() {
    startGame();
}

function generateMines() {
    // minesLocation.push("2-2");
    // minesLocation.push("2-3");
    // minesLocation.push("5-6");
    // minesLocation.push("3-4");
    // minesLocation.push("1-1");

    let minesLeft = minesCount;
    while (minesLeft > 0) { 
        let r = Math.floor(Math.random() * rows);
        let c = Math.floor(Math.random() * columns);
        let id = r.toString() + "-" + c.toString();

        if (!minesLocation.includes(id)) {
            minesLocation.push(id);
            minesLeft -= 1;
        }
    }
}


function startGame() {
    document.getElementById("mines-count").innerText = minesCount;
    generateMines();

    //populate the board
    for (let r = 0; r < rows; r++) {
        let row = [];
        for (let c = 0; c < columns; c++) {
            let tile = document.createElement("div");
            tile.id = r.toString() + "-" + c.toString();
            tile.addEventListener("click", clickTile);
            tile.addEventListener("contextmenu", function(e) {
                e.preventDefault();
                setFlag(tile);
            });
            document.getElementById("board").append(tile);
            row.push(tile);
        }
        board.push(row);
    }

    console.log(board);
}


function setFlag(tile) {
    if (tile.innerText == "") {
        tile.innerText = "🚽";
    }
    else if (tile.innerText == "🚽") {
        tile.innerText = "";
    }
}


function clickTile() {
    if (gameOver || this.classList.contains("tile-clicked")) {
        return;
    }

    let tile = this;

    if (minesLocation.includes(tile.id)) {
        // alert("GAME OVER");
        gameOver = true;
        revealMines();
        return;
    }

    let coords = tile.id.split("-"); // "0-0" -> ["0", "0"]
    let r = parseInt(coords[0]);
    let c = parseInt(coords[1]);
    checkMine(r, c);
}


function revealMines() {
    for (let r= 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            let tile = board[r][c];
            if (minesLocation.includes(tile.id)) {
                tile.innerText = "💩";
                tile.style.backgroundColor = "brown";                
            }
        }
    }
}

//https://codereview.stackexchange.com/questions/152671/minesweeper-javascript-prototype

function checkMine(r, c) {
    if (r < 0 || r >= rows || c < 0 || c >= columns) {
        return;
    }
    if (board[r][c].classList.contains("tile-clicked")) {
        return;
    }

    board[r][c].classList.add("tile-clicked");
    tilesClicked += 1;

    let minesFound = 0;

    //top 3
    minesFound += checkTile(r-1, c-1);     
    minesFound += checkTile(r-1, c);       
    minesFound += checkTile(r-1, c+1);  

    //left and right
    minesFound += checkTile(r, c-1);        
    minesFound += checkTile(r, c+1);        

    //bottom 3
    minesFound += checkTile(r+1, c-1);     
    minesFound += checkTile(r+1, c);        
    minesFound += checkTile(r+1, c+1);     

    if (minesFound > 0) {
        board[r][c].innerText = minesFound;
        board[r][c].classList.add("x" + minesFound.toString());
    }
    else {
        board[r][c].innerText = "";
        
        //top 3
        checkMine(r-1, c-1);   
        checkMine(r-1, c);      
        checkMine(r-1, c+1);    

        //left and right
        checkMine(r, c-1);     
        checkMine(r, c+1);      

        //bottom 3
        checkMine(r+1, c-1);  
        checkMine(r+1, c);      
        checkMine(r+1, c+1);   
    }

    if (tilesClicked == rows * columns - minesCount) {
        document.getElementById("mines-count").innerText = "Flushed";
        gameOver = true;
    }
}

function checkTile(r, c) {
    if (r < 0 || r >= rows || c < 0 || c >= columns) {
        return 0;
    }
    if (minesLocation.includes(r.toString() + "-" + c.toString())) {
        return 1;
    }
    return 0;
}