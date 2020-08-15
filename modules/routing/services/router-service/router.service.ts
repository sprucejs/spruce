import { Router } from 'express';
import { autoInjectable } from 'tsyringe';

import { INext, IReq, IRes } from '../../../http';
import { Logger } from '../../../internal';
import { ExpressRouterFactory } from '../../factories';
import { middlewareFn } from '../../interfaces';

@autoInjectable()
export class RouterService {
  public readonly router: Router;

  constructor() {
    this.router = ExpressRouterFactory.create();
  }

  static create() {
    return new RouterService();
  }

  public get(params: string, fn: middlewareFn) {
    this._log(Method.GET, params);
    this.router.get(params, this._tryCatch(fn, 200));
  }

  public post(params: string, fn: middlewareFn) {
    this._log(Method.POST, params);
    this.router.post(params, this._tryCatch(fn, 201));
  }

  public put(params: string, fn: middlewareFn) {
    this._log(Method.PUT, params);
    this.router.put(params, this._tryCatch(fn, 201));
  }

  public delete(params: string, fn: middlewareFn) {
    this._log(Method.DELETE, params);
    this.router.delete(params, this._tryCatch(fn, 204));
  }

  public middleware(fn: middlewareFn) {
    this.router.use(this._tryCatch(fn, null));
  }

  public use(...args: any) {
    this.router.use(...args);
  }

  private _log(method: Method, params: string): void {
    Logger.success(`\t${method}\t${params}`);
  }

  private _tryCatch(fn: middlewareFn, statusCode: number | null) {
    return async (req: IReq, res: IRes, next: INext) => {
      fn(req, res, next)
        .then((result: any) => {
          statusCode ? res.status(statusCode).json(result) : next();
        })
        .catch(next);
    };
  }

  get routes() {
    return this.router;
  }
}

const enum Method {
  PUT = 'PUT',
  POST = 'POST',
  GET = 'GET',
  DELETE = 'DELETE'
}
