import { changeButtonText, closePopup, openPopup, resetPopup } from './popup.js';
import { patchAvatar } from './api.js';
export { handleAvatar };

const addAvatar = (profile, image) => {
  image.src = profile.avatar;
}

const handleAvatarEditButton = (popup, {...rest}) => {
  const button = document.querySelector(rest.avatarEditButton);
  button.addEventListener('click', () => {
    resetPopup(popup);
    openPopup(popup);
  });
}

const updateAvatar = (defaultText, submitButton, popup, formTitle, image) => {
  patchAvatar(formTitle)
  .then((profile) => {
    addAvatar(profile, image);
    closePopup(popup);
  })
  .catch((error) => {
    console.log(error);
  })
  .finally(() => {
    submitButton.textContent = defaultText;
  })
}

const handleAddAvatarForm = (popup, form, formTitle, image) => {
  const submitButton = form.querySelector('.popup__button');
  const defaultText = submitButton.textContent;
  form.addEventListener('submit', (evt) => {
    evt.preventDefault();
    updateAvatar(defaultText, submitButton, popup, formTitle, image); //popup,
    changeButtonText(submitButton);
  });
}

const handleAvatar = (profile, {...rest}) => {
  const popup = document.querySelector(rest.popupAvatar);
  const form = popup.querySelector('.popup__form');
  const formTitle = form.querySelector(rest.popupAvatarTitle); //input (url)
  const image = document.querySelector(rest.avatarImage);
  addAvatar(profile, image);
  handleAvatarEditButton(popup, rest);
  handleAddAvatarForm(popup, form, formTitle, image);
}
