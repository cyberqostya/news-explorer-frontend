/* eslint-disable import/prefer-default-export */
// Переводит данные с NewsApi в нужный формат
function converter(article) {
  const month = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
  const dateArr = article.publishedAt.slice(0, 10).split('-').map((item) => Number(item));

  let { title } = article;
  let text = article.description;
  if (title.length > 38) {
    title = `${title.slice(0, 36)}...`;
  }
  if (text.length > 180) {
    text = `${text.slice(0, 175)}...`;
  }
  if (text.match(/</g)) {
    text = text.replace(/<.+?>/g, '');
  }

  return {
    title,
    text,
    date: `${dateArr[2]} ${month[dateArr[1]]}, ${dateArr[0]}`,
    source: article.source.name,
    link: article.url,
    image: article.urlToImage,
  };
}

export { converter };
