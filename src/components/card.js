import { changeButtonText, closePopup, openPopup, resetPopup, addCloseButtonListener } from './popup.js';
import { getCards, putLike, deleteLike, deleteCard, postCardData } from './api.js';
import { formSelectors } from './selectors.js';
import { toggleSubmitButtonState } from './validate.js';
export { addPhotoCard, handleCards, handleCardAddButton };

//---(подсчитываем и отображаем количество лайков на фотокарточке)---
const handleLikeCounter = (photoCard, cardData, {...rest}) => {
  const counter = photoCard.querySelector(rest.heartCounter);
  const likes = cardData.likes.length;
  if (likes > 0) {
    counter.classList.add(`${rest.heartCounter}_active`);
    counter.textContent = likes;
  } else {
    counter.classList.remove(`${rest.heartCounter}_active`);
    counter.textContent = '';
  }
}

//---(обрабатываем вызов удаления лайка с карточки)---
const removeLike = (like, cardData, photoCard, {...rest}) => {
  deleteLike(cardData._id)
  .then((cardData) => { //обновленные данные карточки
    handleLikeCounter(photoCard, cardData, rest); //photoCard это элемент в разметке
    like.classList.remove('photo-card__button-heart_active');
  })
  .catch((error) => {
    console.log(error);
  })
}

//---(обрабатываем вызов добавления лайка на карточку)---
const addLike = (like, cardData, photoCard, {...rest}) => {
  putLike(cardData._id)
  .then((cardData) => {  //put и delete возвращают актуальные данные карточки
    handleLikeCounter(photoCard, cardData, rest);
    like.classList.add('photo-card__button-heart_active');
  })
  .catch((error) => {
    console.log(error);
  })
}

//---(вызываем удаление или добавление лайка после проверки)---
const handleClickEvent = (eventTarget, cardData, photoCard, profile, {...rest}) => {
  const check = cardData.likes.some(like => like._id === profile._id);
  if (check) {
    removeLike(eventTarget, cardData, photoCard, rest);
  } else {
    addLike(eventTarget, cardData, photoCard, rest);
  }
}

//---(отображаем активными мои лайки ранее добавленные карточкам подгруженным с сервера)---
const handleInitialLike = (photoCard, cardData, profile, {...rest}) => {
  if (cardData.likes.length > 0) {
    const likeButton = photoCard.querySelector(rest.heartButton);
    cardData.likes.forEach((like) => {
      if (like._id === profile._id) {
        likeButton.classList.add('photo-card__button-heart_active');
      }
    })
  }
}

//---(запускаем обработчик клика после успешного обновления данных карточки)---
const getNewCardData = (eventTarget, cardData, photoCard, profile, {...rest}) => {
  getCards()
  .then((cards) => {
    const newCardData = cards.filter((card) => {
      if (card._id === cardData._id) { return card }
    })
    handleClickEvent(eventTarget, newCardData[0], photoCard, profile, rest);
  })
  .catch((error) => {
    console.log(error);
  })
}

//---(добавляем слушатель лайка и инициируем обновление данных карточки при клике)---
const handleLikeButton = (photoCard, cardData, profile, {...rest}) => {
  const likeButton = photoCard.querySelector(rest.heartButton);
  likeButton.addEventListener('click', (evt) => {
    const eventTarget = evt.target;
    getNewCardData(eventTarget, cardData, photoCard, profile, rest)
  });
}

//---(удаляем карточку из разметки)---
const removeDeletedCard = (photoCard) => {
  photoCard.remove();
}

//---(обрабатываем запрос на удаление карточки с сервера)---
const deletePhotoCard = (cardID, cardItem, submitButton, defaultText) => {  //submitButton.textContent = defaultText; передать сюда
  deleteCard(cardID)
    .then(() => {
      removeDeletedCard(cardItem);
      closePopup(popup);
    })
    .catch((error) => {  //примет сообщение об ошибке при Promise.reject
      console.log(error);
      alert('Произошла какая-то ошибка. Попробуйте снова.')
    })
    .finally(() => {
      submitButton.textContent = defaultText;
    })
}

//---(отрисовываем кнопку удаления на ранее созданных мной карточках)---
const showDeleteButton = (cardData, profile, button) => {
  if (profile._id === cardData.owner._id) {
    button.classList.add('photo-card__button-delete_visible');
  }
}


//---(инициируем удаление карточки и закрываем попап подтверждения при событии submit)---
const handleDeleteCardForm = (popup) => {
  const form = popup.querySelector('.popup__form');
  const submitButton = form.querySelector('.popup__button');
  const defaultText = submitButton.textContent;
  form.addEventListener('submit', (evt) => {
    evt.preventDefault();
    changeButtonText(submitButton);
    // deletePhotoCard(cardId, cardItem, submitButton, defaultText);
//сюда надо передавать данные для удаления

  })
}
// addCloseButtonListener(popup);

// const handleDeleteCardPopupCloseEvent = (popup) => {
//   popup.querySelector('.popup__close-button').addEventListener('click', () => {
//     // closePopup(popup);
//   });
//   if (event.key === 'Escape') {
//     // closePopup(document.querySelector('.popup_opened'));
//   }
// }
const openDeleteCardPopup = (popup) => {
  popup.classList.add('popup_opened');

  handleDeleteCardPopup(popup);
};
const openPopup = (popup) => {
  popup.classList.add('popup_opened');
  document.addEventListener('keydown', handleEscButton);
  document.addEventListener('mousedown', handleClickOverlay);
};
const closePopup = (popup) => {
  popup.classList.remove('popup_opened');
  document.removeEventListener('keydown', handleEscButton);
  document.removeEventListener('mousedown', handleClickOverlay);
};


