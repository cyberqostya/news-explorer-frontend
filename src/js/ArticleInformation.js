/* eslint-disable no-inner-declarations */
/* eslint-disable no-undef */
/* eslint-disable import/prefer-default-export */
export class ArticleInformation {
  constructor() {
    this.block = document.querySelector('.article-inf');
    this.title = this.block.querySelector('.article-inf__title');
  }

  renderTitle(name, articles) {
    this.title.textContent = `${name}, у вас ${articles} сохранённых статей`;
  }

  renderText(arr) {
    let templ = '';
    if (arr.length === 0) {
      templ = '<p class="article-inf__text text"></p>';
    } else if (arr.length === 1) {
      templ = `<p class="article-inf__text text">По ключевому слову: <span class="article-inf__keyword">${arr[0]}</span></p>`;
    } else if (arr.length === 2) {
      templ = `<p class="article-inf__text text">По ключевым словам:
                        <span class="article-inf__keyword">${arr[0]}</span> и
                        <span class="article-inf__keyword">${arr[1]}</span>
                        </p>`;
    } else {
      const mainWords = [];
      const uniq = arr.filter((el, i) => arr.indexOf(el) === i);
      let counter = 0;
      let keyword;
      function findKeyword() {
        uniq.forEach((item) => {
          const arrOfSame = arr.filter((elem) => elem === item);
          if (arrOfSame.length > counter) {
            keyword = item;
            counter = arrOfSame.length;
          }
        });
      }

      while (mainWords.length !== 2) {
        if (uniq.length === 0) {
          break;
        }
        findKeyword();

        mainWords.push(keyword);
        uniq.splice(uniq.indexOf(keyword), 1);
        counter = 0;
      }

      if (uniq.length === 0 && mainWords.length === 1) {
        templ = `<p class="article-inf__text text">По ключевому слову: <span class="article-inf__keyword">${mainWords[0]}</span></p>`;
      } else if (uniq.length === 0 && mainWords.length === 2) {
        templ = `<p class="article-inf__text text">По ключевым словам:
                        <span class="article-inf__keyword">${mainWords[0]}</span> и
                        <span class="article-inf__keyword">${mainWords[1]}</span>
                        </p>`;
      } else {
        templ = `<p class="article-inf__text text">По ключевым словам:
                  <span class="article-inf__keyword">${mainWords[0]},</span>
                  <span class="article-inf__keyword">${mainWords[1]}</span>
                  <span class="article-inf__keyword">и ${uniq.length} другим</span>
                </p>`;
      }
    }

    this.title.insertAdjacentHTML('afterend', templ);
  }
}
