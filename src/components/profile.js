import { openPopup, resetPopup, handleCloseButton, handleSubmitEvent} from './popup.js';
import { formSelectors } from './selectors.js';
import { toggleButtonState } from './validate.js';
// import { handleAvatarEditButton } from './profile-avatar.js';
// import { handleCardAddButton } from './card.js';
import { handleProfileData, addProfileData } from './profile-serve.js';
export { handleProfilePopup };


const handleEditButton = (popup, form, formTitle, formSubtitle, popupTitle, popupSubtitle, {...rest}) => {
  const editButton = document.querySelector(rest.profileEditButton);
  editButton.addEventListener('click', () => {
    formTitle.value = popupTitle.textContent;
    formSubtitle.value = popupSubtitle.textContent;
    toggleButtonState(form, formSelectors);
    resetPopup(popup);
    openPopup(popup);
  });
}

const handleProfileForm = (popup, form, formTitle, formSubtitle, popupTitle, popupSubtitle) => {
  form.addEventListener('submit', () => {
    handleProfileData(popup, formTitle, formSubtitle, popupTitle, popupSubtitle);
    handleSubmitEvent(popup);
  });
}

const handleProfilePopup = ({...rest}) => {
  const popup = document.querySelector(rest.popupProfile);
  const form = popup.querySelector(rest.formSelector);
  const formTitle = form.querySelector(rest.popupProfileTitle);
  const formSubtitle = form.querySelector(rest.popupProfileSubtitle);
  const popupTitle = document.querySelector(rest.profileTitle);
  const popupSubtitle = document.querySelector(rest.profileSubtitle);
  addProfileData(popupTitle, popupSubtitle);
  handleProfileForm(popup, form, formTitle, formSubtitle, popupTitle, popupSubtitle);
  handleEditButton(popup, form, formTitle, formSubtitle, popupTitle, popupSubtitle, rest);
  handleCloseButton(popup);
}

// const handleProfile = ({...rest}) => {
//   handleProfilePopup(rest);
//   handleCardAddButton();
//   handleAvatarEditButton();
// }

