import { Router } from 'express';

import { IRouterConfig } from '../interfaces';
import { RouterService } from '../services';

export abstract class CoreRouter {
  constructor(protected readonly routerService: RouterService) {}

  public get nativeRoutes(): Router {
    return this.routerService.routes;
  }

  protected abstract _generateRoutes(config?: Array<IRouterConfig>): void;

  public generateRoutes(): Router {
    this._generateRoutes();
    return this.nativeRoutes;
  }
}
