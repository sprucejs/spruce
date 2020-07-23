import { Router } from 'express';
import { container, delay, inject, injectable } from 'tsyringe';

import { Logger } from '../../internal';
import { CoreRouter } from '../instances';
import { IRouterConfig } from '../interfaces';
import { RouterService } from '../services';

@injectable()
export class AppRouter extends CoreRouter {
  constructor(
    @inject(delay(() => RouterService)) routerService: RouterService
  ) {
    super(routerService);
  }

  public setRoutes(config: Array<IRouterConfig>): Router {
    config.forEach((route: IRouterConfig) => {
      Logger.info(`\nConfiguring routes for ${route.url}:`);
      this.routerService.use(
        route.url,
        container.resolve(route.router).generateRoutes()
      );

      this._handleChildren(route);
    });

    return this.nativeRoutes;
  }

  protected _generateRoutes(): void {
    return;
  }

  private _handleChildren(route: IRouterConfig, previousUrl?: string): void {
    if (!route.children) {
      return;
    } else {
      route.children.forEach((child: IRouterConfig) => {
        const concatenatedUrl: string = `${previousUrl || route.url}${
          child.url
        }`;

        Logger.info(`\nConfiguring routes for ${concatenatedUrl}`);
        this.routerService.use(
          concatenatedUrl,
          container.resolve(child.router).generateRoutes()
        );

        this._handleChildren(child, concatenatedUrl);
      });
    }
  }
}
