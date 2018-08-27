let request = require('request');

function getSuggestion(key) {
  return new Promise(function(resolve, reject) {
    let url = 'http://www.washington.edu/maps/?json=campusmap.get_search_results&include=title%2Cid&search=';
    url += key;
    request(url, function(err, res, body) {
      if(err) {
        reject(err);
      } else {
        resolve(body);
      }
    });
  });
}

function formatSuggestion(r) {
  let suggestions = [];
  for(let suggestion of JSON.parse(r).posts) {
    suggestions.push({
      id: suggestion.id,
      title: suggestion.title.replace(/&amp;/g, '&')
    });
  }
  return suggestions;
}

exports.main = async (event, context) => {
  let { key } = event;
  let r = await getSuggestion(key);
  let res = formatSuggestion(r);
  return res;
}
