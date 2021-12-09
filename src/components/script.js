import '../pages/index.css';
import { profileSelectors, photoCardSelectors, formSelectors } from './selectors.js';
import { handleProfile } from './profile.js';
import { handleAvatar } from './profile-avatar.js';
import { handleCards } from './card.js';
import { handlePopupCloseButton } from './popup.js';
import { enableValidation } from './validate.js';
import { getCards, getProfile } from './api.js';

handlePopupCloseButton();
enableValidation(formSelectors);

//---(запускаем обработчики запрошенных у сервера данных)---
const handleInitialData = (cards, profile) => {
  handleProfile(profile, profileSelectors);
  handleAvatar(profile, profileSelectors);
  handleCards(cards, profile, photoCardSelectors);
};

//---(запрашиваем начальные данные у сервера)---
const getInitialData = () => {
  Promise.all([getCards(), getProfile()])
  .then((res) => {
    const cards = res[0];
    const profile = res[1];
    handleInitialData(cards, profile);
  })
};

getInitialData();
