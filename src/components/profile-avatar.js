import { changeButtonText, closePopup, openPopup, resetPopup } from './popup.js';
import { formSelectors } from './selectors.js';
import { toggleButtonState } from './validate.js';
import { patchAvatar } from './api.js';
export { handleAvatar };

const addAvatar = (profile, image) => {
  image.src = profile.avatar;
}

const handleAvatarEditButton = (popup, form, {...rest}) => {
  const button = document.querySelector(rest.avatarEditButton);
  button.addEventListener('click', () => {
    toggleButtonState(form, formSelectors);
    resetPopup(popup);
    openPopup(popup);
  });
}

const updateAvatar = (defaultText, submitButton, popup, formTitle, image) => {
  patchAvatar(formTitle)
  .then((profile) => {
    addAvatar(profile, image);
  })
  .catch((error) => {
    console.log(error);
  })
  .finally(() => {
    submitButton.textContent = defaultText;
    resetPopup(popup);
    closePopup(popup);
  })
}

const handleAddAvatarForm = (popup, form, formTitle, image) => {
  form.addEventListener('submit', (evt) => {
    const submitButton = form.querySelector('.popup__button');
    const defaultText = submitButton.textContent;
    updateAvatar(defaultText, submitButton, popup, formTitle, image); //popup,
    evt.preventDefault();
    changeButtonText(submitButton);
  });
}

const handleAvatar = (profile, {...rest}) => {
  const popup = document.querySelector(rest.popupAvatar);
  const form = popup.querySelector('.popup__form');
  const formTitle = form.querySelector(rest.popupAvatarTitle); //input (url)
  const image = document.querySelector(rest.avatarImage);
  addAvatar(profile, image);
  handleAvatarEditButton(popup, form, rest);
  handleAddAvatarForm(popup, form, formTitle, image);
}
