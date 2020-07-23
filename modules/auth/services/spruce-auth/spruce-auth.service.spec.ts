import { SpruceAuthService } from './spruce-auth.service';

describe('SpruceAuthService', () => {
  let service: SpruceAuthService;

  beforeEach(() => {
    service = new SpruceAuthService();
  });

  describe('when checcking if password is a match', () => {
    let result: Promise<boolean>;

    beforeEach(() => {
      result = service.isPasswordMatch('test', 'control');
    });

    it('should return a promise of the result', async () => {
      expect(await result).toBe(false);
    });
  });

  describe('when creating a jwt', () => {
    let jwtResult: string;

    beforeEach(() => {
      jwtResult = service.createJwt({
        secret: 'secret',
        expiresIn: '1d',
        payload: {}
      });
    });

    it('should return the jwt token', () => {
      expect(typeof jwtResult).toBe('string');
    });
  });

  describe('when decoding a jwt', () => {
    let jwtString: string,
      secret: string,
      resolveSpy: jest.Mock,
      rejectSpy: jest.Mock;

    beforeEach(() => {
      resolveSpy = jest.fn();
      rejectSpy = jest.fn();
      secret = 'secret';
    });

    describe('when the string is a bearer token', () => {
      beforeEach(() => {
        jwtString =
          'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1OTU1MDYzNTUsImV4cCI6MTU5NTU5Mjc1NX0.HhBARySXrBOxEhzvKZT_-iSdo3rZisJHhrzpJuOoY_c';
        service.decodeJwt(jwtString, secret).then(resolveSpy);
      });

      it('should return', () => {
        expect(resolveSpy).toHaveBeenCalledWith({
          exp: 1595592755,
          iat: 1595506355
        });
      });
    });

    describe('when the string is not a bearer token', () => {
      beforeEach(() => {
        jwtString = 'hello';
        service.decodeJwt(jwtString, secret).then(resolveSpy, rejectSpy);
      });

      it('should throw an error', () => {
        expect(rejectSpy).toHaveBeenCalled();
      });
    });
  });
});
