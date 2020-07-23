import { Router } from 'express';

export class ExpressRouterFactory {
  static create() {
    return Router({ mergeParams: true });
  }
}
