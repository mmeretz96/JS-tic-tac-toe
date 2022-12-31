//delete after debugging
const log = console.log

const CellFactory = () => {
  let marker = undefined

  const setMarker = (newMarker) => {
    marker = newMarker
  }
  const getMarker = () => {
    return marker
  }

  return{
    getMarker,
    setMarker
  }
}

const DomController = ((()=>{
  const boardContainer = document.querySelector(".board")
  const displayCells = () => {
    boardContainer.innerHTML = ""
    for(let i = 0; i<9; i++){
      const div = document.createElement("div")
      div.classList.add("cell")
      div.setAttribute("data-number", i)
      boardContainer.appendChild(div)
    }
  }

  const placeMarker = (pos, marker) => {
    cells = document.querySelectorAll(".cell")
    cells.forEach((cell, index) => {
      if(pos == index){
        const img = document.createElement("img")
        img.setAttribute("src","images/"+marker+".png")
        img.classList.add("marker")
        img.setAttribute("data-number", index)
        cell.appendChild(img)
      }
    })
  }

  const displayMessage = (message, color) => {
    const messageBox = document.querySelector(".messageBox")
    messageBox.innerHTML = message
    messageBox.style.backgroundColor = color
  }
  
  return{
    displayCells,
    placeMarker,
    displayMessage
  }
}))()



const Gameboard = (() => {
  let cells = []
  const winCombinations = [
    [0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6]
  ]
  const init = () => {
    cells = []
    for(let i = 0; i<9; i++){
      cells.push(CellFactory())
    }
  }
  
  const placeMarker = (pos, marker) => {
    if(cells[pos].getMarker()) return false
    cells[pos].setMarker(marker)
    DomController.placeMarker(pos, marker)
    return true
  }

  const getWinCombination = (pos) => {
   winCombinations.forEach(combination => {
    log(combination.includes(pos))
    if(combination.includes(pos)){
    const markers = []
    combination.forEach(p => {
      markers.push(getCell(p).getMarker())
    })
    log(markers)
    }
   })
  }

  const getCell = (pos) => cells[pos]

  const getCells = () => cells
  init()
  return{
    getCells,
    getWinCombination,
    placeMarker,
    init,
    getCell
  }
})();



const GameController = (() => {
  let players = [{num: 0, name: "player", marker: "x"}, {num: 1, name: "computer", marker: "o"}]
  let activePlayer = players[0]

  const switchActivePlayer = () => {
    activePlayer = players[(activePlayer.num+1)%2]
    DomController.displayMessage(activePlayer.name + "'s turn!" , "green")
  }

  const init = () => {
    DomController.displayCells()
    document.querySelectorAll(".cell").forEach(cell => {
      cell.addEventListener("click", e => {
       handleCellClick(e.target)
      })

      cell.addEventListener("mouseover", e => {
        const boardCell = Gameboard.getCell(e.target.getAttribute("data-number"))
        if(boardCell.getMarker()) return
        e.target.style.backgroundImage = `url(images/${activePlayer.marker}.png)` 
      })

      cell.addEventListener("mouseout", e => {
        e.target.style.backgroundImage = ``
      })
    })
  }

  const handleCellClick = (cell) =>{
    cell.style.backgroundImage = ``
    if (!Gameboard.placeMarker(cell.getAttribute("data-number") , activePlayer.marker)){
      DomController.displayMessage("Cell is occupied already!", "#440044")
      return
    }

    //check for win
    Gameboard.getWinCombination(cell.getAttribute("data-number"))
    switchActivePlayer()

  }



  document.querySelector(".reset").addEventListener("click", e => {
    Gameboard.init()
    init()
  })

  return {
    switchActivePlayer,
    init
  }
 })()



GameController.init()




