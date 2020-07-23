import { INext, IReq, IRes } from '../../../http';
import { MiddlewareParamsStub } from '../../../http/testing/middleware-params.stub';
import { AuthMiddleware } from './auth.middleware';

describe('AuthMiddleware', () => {
  let middleWare: AuthMiddleware;

  beforeEach(() => {
    middleWare = new AuthMiddleware();
  });

  describe('when validating', () => {
    let req: IReq, res: IRes, next: INext;
    beforeEach(() => {
      [req, res, next] = MiddlewareParamsStub.create();

      middleWare.authenticate(req, res, next);
    });

    it('should go to the next middleware', () => {
      expect(next).toHaveBeenCalledWith();
    });
  });
});