//открываем попап и передаем данные кликнутой карточки
//---(вызываем функцию отрисовки иконки удаления)---
const handleDeleteButton = (photoCard, cardData, profile, {...rest}) => {
  const popup = document.querySelector(rest.popupDeletePhoto);
  const button = photoCard.querySelector(rest.deleteButton);
  showDeleteButton(cardData, profile, button);
  button.addEventListener('click', () => {
    dataForDeleteCard.cardId = cardData._id;
    dataForDeleteCard.cardItem = photoCard;
    openDeleteCardPopup(popup);
  })
}

//---(заполняем поля попапа просмотра фото)---
const addViewImageData = (popup, cardData) => {
  const photo = popup.querySelector('.viewing-photo__image');
  const figcaption = popup.querySelector('.viewing-photo__figcaption');
  photo.src = cardData.link;
  photo.alt = cardData.name;
  figcaption.textContent = cardData.name;
}

//---(открываем попап просмотра карточки при клике по фото и вызываем обработчик)---
const handlePhoto = (cardData, image, {...rest}) => {
  const popup = document.querySelector(rest.popupViewingPhoto);
  image.addEventListener('click', () => {
    addViewImageData(popup, cardData, rest);
    openPopup(popup);
  })
}

//---(вызываем обработчики элементов карточки)---
const handlePhotoCardElements = (photoCard, cardData, image, profile, {...rest}) => {
  handleInitialLike(photoCard, cardData, profile, rest);
  handleLikeButton(photoCard, cardData, profile, rest);
  handleLikeCounter(photoCard, cardData, rest);
  handleDeleteButton(photoCard, cardData, profile, rest);
  handlePhoto(cardData, image, rest);
}

//---(заполняем поля фотокарточки из полученных с сервера данных)---
const addPhotoCardData = (image, photoCard, cardData, {...rest}) => {
  photoCard.querySelector(rest.cardTitle).textContent = cardData.name;
  image.src = cardData.link;
  image.alt = cardData.name;
}

//---(создаем фотокарточку из темплейта, запускаем обработчики)---
const createPhotoCard = (cardData, profile, {...rest}) => {
  const photoCardTemplate = document.querySelector('#photo-card-template').content;
  const photoCard = photoCardTemplate.querySelector(rest.cardItem).cloneNode(true); //это <li> с картинкой и всеми кнопками, т.е. фотокарточка
  const image = photoCard.querySelector(rest.cardImage); //это <img>
  handlePhotoCardElements(photoCard, cardData, image, profile, rest);
  addPhotoCardData(image, photoCard, cardData, rest);
  return photoCard;
}

//---(добавляем обработанную фотокарточку в разметку)---
const addPhotoCard = (cardData, profile, {...rest}) => {
  const card = createPhotoCard(cardData, profile, rest);
  document.querySelector(rest.photoCardPlace).prepend(card);
}

//---(запускаем добавление начальных карточек)---
const addInitialCards = (cards, profile, {...rest}) => {
  cards.forEach((cardsItem) => {
    addPhotoCard(cardsItem, profile, rest);
  });
};

//---(если данные карточки ушли на сервер, то передаем их дальше для добавления карточки в разметку)---
const addNewCard = (defaultText, submitButton, popup, cardDataForSend, profile, {...rest}) => {
  postCardData(cardDataForSend)
    .then((cardData) => {
      addPhotoCard(cardData, profile, rest);
      resetPopup(popup);
      closePopup(popup);
    })
    .catch((error) => {  //примет сообщение об ошибке при Promise.reject
      console.log(error);
      alert('Произошла какая-то ошибка. Попробуйте снова.')
    })
    .finally(() => {
      submitButton.textContent = defaultText;
    })
}

//---(формируем cardData из заполненных полей формы и передаем их при событии submit)---
const handleAddCardForm = (popup, profile, {...rest}) => {
  const form = popup.querySelector('.popup__form');
  const submitButton = form.querySelector('.popup__button');
  const defaultText = submitButton.textContent;
  const title = form.querySelector(rest.popupTitle);
  const image = form.querySelector(rest.popupImageLink);
  toggleSubmitButtonState(form, formSelectors); //в validate
  form.addEventListener('submit', (evt) => {
    evt.preventDefault();
    const cardDataForSend = {
      name: `${title.value}`,
      link: `${image.value}`
    }
    changeButtonText(submitButton);
    addNewCard(defaultText, submitButton, popup, cardDataForSend, profile, rest);
  })
}

//---(открываем попап добавления нового фото при клике по кнопке add)---
const handleCardAddButton = (popup) => {
  button.addEventListener('click', () => {
    resetPopup(popup);
    openPopup(popup);
  })
}

//---(вызываем обработчики формы удаления, кнопки и формы добавления карточек)---
const handleSubmitForms = (profile, {...rest}) => {
  const popupDeleteCard = document.querySelector(rest.popupDeletePhoto);
  handleDeleteCardForm(popupDeleteCard);
  const popupAddCard = document.querySelector(rest.popupAddPhoto);
  handleCardAddButton(popupAddCard);
  handleAddCardForm(popupAddCard, profile, rest);
}

//---(запускаем обработчики и отрисовку полученных карточек)---
const handleCards = (cards, profile, {...rest}) => {
  handleSubmitForms(profile, rest);
  addInitialCards(cards, profile, rest);
}

