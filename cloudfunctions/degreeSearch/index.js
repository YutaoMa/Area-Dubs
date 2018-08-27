let request = require('request');

function searchDegree(key) {
  return new Promise(function(resolve, reject) {
    let url = 'https://myplan.uw.edu/program/api/programs';
    let data = {
      queryString: key
    };
    request({
      url,
      method: 'POST',
      json: true,
      body: data
    }, function (err, res, body) {
      if (err) {
        reject(err);
      } else {
        resolve(body);
      }
    });
  });
}

function formatDegree(r) {
  return r;
}

exports.main = async (event, context) => {
  let { key } = event;
  let r = await searchDegree(key);
  let res = formatDegree(r);
  return res;
}
