import { compare, hash } from 'bcryptjs';
import { sign, verify } from 'jsonwebtoken';
import { injectable } from 'tsyringe';
import { promisify } from 'util';

import { IJwtConfig } from '../../interfaces/jwt-config.interface';

@injectable()
export class SpruceAuthService {
  public hash(password: string, strength?: number): Promise<string> {
    return hash(password, strength || 12);
  }

  public isPasswordMatch(
    testPassword: string,
    controlPassword: string
  ): Promise<boolean> {
    return compare(testPassword, controlPassword);
  }

  public createJwt(jwtConfig: IJwtConfig): string {
    return sign(jwtConfig.payload, jwtConfig.secret, {
      expiresIn: jwtConfig.expiresIn
    });
  }

  public decodeJwt(jwtToken: string, secret: string): Promise<IJwtConfig> {
    const bearerToken = this._getToken(jwtToken);
    const jwtVerify: any = promisify(verify);

    if (!bearerToken) {
      return Promise.reject();
    } else {
      return jwtVerify(bearerToken, secret);
    }
  }

  private _getToken(auth: string): string | null {
    let token: string;

    if (auth && auth.startsWith('Bearer')) {
      token = auth.split(' ')[1];
    } else {
      return null;
    }

    return token;
  }
}
