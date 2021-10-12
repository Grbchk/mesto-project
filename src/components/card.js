import { openPopup, submitEvent, popupCloseButtonListeners} from './popup.js';
export { addPhotoCard, addCardButtonListeners, popupPhotoCardListener};

const likeButtonListeners = (photoCard, {...rest}) => {
  photoCard.querySelector(rest.heartButton).addEventListener('click', function (evt) {
    const eventTarget = evt.target;
    eventTarget.classList.toggle('photo-card__button-heart_active');
  });
}

const deleteButtonListeners = (photoCard, {...rest}) => {
  const button = photoCard.querySelector(rest.deleteButton);
  button.addEventListener('click', function () {
    const deletedCard = button.closest(rest.cardItem);
    deletedCard.remove();
  });
}

const addCardButtonListeners = () => {
  const button = document.querySelector('.profile__button-add');
  const popup = document.querySelector('#add-photo-card');
  button.addEventListener('click', () => {
    openPopup(popup);
  });
}

const cardEventListeners = (photoCard, {...rest}) => {
  likeButtonListeners(photoCard, rest);
  deleteButtonListeners(photoCard, rest);
};

const addCardData = (image, photoCard, cardData, {...rest}) => {
  photoCard.querySelector(rest.cardTitle).textContent = cardData.name;
  image.src = cardData.link;
  image.alt = cardData.name;
}

const addViewImageData = (popup, cardData) => {
  const photo = popup.querySelector('.viewing-photo__image');
  const figcaption = popup.querySelector('.viewing-photo__figcaption');
  photo.src = cardData.link;
  photo.alt = cardData.name;
  figcaption.textContent = cardData.name;
}

const imageClickListeners = (image, cardData, {...rest}) => {
  const popup = document.querySelector(rest.popupViewingPhoto);
  image.addEventListener('click', function () {
    addViewImageData(popup, cardData, rest);
    popupCloseButtonListeners(popup);
    openPopup(popup);
  });
}

const createPhotoCard = (cardData, {...rest}) => {
  const photoCardTemplate = document.querySelector('#photo-card-template').content;
  const photoCard = photoCardTemplate.querySelector(rest.cardItem).cloneNode(true);
  const image = photoCard.querySelector(rest.cardImage)
  cardEventListeners(photoCard, rest);
  addCardData(image, photoCard, cardData, rest);
  imageClickListeners(image, cardData, rest);
  return photoCard;
}

const addPhotoCard = (cardData, {...rest}) => {
  const card = createPhotoCard(cardData, rest);
  document.querySelector(rest.photoCardPlace).prepend(card);
};

const popupPhotoCardListener = ({...rest}) => {
  const popup = document.querySelector(rest.popupPhotoСard);
  popupCloseButtonListeners(popup);
  const form = popup.querySelector(rest.photoCardForm);
  form.addEventListener('submit', () => {
    const title = document.querySelector(rest.popupTitle)
    const image = document.querySelector(rest.popupImageLink)
    const name = title.value;
    const link = image.value;
    addPhotoCard({name, link}, rest);
    submitEvent(popup);
  });
}


