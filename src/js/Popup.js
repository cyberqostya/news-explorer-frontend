/* eslint-disable import/prefer-default-export */
/* eslint-disable no-undef */
export class Popup {
  constructor() {
    this.popup = document.querySelector('.popup');
    this.popupContainer = this.popup.querySelector('.popup__container');
    this.title = this.popup.querySelector('.popup__title');
    this.link = this.popup.querySelector('.popup__link');
    this.ending = this.popupContainer.querySelector('.popup__ending');
    this.enterLink = '<p class="popup__link popup__link_success">Выполнить вход</p>';
    this.state = 'enter';
  }

  open() {
    this.popup.setAttribute('style', 'display: flex');
    document.body.setAttribute('style', 'overflow-y: hidden');
  }

  close() {
    this.popup.removeAttribute('style');
    document.body.removeAttribute('style');
  }

  switchState(str) {
    this.state = str;
    if (str === 'reg') {
      this.title.textContent = 'Регистрация';
      this.link.textContent = 'Войти';
    } else if (str === 'enter') {
      this.title.textContent = 'Вход';
      this.link.textContent = 'Зарегистрироваться';
      if (this.popupContainer.querySelector('.popup__link_success')) {
        this.popupContainer.removeChild(this.popupContainer.querySelector('.popup__link_success'));
        this.ending.removeAttribute('style');
      }
    } else if (str === 'success') {
      this.title.textContent = 'Пользователь успешно зарегистрирован!';
      this.ending.setAttribute('style', 'display: none');
      this.popupContainer.insertAdjacentHTML('beforeend', this.enterLink);
    }
  }
}
