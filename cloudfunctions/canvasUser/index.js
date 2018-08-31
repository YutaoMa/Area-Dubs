let request = require('request');

function getUser(key) {
  return new Promise(function(resolve, reject) {
    let url = 'https://canvas.uw.edu/api/v1/users/self';
    url += '?access_token=' + key;
    request(url, function(err, res, body) {
      if(err) {
        reject(err);
      } else {
        resolve(body);
      }
    });
  });
}

function formatUser(r) {
  return r;
}

exports.main = async (event, context) => {
  let { key } = event;
  let r = await getUser(key);
  let res = formatUser(r);
  return res;
}