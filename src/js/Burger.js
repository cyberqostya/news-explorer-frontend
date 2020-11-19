/* eslint-disable no-undef */
/* eslint-disable import/prefer-default-export */
export class Burger {
  constructor() {
    this.block = document.querySelector('.burger-menu');
    this.icon = this.block.querySelector('.header__icon');
  }

  open() {
    this.block.setAttribute('style', 'display: block');
    document.body.setAttribute('style', 'overflow-y: hidden');
  }

  close() {
    this.block.removeAttribute('style');
    document.body.removeAttribute('style');
  }
}
