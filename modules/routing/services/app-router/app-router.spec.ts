import { container, InjectionToken } from 'tsyringe';

import { Logger } from '../../../internal';
import {
  MockProviderGrandChild,
  MockRouterChild,
  MockRouterParent,
} from '../../../internal/testing/stubs/module-router.stub';
import { Testing } from '../../../internal/testing/utilities/testing';
import { IRouterConfig, ISpruceRouter } from '../../interfaces';
import { RouterServiceStub } from '../router-service/router-service.stub';
import { RouterService } from '../router-service/router.service';
import { AppRouter } from './app-router';

describe('AppRouter', () => {
  let router: AppRouter, routerService: RouterServiceStub;

  beforeEach(() => {
    routerService = new RouterServiceStub();
    router = new AppRouter((routerService as unknown) as RouterService);
  });

  describe('when setting the routes', () => {
    let generateRoutes: jest.Mock;

    beforeEach(() => {
      generateRoutes = jest.fn().mockReturnValue('routerClass');
      Testing.stubStaticClasses(Logger);
      Testing.spyOnAndMock(container, 'resolve', { generateRoutes });
      router.setRoutes(routerConfig);
    });

    it('should set the top level routes', () => {
      expect(routerService.use).toHaveBeenCalledWith('/route1', 'routerClass');
    });

    it('should generate the routes for each ', () => {});

    it('should set the children routes with concatenated URLS recursively', () => {
      expect(routerService.use).toHaveBeenCalledWith(
        '/route1/route2',
        'routerClass'
      );
      expect(routerService.use).toHaveBeenCalledWith(
        '/route1/route2/route3',
        'routerClass'
      );
    });
  });
});

const routerConfig: Array<IRouterConfig> = [
  {
    url: '/route1',
    router: MockRouterParent as InjectionToken<ISpruceRouter>,
    children: [
      {
        url: '/route2',
        router: MockRouterChild as InjectionToken<ISpruceRouter>,
        children: [
          {
            url: '/route3',
            router: MockProviderGrandChild as InjectionToken<ISpruceRouter>
          }
        ]
      }
    ]
  }
];
