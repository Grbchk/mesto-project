import '../pages/index.css';
import { getInitialData } from './api.js';
import { handlePopupCloseButton } from './popup.js';
import { enableValidation } from './validate.js';
import { formSelectors } from './selectors.js';



getInitialData();
handlePopupCloseButton();
enableValidation(formSelectors);

