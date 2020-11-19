/* eslint-disable import/prefer-default-export */
/* eslint-disable class-methods-use-this */
export class NewsCard {
  create(data) {
    const templ = `<a class="card" href="${data.link}" target="_blank">
                    <div class="card__bg" style="background-image: url(${data.image})">
                      <p class="card__message card__message_right text"></p>
                      <div class="card__btn card__btn_flag"></div>
                    </div>
                    <div class="card__about">
                      <p class="card__date text">${data.date}</p>
                      <h3 class="card__title title">${data.title}</h3>
                      <p class="card__text minitext">${data.text}</p>
                      <p class="card__source title">${data.source}</p>
                    </div>
                  </a>`;
    return templ;
  }

  createSecondPage(data) {
    const templ = `<a class="card" href="${data.link}" target="_blank">
                    <div class="card__bg" style="background-image: url(${data.image})">
                      <p class="card__message card__message_left text">${data.keyword}</p>
                      <p class="card__message card__message_right text"></p>
                      <div class="card__btn card__btn_trash"></div>
                    </div>
                    <div class="card__about">
                      <p class="card__date text">${data.date}</p>
                      <h3 class="card__title title">${data.title}</h3>
                      <p class="card__text minitext">${data.text}</p>
                      <p class="card__source title">${data.source}</p>
                    </div>
                  </a>`;
    return templ;
  }

  renderIcon(icon) {
    icon.classList.toggle('card__btn_flag-active');
  }

  showMessage(icon) {
    const message = icon.closest('.card__bg').querySelector('.card__message');
    message.textContent = 'Войдите, чтобы сохранять статьи';
    message.style.display = 'flex';
    setTimeout(() => { message.style.display = 'none'; }, 2000);
  }
}
