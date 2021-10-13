import { resetError} from './utils.js';
import { formSelectors } from './selectors.js';
export { openPopup, closePopup, resetPopup, handleSubmitEvent, handleCloseButton};

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

const handleSubmitEvent = (popup) => {
  event.preventDefault();
  closePopup(popup);
};

const handleCloseButton = (popup) => {
  popup.querySelector('.popup__close-button').addEventListener('click', () => {
    closePopup(popup);
  });
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
