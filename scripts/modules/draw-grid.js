const originalGridClass = document.querySelector(".grid").className
const screenSharingGrid = document.querySelector(".vertical-grid")

function clearGrid() {
  if (document.querySelector(".vertical-grid"))
    document.querySelector(".vertical-grid").innerHTML = ""

  document.querySelector(".grid").innerHTML = ""
  document.querySelector(".grid").className = originalGridClass
}

function calculatePeopleWeight(people, weight) {
  return people.reduce((acc, p) => {
    if (p.zoomed) acc += weight
    else acc += 1
    return acc
  }, 0)
}

function changeLayout(people) {
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

export function drawGrid(people) {
  clearGrid()

  const grid = document.querySelector(".grid")

  changeLayout(people)

  for (let person of people) {
    let cell = document.createElement("div")
    cell.classList.add("person")
    cell.classList.add(person.type)
    if (person.zoomed) cell.classList.add("zoomed")

    cell.innerHTML = person.name
    if (person.speaking) cell.classList.add("speaking")

    if (screenSharingGrid && screenSharingGrid.childElementCount < 4)
      screenSharingGrid.append(cell)
    else grid.append(cell)

    // observe if a person is visible
    let observer = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.intersectionRatio != 1) {
            person.visible = false
          } else {
            person.visible = true
          }
        })
      },
      { threshold: 1 }
    )
    observer.observe(cell)
  }
}
