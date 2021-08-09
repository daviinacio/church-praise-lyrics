export const normalizeTextIdentifier = (textIdentifier, spaceCharacter = '_') => {
  return textIdentifier.normalize('NFD').replace(/[\u0300-\u036f]/g, "").split(' ').join(spaceCharacter);
}