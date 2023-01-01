const CellFactory = () => {
  let marker = undefined;

  const setMarker = (newMarker) => {
    marker = newMarker;
  };

  const getMarker = () => {
    return marker;
  };

  return {
    getMarker,
    setMarker,
  };
};

const DomController = (() => {
  const boardContainer = document.querySelector(".board");

  const displayCells = () => {
    boardContainer.innerHTML = "";
    for (let i = 0; i < 9; i++) {
      const div = document.createElement("div");
      div.classList.add("cell");
      div.setAttribute("data-number", i);
      boardContainer.appendChild(div);
    }
  };

  const placeMarker = (pos, marker) => {
    cells = document.querySelectorAll(".cell");
    cells.forEach((cell, index) => {
      if (pos == index) {
        const img = document.createElement("img");
        img.setAttribute("src", "images/" + marker + ".png");
        img.classList.add("marker");
        img.setAttribute("data-number", index);
        cell.appendChild(img);
      }
    });
  };

  const displayMessage = (message, color) => {
    const messageBox = document.querySelector(".messageBox");
    messageBox.innerHTML = message;
    messageBox.style.backgroundColor = color;
  };

  const highlightCells = (cells) => {
    cells.forEach((cell) => {
      let cellToColor = document.querySelector(`.cell[data-number= "${cell}"]`);
      cellToColor.style.backgroundColor = "red";
    });
  };

  return {
    displayCells,
    placeMarker,
    displayMessage,
    highlightCells,
  };
})();

const Gameboard = (() => {
  let cells = [];
  let cellsOccupied = 0;
  const winCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  const init = () => {
    cells = [];
    cellsOccupied = 0;
    for (let i = 0; i < 9; i++) {
      cells.push(CellFactory());
    }
  };

  const placeMarker = (pos, marker) => {
    if (cells[pos].getMarker()) return false;
    cells[pos].setMarker(marker);
    cellsOccupied++;
    return true;
  };

  const getWinCombination = (pos) => {
    let winCombination;
    winCombinations.forEach((combination) => {
      if (combination.includes(parseInt(pos))) {
        const markers = [];
        combination.forEach((p) => {
          markers.push(getCell(p).getMarker());
        });
        if (markers[0] != undefined) {
          if (markers[0] == markers[1] && markers[0] == markers[2]) {
            winCombination = combination;
          }
        }
      }
    });
    if (cellsOccupied == 9) {
      return "draw";
    }

    return winCombination;
  };

  const getCell = (pos) => cells[pos];

  const getCells = () => cells;
  init();
  return {
    getCells,
    getWinCombination,
    placeMarker,
    init,
    getCell,
  };
})();

const GameController = (() => {
  let players = [
    { num: 0, name: "Player", marker: "x" },
    { num: 1, name: "Computer", marker: "o" },
  ];
  let activePlayer = players[0];
  let hasEnded = false;

  const switchActivePlayer = () => {
    activePlayer = players[(activePlayer.num + 1) % 2];
    DomController.displayMessage(activePlayer.name + "'s turn!", "green");
  };

  const init = () => {
    hasEnded = false;
    DomController.displayCells();
    document.querySelectorAll(".cell").forEach((cell) => {
      cell.addEventListener("click", (e) => {
        handleCellClick(e.target);
      });

      cell.addEventListener("mouseover", (e) => {
        if (hasEnded) return;
        const boardCell = Gameboard.getCell(
          e.target.getAttribute("data-number")
        );
        if (boardCell.getMarker()) return;
        e.target.style.backgroundImage = `url(images/${activePlayer.marker}.png)`;
      });

      cell.addEventListener("mouseout", (e) => {
        e.target.style.backgroundImage = ``;
      });
    });
    switchActivePlayer();
  };

  const handleCellClick = (cell) => {
    if (hasEnded) return;
    cell.style.backgroundImage = ``;
    if (
      !Gameboard.placeMarker(
        cell.getAttribute("data-number"),
        activePlayer.marker
      )
    ) {
      DomController.displayMessage("Cell is occupied already!", "#440044");
      return;
    }

    DomController.placeMarker(
      cell.getAttribute("data-number"),
      activePlayer.marker
    );

    const wincombo = Gameboard.getWinCombination(
      cell.getAttribute("data-number")
    );
    if (wincombo) {
      if (wincombo == "draw") {
        DomController.displayMessage("DRAW!", "red");
        end();
        return;
      }
      DomController.displayMessage(activePlayer.name + " won", "red");
      DomController.highlightCells(wincombo);
      end();
      return;
    }
    switchActivePlayer();
  };

  const end = () => {
    hasEnded = true;
  };

  document.querySelector(".reset").addEventListener("click", (e) => {
    Gameboard.init();
    init();
  });

  return {
    switchActivePlayer,
    init,
  };
})();

GameController.init();
