import { openPopup, submitEvent, popupCloseButtonListeners} from './popup.js';
import { addCardButtonListeners } from './card.js';

export const addProfileListeners = ({...rest}) => {
  const popup = document.querySelector(rest.popupProfile);
  const popupTitle = document.querySelector(rest.popupProfileTitle);
  const popupSubtitle = document.querySelector(rest.popupProfileSubtitle);
  const title = document.querySelector(rest.profileTitle);
  const subtitle = document.querySelector(rest.profileSubtitle);
  const editButton = document.querySelector(rest.profileEditButton);

  editButton.addEventListener('click', () => {
    popupTitle.value = title.textContent;
    popupSubtitle.value = subtitle.textContent;
    openPopup(popup);
  });
  const form = document.querySelector(rest.profileForm);
  form.addEventListener('submit', function () {
    title.textContent = popupTitle.value;
    subtitle.textContent = popupSubtitle.value;
    submitEvent(popup);
  });
  popupCloseButtonListeners(popup);
  addCardButtonListeners();
}
