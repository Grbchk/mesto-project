import { hideInputError } from './validate.js';
export { resetError };

//---(убираем сообщения об ошибке в инпутах формы)---
const resetError = (form, {...rest}) => {
  const inputList = Array.from(form.querySelectorAll(rest.inputSelector));
  inputList.forEach((input) => {
    const errorElement = form.querySelector(`.${input.id}-error`);
    hideInputError(input, errorElement, rest);
  });
}

