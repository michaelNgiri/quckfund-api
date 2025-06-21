import { Injectable } from '@nestjs/common';
const { version, name } = require('../package.json');

@Injectable()
export class AppService {
  getApiStatus() {
    return {
      status: 'OK',
      name: name,
      version: version,
      message: 'Welcome to the QuickFund API! Please see the documentation for available endpoints.',
    };
  }
}
