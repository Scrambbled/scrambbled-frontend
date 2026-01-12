import { randomPick } from "./tools"

const FIRST_NAME_PARTS = ["Wild", "Fantastic", "Odd", "Weird", "Electric", "Furious"]
const SECOND_NAME_PARTS = ["Racoon", "Fox", "Astronaut", "Firefighter", "SockPuppet"]

export const getRandomName = () => `${randomPick(FIRST_NAME_PARTS)}${randomPick(SECOND_NAME_PARTS)}`