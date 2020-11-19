/* eslint-disable import/prefer-default-export */
/* eslint-disable no-param-reassign */
/* eslint-disable class-methods-use-this */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-undef */
export class Form {
  constructor() {
    this.form = document.forms.enter;
    this.validCounter = {
      email: false,
      password: false,
    };
    this.state = 'enter';

    this.inputEmail = this.form.elements.email;
    this.emailErrorMessage = this.inputEmail.closest('.popup__field').querySelector('.popup__err-message');

    this.inputPassword = this.form.elements.password;
    this.passwordErrorMessage = this.inputPassword.closest('.popup__field').querySelector('.popup__err-message');

    this.buttonContainer = this.form.querySelector('.popup__button-container');
    this.button = this.buttonContainer.querySelector('.popup__button');
    this.buttonErrorMessage = this.buttonContainer.querySelector('.popup__err-message');

    this.nameField = `<div class="popup__field name-js">
                        <p class="popup__field-title">Имя</p>
                        <input class="popup__input" name="name" type="text" placeholder="Введите своё имя" required minlength="2" maxlength="11">
                        <p class="popup__err-message popup__err-message_input"></p>
                      </div>`;
    this.errorMessages = {
      required: 'Это обязательное поле',
      minimum: 'Пароль должен быть длиннее 8 символов',
      doesntMatch: 'Неправильный формат email',
      minName: 'Имя должно быть длиннее 2 символов',
    };

    this._addInputListener(this.inputEmail, this.emailErrorMessage, 'email');
    this._addInputListener(this.inputPassword, this.passwordErrorMessage, 'password');
  }

  nullifiedValidity() {
    this.validCounter.email = false;
    this.validCounter.password = false;
  }

  switchState(str) {
    this.state = str;
    if (str === 'reg') {
      this.button.textContent = 'Зарегистрироваться';
      this.buttonContainer.insertAdjacentHTML('beforebegin', this.nameField);

      this.validCounter.name = false;
      const inputName = this.form.elements.name;
      const nameErrorMessage = inputName.closest('.popup__field').querySelector('.popup__err-message');
      this._addInputListener(inputName, nameErrorMessage, 'name');
    } else if (str === 'enter') {
      this.button.textContent = 'Войти';
      this.form.removeAttribute('style');

      // Уборка после регистрации
      if (this.form.elements.name) {
        delete this.validCounter.name;
        this.form.elements.name.removeEventListener('input', this._validateInput);
        this.form.removeChild(this.form.querySelector('.name-js'));
      }
    } else if (str === 'success') {
      this.form.setAttribute('style', 'display: none');
    }
    this._validateForm();
  }

  _addInputListener(input, inputMessage, param) {
    input.addEventListener('input', this._validateInput.bind(this, input, inputMessage, param));
  }

  _validateInput(input, inputMessage, param) {
    let counter;
    this.buttonErrorMessage.textContent = '';
    if (!input.validity.valid) {
      this.showError(inputMessage, this.errorMessages.doesntMatch);
      counter = false;
    } else {
      this._hideError(inputMessage);
      counter = true;
    }
    if (input.validity.tooShort) {
      if (input === this.inputPassword) {
        this.showError(inputMessage, this.errorMessages.minimum);
      } else {
        this.showError(inputMessage, this.errorMessages.minName);
      }
    }
    if (input.value === '') {
      this.showError(inputMessage, this.errorMessages.required);
    }

    if (param === 'email') {
      this.validCounter.email = counter;
    } else if (param === 'password') {
      this.validCounter.password = counter;
    } else if (param === 'name') {
      this.validCounter.name = counter;
    }

    this._validateForm();
  }

  // Возьмёт значения объекта в массив, найдёт в нём хоть один false -
  // заблокирует кнопку отправуи формы
  _validateForm() {
    if (Object.values(this.validCounter).find((item) => item === false) === undefined) {
      this.button.classList.remove('popup__button_blocked');
    } else {
      this.button.classList.add('popup__button_blocked');
    }
  }

  showError(block, message) {
    block.textContent = message;
  }

  _hideError(block) {
    block.textContent = '';
  }

  clearForm() {
    this.inputEmail.value = '';
    this.inputPassword.value = '';
    this._hideError(this.emailErrorMessage);
    this._hideError(this.passwordErrorMessage);
    this._hideError(this.buttonErrorMessage);
  }
}
