import { changeButtonText, closePopup, openPopup, resetPopup } from './popup.js';
import { putLike, deleteLike, deleteCard, postCardData } from './api.js';
export { addPhotoCard, handleCards, handleCardAddButton };

let dataForDeleteCard = {
  cardId: null,
  cardItem: null,
}

let dataForToggleLike = {};

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
  .then((newCardData) => { //обновленные данные карточки
    dataForToggleLike[cardData._id] = newCardData.likes;
    handleLikeCounter(photoCard, newCardData, rest); //photoCard это элемент в разметке
    like.classList.remove('photo-card__button-heart_active');
  })
  .catch((error) => {
    console.log(error);
  })
}

//---(обрабатываем вызов добавления лайка на карточку, обновляем массив лайков в объекте с данными карточки)---
const addLike = (like, cardData, photoCard, {...rest}) => {
  putLike(cardData._id)
  .then((newCardData) => {  //put и delete возвращают актуальные данные карточки
    dataForToggleLike[cardData._id] = newCardData.likes;
    handleLikeCounter(photoCard, newCardData, rest);
    like.classList.add('photo-card__button-heart_active');
  })
  .catch((error) => {
    console.log(error);
  })
}

//---(вызываем удаление или добавление лайка после проверки)---
const handleClickEvent = (like, cardData, photoCard, profile, {...rest}) => {
  const likes = dataForToggleLike[cardData._id];
  const check = likes.some(like => like._id === profile._id);
  if (check) {
    removeLike(like, cardData, photoCard, rest);
  } else {
    addLike(like, cardData, photoCard, rest);
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

//---(добавляем слушатель лайка, передаем данные карточки в объект на хранение, инициируем обработчик клика)---
const handleLikeButton = (photoCard, cardData, profile, {...rest}) => {
  const likeButton = photoCard.querySelector(rest.heartButton);
  dataForToggleLike[cardData._id] = cardData.likes;
  likeButton.addEventListener('click', () => {
    handleClickEvent(likeButton, cardData, photoCard, profile, rest);
  });
}

//---(удаляем карточку из разметки)---
const removeDeletedCard = (photoCard) => {
  photoCard.remove();
}

//---(обрабатываем запрос на удаление карточки с сервера)---
const deletePhotoCard = (popup, cardId, cardItem, submitButton, defaultText) => {  //submitButton.textContent = defaultText; передать сюда
  deleteCard(cardId)
    .then(() => {
      delete dataForToggleLike[cardId]; //убираем сохраненные в объекте данные карточки
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

const resetDataForDeleteCard = () => {
  dataForDeleteCard.cardId = null;
  dataForDeleteCard.cardItem = null;
}

//---(инициируем удаление карточки и закрываем попап подтверждения при событии submit)---
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

//открываем попап и передаем данные кликнутой карточки
//---(вызываем функцию отрисовки иконки удаления)---
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
const addNewCard = (popup, cardDataForSend, profile, {...formButtonData}, {...rest}) => {
  postCardData(cardDataForSend)
    .then((cardData) => {
      addPhotoCard(cardData, profile, rest);
      closePopup(popup);
    })
    .catch((error) => {  //примет сообщение об ошибке при Promise.reject
      console.log(error);
    })
    .finally(() => {
      formButtonData.submitButton.textContent = formButtonData.defaultText;
    })
}

//---(формируем cardData из заполненных полей формы и передаем их при событии submit)---
const handleAddCardForm = (popup, profile, {...rest}) => {
  const form = popup.querySelector('.popup__form');
  const title = form.querySelector(rest.popupTitle);
  const image = form.querySelector(rest.popupImageLink);
  const submitButton = form.querySelector('.popup__button');
  const defaultText = submitButton.textContent;
  const formButtonData = {
    submitButton: submitButton,
    defaultText: defaultText
  }
  form.addEventListener('submit', (evt) => {
    evt.preventDefault();
    const cardDataForSend = {
      name: `${title.value}`,
      link: `${image.value}`
    }
    changeButtonText(submitButton);
    addNewCard(formButtonData, popup, cardDataForSend, profile, rest);
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

