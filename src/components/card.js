import { changeButtonText, closePopup, openPopup, resetPopup, handleSubmitEvent, handlePopupCloseButton } from './popup.js';
import { getCards, putLike, deleteLike, deleteCard, postCardData } from './api.js';
import { formSelectors } from './selectors.js';
import { toggleButtonState } from './validate.js';
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
    });
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
  // photoCard.parentNode.removeChild(photoCard);
  photoCard.remove();
}

//---(обрабатываем запрос на удаление карточки с сервера)---
const deletePhotoCard = (photoCard, cardData) => {
  deleteCard(cardData._id)
    .then(() => {
      removeDeletedCard(photoCard);
    })
    .catch((error) => {  //примет сообщение об ошибке при Promise.reject
      console.log(error);
    })
}

//---(инициируем удаление карточки и закрываем попап подтверждения при событии submit)---
const handleDeleteCardForm = (popup, photoCard, cardData) => {
  const form = popup.querySelector('.popup__form');
  form.addEventListener('submit', () => {
    deletePhotoCard(photoCard, cardData);
    handleSubmitEvent(popup);
  })
}

//---(показываем кнопку удаления на созданных мной карточках после проверки)---
const showDeleteButton = (cardData, profile, button) => {
  if (profile._id === cardData.owner._id) {
    button.classList.add('photo-card__button-delete_visible');  //не работает ${rest.deleteButton}_visible из-за точки
  }
}

//---(инициируем проверку владельца карточки и открываем попап подтверждения при клике кнопки удаления карточки)---
const handleDeleteButton = (photoCard, cardData, profile, {...rest}) => {
  const button = photoCard.querySelector(rest.deleteButton);
  const popup = document.querySelector('#delete-photo-card');
  showDeleteButton(cardData, profile, button);
  button.addEventListener('click', () => {  //вызывать обработчик формы только при клике по кнопке, или при создании карточки?
    handleDeleteCardForm(popup, photoCard, cardData);
    handlePopupCloseButton(popup);
    openPopup(popup); //reset тут не нужен, т.к. нет полей у формы
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

//---(открываем попап просмотра при клике по фото и вызываем обработчики)---
const handlePhoto = (cardData, image, {...rest}) => {
  const popup = document.querySelector(rest.popupViewingPhoto);
  image.addEventListener('click', () => {
    addViewImageData(popup, cardData, rest);
    handlePopupCloseButton(popup);
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
  photoCard.querySelector(rest.cardTitle).textContent = cardData.name; //заголовок карточки
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
  document.querySelector(rest.photoCardPlace).append(card); //можно поправить на append(?)
}

//---(запускаем добавление начальных карточек и отрисовку моих лайков)---
const addInitialCards = (cards, profile, {...rest}) => {
  cards.forEach((cardsItem) => {
    addPhotoCard(cardsItem, profile, rest);
  });
};

//---(если данные карточки ушли на сервер, то передаем их дальше для добавления карточки в разметку)---
const addNewCard = (defaultText, submitButton, popup, cardData, profile, {...rest}) => {
  postCardData(cardData)
    .then((data) => {
      addPhotoCard(data, profile, rest);
    })
    .catch((error) => {  //примет сообщение об ошибке при Promise.reject
      console.log(error);
    })
    .finally(() => {
      submitButton.textContent = defaultText;
      resetPopup(popup);
      closePopup(popup);
    })
}

//---(формируем cardData из заполненных полей формы и передаем их при событии submit, вызываем обработчик кнопки закрытия)---
const handleAddCardForm = (popup, form, profile, {...rest}) => {
  handlePopupCloseButton(popup);
  form.addEventListener('submit', (evt) => {
    const submitButton = form.querySelector('.popup__button');
    const defaultText = submitButton.textContent;
    const title = form.querySelector(rest.popupTitle);
    const image = form.querySelector(rest.popupImageLink);
    const cardData = {
      name: `${title.value}`,
      link: `${image.value}`
    }
    evt.preventDefault();
    changeButtonText(submitButton);
    addNewCard(defaultText, submitButton, popup, cardData, profile, rest);
  })
}

//---(открываем попап добавления нового фото при клике по кнопке add)---
const handleCardAddButton = (popup, form) => {
  const button = document.querySelector('.profile__button-add');
  button.addEventListener('click', () => {
    toggleButtonState(form, formSelectors); //в validate
    resetPopup(popup);
    openPopup(popup);
  })
}

//---(вызываем обработчики, запускаем отрисовку полученных карточек)---
const handleCards = (cards, profile, {...rest}) => {
  const popup = document.querySelector(rest.popupAddPhoto);
  const form = popup.querySelector('.popup__form');
  handleAddCardForm(popup, form, profile, rest);
  handleCardAddButton(popup, form);
  addInitialCards(cards, profile, rest);
}
