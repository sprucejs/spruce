import { forEach, noop } from 'lodash';
import { container, InjectionToken } from 'tsyringe';

export class Testing {
  public static spyOnAndStub(object: any, value: string): jest.SpyInstance {
    return jest.spyOn(object, value).mockImplementation(noop);
  }

  public static spyOnAndMock(
    object: any,
    value: string,
    returnValue: any
  ): jest.SpyInstance {
    return jest.spyOn(object, value).mockImplementation(() => returnValue);
  }

  public static stubStaticClasses(...statics: Array<any>): void {
    statics.forEach((staticClass: any) => {
      forEach(staticClass, (_fn: any, field: string) => {
        this.spyOnAndStub(staticClass, field);
      });
    });
  }

  public static overrideValues<T>(value: unknown): T {
    return value as T;
  }

  public static configureTestingModule(config: ITestingModuleConfig) {
    if (config.providers) {
      config.providers.forEach((provider: IOverrideProvider) => {
        container.register(provider.provide, { useValue: provider.useValue });
        container.resolve(provider.provide);
      });
    }

    if (config.statics) {
      this.stubStaticClasses(config.statics);
    }

    return container.resolve(config.class);
  }
}

export interface ITestingModuleConfig {
  providers?: Array<IOverrideProvider>;
  statics?: Array<InjectionToken>;
  class: InjectionToken;
}

export interface IOverrideProvider {
  provide: InjectionToken;
  useValue: any;
}
