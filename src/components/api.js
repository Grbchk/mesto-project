import { configs } from './configs.js';
import { profileSelectors, photoCardSelectors } from './selectors.js';
import { handleProfile } from './profile.js';
import { handleAvatar } from './profile-avatar.js';
import { handleCards } from './card.js';
export { postCardData, patchAvatar, patchProfileData, getInitialData, putLike, deleteLike, deleteCard };


//---(обрабатываем ответ от сервера)---
const handleResponse = (res) => {
  if (res.ok) {
    return res.json();
  }
  return Promise.reject(`Ошибка: ${res.status}`); //этот промис отклонен, отправит в catch
}

//---(по сабмиту формы отправляем данные карточки на сервер)---
const postCardData = (cardData) => {
  return fetch(`${configs.baseUrl}/cards`, {
    method: 'POST',
    headers: configs.headers,
    body: JSON.stringify({
      name: cardData.name,
      link: cardData.link,
    })
  })
  .then(handleResponse) //тоже самое что и .then(res => handlerResponse(res))
};

//---(обновляем аватар)---
const patchAvatar = (formTitle) => {
  return fetch(`${configs.baseUrl}/users/me/avatar`, {
    method: 'PATCH',
    headers: configs.headers,
    body: JSON.stringify({
      avatar: `${formTitle.value}`
    })
  })
  .then(handleResponse)
};

//---(обновляем данные профиля)---
const patchProfileData = (formTitle, formSubtitle) => {
  return fetch(`${configs.baseUrl}/users/me`, {
    method: 'PATCH',
    headers: configs.headers,
    body: JSON.stringify({
      name: `${formTitle.value}`,
      about: `${formSubtitle.value}`
    })
  })
  .then(handleResponse)
};

//---(отправляем свой лайк карточки на сервер)---
const putLike = (cardId) => {
  return fetch(`${configs.baseUrl}/cards/likes/${cardId}`, {
    method: 'PUT',
    headers: configs.headers
  })
  .then(handleResponse)
};

//---(убираем свой лайк у карточки на сервере)---
const deleteLike = (cardId) => {
  return fetch(`${configs.baseUrl}/cards/likes/${cardId}`, {
    method: 'DELETE',
    headers: configs.headers
  })
  .then(handleResponse)  //delete лайка возвращает обновленные данные карточки (в отличие от delete самой карточки)
};

//---(удаляем свою карточку)---
const deleteCard = (cardId) => {
  return fetch(`${configs.baseUrl}/cards/${cardId}`, {
    method: 'DELETE',
    headers: configs.headers
  })
  .then(res => {
    if(res.ok){
      return true;
    }
    return Promise.reject(`Ошибка: ${res.status}`);
  })
};

//---(получаем массив карточек добавленных на сервер)---
const getCards = () => {
  return fetch(`${configs.baseUrl}/cards`, {
    headers: configs.headers
  })
  .then(handleResponse)
};

//---(получаем данные своего профиля)---
const getProfile = () => {
  return fetch(`${configs.baseUrl}/users/me`, {  //по этому адресу хранится профиль
    headers: configs.headers
  })
  .then(handleResponse)
};

//---(запускаем обработчики запрошенных у сервера данных)---
const handleInitialData = (cards, profile) => {
  handleProfile(profile, profileSelectors);
  handleAvatar(profile, profileSelectors);
  handleCards(cards, profile, photoCardSelectors);
};

//---(запрашиваем начальные данные у сервера)---
const getInitialData = () => {
  Promise.all([getCards(), getProfile()])
  .then((res) => {
    const cards = res[0];
    const profile = res[1];
    handleInitialData(cards, profile);
  })
};

