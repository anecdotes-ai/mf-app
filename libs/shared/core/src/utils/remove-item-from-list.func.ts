export function removeItemFromList<E>(array: E[], item: E): E[] {
  const indx = array.indexOf(item, 0);
  if (indx > -1) {
    array.splice(indx, 1);
  }
  return array;
}
