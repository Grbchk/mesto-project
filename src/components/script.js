import '../pages/index.css';
import { formSelectors } from './selectors.js';
import { enableValidation } from './validate.js';
import { getInitialData } from './api.js';

getInitialData();
enableValidation(formSelectors);
