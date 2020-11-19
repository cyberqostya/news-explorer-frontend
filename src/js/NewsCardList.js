/* eslint-disable import/prefer-default-export */
/* eslint-disable no-undef */
export class NewsCardList {
  constructor() {
    this.container = document.querySelector('.cards-container');
  }

  render(card) {
    this.container.insertAdjacentHTML('beforeend', card);
  }

  clear() {
    this.container.innerHTML = '';
  }
}
