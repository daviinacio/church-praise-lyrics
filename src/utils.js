export const normalizeTextIdentifier = (textIdentifier, spaceCharacter = '') => {
  return textIdentifier.trim().normalize('NFD')
    .toLowerCase()
    .replace(/[\u0300-\u036f]/g, "")
    .split(' ').join(spaceCharacter);
}