let request = require('request');

function getDegree(code) {
  return new Promise(function(resolve, reject) {
    let url = 'https://myplan.uw.edu/program/api/programs/' + code + '/details';
    request(url, function(err, res, body) {
      if(err) {
        reject(err);
      } else {
        resolve(body);
      }
    });
  });
}

function formatDegree(r) {
  return JSON.parse(r);
}

exports.main = async (event, context) => {
  let { code } = event;
  let r = await getDegree(code);
  let res = formatDegree(r);
  return res;
}