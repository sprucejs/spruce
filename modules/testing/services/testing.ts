import { forEach, noop } from 'lodash';
import { container, InjectionToken } from 'tsyringe';

export class Testing {
  public static spyOnAndStub(object: any, value: string): void {
    jest.spyOn(object, value).mockImplementation(noop);
  }

  public static spyOnAndMock(
    object: any,
    value: string,
    returnValue: any
  ): void {
    jest.spyOn(object, value).mockImplementation(() => returnValue);
  }

  public static stubStaticClasses(...statics: Array<any>): void {
    statics.forEach((staticClass: any) => {
      forEach(staticClass, (_fn: any, field: string) => {
        this.spyOnAndStub(staticClass, field);
      });
    });
  }

  public static configureTestingModule(config: ITestingModuleConfig) {
    config.providers.forEach((provider: IOverrideProvider) => {
      container.register(provider.provide, { useValue: provider.useValue });
    });

    this.stubStaticClasses(config.statics);

    return container.resolve(config.class);
  }
}

export interface ITestingModuleConfig {
  providers: Array<IOverrideProvider>;
  statics: Array<InjectionToken>;
  class: InjectionToken;
}

export interface IOverrideProvider {
  provide: InjectionToken;
  useValue: any;
}
