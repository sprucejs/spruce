import { Application } from 'express';
import { container, InjectionToken } from 'tsyringe';

import { AuthMiddleware } from '../../../auth';
import { ErrorController } from '../../../errors';
import { Logger } from '../../../internal';
import {
  mockChildModule,
  MockProviderChild,
  MockProviderGrandChild,
  MockProviderParent,
  MockRouterChild,
  MockRouterGrandChild,
  MockRouterParent,
} from '../../../internal/testing/stubs/module-router.stub';
import { AppRouter, ISpruceRouter } from '../../../routing';
import { Testing } from '../../../testing/services/testing';
import { IModule } from '../../interfaces';
import { ExpressApplicationStub } from '../../testing/express-application.stub';
import { SpruceApp } from './spruce-app';

describe('SpruceApp', () => {
  let app: SpruceApp, expressApp: Application, appModule: IModule;

  beforeEach(() => {
    appModule = {
      providers: [MockProviderParent],
      routes: [
        {
          url: '/route1',
          router: MockRouterParent as InjectionToken<ISpruceRouter>
        }
      ],
      imports: [mockChildModule]
    };
    Testing.stubStaticClasses(Logger, ErrorController);
    expressApp = (new ExpressApplicationStub() as unknown) as Application;
    app = new SpruceApp(expressApp, appModule);
  });

  describe('when setting the base url', () => {
    beforeEach(() => {
      app.setBaseUrl('/api/v2');
    });

    it('should set the base url', () => {
      // tslint:disable-next-line: no-string-literal
      expect(app['_baseUrl']).toBe('/api/v2');
    });
  });

  describe('when setting cors', () => {
    beforeEach(() => {
      app.cors({ origin: 'hey' });
    });

    it('should set cors', () => {
      expect(expressApp.use).toHaveBeenCalledWith(expect.any(Function));
    });
  });

  describe('when configuring custom middleware', () => {
    beforeEach(() => {
      app.use({ hey: 'hey' });
    });

    it('should set the custom middleware', () => {
      expect(expressApp.use).toHaveBeenCalledWith({ hey: 'hey' });
    });
  });

  describe('when setting the authenticator', () => {
    beforeEach(() => {
      Testing.spyOnAndStub(container, 'register');
      app.setAuthenticator(AuthMiddleware);
    });

    it('should set the middleware on the container', () => {
      expect(container.register).toHaveBeenCalledWith(AuthMiddleware, {
        useClass: AuthMiddleware
      });
    });
  });

  describe('when starting the server', () => {
    beforeEach(() => {
      app.listen(3000);
    });

    it('should start the server on port 3000', () => {
      expect(expressApp.listen).toHaveBeenCalledWith(3000);
    });

    it('should log that the server has started', () => {
      expect(Logger.success).toHaveBeenCalledWith(
        `\n📡 Server listening at localhost:3000!`
      );
    });
  });

  describe('when initialising the app', () => {
    let setRoutesFn: jest.Mock;

    beforeEach(() => {
      setRoutesFn = jest.fn().mockReturnValue('routes');
      Testing.spyOnAndMock(container, 'resolve', {
        setRoutes: setRoutesFn
      });
      app.init();
    });

    it('should resolve the auth middleware', () => {
      expect(container.resolve).toHaveBeenCalledWith(AuthMiddleware);
    });

    it('should resolve the providers of the module', () => {
      expect(container.resolve).toHaveBeenCalledWith(MockProviderParent);
    });

    it('should resolve the providers of the child module', () => {
      expect(container.resolve).toHaveBeenCalledWith(MockProviderChild);
    });

    it('should resolve the providers of the grandchild module', () => {
      expect(container.resolve).toHaveBeenCalledWith(MockProviderGrandChild);
    });

    it('should create the error controller', () => {
      expect(ErrorController.create).toHaveBeenCalledWith(expressApp);
    });

    describe('when resolving the routes', () => {
      it('should add the app routes to the path', () => {
        expect(expressApp.use).toHaveBeenCalledWith('', 'routes');
      });

      it('should resolve the app router', () => {
        expect(container.resolve).toHaveBeenCalledWith(AppRouter);
      });

      it('should set the routes', () => {
        expect(setRoutesFn).toHaveBeenCalledWith([
          {
            url: '/route1',
            router: MockRouterParent
          }
        ]);
        expect(setRoutesFn).toHaveBeenCalledWith([
          {
            url: '/route2',
            router: MockRouterChild
          }
        ]);
        expect(setRoutesFn).toHaveBeenCalledWith([
          {
            url: '/route3',
            router: MockRouterGrandChild
          }
        ]);
      });
    });
  });
});
