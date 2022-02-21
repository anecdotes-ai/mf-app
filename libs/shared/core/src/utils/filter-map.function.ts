export {};
declare global {
  interface Array<T> {
    /**
     * This is a super array function which allows us to combine filter, map and a tap (on the mapped elements) methods.
     * It saves the number of times we go over the same array and performs it all in the for same loop.
     * @param predicate - predicate for filtering.
     * @param mapCallbackfn - Map callback function.
     * @param innerTapFn - In case your map function outputs an array, you can ran a custom callbackFn each of its elements.
     * @return return filtered, mapped array
     */
    filterMap(
      predicate: (value: T, indx: number, array: Array<T>) => boolean,
      mapCallbackfn: (value: T, array: Array<T>) => any,
      innerTapFn?: (value: any, index: number, array: any[]) => void
    ): Array<any>;
  }
}
if (!Array.prototype.filterMap) {
  Array.prototype.filterMap = function(predicate, mapCallbackfn, innerTapFn?): Array<any> {
    const newArray = [];
    for (let i = 0; i < this.length; i++) {
      if (predicate(this[i], i, this)) {
        const newMappedItem = mapCallbackfn(this[i], this);
        if (innerTapFn && Array.isArray(newMappedItem)) {
            newMappedItem.forEach(innerTapFn);
        }
        newArray.push(newMappedItem);
      }
    }
    return newArray;
  };
}
