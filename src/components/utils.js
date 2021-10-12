import { hideInputError } from './validate.js';
export { resetError, resetButton };


const resetError = (form, {...rest}) => {
  const inputList = Array.from(form.querySelectorAll(rest.inputSelector));
  inputList.forEach((input) => {
    const errorElement = form.querySelector(`.${input.id}-error`);
    hideInputError(input, errorElement, rest);
  });
}

const resetButton = (form, {...rest}) => {
  const button = form.querySelector(rest.submitButtonSelector);
  if (form === document.querySelector('form[name="photo-card-popup"]')) {
    button.classList.add(rest.inactiveButtonClass); 
  } else {
    button.classList.remove(rest.inactiveButtonClass);
  }
}

