export interface IJwtConfig {
  secret: string;
  expiresIn: string;
  payload: { [key: string]: any };
}
