import { HttpException } from './http.exception';

export class UnauthorisedException extends HttpException {
  constructor(customMessage?: string) {
    super(401, 'Unauthorised', customMessage);
  }
}
