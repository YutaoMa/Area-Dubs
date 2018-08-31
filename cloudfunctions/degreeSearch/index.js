const request = require('request');

function searchDegree(key) {
  return new Promise((resolve, reject) => {
    const url = 'https://myplan.uw.edu/program/api/programs';
    const data = {
      queryString: key,
    };
    request({
      url,
      method: 'POST',
      json: true,
      body: data,
    }, (err, res, body) => {
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

exports.main = async (event) => {
  const { key } = event;
  const r = await searchDegree(key);
  const res = formatDegree(r);
  return res;
};
