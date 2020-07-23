import express, { Application } from 'express';

export class ExpressApplicationFactory {
  static create(): Application {
    return express();
  }
}
