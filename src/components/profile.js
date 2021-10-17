import { openPopup, resetPopup, handleSubmitEvent, handleCloseButton} from './popup.js';
import { formSelectors } from './selectors.js';
import { toggleButtonState } from './validate.js';


const handleCardAddButton = () => {
  const popup = document.querySelector('#add-photo-card');
  const form = popup.querySelector('.popup__form');
  const button = document.querySelector('.profile__button-add');
  button.addEventListener('click', () => {
    resetPopup(popup);
    toggleButtonState(form, formSelectors);
    openPopup(popup);
  });
}

export const handlePopupEditProfile = ({...rest}) => {
  const popupProfile = document.querySelector(rest.popupProfile);
  const formProfile = popupProfile.querySelector(rest.profileForm);
  const formTitle = formProfile.querySelector(rest.popupProfileTitle);
  const formSubtitle = formProfile.querySelector(rest.popupProfileSubtitle);
  const profileTitle = document.querySelector(rest.profileTitle);
  const profileSubtitle = document.querySelector(rest.profileSubtitle);
  const editButton = document.querySelector(rest.profileEditButton);
  editButton.addEventListener('click', () => {
    resetPopup(popupProfile);
    formTitle.value = profileTitle.textContent;
    formSubtitle.value = profileSubtitle.textContent;
    toggleButtonState(formProfile, formSelectors);
    openPopup(popupProfile);
  });
  formProfile.addEventListener('submit', function () {
    profileTitle.textContent = formTitle.value;
    profileSubtitle.textContent = formSubtitle.value;
    handleSubmitEvent(popupProfile);
  });
  handleCloseButton(popupProfile);
  handleCardAddButton();
}
