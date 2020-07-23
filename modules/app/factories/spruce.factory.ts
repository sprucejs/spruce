import { SpruceApp } from '../instances/spruce-app/spruce-app';
import { IModule } from '../interfaces/module.interface';
import { ExpressApplicationFactory } from './express-application.factory';

export class SpruceFactory {
  static create(appModule: IModule): SpruceApp {
    return new SpruceApp(ExpressApplicationFactory.create(), appModule);
  }
}
