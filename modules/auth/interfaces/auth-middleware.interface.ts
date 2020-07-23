import { middlewareFn } from '../../routing/interfaces/middleware-function.interface';

export interface IAuthMiddleware {
  validate: middlewareFn;
}
