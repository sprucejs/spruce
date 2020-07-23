import 'reflect-metadata';

import cors, { CorsOptions } from 'cors';
import express from 'express';
import { container, InjectionToken } from 'tsyringe';
import { constructor } from 'tsyringe/dist/typings/types';

import { AuthMiddleware } from '../../../auth';
import { ErrorController } from '../../../errors';
import { Logger } from '../../../internal';
import { AppRouter, IRouterConfig } from '../../../routing';
import { IModule } from '../../interfaces';

export class SpruceApp {
  public expressApp: express.Application;
  private _baseUrl: string | undefined;
  private readonly _appModule: IModule;

  constructor(expressApp: express.Application, appModule: IModule) {
    this.expressApp = expressApp;
    this._appModule = appModule;
  }

  public setBaseUrl(url: string): void {
    this._baseUrl = url;
  }

  public cors(config: CorsOptions): void {
    this.expressApp.use(cors(config));
  }

  public use(config: any): void {
    this.expressApp.use(config);
  }

  public setAuthenticator(authenticator: constructor<AuthMiddleware>): void {
    container.register(AuthMiddleware, { useClass: authenticator });
  }

  private _defineRoutes(routers: Array<IRouterConfig>): void {
    this.expressApp.use(
      this._baseUrl || '',
      container.resolve(AppRouter).setRoutes(routers)
    );
    this._catchErrors();
  }

  public async listen(port: number): Promise<void> {
    await this.expressApp.listen(port);
    Logger.success(`\n📡 Server listening at localhost:${port}!`);
  }

  private _catchErrors(): void {
    ErrorController.create(this.expressApp);
  }

  public init() {
    container.resolve(AuthMiddleware);
    Logger.success('Building routes...');
    Logger.info(`Setting base URL to ${this._baseUrl}`);
    this._resolveDependencies(this._appModule);
    this._defineRoutes(this._appModule.routes);
    this.expressApp.use(express.json());
  }

  private _resolveDependencies(module: IModule): void {
    module.providers.forEach((provider: InjectionToken<unknown>) => {
      container.resolve(provider);
    });

    module.imports.forEach((child: IModule) => {
      this._resolveDependencies(child);
      this._defineRoutes(child.routes);
    });
  }
}
