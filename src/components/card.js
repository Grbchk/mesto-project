import { openPopup, resetPopup, handleSubmitEvent, handleCloseButton} from './popup.js';
import { toggleButtonState } from './validate.js';
import { formSelectors } from './selectors.js';
export { addPhotoCard, handleCardAddButton, handlePopupAddPhoto};

const addViewImageData = (popup, cardData) => {
  const photo = popup.querySelector('.viewing-photo__image');
  const figcaption = popup.querySelector('.viewing-photo__figcaption');
  photo.src = cardData.link;
  photo.alt = cardData.name;
  figcaption.textContent = cardData.name;
}

const handleLikeButton = (photoCard, {...rest}) => {
  photoCard.querySelector(rest.heartButton).addEventListener('click', function (evt) {
    const eventTarget = evt.target;
    eventTarget.classList.toggle('photo-card__button-heart_active');
  });
}

const handleDeleteButton = (photoCard, {...rest}) => {
  const button = photoCard.querySelector(rest.deleteButton);
  button.addEventListener('click', function () {
    const deletedCard = button.closest(rest.cardItem);
    deletedCard.remove();
  });
}

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

const handlePhoto = (popup, cardData, image, {...rest}) => {
  image.addEventListener('click', function () {
    addViewImageData(popup, cardData, rest);
    openPopup(popup);
  });
}

const handlePhotoCard = (popup, photoCard, cardData, image, {...rest}) => {
  handleLikeButton(photoCard, rest);
  handleDeleteButton(photoCard, rest);
  handlePhoto(popup, cardData, image, {...rest});
  handleCloseButton(popup);
};

const addCardData = (image, photoCard, cardData, {...rest}) => {
  photoCard.querySelector(rest.cardTitle).textContent = cardData.name;
  image.src = cardData.link;
  image.alt = cardData.name;
}

const createPhotoCard = (cardData, {...rest}) => {
  const photoCardTemplate = document.querySelector('#photo-card-template').content;
  const photoCard = photoCardTemplate.querySelector(rest.cardItem).cloneNode(true);
  const popup = document.querySelector(rest.popupViewingPhoto);
  const image = photoCard.querySelector(rest.cardImage)
  handlePhotoCard(popup, photoCard, cardData, image, rest);
  addCardData(image, photoCard, cardData, rest);
  return photoCard;
}

const addPhotoCard = (cardData, {...rest}) => {
  const card = createPhotoCard(cardData, rest);
  document.querySelector(rest.photoCardPlace).prepend(card);
};

const handlePopupAddPhoto = ({...rest}) => {
  const popup = document.querySelector(rest.popupPhotoСard);
  const form = popup.querySelector(rest.photoCardForm);
  form.addEventListener('submit', () => {
    const title = form.querySelector(rest.popupTitle);
    const image = form.querySelector(rest.popupImageLink);
    const name = title.value;
    const link = image.value;
    addPhotoCard({name, link}, rest);
    handleSubmitEvent(popup);
  });
  handleCloseButton(popup);
}


