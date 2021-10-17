import '../pages/index.css';
import { getArrayCards } from './cards-array.js';
import { profileSelectors, photoCardSelectors, formSelectors} from './selectors.js';
import { enableValidation } from './validate.js';
import { handlePopupEditProfile } from './profile.js';
import { handlePopupAddPhoto } from './card.js';

handlePopupEditProfile(profileSelectors);

handlePopupAddPhoto(photoCardSelectors);
enableValidation(formSelectors);

getArrayCards(photoCardSelectors);
