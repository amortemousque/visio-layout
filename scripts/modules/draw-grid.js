const grid = document.querySelector(".grid")
const screenGrid = document.querySelector(".vertical-grid")
const shareSection = document.querySelector(".share")
const screensContainer = document.querySelector(".screen-container")
let screens = document.querySelectorAll(".screen")
let isSharing = false

function clearScreens() {
  screensContainer.innerHTML = ""
  screens = []
}

function clearGrid() {
  document.querySelector(".grid").innerHTML = ""
  grid.className = "grid"
  shareSection.classList.add("hidden")
  screenGrid.innerHTML = ""
  if (isSharing) grid.className = "grid grid-5-column"

  clearScreens()
}

function calculatePeopleWeight(people, weight) {
  return people.reduce((acc, p) => {
    if (p.zoomed) acc += weight
    else acc += 1
    return acc
  }, 0)
}

function changeGridLayout(people) {
  // [<max people in the grid>, <column number>, <people zoomed weight>]
  const peopleBreakpoints = [
    [0, 0, 1],
    [1, 1, 1],
    [4, 2, 1],
    [9, 3, 4],
    [16, 4, 4],
    [20, 5, 4],
    [Number.MAX_SAFE_INTEGER, 5, 4],
  ]

  for (let i = 1; i < peopleBreakpoints.length; i++) {
    const weightedPeopleNumber = calculatePeopleWeight(
      people,
      peopleBreakpoints[i][2]
    )
    if (
      weightedPeopleNumber > peopleBreakpoints[i - 1][0] &&
      weightedPeopleNumber <= peopleBreakpoints[i][0]
    ) {
      document
        .querySelector(".grid")
        .classList.add("grid-" + peopleBreakpoints[i][1] + "-column")
      break
    }
  }
}

function displayScreens(screenNumber) {
  if (screenNumber > 0) shareSection.classList.remove("hidden")

  for (let i = 0; i < screenNumber; i++) {
    const screen = document.createElement("div")
    screen.classList.add("screen")
    screensContainer.append(screen)
  }
  screens = document.querySelectorAll(".screen")
}

export function drawGrid(people) {
  isSharing = people.some((p) => p.sharing)

  clearGrid()
  displayScreens(people.filter((p) => p.sharing).length)
  changeGridLayout(people)

  for (let person of people) {
    let cell = document.createElement("div")
    cell.classList.add("person")
    cell.classList.add(person.type)
    if (person.zoomed) cell.classList.add("zoomed")

    cell.innerHTML = person.name
    if (person.speaking) cell.classList.add("speaking")

    if (isSharing && screenGrid.childElementCount < screens.length * 4)
      screenGrid.append(cell)
    else grid.append(cell)

    // observe if a person is visible
    let observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          person.visible = entry.isIntersecting && entry.isVisible
        })
      },
      { threshold: 1, trackVisibility: true, delay: 100 }
    )
    observer.observe(cell)
  }
}
