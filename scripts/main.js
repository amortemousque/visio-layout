import { initRoom } from "./modules/room.js"
import { speak } from "./modules/speak.js"
import { zoom } from "./modules/zoom.js"
import { drawGrid } from "./modules/draw-grid.js"

let people = []

window.initRoom = (peopleNumber) => {
  people = initRoom(peopleNumber)
  drawGrid(people)
}

window.speak = (personIndex) => {
  speak(people, personIndex)
  drawGrid(people)
}

window.zoom = (personIndex) => {
  zoom(people, personIndex)
  drawGrid(people)
}

window.initRoom(10)
