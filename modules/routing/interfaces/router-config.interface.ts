import { InjectionToken } from 'tsyringe';

import { ISpruceRouter } from '..';

export interface IRouterConfig {
  url: string;
  router: InjectionToken<ISpruceRouter>;
  children?: Array<IRouterConfig>;
}
