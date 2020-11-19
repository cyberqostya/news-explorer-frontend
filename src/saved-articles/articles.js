/* eslint-disable no-underscore-dangle */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-undef */
import './articles.css';

import { Header } from '../js/Header';
import { ArticleInformation } from '../js/ArticleInformation';
import { NewsCard } from '../js/NewsCard';
import { NewsCardList } from '../js/NewsCardList';
import { Burger } from '../js/Burger';

import { MainApi } from '../js/MainApi';

const header = new Header();
const articleInf = new ArticleInformation();
const card = new NewsCard();
const cardList = new NewsCardList();
const burger = new Burger();
const mainApi = new MainApi();

let myArticles = [];
const keywords = [];

mainApi.getUserData()
  .then((res) => {
    header.userName = res.name;
    header.isLoggedIn = true;
    header.renderSecondPage();

    mainApi.getArticles()
      .then((results) => {
        myArticles = results;
        articleInf.renderTitle(res.name, results.length);
        results.forEach((item) => {
          keywords.push(item.keyword);
          cardList.render(card.createSecondPage(item));
        });
        articleInf.renderText(keywords);
      })
      .catch((err) => { console.log(err); });
  })
  .catch(() => {
    document.location.href = '../index.html';
  });

header.headers.forEach((item) => {
  item.addEventListener('click', (event) => {
    if (event.target.classList.contains('link_surrounded')) {
      event.preventDefault();
      mainApi.deleteCookie()
        .then(() => { document.location.href = '../index.html'; })
        .catch((err) => { console.log(err); });
    }
    if (event.target === header.icon) {
      burger.open();
    }
  });
});

cardList.container.addEventListener('click', (event) => {
  if (event.target.classList.contains('card__btn_trash')) {
    event.preventDefault();
    for (const elem of myArticles) {
      if (elem.link === event.target.closest('.card').getAttribute('href')) {
        mainApi.removeArticle(elem._id)
          .then((res) => { cardList.container.removeChild(event.target.closest('.card')); console.log(res); })
          .catch((err) => { console.log(err); });
        break;
      }
    }
  }
});

burger.block.addEventListener('click', (event) => {
  if (event.target === burger.icon || event.target.classList.contains('burger-menu')) {
    burger.close();
  }
});
