export const enableValidation = ({...rest}) => {
  formEventListeners(rest);
};

const showInputError = (input, errorElement, errorMessage, {...rest}) => {
  input.classList.add(rest.inputErrorClass);
  errorElement.classList.add(rest.errorClass);
  errorElement.textContent = errorMessage;
};

const hideInputError = (input, errorElement, {...rest}) => {
  input.classList.remove(rest.inputErrorClass);
  errorElement.classList.remove(rest.errorClass);
  errorElement.textContent = '';
};


const isValid = (form, input, {...rest}) => {
  const errorElement = form.querySelector(`.${input.id}-error`);
  if (!input.validity.valid) {
    showInputError(input, errorElement, input.validationMessage, rest);
  } else {
    hideInputError(input, errorElement, rest);
  }
};

const inputEventListeners = (form, {...rest}) => {
  const inputList = Array.from(form.querySelectorAll(rest.inputSelector));
  const button = form.querySelector(rest.submitButtonSelector);
  const popupProfile = document.querySelector('#add-profile');
  const profileButton = popupProfile.querySelector(rest.submitButtonSelector);
  if (button !== profileButton) {
    toggleButtonState(inputList, button, rest);
  }
  inputList.forEach((input) => {
    input.addEventListener('input', () => {
      isValid(form, input, rest);
      toggleButtonState(inputList, button, rest);
    });
  });
};

const hasInvalidInput = (inputList) => {
  return inputList.some((inputElement) => {
    return !inputElement.validity.valid;
  })
};

const toggleButtonState = (inputList, button, {...rest}) => {
  if (hasInvalidInput(inputList)) {
    button.classList.add(rest.inactiveButtonClass);
  } else {
    button.classList.remove(rest.inactiveButtonClass);
  }
};

const formEventListeners = ({formSelector, ...rest}) => {
  const formList = Array.from(document.querySelectorAll(formSelector));
  formList.forEach((form) => {
    form.addEventListener('submit', (evt) => {
      evt.preventDefault();
    });
    inputEventListeners(form, rest);
  });
};


