import '../pages/index.css';
import { profileSelectors, photoCardSelectors, formSelectors} from './selectors.js';
import { handleProfilePopup } from './profile.js';
import { handlePhotoCardPopup } from './card.js';
import { enableValidation } from './validate.js';
import { getArrayCards } from './card-serve.js';



handleProfilePopup(profileSelectors);
handlePhotoCardPopup(photoCardSelectors);
enableValidation(formSelectors);
getArrayCards(photoCardSelectors);

