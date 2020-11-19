/* eslint-disable no-undef */
/* eslint-disable no-underscore-dangle */
/* eslint-disable consistent-return */
/* eslint-disable no-restricted-syntax */
import './index.css';

import { Header } from './js/Header';
import { Popup } from './js/Popup';
import { Form } from './js/Form';
import { Search } from './js/Search';
import { Results } from './js/Results';
import { NewsCard } from './js/NewsCard';
import { NewsCardList } from './js/NewsCardList';
import { Burger } from './js/Burger';

import { NewsApi } from './js/NewsApi';
import { MainApi } from './js/MainApi';

import { converter } from './js/utils';

// Объявления констант/переменных
const header = new Header();
const popup = new Popup();
const form = new Form();
const searchForm = new Search();
const results = new Results();
const card = new NewsCard();
const cardList = new NewsCardList();
const burger = new Burger();
const mainApi = new MainApi();
const newsApi = new NewsApi(7);

let limit = 0;
let keyword = '';
let articles = [];
let myArticles = [];

// Функция которая содержит переменные этого окружения служит только для предотвращения
// дублирования кода
function drowStack() {
  for (let i = limit; i < limit + 3; i += 1) {
    if (!articles[i]) {
      results.hide(results.button);
      break;
    }

    if (articles[i].urlToImage === null) {
      articles[i].urlToImage = 'https://i.ytimg.com/vi/pqHcFTzEnis/maxresdefault.jpg';
    }

    const unfinishedCard = card.create(converter(articles[i]));
    cardList.render(unfinishedCard);

    if (header.isLoggedIn) {
      for (const elem of myArticles) {
        if (elem.link === unfinishedCard.match(/http.+?"/)[0].replace('"', '')) {
          const cards = cardList.container.querySelectorAll('.card__btn_flag');
          card.renderIcon(cards[cards.length - 1]);
          break;
        }
      }
    }
  }
}

function closePopup() {
  popup.close();
  form.clearForm();
  form.nullifiedValidity();
  form.switchState('enter');
  popup.switchState('enter');
}

// При загрузке сайта сразу же отправляется запрос на сервер (с куками, если имеются)
// для отрисовки нужного хедера
mainApi.getUserData()
  .then((res) => {
    header.userName = res.name;
    header.isLoggedIn = true;
    header.render();
  })
  .catch(async (err) => {
    const res = await err.json();
    console.log(res);
  });


// Слушатели событий

// НА ХЕДЕРАХ
// Вёрстка сделана таки образом, что на странице имеются 2 хедера,
// один на своем месте, второй в бургер меню. Чтобы их связать, обработчик событий
// и методы рендерят их обоих через перебор массива.
// Если пользователь хочет авторизироваться, то откроется попап,
// если хочет разлогинится - изменится хедер
header.headers.forEach((item) => {
  item.addEventListener('click', (event) => {
    if (popup.popup.hasAttribute('style')) {
      closePopup();
    }
    if (event.target.classList.contains('link_surrounded')) {
      if (!header.isLoggedIn) {
        popup.open();
        burger.close();
      } else {
        header.isLoggedIn = false;
        header.render();
        burger.close();
        results.hide(results.block);
        searchForm.input.value = '';
        mainApi.deleteCookie()
          .then((res) => { console.log(res); })
          .catch((err) => { console.log(err); });
      }
    } else if (event.target === header.icon) {
      burger.open();
    }
  });
});

// НА ПОПАП (делегирование)
// << Попап могут закрыть когда он на регистрации, входе или при успешном создании пользователя.
// При закрытии нужно привести форму в изначальное положение - ВХОД >>
// Если произойдёт клик на крестик:
//    попап закроется, инпуты формы очистятся, ошибки инпутов скроются,
//    ошибка с сервера скроется, изменится текст на баттоне на "Войти",
//      (РЕГИСТРАЦИЯ: удалится инпут с вводом имени, с него снимется обработчик событий,
//      кнопка формы станет недоступной),
//      (СООБЩЕНИЕ ОБ УСПЕХЕ: форма отобразится, уберётся надпись об успешном входе)
//
// << По ссылкам на попапе можно переходить с входа на регистрацию и обратно,
// с сообщения об успешном создании пользователя на вход >>
// Если произойдёт клик на ссылку:
//    проверит в какое сотояние нужно переключить форму, изменит надписи на баттоне,
//    тайтле, ссылке (если есть: удалит/добавит поле инпута имени, удалит/добавит
//    на него обработчик ввода)
//
popup.popup.addEventListener('mousedown', (event) => {
  if (event.target.classList.contains('popup__close') || event.target.classList.contains('popup')) {
    closePopup();
  }

  if (event.target.classList.contains('popup__link')) {
    if (popup.state === 'enter') {
      form.switchState('reg');
      popup.switchState('reg');
    } else if (popup.state === 'reg') {
      form.switchState('enter');
      popup.switchState('enter');
    } else if (popup.state === 'success') {
      form.clearForm();
      form.nullifiedValidity();
      form.switchState('enter');
      popup.switchState('enter');
    }
  }
});

document.addEventListener('keyup', (event) => {
  if (event.key === 'Escape' && popup.popup.hasAttribute('style')) {
    closePopup();
  }
});

// Нажимаем на кнопку формы регистрации/входа
// Идентификация состояния формы, отправка запроса на нужный адрес
form.form.addEventListener('submit', (event) => {
  event.preventDefault();

  if (form.state === 'reg') {
    mainApi.signup(form.inputEmail.value, form.inputPassword.value, form.form.elements.name.value)
      .then(() => {
        popup.switchState('success');
        return form.switchState('success');
      })
      .catch(async (err) => {
        const res = await err.json();
        form.showError(form.buttonErrorMessage, res.message);
        console.log(res);
      });
  }

  if (form.state === 'enter') {
    mainApi.signin(form.inputEmail.value, form.inputPassword.value)
      .then((res) => {
        header.isLoggedIn = true;
        header.userName = res.name;
        header.render();
        popup.close();
        form.clearForm();
        form.nullifiedValidity();
        results.hide(results.block);
        searchForm.input.value = '';
        return form.switchState('enter');
      })
      .catch(async (err) => {
        const res = await err.json();
        form.showError(form.buttonErrorMessage, res.message);
        console.log(res);
      });
  }
});

// Обработчик на кнопку поиска статей
// После каждого запроса очищается контейнер с карточками, при первом поиске
// отображается блок "результатов", отображается прелоадер, скрывается 404,
// скрывается баттон "показать еще"
//
// Нажимая на баттон поиска отправляем запрос в NewsApi по ключевому слову.
// Отображаем прелоадер. Как только запрос пришел, прячем его. Смотрим сколько
// статей пришло и заносим их в глобальную переменную для дальнейшей работы.
// Если статей пришло 0 - отображаем 404. Если больше: отрисовываем сколько можем
// (максимум 3), затем, если статей >3, то отображаем баттон "Показать больше", на котором
// уже стоит слушатель.
// Вместе с запросом на NewsApi отправляем запрос на MainApi для получения сохранённых статей
// для того, чтобы отобразить их.
searchForm.form.addEventListener('submit', (event) => {
  event.preventDefault();
  cardList.clear();
  results.show(results.block);
  results.show(results.preloader);
  results.hide(results.notFound);
  results.hide(results.button);

  limit = 0;
  keyword = searchForm.input.value;

  newsApi.getNews(keyword)
    .then((res) => {
      results.hide(results.preloader);
      articles = res.articles;

      if (articles.length === 0) {
        return results.show(results.notFound);
      }

      if (header.isLoggedIn) {
        mainApi.getArticles()
          .then((result) => {
            myArticles = result;
            drowStack();
            if (articles.length > 3) {
              limit += 3;
              results.show(results.button);
            }
          });
      } else {
        drowStack();
        if (articles.length > 3) {
          limit += 3;
          results.show(results.button);
        }
      }
    })
    .catch((err) => { alert(err); console.log(err); });
});

// Покажи еще
results.button.addEventListener('click', () => {
  drowStack();
  limit += 3;
});

// На контейнер с карточками (делегирование)
// Если кликнули по флажку для добавления карточки, то проверяем залогинен ли пользователь.
// Если нет, показываем сообщение на 2 сек. Если да, то отправляем запрос на сервер о
// добавлении карточки. Чтобы ее найти мы находм коллекцию всех флажков в документе, вычленяем
// тот на который нажали, находим его индекс относительно всех, в запрос вставляем статью с
// найденным индексом (предварительно конвертировав в нужный формат).
cardList.container.addEventListener('click', (event) => {
  if (event.target.classList.contains('card__btn_flag')) {
    event.preventDefault();
    if (event.target.classList.contains('card__btn_flag-active')) {
      for (const elem of myArticles) {
        if (elem.link === event.target.closest('.card').getAttribute('href')) {
          mainApi.removeArticle(elem._id)
            .then((res) => { card.renderIcon(event.target); console.log(res); })
            .catch((err) => { console.log(err); });
          break;
        }
      }
    } else if (!header.isLoggedIn) {
      card.showMessage(event.target);
    } else {
      mainApi.createArticle(converter(articles[Array.from(cardList.container.querySelectorAll('.card__btn_flag')).indexOf(event.target)]), keyword)
        .then((res) => {
          card.renderIcon(event.target);

          mainApi.getArticles()
            .then((result) => { myArticles = result; });

          console.log(res);
        })
        .catch((err) => { console.log(err); });
    }
  }
});

burger.block.addEventListener('click', (event) => {
  if (event.target === burger.icon || event.target.classList.contains('burger-menu')) {
    burger.close();
  }
});
