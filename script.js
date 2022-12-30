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

  
  return{
    displayCells,
    placeMarker
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

  const getCells = () => cells
  init()
  return{
    getCells,
    placeMarker,
    init
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
          log("error")
          return
        }
        switchActivePlayer()
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




