import { openPopup, resetPopup, handleSubmitEvent, handleCloseButton} from './popup.js';
import { postCard } from './card-serve';
import { getProfile } from './profile-serve';
import { formSelectors } from './selectors.js';
import { toggleButtonState } from './validate.js';
export { addPhotoCard, handlePhotoCard, handleCardAddButton };

const handleLikeButton = (photoCard, {...rest}) => {
  photoCard.querySelector(rest.heartButton).addEventListener('click', function (evt) {
    const eventTarget = evt.target;
    eventTarget.classList.toggle('photo-card__button-heart_active');
  });
}

const handleLikeCounter = (photoCard, cardData, {...rest}) => {
  const counter = photoCard.querySelector(rest.heartCounter);
  const likes = cardData.likes.length;
  if (likes > 0) {
    counter.classList.add(`${rest.heartCounter}_active`);
    counter.textContent = likes;
  }
}
/*
// const deletePhotoCard = (button, {...rest}) => {
//   const button = document.querySelector('.photo-card__button-delete');
//   const popup = document.querySelector('#delete-photo-card');
//   button.classList.add('.photo-card__button-delete_visible');

//   button.addEventListener('click', () => {
//     openPopup(popup);
//     const deletedCard = button.closest(rest.cardItem);
//     deletedCard.remove();
//   });
// }

// const handleDeleteButton = (photoCard, cardData, {...rest}) => {
//   getProfile()
//   .then(profileData => {
//     if (profileData._id === cardData.owner._id) {
//       deletePhotoCard(photoCard, rest);
//     }
//   })
//   .catch((error) => {
//     console.log(error);
//   })

сделать хоть как-то, чтобы работало, оптимизация в самом конце
// }
*/

const addViewImageData = (popup, cardData) => {
  const photo = popup.querySelector('.viewing-photo__image');
  const figcaption = popup.querySelector('.viewing-photo__figcaption');
  photo.src = `${cardData.link}`;
  photo.alt = `${cardData.name}`;
  figcaption.textContent = `${cardData.name}`;
}

const handlePhoto = (popup, cardData, image, {...rest}) => {
  image.addEventListener('click', () => {
    addViewImageData(popup, cardData, rest);
    openPopup(popup);
  });
}

const handlePhotoCardElement = (popup, photoCard, cardData, image, {...rest}) => {
  handleLikeButton(photoCard, rest);
  handleLikeCounter(photoCard, cardData, rest);
  handleDeleteButton(photoCard, cardData, rest);
  handlePhoto(popup, cardData, image, {...rest});
  handleCloseButton(popup);
};

const addCardData = (image, photoCard, cardData, {...rest}) => {
  photoCard.querySelector(rest.cardTitle).textContent = `${cardData.name}`;
  image.src = `${cardData.link}`;
  image.alt = `${cardData.name}`;
}

const createPhotoCard = (cardData, {...rest}) => {
  const photoCardTemplate = document.querySelector('#photo-card-template').content;
  const photoCard = photoCardTemplate.querySelector(rest.cardItem).cloneNode(true);
  const popup = document.querySelector(rest.popupViewingPhoto);
  const image = photoCard.querySelector(rest.cardImage)
  handlePhotoCardElement(popup, photoCard, cardData, image, rest);
  addCardData(image, photoCard, cardData, rest);
  return photoCard;
}

const addPhotoCard = (cardData, {...rest}) => {
  const card = createPhotoCard(cardData, rest);
  document.querySelector(rest.photoCardPlace).prepend(card);
};


const handleSubmitForm = (popup, form, {...rest}) => {
  form.addEventListener('submit', () => {
    const title = form.querySelector(rest.popupTitle);
    const image = form.querySelector(rest.popupImageLink);
    const cardItem = {
      name: `${title.value}`,
      link: `${image.value}`
    }
    handleSubmitEvent(popup);
    postCard(cardItem)
      .then((cardItem) => {
        addPhotoCard(cardItem, rest)
      })
      .catch((error) => {
        console.log(error);
      })
      // .finally(() => {
      //   closePopup(popup);
      //   //button status
      // })
  });
}

const handleDeleteCardForm = () => {
  const popup = document.querySelector('#delete-photo-card');
  const form = popup.querySelector('.popup__form');
  form.addEventListener('submit', () => {
    handleSubmitEvent(popup);
    // deletePhotoCard();
  })
}

//думаю перенести это в обработчик сабмита формы удаления
// const deleteCard = (cardsItem) => {  cardsItem.owner._id - проверить в deleteButton
//   return fetch(`${configs.baseUrl}/cards/${cardsItem._id}`, {
//     method: 'DELETE',
//     headers: configs.headers,
//   })
//   .then(res => handlerResponse(res))
// }
const handleCardAddButton = (popup, form) => {  //кнопка в профиле для открытия формы
  const button = document.querySelector('.profile__button-add');
  button.addEventListener('click', () => {
    toggleButtonState(form, formSelectors);
    resetPopup(popup);
    openPopup(popup);
  });
}

const handlePhotoCard = ({...rest}) => {
  const popup = document.querySelector('#add-photo-card');
  const form = popup.querySelector(rest.formSelector);
  handleSubmitForm(popup, form, rest);
  // handleDeleteCardForm();
  handleCardAddButton(popup, form);
  handleCloseButton(popup);
}
