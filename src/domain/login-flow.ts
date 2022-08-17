import { Reader } from './reader';

export interface LoginFlow {
  /**
   * Executes the login flow.
   */
  login(): Promise<Reader>;

  /**
   * Returns the logged in user if availabe,
   * otherwhise executes {@link login}
   */
  checkLogin(): Promise<Reader>;
}
