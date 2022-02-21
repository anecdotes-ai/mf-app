export function trimLeft(str: string, ...chars: string[]): string {
  return str.replace(new RegExp('^[' + chars.join('') + ']+'), '');
}

export function trimRight(str: string, ...chars: string[]): string {
  return str.replace(new RegExp('[' + chars.join('') + ']+$'), '');
}

export function trim(str: string, ...chars: string[]): string {
  return trimRight(trimLeft(str, ...chars), ...chars);
}
