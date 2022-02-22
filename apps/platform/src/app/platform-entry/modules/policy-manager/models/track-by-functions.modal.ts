export interface TrackByFunctions<T> {
  entityTrackBy?: (entity: T) => any;
  entityTrackByWithIndex?: (indx: number, entity: T) => any;
}
