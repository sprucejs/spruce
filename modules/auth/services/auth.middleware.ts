import { injectable } from 'tsyringe';

import { INext, IReq, IRes } from '../../http';

@injectable()
export class AuthMiddleware {
  public async validate(_req: IReq, _res: IRes, next: INext): Promise<void> {
    next();
  }
}
