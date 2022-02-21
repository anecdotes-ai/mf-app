export class SearchOverlap {
  overlapsCount: number;
  object: any;
}

export class SearchOverlapsFoundEvent {
  constructor(public readonly overlaps: SearchOverlap[]) {}
}
