const request = require('request');

function getSuggestion(key) {
  return new Promise((resolve, reject) => {
    const url = `http://www.washington.edu/maps/?json=campusmap.get_search_results&include=title%2Cid&search=${key}`;
    request(url, (err, res, body) => {
      if (err) {
        reject(err);
      } else {
        resolve(body);
      }
    });
  });
}

function formatSuggestion(r) {
  const suggestions = [];
  JSON.parse(r).posts.forEach((suggestion) => {
    suggestions.push({
      id: suggestion.id,
      title: suggestion.title.replace(/&amp;/g, '&'),
    });
  });
  return suggestions;
}

exports.main = async (event) => {
  const { key } = event;
  const r = await getSuggestion(key);
  const res = formatSuggestion(r);
  return res;
};
