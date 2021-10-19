import '../pages/index.css';
import { profileSelectors, photoCardSelectors, formSelectors} from './selectors.js';
import { handleProfile } from './profile.js';
import { handlePhotoCard } from './card.js';
import { enableValidation } from './validate.js';
import { getArrayCards } from './card-serve.js';



handleProfile(profileSelectors);
handlePhotoCard(photoCardSelectors);
enableValidation(formSelectors);
getArrayCards(photoCardSelectors);

