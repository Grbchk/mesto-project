export { profileSelectors, photoCardSelectors, formSelectors};

const profileSelectors = {
  formSelector: '.popup__form',
  profileTitle: '.profile__title',
  profileSubtitle: '.profile__subtitle',
  profileEditButton: '.profile__button-edit',
  popupProfile: '#add-profile',
  popupProfileTitle: '#popup-profile-title',
  popupProfileSubtitle: '#popup-profile-subtitle',
};

const photoCardSelectors = {
  cardItem: '.photo-card',
  cardTitle: '.photo-card__title',
  cardImage: '.photo-card__image',
  heartButton: '.photo-card__button-heart',
  heartCounter: '.photo-card__heart-counter',
  deleteButton: '.photo-card__button-delete',
  popupViewingPhoto: '.viewing-photo',
  popupPhotoСard: '#add-photo-card',
  popupTitle: '#popup-photo-title ',
  popupImageLink: '#popup-photo-subtitle',
  formSelector: '.popup__form',
  photoCardPlace: '.photo-grid__list',
}

const formSelectors = {
  formSelector: '.popup__form',
  inputSelector: '.popup__item',
  submitButtonSelector: '.popup__button',
  inactiveButtonClass: 'popup__button_disabled',
  inputErrorClass: 'popup__item_type_error',
  errorClass: 'popup__error_visible'
}
