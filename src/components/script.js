import '../pages/index.css';
import { profileSelectors, photoCardSelectors, formSelectors} from './selectors.js';
import { initialCardsArray } from './initial-cards.js';
import { enableValidation } from './validate.js';
import { addProfileListeners } from './profile.js';
import { popupPhotoCardListener } from './card.js';

addProfileListeners(profileSelectors);
initialCardsArray(photoCardSelectors);
popupPhotoCardListener(photoCardSelectors);
enableValidation(formSelectors);
