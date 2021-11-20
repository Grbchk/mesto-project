import { token, url } from './configs.js';
export { configs };

const configs = {
  baseUrl: url,
  headers: {
    authorization: token,
    'Content-Type': 'application/json',
  }
};




