export function parseHTMLEntities(stringToParse: string): string {
  return stringToParse.replace(/&#([0-9]{1,3});/gi, (match, numStr) => {
      const num = parseInt(numStr, 10); // read num as normal number
      return String.fromCharCode(num);
    }
  );
}
