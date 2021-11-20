import { closePopup } from './popup.js';
import { handlerResponse } from './utils.js';
import { configs } from './api.js';
export { handleProfileData, addProfileData };


const getProfile = () => {
  return fetch(`${configs.baseUrl}/users/me`, {
    headers: configs.headers
  })
  .then(res => handlerResponse(res))
};

const addProfileData = (popupTitle, popupSubtitle) => {
  getProfile() //тут можно взять мой id
  .then(profileData => {
    popupTitle.textContent = profileData.name;
    popupSubtitle.textContent = profileData.about;
  })
  .catch((error) => {
    console.log(error);
  })
}

const updateProfileData = (formTitle, formSubtitle) => {
  return fetch(`${configs.baseUrl}/users/me`, {
    method: 'PATCH',
    headers: configs.headers,
    body: JSON.stringify({
      name: `${formTitle.value}`,
      about: `${formSubtitle.value}`
    })
  })
  .then(res => handlerResponse(res))
}

const handleProfileData = (popup, formTitle, formSubtitle, popupTitle, popupSubtitle) => {
  //button status
  updateProfileData(formTitle, formSubtitle)
  .then(() => addProfileData(popupTitle, popupSubtitle))
  .catch((error) => {
    console.log(error);
  })
  .finally(() => {
    closePopup(popup);
    //button status
  })
}


