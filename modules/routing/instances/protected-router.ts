import { AuthMiddleware } from '../../auth';
import { RouterService } from '../services/router.service';
import { CoreRouter } from './core-router.abstract';

export abstract class ProtectedRouter extends CoreRouter {
  constructor(routerService: RouterService, authMiddleware: AuthMiddleware) {
    super(routerService);
    routerService.middleware(authMiddleware.authenticate);
  }
}
