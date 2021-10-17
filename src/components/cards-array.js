import { addPhotoCard } from './card.js';
import { configs } from './api.js';
export { getArrayCards };

const getCards = () => {
  return fetch(`${configs.baseUrl}/cards`, {
    headers: configs.headers
  })
};

const getArrayCards = ({...rest}) => {
  getCards()
    .then(res => {
      if (res.ok) {
        return res.json();
      }
      return Promise.reject(`Ошибка: ${res.status}`);
    })
    .then((cards) => {
      console.log(cards);
      addCards(cards, rest);
    })
    .catch((err) => {
      console.log(err);
    })
}

const addCards = (cards, {...rest}) => {
  cards.forEach((cardsItem) => {
    addPhotoCard(cardsItem, rest);
  });
}
