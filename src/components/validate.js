export { enableValidation, hideInputError, toggleSubmitButtonState };

const enableValidation = ({...rest}) => {
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

const hasInvalidInput = (inputList) => {
  return inputList.some((inputElement) => {
    return !inputElement.validity.valid;
  })
};

const toggleSubmitButtonState = (form, {...rest}) => {
  const inputList = Array.from(form.querySelectorAll(rest.inputSelector));
  const button = form.querySelector(rest.submitButtonSelector);
  if (hasInvalidInput(inputList)) {
    button.setAttribute('disabled', true);
    button.classList.add(rest.inactiveButtonClass);
  } else {
    button.removeAttribute('disabled');
    button.classList.remove(rest.inactiveButtonClass);
  }
};

const inputEventListeners = (form, {...rest}) => {
  const inputList = Array.from(form.querySelectorAll(rest.inputSelector));
  inputList.forEach((input) => {
    input.addEventListener('input', () => {
      isValid(form, input, rest);
      toggleSubmitButtonState(form, rest);
    });
  });
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


