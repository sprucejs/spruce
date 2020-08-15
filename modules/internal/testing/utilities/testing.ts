import { forEach, noop } from 'lodash';

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
}
