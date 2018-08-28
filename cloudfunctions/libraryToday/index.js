let request = require('request');

function getHours() {
  return new Promise(function(resolve, reject) {
    let url = 'https://api3.libcal.com/api_hours_today.php?iid=395&format=json';
    request(url, function(err, res, body) {
      if(err) {
        reject(err);
      } else {
        resolve(body);
      }
    });
  });
}

function formatHours(r) {
  return r;
}

exports.main = async (event, context) => {
  let r = await getHours();
  let res = formatHours(r);
  return res;
}