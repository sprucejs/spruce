import { INext, IReq, IRes } from '../interfaces';

export class MiddlewareParamsStub {
  static create(): [IReq, IRes, INext] {
    return [{} as IReq, {} as IRes, jest.fn()];
  }
}
