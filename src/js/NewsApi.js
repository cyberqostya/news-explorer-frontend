/* eslint-disable class-methods-use-this */
/* eslint-disable no-underscore-dangle */
/* eslint-disable import/prefer-default-export */
/* eslint-disable no-undef */
export class NewsApi {
  constructor(days) {
    this.link = 'http://newsapi.org/v2/top-headlines?';
    this.apiKey = '80c56555c03e4564980aed5f6b4d71cb';
    this.pageSize = 100;

    this.numberOfDaysAgo = days;
    this.date = new Date();

    this.dateString = '';
    this.dateStringWeekAgo = '';

    this._dateConverter(this.date);
  }

  getNews(keyword) {
    return fetch(`${this.link}q=${keyword}&from=${this.dateString}&to=${this.dateStringWeekAgo}&pageSize=${this.pageSize}&apiKey=${this.apiKey}`)
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        return Promise.reject(res);
      });
  }

  _dateConverter(date) {
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();

    const dateWeekAgo = new Date(year, month, day - this.numberOfDaysAgo);

    this.dateString = `${year}-${month}-${day}`;
    this.dateStringWeekAgo = `${dateWeekAgo.getFullYear()}-${dateWeekAgo.getMonth()}-${dateWeekAgo.getDate()}`;
  }
}
