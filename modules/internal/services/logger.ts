import 'colors';

export class Logger {
  static default(text: string): void {
    console.log(text);
  }

  static info(text: string | undefined): void {
    console.log(text?.blue);
  }

  static success(text: string): void {
    console.log(text.green);
  }

  static error(text: any): void {
    console.log('APPLICATION ERROR'.red);
    console.error(text);
  }
}
