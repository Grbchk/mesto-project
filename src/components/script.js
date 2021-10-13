import '../pages/index.css';
import { profileSelectors, photoCardSelectors, formSelectors} from './selectors.js';
import { initialCardsArray } from './initial-cards.js';
import { enableValidation } from './validate.js';
import { handlePopupEditProfile } from './profile.js';
import { handlePopupAddPhoto } from './card.js';

handlePopupEditProfile(profileSelectors);
initialCardsArray(photoCardSelectors);
handlePopupAddPhoto(photoCardSelectors);
enableValidation(formSelectors);
