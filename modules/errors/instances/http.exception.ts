export class HttpException {
  public message: string;
  public status: number;
  public error: string;

  constructor(status: number, text: string, customMessage?: string) {
    this.status = status;
    this.error = `${status} ${text}`;
    this.message = customMessage || this.error;
  }
}
