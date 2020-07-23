import { Router } from 'express';

export interface ISpruceRouter {
  nativeRoutes: Router;
  generateRoutes(): Router;
}
