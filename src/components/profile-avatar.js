import { changeButtonText, closePopup, openPopup, resetPopup } from './popup.js';
import { formSelectors } from './selectors.js';
import { toggleSubmitButtonState } from './validate.js';
import { patchAvatar } from './api.js';
export { handleAvatar };

const addAvatar = (profile, image) => {
  image.src = profile.avatar;
}

const handleAvatarEditButton = (popup, form, {...rest}) => {
  const button = document.querySelector(rest.avatarEditButton);
  button.addEventListener('click', () => {
    toggleSubmitButtonState(form, formSelectors);
    resetPopup(popup);
    openPopup(popup);
  });
}

const updateAvatar = (defaultText, submitButton, popup, formTitle, image) => {
  patchAvatar(formTitle)
  .then((profile) => {
    addAvatar(profile, image);
    resetPopup(popup);
    closePopup(popup);
  })
  .catch((error) => {
    console.log(error);
    alert('Произошла какая-то ошибка. Попробуйте снова.')

  })
  .finally(() => {
    submitButton.textContent = defaultText;
  })
}




let dataForDeleteCard = {
  cardId: null,
  cardItem: null,
}
function resetDataForDeleteCard(){
  dataForDeleteCard.cardId = null;
  dataForDeleteCard.cardItem = null;
}


function requestDeleteCard(card){ //запросить удаление
  cardForDelete = card;
  openOverlay();
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
  handleAvatarEditButton(popup, form, rest);
  handleAddAvatarForm(popup, form, formTitle, image);
}
