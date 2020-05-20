const fetch = require('node-fetch');
const cheerio = require('cheerio');

const url = 'https://www.imdb.com/find?ref_=nv_sr_fn&s=all&q=';

function searchMovies(searchText){
  return fetch(`${url}${searchText}`)
  .then(response => response.text());
}

searchMovies('')
.then(body => {
  //console.log(body);
  let $ = cheerio.load(body);
  let list = $(".findResult").each(function(i, element){
    const $element = $(element);
    const $image = $element.find('td a img');
    console.log('td._title')
    const $title = $element.find('td.result_text a');
    // console.log($title.text());
    //console.log($image.attr('src'));
  });
});

