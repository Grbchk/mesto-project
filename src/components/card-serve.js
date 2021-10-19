import { addPhotoCard } from './card.js';
import { handlerResponse } from './utils.js';
import { configs } from './api.js';
export { getArrayCards, postCard };

const getCards = () => {
  return fetch(`${configs.baseUrl}/cards`, {
    headers: configs.headers
  })
  .then(res => handlerResponse(res))
};

const addCards = (cards, {...rest}) => {
  cards.forEach((cardsItem) => {
    addPhotoCard(cardsItem, rest);
  });
};

//это из скрипт вызывается
const getArrayCards = ({...rest}) => {
  getCards()
  .then((cards) => {
    addCards(cards, rest);
  })
  .catch((error) => {
    console.log(error);
  })
};

const postCard = (cardsItem) => {
  return fetch(`${configs.baseUrl}/cards`, {
    method: 'POST',
    headers: configs.headers,
    body: JSON.stringify({
      name: cardsItem.name,
      link: cardsItem.link,
    })
  })
  .then(res => handlerResponse(res))
}


