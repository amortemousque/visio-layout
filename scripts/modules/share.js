export function share(people, personIndex) {
  people[personIndex].sharing = !people[personIndex].sharing
}

export function doesSomeoneShare(people) {
  return people.some((p) => p.sharing)
}
