let request = require('request');

function getTerms(key) {
  return new Promise(function(resolve, reject) {
    let url = 'https://canvas.uw.edu/api/v1/courses?include=term';
    url += '&access_token=' + key;
    request(url, function(err, res, body) {
      if(err) {
        reject(err);
      } else {
        resolve(body);
      }
    });
  });
}

function formatTerms(r) {
  let res = [];
  let idList = [];
  for(let course of JSON.parse(r)) {
    if (idList.indexOf(course.term.id) == -1) {
      idList.push(course.term.id);
      res.push({
        name: course.term.name,
        id: course.term.id
      });
    }
  }
  return res;
}

exports.main = async (event, context) => {
 let { key } = event;
 let r = await getTerms(key);
 let res = formatTerms(r);
 return res;
}