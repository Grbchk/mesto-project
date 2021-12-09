import { resetError } from './utils.js';
import { formSelectors } from './selectors.js';
export { openPopup, closePopup, resetPopup, handlePopupCloseButton, changeButtonText };

const openPopup = (popup) => {
  popup.classList.add('popup_opened');
  document.addEventListener('keydown', handleEscButton);
  popup.addEventListener('mousedown', handleClickOverlay);
};

const resetPopup = (popup) => {
  const form = popup.querySelector('.popup__form');
  form.reset();
  resetError(form, formSelectors);
};

const closePopup = (popup) => {
  popup.classList.remove('popup_opened');
  document.removeEventListener('keydown', handleEscButton);
  popup.removeEventListener('mousedown', handleClickOverlay);
};

//---(добавляет кнопке три точки при сабмите формы)---
const changeButtonText = (submitButton) => {
  submitButton.textContent = `${submitButton.textContent}...`;
};

const addCloseButtonListener = (popup) => {
  popup.querySelector('.popup__close-button').addEventListener('click', () => {
    closePopup(popup);
  });
}

const handlePopupCloseButton = () => {
  const popupList = Array.from(document.querySelectorAll('.popup'));
  popupList.forEach((popup) => {
    addCloseButtonListener(popup);
  })
}

const handleEscButton = (event) => {
  if (event.key === 'Escape') {
    closePopup(document.querySelector('.popup_opened'));
  }
}

const handleClickOverlay = (event) => {
    closePopup(event.target);
}
