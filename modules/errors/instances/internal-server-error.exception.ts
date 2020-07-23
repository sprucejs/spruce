import { HttpException } from './http.exception';

export class InternalServerErrorException extends HttpException {
  constructor(customMessage?: string) {
    super(500, 'Internal Server Error', customMessage);
  }
}
