import { token, url } from './configs.js';
export { configs, myProfileData };

const configs = {
  baseUrl: url,
  headers: {
    authorization: token,
    'Content-Type': 'application/json',
  }
};

let myProfileData = none;


