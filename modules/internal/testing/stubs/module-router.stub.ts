import { injectable, InjectionToken } from 'tsyringe';

import { IModule } from '../../../app';
import { ISpruceRouter } from '../../../routing';

@injectable()
export class MockProviderParent {}

@injectable()
export class MockProviderChild {}

@injectable()
export class MockProviderGrandChild {}

@injectable()
export class MockRouterParent {}

@injectable()
export class MockRouterChild {}

// tslint:disable-next-line: max-classes-per-file
@injectable()
export class MockRouterGrandChild {}

export const mockGrandchildModule = {
  providers: [MockProviderGrandChild],
  imports: [],
  routes: [
    {
      url: '/route3',
      router: MockRouterGrandChild as InjectionToken<ISpruceRouter>
    }
  ]
};

export const mockChildModule: IModule = {
  providers: [MockProviderChild],
  imports: [mockGrandchildModule],
  routes: [
    { url: '/route2', router: MockRouterChild as InjectionToken<ISpruceRouter> }
  ]
};
