/* eslint-disable prefer-destructuring */
/* eslint-disable no-undef */
// eslint-disable-next-line import/prefer-default-export
export class Header {
  constructor() {
    this.headers = document.querySelectorAll('.header');
    this.isLoggedIn = false;
    this.userName = 'Создатель';
    this.icon = document.querySelector('.header__icon');
  }

  render() {
    this.headers.forEach((item) => {
      const surroundedLink = item.querySelector('.link_surrounded');
      if (this.isLoggedIn) {
        surroundedLink.textContent = this.userName;
        surroundedLink.insertAdjacentHTML('beforebegin', '<a class="link text saved-js" href="./articles/articles.html">Сохранённые статьи</a>');
        surroundedLink.classList.add('link_auth');
      } else {
        surroundedLink.textContent = 'Авторизация';
        if (surroundedLink.classList.contains('link_auth')) {
          item.querySelector('.header__links').removeChild(item.querySelector('.saved-js'));
          surroundedLink.classList.remove('link_auth');
        }
      }
    });
  }

  renderSecondPage() {
    this.headers.forEach((item) => {
      const surroundedLink = item.querySelector('.link_surrounded');
      surroundedLink.textContent = this.userName;
    });
  }
}

// Класс, отвечающий за перерисовку header'a в зависимости
// от авторизации пользователя
