/* eslint-disable import/prefer-default-export */
/* eslint-disable no-param-reassign */
/* eslint-disable class-methods-use-this */
/* eslint-disable no-undef */
export class Results {
  constructor() {
    this.block = document.querySelector('.results');
    this.button = this.block.querySelector('.results__button');
    this.notFound = this.block.querySelector('.not-found');
    this.preloader = this.block.querySelector('.preload');
  }

  show(block) {
    block.removeAttribute('style');
  }

  hide(block) {
    block.setAttribute('style', 'display: none');
  }
}
