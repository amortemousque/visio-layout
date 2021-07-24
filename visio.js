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

function speak(personIndex) {
  // flag the speaker
  people = people.map((p) => {
    p.speaking = false
    if (p.name.includes(`name ${personIndex} `)) p.speaking = true
    return p
  })

  if (!people[personIndex].visible) {
    // find a spot close to the speakers
    let firstIndexAfterSpeakers = 1
    for (let i = 1; i < people.length; i++) {
      if (people[i - 1].type === "speaker" && people[i].type === "viewer") {
        firstIndexAfterSpeakers = i
        break
      }
    }
    // swap the person whose speaking with the other one
    let temp = people[firstIndexAfterSpeakers]
    people[firstIndexAfterSpeakers] = people[personIndex]
    people[personIndex] = temp
  }

  drawGrid()
}
