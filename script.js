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
    log(cells)
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

  const getCell = (pos) => cells[pos]

  const getCells = () => cells
  init()
  return{
    getCells,
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
    log(activePlayer)
  }

  const init = () => {
    DomController.displayCells()
    document.querySelectorAll(".cell").forEach(cell => {
      cell.addEventListener("click", e => {
        if (!Gameboard.placeMarker(e.target.getAttribute("data-number") , activePlayer.marker)){
          //Add Error message here
          DomController.displayMessage("Cell is occupied already!", "#440044")
          log("error")
          return
        }
        switchActivePlayer()
        DomController.displayMessage(activePlayer.name + "'s turn!" , "green")
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
DomController.displayMessage("hi", "green")




