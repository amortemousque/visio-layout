function clearGrid() {
  document.querySelector(".grid").innerHTML = ""
  document.querySelector(".grid").className = "grid"
}

let people = []

function initRoom(peopleNumber) {
  people = Array(peopleNumber)
    .fill()
    .map((el, index) => ({
      name: `name ${index} `,
      type: index === 0 ? "speaker" : "viewer",
      speaking: false,
      hasSpokenAt: 0,
      visible: true,
    }))

  drawGrid()
}

function drawGrid() {
  clearGrid()
  const peopleNumber = people.length
  // [<max people in the grid>, <column number>]
  const peopleBreakpoints = [
    [0, 0],
    [1, 1],
    [4, 2],
    [9, 3],
    [16, 4],
    [20, 5],
    [Number.MAX_SAFE_INTEGER, 5],
  ]

  for (let i = 1; i < peopleBreakpoints.length; i++) {
    if (
      peopleNumber > peopleBreakpoints[i - 1][0] &&
      peopleNumber <= peopleBreakpoints[i][0]
    )
      document
        .querySelector(".grid")
        .classList.add("grid-" + peopleBreakpoints[i][1] + "-column")
  }

  for (let person of people) {
    let cell = document.createElement("div")
    let personElement = document.createElement("div")
    personElement.classList.add("person")
    personElement.innerHTML = person.name
    if (person.speaking) personElement.classList.add("speaking")
    cell.append(personElement)
    document.querySelector(".grid").append(cell)

    // observe if a person is visible
    let observer = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.intersectionRatio != 1) {
            console.log("test")
            person.visible = false
          } else {
            person.visible = true
          }
        })
      },
      { threshold: 1 }
    )
    observer.observe(personElement)
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
