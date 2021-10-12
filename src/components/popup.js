import { resetError, resetButton } from './utils.js';
import { formSelectors } from './selectors.js';
export { openPopup, closePopup, submitEvent, popupCloseButtonListeners};

const openPopup = (popup) => {
  popup.classList.add('popup_opened');
  document.addEventListener('keydown', pressEscape);
  document.addEventListener('mousedown', clickOverlay);
};

const resetPopup = (popup) => {
  const form = popup.querySelector('.popup__form');
  form.reset();
  resetError(form, formSelectors);
  resetButton(form, formSelectors);
};

const closePopup = (popup) => {
  popup.classList.remove('popup_opened');
  resetPopup(popup);
  document.removeEventListener('keydown', pressEscape);
  document.removeEventListener('mousedown', clickOverlay);

};

const submitEvent = (popup) => {
  event.preventDefault();
  closePopup(popup);
};

const popupCloseButtonListeners = (popup) => {
  popup.querySelector('.popup__close-button').addEventListener('click', () => {
  closePopup(popup);
  });
}

const pressEscape = () => {
  if (event.key === 'Escape') {
    closePopup(document.querySelector('.popup_opened'));
  }
}

const clickOverlay = () => {
  if (event.target.classList.contains('popup_opened')) {
    closePopup(document.querySelector('.popup_opened'));
  }
}
