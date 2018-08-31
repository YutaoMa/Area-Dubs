const request = require('request');

function getDegree(code) {
  return new Promise((resolve, reject) => {
    const url = `https://myplan.uw.edu/program/api/programs/${code}/details`;
    request(url, (err, res, body) => {
      if (err) {
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

exports.main = async (event) => {
  const { code } = event;
  const r = await getDegree(code);
  const res = formatDegree(r);
  return res;
};
