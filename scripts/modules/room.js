export function initRoom(peopleNumber) {
  const speakerNumber = 2
  let people = new Array(peopleNumber).fill().map((el, index) => ({
    name: `name ${index} `,
    type: index < speakerNumber ? "speaker" : "viewer",
    speaking: false,
    hasSpokenAt: 0,
    visible: true,
    zoomed: false,
    sharing: false,
  }))

  return people
}
