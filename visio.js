function clearGrid() {
  document.querySelector(".grid").innerHTML = ""
  document.querySelector(".grid").className = "grid"
}

let people = []
let speakerNumber = 2

function initRoom(peopleNumber) {
  people = Array(peopleNumber)
    .fill()
    .map((el, index) => ({
      name: `name ${index} `,
      type: index < speakerNumber ? "speaker" : "viewer",
      speaking: false,
      hasSpokenAt: 0,
      visible: true,
      zoomed: false,
    }))

  drawGrid()
}

function calculatePeopleWeight(weight) {
  return people.reduce((acc, p) => {
    if (p.zoomed) acc += weight
    else acc += 1
    return acc
  }, 0)
}

function drawGrid() {
  clearGrid()

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
    const peopleNumber = calculatePeopleWeight(peopleBreakpoints[i][2])
    if (
      peopleNumber > peopleBreakpoints[i - 1][0] &&
      peopleNumber <= peopleBreakpoints[i][0]
    ) {
      document
        .querySelector(".grid")
        .classList.add("grid-" + peopleBreakpoints[i][1] + "-column")
      break
    }
  }

  for (let person of people) {
    let cell = document.createElement("div")
    cell.classList.add("person")
    cell.classList.add(person.type)
    if (person.zoomed) cell.classList.add("zoomed")

    cell.innerHTML = person.name
    if (person.speaking) cell.classList.add("speaking")
    document.querySelector(".grid").append(cell)

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

function speak(indexName) {
  // flag the speaker
  people = people.map((p) => ({ ...p, speaking: false }))
  personIndex = people.findIndex((p) => p.name.includes(`name ${indexName} `))
  people[personIndex].speaking = true
  people[personIndex].hasSpokenAt = Number.MAX_SAFE_INTEGER

  if (!people[personIndex].visible && people[personIndex].type !== "speaker") {
    // find the closest spot to the speakers
    let bestSpot = 1
    let bestSpotHasSpokenAt = Number.MAX_SAFE_INTEGER
    for (let i = 0; i < people.length; i++) {
      if (people[i].type === "speaker") continue
      if (!people[i].visible) break

      if (bestSpotHasSpokenAt > people[i].hasSpokenAt) {
        bestSpot = i
        bestSpotHasSpokenAt = people[i].hasSpokenAt
      }
    }
    // swap the person whose speaking with the other one
    let temp = people[bestSpot]
    people[bestSpot] = people[personIndex]
    people[personIndex] = temp
    people[personIndex].visible = true
  }

  drawGrid()
}

function zoom(zoomedPeopleNumber) {
  for (let i = 0; i < zoomedPeopleNumber; i++) {
    let personIndex = Math.floor(Math.random() * people.length)
    people[personIndex].zoomed = true
  }
  drawGrid()
}
