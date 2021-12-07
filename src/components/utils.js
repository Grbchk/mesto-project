import { hideInputError } from './validate.js';
export { resetError, handleResponse };

//---(убираем сообщения об ошибке в инпутах формы)---
const resetError = (form, {...rest}) => {
  const inputList = Array.from(form.querySelectorAll(rest.inputSelector));
  inputList.forEach((input) => {
    const errorElement = form.querySelector(`.${input.id}-error`);
    hideInputError(input, errorElement, rest);
  });
}

//---(обрабатываем ответ от сервера)---
const handleResponse = (res) => {
  if (res.ok) {
    return res.json();
  }
  return Promise.reject(`Ошибка: ${res.status}`); //этот промис отклонен, отправит в catch
}

