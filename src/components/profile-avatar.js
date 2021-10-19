// import { openPopup, resetPopup, handleCloseButton } from './popup.js';
// import { formSelectors } from './selectors.js';
// import { toggleButtonState } from './validate.js';


// const handleAvatarEditButton = () => {
//   const popup = document.querySelector('#update-avatar');
//   const form = popup.querySelector('.popup__form');
//   const button = document.querySelector('.profile__photo-edit');
//   button.addEventListener('click', () => {
//     resetPopup(popup);
//     toggleButtonState(form, formSelectors);
//     handleCloseButton(popup);
//     openPopup(popup);
//   });
// }

// const addNewAvatar = (image, photoCard, cardData, {...rest}) => {
//   // photoCard.querySelector(rest.cardTitle)
//   .textContent = `${cardData.name}`;
//   image.src = `${cardData.link}`;
//   image.alt = `${cardData.name}`;
// }
// //еще форму добавить и слушатели (см профиль)
// const handleAvatar = ({...rest}) => {
//   const popup = document.querySelector('#add-photo-card');
//   const form = popup.querySelector('.popup__form');
//   handleSubmitForm(popup, form, rest);
//   handleCardAddButton(popup, form);
//   handleCloseButton(popup);
// }

