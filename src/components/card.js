import { changeButtonText, closePopup, openPopup, resetPopup } from './popup.js';
import { putLike, deleteLike, deleteCard, postCardData } from './api.js';
import { formSelectors } from './selectors.js';
import { toggleSubmitButtonState } from './validate.js';
export { addPhotoCard, handleCards, handleCardAddButton };

let dataForDeleteCard = {
  cardId: null,
  cardItem: null,
}

let dataForToggleLike = {};

//---(подсчитываем и отображаем количество лайков на фотокарточке)---
const handleLikeCounter = (counter, likes, {...rest}) => {
  if (likes.length > 0) {
    counter.classList.add(`${rest.heartCounter}_active`);
    counter.textContent = likes;
  } else {
    counter.classList.remove(`${rest.heartCounter}_active`);
    counter.textContent = '';
  }
}

//---(обрабатываем вызов удаления лайка с карточки)---
const removeLike = (like, cardId, counter, {...rest}) => {
  deleteLike(cardId)
  .then((cardData) => { //обновленные данные карточки
    dataForToggleLike[cardId] = cardData.likes;
    handleLikeCounter(counter, cardData.likes, rest); //photoCard это элемент в разметке
    like.classList.remove('photo-card__button-heart_active');
  })
  .catch((error) => {
    console.log(error);
  })
}

//---(обрабатываем вызов добавления лайка на карточку)---
const addLike = (like, cardId, counter, {...rest}) => { //
  putLike(cardId)
  .then((cardData) => {  //put и delete возвращают актуальные данные карточки
    dataForToggleLike[cardId] = cardData.likes;
    handleLikeCounter(counter, cardData.likes, rest);
    like.classList.add('photo-card__button-heart_active');
  })
  .catch((error) => {
    console.log(error);
  })
}

//---(вызываем удаление или добавление лайка после проверки)---
const handleClickEvent = (like, counter, cardId, profile, {...rest}) => {
  const likes = dataForToggleLike[cardId];
  const check = likes.some(like => like._id === profile._id); //тут я прохожусь по likesArr, нужен актуальный
  if (check) {
    removeLike(like, cardId, counter, rest);
  } else {
    addLike(like, cardId, counter, rest);
  }
}

//---(добавляем слушатель клика лайка)---
const handleLikeButton = (photoCard, cardData, profile, {...rest}) => {
  const like = photoCard.querySelector(rest.heartButton);
  const counter = photoCard.querySelector(rest.heartCounter);
  dataForToggleLike[cardData._id] = cardData.likes;
  like.addEventListener('click', () => {
    handleClickEvent(like, counter, cardData._id, profile, rest);
  });
}


    ////////////это одна карточка
        // все штуки уникальны, только массив лайков меняется
        // (данные)
      //     cardId -не меняется
      // likesArr                    //сли передаю отсюда, то нужно запросить из объекта
      //   // (элементы в разметке)         //откуда взять изначальные данные?
      //     like - не меняется
      //     counter - не меняется
    ///////////
        //массив лайков можно сверять по айди карточки
        //остальные элементы передавать по цепочке

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

//---(удаляем карточку из разметки)---
const removeDeletedCard = (photoCard) => {
  photoCard.remove();
}

//---(обрабатываем запрос на удаление карточки с сервера)---
const deletePhotoCard = (popup, cardID, cardItem, submitButton, defaultText) => {  //submitButton.textContent = defaultText; передать сюда
  deleteCard(cardID)
    .then(() => {
      delete dataForToggleLike[cardID];
      removeDeletedCard(cardItem);
      closePopup(popup);
    })
    .catch((error) => {  //примет сообщение об ошибке при Promise.reject
      console.log(error);
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

//---(сбрасываем записанные данные карточки)---
const resetDataForDeleteCard = () => {
  dataForDeleteCard.cardId = null;
  dataForDeleteCard.cardItem = null;
}

//---(инициируем удаление карточки при событии submit)---
const handleDeleteCardForm = (popup) => {
  const form = popup.querySelector('.popup__form');
  const submitButton = form.querySelector('.popup__button');
  const defaultText = submitButton.textContent;
  form.addEventListener('submit', (evt) => {
    evt.preventDefault();
    changeButtonText(submitButton);
    deletePhotoCard(popup, dataForDeleteCard.cardId, dataForDeleteCard.cardItem, submitButton, defaultText);
    resetDataForDeleteCard();
  })
}

//---(вызываем функцию отрисовки иконки удаления, передаем данные кликнутой карточки, открываем попап подтверждения)---
const handleDeleteButton = (photoCard, cardData, profile, {...rest}) => {
  const popup = document.querySelector(rest.popupDeletePhoto);
  const button = photoCard.querySelector(rest.deleteButton);
  showDeleteButton(cardData, profile, button);
  button.addEventListener('click', () => {
    dataForDeleteCard.cardId = cardData._id;
    dataForDeleteCard.cardItem = photoCard;
    openPopup(popup);
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
  const addCardButton = document.querySelector('.profile__button-add');
  addCardButton.addEventListener('click', () => {
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

