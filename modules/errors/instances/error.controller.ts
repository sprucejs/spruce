import express from 'express';

import { INext, IReq, IRes } from '../../http';
import { Logger } from '../../internal';
import { HttpException } from './http.exception';
import { InternalServerErrorException } from './internal-server-error.exception';

export class ErrorController {
  private readonly _app: express.Application;

  constructor(app: express.Application) {
    this._app = app;
    this.handleErrors();
  }

  static create(app: express.Application) {
    return new ErrorController(app);
  }

  public handleErrors(): void {
    this._app.use(
      (error: HttpException, _req: IReq, res: IRes, _next: INext) => {
        if (error.status) {
          res.status(error.status).json(error);
        } else {
          Logger.error(error);
          res.status(500).json(new InternalServerErrorException());
        }
      }
    );
  }
}
