import { ControlStatusEnum } from 'core/modules/data/models/domain';

export interface IProgressResponse<T> {
  /**
   * Floating point number from 0 to 1
   */
  progress: number;
  /**
   * Response status
   */
  status: ControlStatusEnum;

  /**
   * Response object of provided type
   */
  response: T;
}
