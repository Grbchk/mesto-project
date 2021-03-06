import { changeButtonText, closePopup, openPopup } from './popup.js';
import { toggleSubmitButtonState } from './validate.js';
import { formSelectors } from './selectors.js';
import { patchProfileData } from './api.js';
import { resetError } from './utils.js';
export { handleProfile };

//---(заполняем поля попапа редактирования профиля и открываем его при клике)---
const handleEditButton = (popup, form, formTitle, formSubtitle, profileTitle, profileSubtitle, {...rest}) => {
  const editButton = document.querySelector(rest.profileEditButton);
  editButton.addEventListener('click', () => {
    formTitle.value = profileTitle.textContent;
    formSubtitle.value = profileSubtitle.textContent;
    resetError(form, formSelectors);
    toggleSubmitButtonState(form, formSelectors);
    openPopup(popup);
  });
}

//---(добавляем в разметку данные профиля)---
const addProfileData = (profile, profileTitle, profileSubtitle) => {
  profileTitle.textContent = profile.name;
  profileSubtitle.textContent = profile.about;
}

//---(обрабатываем ответ запроса на обновление данных профиля)---
const updateProfileData = (defaultText, submitButton, popup, formTitle, formSubtitle, profileTitle, profileSubtitle) => {
  patchProfileData(formTitle, formSubtitle)
  .then((profile) => {
    addProfileData(profile, profileTitle, profileSubtitle);
    closePopup(popup);
  })
  .catch((error) => {
    console.log(error);
  })
  .finally(() => {
    submitButton.textContent = defaultText;
  })
}

//---(назначаем действия при сабмите формы редактирования профиля, запускаем обработчик кнопки ее закрытия)---
const handleProfileForm = (popup, form, formTitle, formSubtitle, profileTitle, profileSubtitle) => {
  const submitButton = form.querySelector('.popup__button');
  const defaultText = submitButton.textContent;
  form.addEventListener('submit', (evt) => {
    updateProfileData(defaultText, submitButton, popup, formTitle, formSubtitle, profileTitle, profileSubtitle);
    evt.preventDefault();
    changeButtonText(submitButton);
  });
}

//---(вызываем обработчики и ф-ию для добавления данных профиля на страницу)---
const handleProfile = (profile, {...rest}) => {
  const popup = document.querySelector(rest.popupProfile);
  const form = popup.querySelector('.popup__form');
  const formTitle = form.querySelector(rest.popupProfileTitle);
  const formSubtitle = form.querySelector(rest.popupProfileSubtitle);
  const profileTitle = document.querySelector(rest.profileTitle); //h1
  const profileSubtitle = document.querySelector(rest.profileSubtitle); //p
  addProfileData(profile, profileTitle, profileSubtitle);
  handleEditButton(popup, form, formTitle, formSubtitle, profileTitle, profileSubtitle, rest);
  handleProfileForm(popup, form, formTitle, formSubtitle, profileTitle, profileSubtitle);
}

