import { resetError } from './utils.js';
import { formSelectors } from './selectors.js';
export { openPopup, closePopup, resetPopup, addCloseButtonListener, handlePopupCloseButton, changeButtonText };

const openPopup = (popup) => {
  popup.classList.add('popup_opened');
  document.addEventListener('keydown', handleEscButton);
  document.addEventListener('mousedown', handleClickOverlay);
};

const resetPopup = (popup) => {
  const form = popup.querySelector('.popup__form');
  form.reset();
  resetError(form, formSelectors);
};

const closePopup = (popup) => {
  popup.classList.remove('popup_opened');
  document.removeEventListener('keydown', handleEscButton);
  document.removeEventListener('mousedown', handleClickOverlay);
};

//---(добавляет кнопке три точки при сабмите формы)---
const changeButtonText = (submitButton) => {
  submitButton.textContent = `${submitButton.textContent}...`;
};

// //---(отменяет поведение по-умолчанию при сабмите формы)---
// const handleSubmitEvent = (popup) => {
//   event.preventDefault();
//   closePopup(popup);
// };

const addCloseButtonListener = (popup) => {
  popup.querySelector('.popup__close-button').addEventListener('click', () => {
    closePopup(popup);
  });
}

const handlePopupCloseButton = () => {
  const popupList = Array.from(document.querySelectorAll('.popup'));
  popupList.push(document.querySelector('.viewing-photo'));
  popupList.forEach((popup) => {
    // if (popup != document.querySelector('#delete-photo-card')) {
    //   console.log(popup);
      addCloseButtonListener(popup);
    // }
  })
}

const handleEscButton = () => {
  if (event.key === 'Escape') {
    closePopup(document.querySelector('.popup_opened'));
  }
}

const handleClickOverlay = () => {
  if (event.target.classList.contains('popup_opened')) {
    closePopup(document.querySelector('.popup_opened'));
  }
}
