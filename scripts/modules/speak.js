export function speak(people, indexName) {
  // flag the speaker
  people.forEach((_, i) => (people[i].speaking = false))
  const personIndex = people.findIndex((p) =>
    p.name.includes(`name ${indexName} `)
  )
  people[personIndex].speaking = true
  people[personIndex].hasSpokenAt = Date.now()

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
}
